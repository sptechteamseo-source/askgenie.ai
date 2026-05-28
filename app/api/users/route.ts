import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: z.enum(['ADMIN', 'EDITOR', 'AUTHOR']).default('AUTHOR'),
})

// GET /api/users â€” ADMIN only
export async function GET() {
  try {
    await requirePermission('manage:users')

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        image: true,
        createdAt: true,
        _count: {
          select: { blogs: true, useCases: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    })

    return Response.json({ success: true, data: users })
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    }
    if (error.message === 'FORBIDDEN') {
      return Response.json({ success: false, error: 'Admins only' }, { status: 403 })
    }
    return Response.json({ success: false, error: 'Failed to fetch users' }, { status: 500 })
  }
}

// POST /api/users â€” create a new user (ADMIN only)
export async function POST(request: NextRequest) {
  try {
    await requirePermission('manage:users')

    const body = await request.json()
    const parsed = createUserSchema.safeParse(body)
    if (!parsed.success) {
      return Response.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { name, email, password, role } = parsed.data

    // Check if email is taken
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return Response.json({ success: false, error: 'Email already in use' }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword, role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    })

    return Response.json({ success: true, data: user }, { status: 201 })
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    }
    return Response.json({ success: false, error: 'Failed to create user' }, { status: 500 })
  }
}

