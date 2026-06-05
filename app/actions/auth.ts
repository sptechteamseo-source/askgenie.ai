
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

  try {
    await signIn('credentials', {
      email,
      password,
      redirectTo: 'https://askgenie-ai-inky.vercel.app/dashboard',
    })
  } catch (error: any) {
    if (error?.type === 'CredentialsSignin') {
      return { error: 'Invalid email or password' }
    }
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

  const existing = await prisma.users.findUnique({
    where: { email },
  })

  if (existing) {
    return { error: 'An account with this email already exists' }
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  await prisma.users.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role: 'author',
    },
  })

  await signIn('credentials', {
    email,
    password,
    redirectTo: 'https://askgenie-ai-inky.vercel.app/dashboard',
  })
}

// ─── Logout ───────────────────────────────────────────────────────────────────

export async function logout() {
  await signOut({
    redirectTo: 'https://askgenie-ai-inky.vercel.app/login',
  })
}

// ─── Forgot Password ──────────────────────────────────────────────────────────

export async function forgotPassword(formData: FormData) {
  const email = formData.get('email') as string

  if (!email) {
    return { error: 'Email is required' }
  }

  const user = await prisma.users.findUnique({
    where: { email },
  })

  if (!user) {
    return { success: true }
  }

  const token = crypto.randomBytes(32).toString('hex')
  const expiry = new Date(Date.now() + 60 * 60 * 1000)

  await prisma.users.update({
    where: { email },
    data: {
      resettoken: token,
      resettokenexpiry: expiry,
    },
  })

  console.log('Reset link generated')

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

  const user = await prisma.users.findFirst({
    where: {
      resettoken: token,
      resettokenexpiry: {
        gt: new Date(),
      },
    },
  })

  if (!user) {
    return { error: 'Invalid or expired reset link' }
  }

  const hashedPassword = await bcrypt.hash(password, 12)

  await prisma.users.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resettoken: null,
      resettokenexpiry: null,
    },
  })

  redirect('https://askgenie-ai-inky.vercel.app/login?message=password-reset')
}
```
