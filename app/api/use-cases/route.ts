import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const useCaseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  persona: z.string().min(1, 'Persona is required'),
  excerpt: z.string().optional(),
  content: z.string().min(1, 'Content is required'),
  metric: z.string().optional(),
  industry: z.string().optional(),
  teamType: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
})

// GET /api/use-cases
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const status = searchParams.get('status')
    const persona = searchParams.get('persona')

    const useCases = await prisma.useCase.findMany({
      where: {
        ...(status ? { status: status as any } : {}),
        ...(persona ? { persona } : {}),
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    })

    return Response.json({ success: true, data: useCases })
  } catch {
    return Response.json({ success: false, error: 'Failed to fetch use cases' }, { status: 500 })
  }
}

// POST /api/use-cases
export async function POST(request: NextRequest) {
  try {
    const session = await requirePermission('manage:use-cases')

    const body = await request.json()
    const parsed = useCaseSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const data = parsed.data
    const publishedAt = data.status === 'PUBLISHED' ? new Date() : undefined

    const useCase = await prisma.useCase.create({
      data: { ...data, publishedAt, authorId: session.user.id },
      include: { author: { select: { id: true, name: true, email: true } } },
    })

    return Response.json({ success: true, data: useCase }, { status: 201 })
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    }
    return Response.json({ success: false, error: 'Failed to create use case' }, { status: 500 })
  }
}

