import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission, canEdit } from '@/lib/rbac'
import { z } from 'zod'

const updateSchema = z.object({
  title: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  persona: z.string().optional(),
  excerpt: z.string().optional(),
  content: z.string().optional(),
  metric: z.string().optional(),
  industry: z.string().optional(),
  teamType: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
})

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const useCase = await prisma.useCase.findUnique({
      where: { id },
      include: { author: { select: { id: true, name: true, email: true } } },
    })

    if (!useCase) {
      return Response.json({ success: false, error: 'Not found' }, { status: 404 })
    }

    return Response.json({ success: true, data: useCase })
  } catch {
    return Response.json({ success: false, error: 'Failed to fetch use case' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requirePermission('manage:use-cases')
    const { id } = await params

    const useCase = await prisma.useCase.findUnique({ where: { id } })
    if (!useCase) {
      return Response.json({ success: false, error: 'Not found' }, { status: 404 })
    }

    if (!canEdit(session.user.role as any, session.user.id, useCase.authorId)) {
      return Response.json({ success: false, error: 'Not allowed' }, { status: 403 })
    }

    const body = await request.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 })
    }

    const data = parsed.data
    const publishedAt = data.status === 'PUBLISHED' && !useCase.publishedAt ? new Date() : undefined

    const updated = await prisma.useCase.update({
      where: { id },
      data: { ...data, ...(publishedAt ? { publishedAt } : {}) },
      include: { author: { select: { id: true, name: true, email: true } } },
    })

    return Response.json({ success: true, data: updated })
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    }
    return Response.json({ success: false, error: 'Failed to update use case' }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requirePermission('manage:use-cases')
    const { id } = await params

    if (session.user.role !== 'ADMIN') {
      return Response.json({ success: false, error: 'Only admins can delete' }, { status: 403 })
    }

    await prisma.useCase.delete({ where: { id } })

    return Response.json({ success: true, data: { deleted: true } })
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    }
    return Response.json({ success: false, error: 'Failed to delete use case' }, { status: 500 })
  }
}
