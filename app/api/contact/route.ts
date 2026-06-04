import { NextRequest } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const contactSchema = z.object({
  name:     z.string().min(2,  'Name must be at least 2 characters'),
  email:    z.string().email('Please enter a valid email address'),
  company:  z.string().optional(),
  role:     z.string().optional(),
  teamsize: z.string().optional(),
  message:  z.string().min(10, 'Message must be at least 10 characters'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = contactSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      )
    }

    const submission = await prisma.contactsubmission.create({
      data: parsed.data,
    })

    return Response.json({ success: true, data: { id: submission.id } }, { status: 201 })
  } catch (error) {
    console.error('[POST /api/contact]', error)
    return Response.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return Response.json({ success: false, error: 'Method not allowed' }, { status: 405 })
}
