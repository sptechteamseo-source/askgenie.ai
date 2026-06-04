import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
})

// PUT /api/categories/:id — rename a category (admin or editor)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requirePermission('manage:blogs')
    const { id } = await params

    const body = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const category = await prisma.blogcategory.update({
      where: { id },
      data: parsed.data,
    })

    return Response.json({ success: true, data: category })
  } catch (error: any) {
    console.error('[PUT /api/categories/:id]', error)
    if (error.message === 'UNAUTHORIZED') {
      return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    }
    if (error.message === 'FORBIDDEN') {
      return Response.json({ success: false, error: 'Not allowed' }, { status: 403 })
    }
    return Response.json({ success: false, error: 'Failed to update category' }, { status: 500 })
  }
}

// DELETE /api/categories/:id — admin only
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requirePermission('manage:blogs')
    const { id } = await params

    if (session.user.role !== 'admin') {
      return Response.json({ success: false, error: 'Only admins can delete' }, { status: 403 })
    }

    // Guard: MongoDB has no FK constraints — check manually before deleting
    const assignedCount = await prisma.blog.count({ where: { categoryid: id } })
    if (assignedCount > 0) {
      return Response.json(
        { success: false, error: 'Cannot delete — this category is still assigned to one or more blogs.' },
        { status: 409 }
      )
    }

    await prisma.blogcategory.delete({ where: { id } })

    return Response.json({ success: true, data: { deleted: true } })
  } catch (error: any) {
    console.error('[DELETE /api/categories/:id]', error)
    if (error.message === 'UNAUTHORIZED') {
      return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    }
    return Response.json({ success: false, error: 'Failed to delete category' }, { status: 500 })
  }
}
