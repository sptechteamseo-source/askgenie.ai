import type { NextAuthConfig } from 'next-auth'

// Lightweight auth config used by middleware (no database imports — edge-safe)
// The full credentials provider is only in lib/auth.ts
export const authConfig: NextAuthConfig = {
  providers: [],
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string
        token.role = (user as any).role as string
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        ;(session.user as any).id = token.id
        ;(session.user as any).role = token.role
      }
      return session
    },
  },
}
