import { handlers } from '@/lib/auth'

// NextAuth v5 route handler - handles GET and POST for all auth endpoints
// /api/auth/signin, /api/auth/signout, /api/auth/session, etc.
export const { GET, POST } = handlers
