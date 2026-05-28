import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
})

export async function GET() {
  try {
    const categories = await prisma.blogCategory.findMany({
      include: { _count: { select: { blogs: true } } },
      orderBy: { name: 'asc' },
    })
    return Response.json({ success: true, data: categories })
  } catch {
    return Response.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    await requirePermission('manage:blogs')

    const body = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return Response.json({ success: false, error: parsed.error.issues[0].message }, { status: 400 })
    }

    const category = await prisma.blogCategory.create({ data: parsed.data })

    return Response.json({ success: true, data: category }, { status: 201 })
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    }
    return Response.json({ success: false, error: 'Failed to create category' }, { status: 500 })
  }
}

