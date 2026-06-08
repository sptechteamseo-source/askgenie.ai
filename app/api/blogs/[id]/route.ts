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
  coverimage:     z.string().nullable().optional(),
  ogimage:        z.string().nullable().optional(),
  seotitle:       z.string().optional(),
  seodescription: z.string().optional(),
  faq:            z.array(z.object({ q: z.string(), a: z.string() })).optional(),
  tag:            z.string().optional(),
  status:         z.enum(['draft', 'published', 'archived']).optional(),
  readmin:        z.number().min(1).optional(),
  categoryid:     z.string().optional(),
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

    // admin/editor can edit all, author can only edit their own
    if (!canEdit(session.user.role as any, session.user.id, blog.authorid)) {
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

    // Set publishedat only the first time the post is published
    const publishedat =
      d.status === 'published' && !blog.publishedat ? new Date() : undefined

    // Build update payload explicitly — same approach as create.
    // We only include fields that were sent (undefined = don't touch).
    // For optional string fields, empty string clears to NULL.
    const updateData: Record<string, any> = {}

    if (d.title          !== undefined) updateData.title          = d.title
    if (d.slug           !== undefined) updateData.slug           = d.slug
    if (d.content        !== undefined) updateData.content        = d.content
    if (d.status         !== undefined) updateData.status         = d.status
    if (d.readmin        !== undefined) updateData.readmin        = d.readmin
    if (d.excerpt        !== undefined) updateData.excerpt        = d.excerpt        || null
    if (d.coverimage     !== undefined) updateData.coverimage     = d.coverimage     || null
    if (d.ogimage        !== undefined) updateData.ogimage        = d.ogimage        || null
    if (d.seotitle       !== undefined) updateData.seotitle       = d.seotitle       || null
    if (d.seodescription !== undefined) updateData.seodescription = d.seodescription || null
    if (d.tag            !== undefined) updateData.tag            = d.tag            || null

    // Category — relation syntax required by Prisma v7 PrismaPg adapter
    if (d.categoryid !== undefined) {
      updateData.category = d.categoryid
        ? { connect: { id: d.categoryid } }
        : { disconnect: true }
    }

    // faq is Json? — set to array when non-empty, null to clear, skip if not sent
    if (d.faq !== undefined) {
      updateData.faq = d.faq.length > 0 ? d.faq : null
    }

    if (publishedat) updateData.publishedat = publishedat

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

// DELETE /api/blogs/:id — delete blog (admin only)
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requirePermission('manage:blogs')
    const { id }  = await params

    if (session.user.role !== 'admin') {
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
