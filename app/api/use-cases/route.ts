import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const useCaseSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  slug: z.string().min(1, 'Slug is required'),
  persona: z.string().min(1, 'Persona is required'),
  excerpt: z.string().optional(),
  content: z.string().optional().default(''),
  pagedata: z.any().optional(),
  metric: z.string().optional(),
  industry: z.string().optional(),
  teamtype: z.string().optional(),
  status: z.enum(['draft', 'published', 'archived']).default('draft'),
})

// GET /api/use-cases
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const status = searchParams.get('status')
    const persona = searchParams.get('persona')

    const useCases = await prisma.usecase.findMany({
      where: {
        ...(status ? { status: status as any } : {}),
        ...(persona ? { persona } : {}),
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdat: 'desc' },
    })

    return Response.json({ success: true, data: useCases })
  } catch (error) {
    console.error('[GET /api/use-cases]', error)
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
    const publishedat = data.status === 'published' ? new Date() : undefined

    const useCase = await prisma.usecase.create({
      data: { ...data, publishedat, authorid: session.user.id },
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
