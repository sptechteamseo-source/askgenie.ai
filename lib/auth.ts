import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { z } from 'zod'

// Validate login form inputs
const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },

      async authorize(credentials) {
        // Validate inputs
        const parsed = loginSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password } = parsed.data

        // Find user in database
        const user = await prisma.users.findUnique({ where: { email } })
        if (!user) return null

        // Check password
        const passwordMatch = await bcrypt.compare(password, user.password)
        if (!passwordMatch) return null

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          image: user.image,
        }
      },
    }),
  ],

  // Use JWT for sessions (no database session table needed)
  session: { strategy: 'jwt' },

  callbacks: {
    // Put role into the JWT token + self-heal stale tokens
    async jwt({ token, user }) {
      // First sign-in: copy user fields onto the token
      if (user) {
        token.id = user.id as string
        token.role = String((user as any).role || '').toLowerCase()
        return token
      }

      // Subsequent requests: re-validate the user still exists in DB,
      // and lowercase any legacy uppercase role we still have on the token.
      // Returning {} on a missing user invalidates the session — NextAuth will
      // treat it as unauthenticated and protected pages will redirect to /login.
      if (token.id) {
        const dbUser = await prisma.users.findUnique({
          where: { id: token.id as string },
          select: { id: true, role: true },
        })

        // User no longer exists (e.g. deleted, or wiped after a force-reset).
        // Invalidate the JWT — clients with stale cookies will be bounced cleanly.
        if (!dbUser) return {}

        // Refresh role from DB and normalise to lowercase.
        token.role = String(dbUser.role || '').toLowerCase()
      }

      return token
    },

    // Put role into the session so client can read it
    async session({ session, token }) {
      if (token && token.id) {
        ;(session.user as any).id = token.id
        ;(session.user as any).role = String(token.role || '').toLowerCase()
      }
      return session
    },
  },

  pages: {
    signIn: '/login',
    error: '/login',
  },
})
