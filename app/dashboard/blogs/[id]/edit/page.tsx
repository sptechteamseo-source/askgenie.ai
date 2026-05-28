import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import DashboardHeader from '@/components/dashboard/Header'
import BlogForm from '../../BlogForm'

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [blog, categories] = await Promise.all([
    prisma.blog.findUnique({ where: { id } }),
    prisma.blogCategory.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (!blog) notFound()

  // Cast faq from Prisma Json type to our FaqItem array
  const faq = Array.isArray(blog.faq)
    ? (blog.faq as Array<{ q: string; a: string }>)
    : null

  return (
    <>
      <DashboardHeader title="Edit Blog" description={blog.title} />
      <div className="dash-content">
        <BlogForm
          initialData={{
            id:             blog.id,
            title:          blog.title,
            slug:           blog.slug,
            excerpt:        blog.excerpt,
            content:        blog.content,
            coverImage:     blog.coverImage,
            ogImage:        blog.ogImage,
            seoTitle:       blog.seoTitle,
            seoDescription: blog.seoDescription,
            faq,
            tag:            blog.tag,
            status:         blog.status,
            readMin:        blog.readMin,
            categoryId:     blog.categoryId,
          }}
          categories={categories}
        />
      </div>
      <style>{`.dash-content { padding: 28px 32px; }`}</style>
    </>
  )
}
