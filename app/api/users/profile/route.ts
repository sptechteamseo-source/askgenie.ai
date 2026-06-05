import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

const profileSchema = z.object({
  name:     z.string().min(2, 'Name must be at least 2 characters'),
  email:    z.string().email('Invalid email').optional(),
  password: z.string().min(8, 'Password must be at least 8 characters').optional(),
  bio:      z.string().optional().or(z.literal('')),
  jobtitle: z.string().optional().or(z.literal('')),
  twitter:  z.string().optional().or(z.literal('')),
  linkedin: z.string().optional().or(z.literal('')),
  image:    z.string().optional().or(z.literal('')),
})

// GET /api/users/profile — return own profile
export async function GET() {
  try {
    const session = await auth()
    if (!session?.user) {
      return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    }

    const user = await prisma.users.findUnique({
      where: { id: session.user.id },
      select: {
        id: true, name: true, email: true, role: true,
        image: true, bio: true, jobtitle: true, twitter: true, linkedin: true,
      },
    })

    return Response.json({ success: true, data: user })
  } catch (error) {
    console.error('[GET /api/users/profile]', error)
    return Response.json({ success: false, error: 'Failed to load profile' }, { status: 500 })
  }
}

// PATCH /api/users/profile — update own profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user) {
      return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = profileSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const { password, ...rest } = parsed.data
    const updateData: Record<string, any> = { ...rest }
    if (password) {
      updateData.password = await bcrypt.hash(password, 12)
    }

    const updated = await prisma.users.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true, name: true, email: true, role: true,
        image: true, bio: true, jobtitle: true, twitter: true, linkedin: true,
      },
    })

    return Response.json({ success: true, data: updated })
  } catch (error) {
    console.error('[PATCH /api/users/profile]', error)
    return Response.json({ success: false, error: 'Failed to update profile' }, { status: 500 })
  }
}
