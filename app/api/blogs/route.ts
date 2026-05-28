import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const blogSchema = z.object({
  title:          z.string().min(1, 'Title is required'),
  slug:           z.string().min(1, 'Slug is required'),
  excerpt:        z.string().optional(),
  content:        z.string().min(1, 'Content is required'),
  coverImage:     z.string().optional(),
  ogImage:        z.string().optional(),
  seoTitle:       z.string().optional(),
  seoDescription: z.string().optional(),
  faq:            z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  tag:            z.string().optional(),
  status:         z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  readMin:        z.number().min(1).default(5),
  categoryId:     z.string().optional(),
})

// GET /api/blogs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const status = searchParams.get('status')
    const tag    = searchParams.get('tag')

    const blogs = await prisma.blog.findMany({
      where: {
        ...(status ? { status: status as any } : {}),
        ...(tag    ? { tag }                   : {}),
      },
      include: {
        author:   { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return Response.json({ success: true, data: blogs })
  } catch (error) {
    console.error('[GET /api/blogs]', error)
    return Response.json({ success: false, error: 'Failed to fetch blogs' }, { status: 500 })
  }
}

// POST /api/blogs — create blog (ADMIN or EDITOR)
export async function POST(request: NextRequest) {
  try {
    const session = await requirePermission('manage:blogs')

    const body   = await request.json()
    const parsed = blogSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const d = parsed.data
    const publishedAt = d.status === 'PUBLISHED' ? new Date() : undefined

    const blog = await prisma.blog.create({
      data: {
        // ── Scalar fields ──────────────────────────────────────
        title:          d.title,
        slug:           d.slug,
        excerpt:        d.excerpt        || undefined,
        content:        d.content,
        coverImage:     d.coverImage     || undefined,
        ogImage:        d.ogImage        || undefined,
        seoTitle:       d.seoTitle       || undefined,
        seoDescription: d.seoDescription || undefined,
        tag:            d.tag            || undefined,
        status:         d.status,
        readMin:        d.readMin,
        publishedAt,

        // ── JSON field — only set when non-empty ───────────────
        ...(d.faq && d.faq.length > 0 ? { faq: d.faq } : {}),

        // ── Relations — use connect syntax (required by Prisma v7 PrismaPg) ──
        author: {
          connect: { id: session.user.id },
        },
        ...(d.categoryId
          ? { category: { connect: { id: d.categoryId } } }
          : {}
        ),
      },
      include: {
        author:   { select: { id: true, name: true, email: true } },
        category: { select: { id: true, name: true, slug: true } },
      },
    })

    return Response.json({ success: true, data: blog }, { status: 201 })
  } catch (error: any) {
    console.error('[POST /api/blogs]', error)
    if (error.message === 'UNAUTHORIZED') {
      return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    }
    if (error.message === 'FORBIDDEN') {
      return Response.json({ success: false, error: 'Not allowed' }, { status: 403 })
    }
    return Response.json(
      { success: false, error: error?.message || 'Failed to create blog' },
      { status: 500 }
    )
  }
}
