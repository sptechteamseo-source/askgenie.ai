import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission, canEdit } from '@/lib/rbac'
import { z } from 'zod'

// Zod validation schema for blog update (all fields optional)
const updateSchema = z.object({
  title:          z.string().min(1).optional(),
  slug:           z.string().min(1).optional(),
  excerpt:        z.string().optional(),
  content:        z.string().optional(),
  coverImage:     z.string().optional(),
  ogImage:        z.string().optional(),
  seoTitle:       z.string().optional(),
  seoDescription: z.string().optional(),
  faq:            z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  tag:            z.string().optional(),
  status:         z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  readMin:        z.number().min(1).optional(),
  categoryId:     z.string().optional(),
})

// GET /api/blogs/:id — fetch single blog by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const blog = await prisma.blog.findUnique({
      where: { id },
      include: {
        author:   { select: { id: true, name: true, email: true } },
        category: true,
        tags:     { include: { tag: true } },
      },
    })

    if (!blog) {
      return Response.json({ success: false, error: 'Blog not found' }, { status: 404 })
    }

    return Response.json({ success: true, data: blog })
  } catch (error) {
    console.error('[GET /api/blogs/:id]', error)
    return Response.json({ success: false, error: 'Failed to fetch blog' }, { status: 500 })
  }
}

// PUT /api/blogs/:id — update blog
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requirePermission('manage:blogs')
    const { id }  = await params

    const blog = await prisma.blog.findUnique({ where: { id } })
    if (!blog) {
      return Response.json({ success: false, error: 'Blog not found' }, { status: 404 })
    }

    // ADMIN/EDITOR can edit all, AUTHOR can only edit their own
    if (!canEdit(session.user.role as any, session.user.id, blog.authorId)) {
      return Response.json({ success: false, error: 'Not allowed' }, { status: 403 })
    }

    const body   = await request.json()
    const parsed = updateSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const d = parsed.data

    // Set publishedAt only the first time the post is published
    const publishedAt =
      d.status === 'PUBLISHED' && !blog.publishedAt ? new Date() : undefined

    // Build update payload explicitly — same approach as create.
    // We only include fields that were sent (undefined = don't touch).
    // For optional string fields, empty string clears to NULL.
    const updateData: Record<string, any> = {}

    if (d.title          !== undefined) updateData.title          = d.title
    if (d.slug           !== undefined) updateData.slug           = d.slug
    if (d.content        !== undefined) updateData.content        = d.content
    if (d.status         !== undefined) updateData.status         = d.status
    if (d.readMin        !== undefined) updateData.readMin        = d.readMin
    if (d.excerpt        !== undefined) updateData.excerpt        = d.excerpt        || null
    if (d.coverImage     !== undefined) updateData.coverImage     = d.coverImage     || null
    if (d.ogImage        !== undefined) updateData.ogImage        = d.ogImage        || null
    if (d.seoTitle       !== undefined) updateData.seoTitle       = d.seoTitle       || null
    if (d.seoDescription !== undefined) updateData.seoDescription = d.seoDescription || null
    if (d.tag            !== undefined) updateData.tag            = d.tag            || null

    // Category — relation syntax required by Prisma v7 PrismaPg adapter
    if (d.categoryId !== undefined) {
      updateData.category = d.categoryId
        ? { connect: { id: d.categoryId } }
        : { disconnect: true }
    }

    // faq is Json? — set to array when non-empty, null to clear, skip if not sent
    if (d.faq !== undefined) {
      updateData.faq = d.faq.length > 0 ? d.faq : null
    }

    if (publishedAt) updateData.publishedAt = publishedAt

    const updated = await prisma.blog.update({
      where: { id },
      data:  updateData,
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
    })

    return Response.json({ success: true, data: updated })
  } catch (error: any) {
    console.error('[PUT /api/blogs/:id]', error)
    if (error.message === 'UNAUTHORIZED') {
      return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    }
    return Response.json(
      { success: false, error: error?.message || 'Failed to update blog' },
      { status: 500 }
    )
  }
}

// DELETE /api/blogs/:id — delete blog (ADMIN only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requirePermission('manage:blogs')
    const { id }  = await params

    if (session.user.role !== 'ADMIN') {
      return Response.json({ success: false, error: 'Only admins can delete' }, { status: 403 })
    }

    await prisma.blog.delete({ where: { id } })

    return Response.json({ success: true, data: { deleted: true } })
  } catch (error: any) {
    console.error('[DELETE /api/blogs/:id]', error)
    if (error.message === 'UNAUTHORIZED') {
      return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    }
    return Response.json({ success: false, error: 'Failed to delete blog' }, { status: 500 })
  }
}
