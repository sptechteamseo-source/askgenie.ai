'use server'

import { signIn, signOut } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { redirect } from 'next/navigation'
import crypto from 'crypto'

// ─── Login ────────────────────────────────────────────────────────────────────

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const callbackUrl = (formData.get('callbackUrl') as string) || '/dashboard'

  try {
    await signIn('credentials', { email, password, redirectTo: callbackUrl })
  } catch (error: any) {
    // CredentialsSignin = wrong email or password
    if (error?.type === 'CredentialsSignin') {
      return { error: 'Invalid email or password' }
    }
    // Anything else (including the successful redirect) — let Next.js handle it
    throw error
  }
}

// ─── Sign Up ──────────────────────────────────────────────────────────────────

const signupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export async function signup(formData: FormData) {
  const raw = {
    name: formData.get('name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const parsed = signupSchema.safeParse(raw)
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message }
  }

  const { name, email, password } = parsed.data

  // Check if email is already registered
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return { error: 'An account with this email already exists' }
  }

  // Hash password with bcrypt (cost factor 12)
  const hashedPassword = await bcrypt.hash(password, 12)

  await prisma.user.create({
    data: { name, email, password: hashedPassword, role: 'AUTHOR' },
  })

  // Auto sign in after signup
  await signIn('credentials', { email, password, redirectTo: '/dashboard' })
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout() {
  await signOut({ redirectTo: '/login' })
}

// ─── Forgot Password ──────────────────────────────────────────────────────────

export async function forgotPassword(formData: FormData) {
  const email = formData.get('email') as string

  if (!email) return { error: 'Email is required' }

  const user = await prisma.user.findUnique({ where: { email } })

  // Always return success to prevent email enumeration
  if (!user) {
    return { success: true }
  }

  // Create a secure reset token
  const token = crypto.randomBytes(32).toString('hex')
  const expiry = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

  await prisma.user.update({
    where: { email },
    data: { resetToken: token, resetTokenExpiry: expiry },
  })

  // In production: send email with reset link
  // The link would be: /reset-password?token=${token}
  console.log(`Reset link: /reset-password?token=${token}`)

  return { success: true }
}

// ─── Reset Password ───────────────────────────────────────────────────────────

export async function resetPassword(formData: FormData) {
  const token = formData.get('token') as string
  const password = formData.get('password') as string

  if (!token || !password) {
    return { error: 'Token and password are required' }
  }

  if (password.length < 8) {
    return { error: 'Password must be at least 8 characters' }
  }

  // Find user with valid (non-expired) reset token
  const user = await prisma.user.findFirst({
    where: {
      resetToken: token,
      resetTokenExpiry: { gt: new Date() },
    },
  })

  if (!user) {
    return { error: 'Invalid or expired reset link' }
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null,
    },
  })

  redirect('/login?message=password-reset')
}
