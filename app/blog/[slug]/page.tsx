// Server Component — no 'use client'.
// Fetches blog data from PostgreSQL, generates SEO metadata, adds JSON-LD schema,
// then hands pre-fetched data to BlogPostClient for interactive rendering.

import { cache }     from 'react'
import { notFound }  from 'next/navigation'
import Script        from 'next/script'
import type { Metadata } from 'next'
import type { Prisma }   from '@prisma/client'
import { prisma }    from '@/lib/prisma'
import BlogPostClient from './BlogPostClient'
import type { SerializedBlog, RelatedPost, FaqItem } from '@/types'

type BlogWithRelations = Prisma.BlogGetPayload<{
  include: {
    author: { select: { id: true; name: true; image: true; bio: true; jobTitle: true; twitter: true; linkedin: true } }
    category: { select: { id: true; name: true; slug: true } }
    tags: { include: { tag: { select: { id: true; name: true; slug: true } } } }
  }
}>

// ── Cached DB fetch — runs ONCE even when both generateMetadata and the page call it ──
const getBlog = cache(async (slug: string): Promise<BlogWithRelations | null> => {
  return await prisma.blog.findUnique({
    where: { slug, status: 'PUBLISHED' },
    include: {
      author: {
        select: {
          id: true, name: true, image: true,
          bio: true, jobTitle: true, twitter: true, linkedin: true,
        },
      },
      category: { select: { id: true, name: true, slug: true } },
      tags:     { include: { tag: { select: { id: true, name: true, slug: true } } } },
    },
  })
})

type PageProps = {
  params: Promise<{ slug: string }>
}

// ── SEO metadata ──
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const blog = await getBlog(slug)
  if (!blog) return { title: 'Post not found' }

  const title       = blog.seoTitle       ?? blog.title
  const description = blog.seoDescription ?? blog.excerpt ?? ''
  const image       = blog.ogImage        ?? blog.coverImage ?? ''

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type:   'article',
      images: image ? [{ url: image, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card:        'summary_large_image',
      title,
      description,
      images:      image ? [image] : [],
    },
  }
}

// ── Page component ──
export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params
  const blog = await getBlog(slug)
  if (!blog) notFound()

  // ── Related posts — same category first, fill from any published blogs ──
  const related: RelatedPost[] = await (async () => {
    const sameCategory = await prisma.blog.findMany({
      where: {
        status:     'PUBLISHED',
        id:         { not: blog.id },
        categoryId: blog.categoryId ?? undefined,
      },
      take: 3,
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true, title: true, slug: true, excerpt: true,
        tag: true, coverImage: true, readMin: true,
        author: { select: { name: true } },
      },
    })

    if (sameCategory.length >= 3) return sameCategory

    const extra = await prisma.blog.findMany({
      where: {
        status: 'PUBLISHED',
        id:     { notIn: [blog.id, ...sameCategory.map((r) => r.id)] },
      },
      take:    3 - sameCategory.length,
      orderBy: { publishedAt: 'desc' },
      select: {
        id: true, title: true, slug: true, excerpt: true,
        tag: true, coverImage: true, readMin: true,
        author: { select: { name: true } },
      },
    })

    return [...sameCategory, ...extra]
  })()

  // ── JSON-LD structured data ──
  const faqItems: FaqItem[] = Array.isArray(blog.faq) ? (blog.faq as unknown as FaqItem[]) : []

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type':         'BlogPosting',
        headline:        blog.title,
        description:     blog.excerpt ?? '',
        image:           blog.coverImage ?? blog.ogImage ?? '',
        datePublished:   blog.publishedAt?.toISOString() ?? blog.createdAt.toISOString(),
        dateModified:    blog.updatedAt.toISOString(),
        author: {
          '@type':    'Person',
          name:       blog.author.name,
          jobTitle:   blog.author.jobTitle ?? '',
          sameAs:     [blog.author.twitter, blog.author.linkedin].filter(Boolean),
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://askgenie.ai' },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://askgenie.ai/blog' },
          ...(blog.category ? [{
            '@type':    'ListItem',
            position:   3,
            name:       blog.category.name,
            item:       `https://askgenie.ai/blog/topic/${blog.category.slug}`,
          }] : []),
        ],
      },
      ...(faqItems.length > 0 ? [{
        '@type':     'FAQPage',
        mainEntity:  faqItems.map((item) => ({
          '@type':          'Question',
          name:             item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      }] : []),
    ],
  }

  // ── Serialize — Date objects → ISO strings for client component ──
  const serializedBlog: SerializedBlog = {
    id:             blog.id,
    title:          blog.title,
    slug:           blog.slug,
    excerpt:        blog.excerpt,
    content:        blog.content,
    coverImage:     blog.coverImage,
    ogImage:        blog.ogImage,
    seoTitle:       blog.seoTitle,
    seoDescription: blog.seoDescription,
    faq:            faqItems,
    tag:            blog.tag,
    status:         blog.status,
    readMin:        blog.readMin,
    publishedAt:    blog.publishedAt?.toISOString() ?? null,
    updatedAt:      blog.updatedAt.toISOString(),
    createdAt:      blog.createdAt.toISOString(),
    author: {
      id:       blog.author.id,
      name:     blog.author.name,
      image:    blog.author.image,
      bio:      blog.author.bio,
      jobTitle: blog.author.jobTitle,
      twitter:  blog.author.twitter,
      linkedin: blog.author.linkedin,
    },
    category: blog.category
      ? { id: blog.category.id, name: blog.category.name, slug: blog.category.slug }
      : null,
    tags: blog.tags.map((t) => ({
      blogId: t.blogId,
      tagId:  t.tagId,
      tag:    { id: t.tag.id, name: t.tag.name, slug: t.tag.slug },
    })),
  }

  return (
    <>
      <Script
        id="blog-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <BlogPostClient blog={serializedBlog} related={related} />
    </>
  )
}
