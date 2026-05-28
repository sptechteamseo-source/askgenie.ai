import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const testimonialSchema = z.object({
  quote: z.string().min(1, 'Quote is required'),
  authorName: z.string().min(1, 'Author name is required'),
  authorRole: z.string().optional(),
  company: z.string().optional(),
  initials: z.string().max(3).optional(),
  seats: z.string().optional(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).default('DRAFT'),
  order: z.number().default(0),
})

// GET /api/testimonials â€” public endpoint, returns PUBLISHED by default
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const status = searchParams.get('status') ?? 'PUBLISHED'
    const all = searchParams.get('all') === 'true'

    const testimonials = await prisma.testimonial.findMany({
      where: all ? {} : { status: status as any },
      orderBy: [{ order: 'asc' }, { createdAt: 'desc' }],
    })

    return Response.json({ success: true, data: testimonials })
  } catch {
    return Response.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}

// POST /api/testimonials
export async function POST(request: NextRequest) {
  try {
    await requirePermission('manage:testimonials')

    const body = await request.json()
    const parsed = testimonialSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const testimonial = await prisma.testimonial.create({ data: parsed.data })

    return Response.json({ success: true, data: testimonial }, { status: 201 })
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    }
    return Response.json(
      { success: false, error: 'Failed to create testimonial' },
      { status: 500 }
    )
  }
}

