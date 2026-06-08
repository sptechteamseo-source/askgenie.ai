import { PrismaClient } from '@prisma/client'

/**
 * MongoDB connection URL resolution order:
 *
 * 1. MONGODB_URI  — the standard env var name used by Vercel's MongoDB
 *                   integration and Atlas add-ons.  Always prefer this in
 *                   production / Vercel deployments.
 * 2. DATABASE_URL — Prisma's conventional env var; used by the Prisma CLI
 *                   (prisma generate, db push, studio) and as a local-dev
 *                   fallback when MONGODB_URI is not set.
 *
 * The datasources override below means the value of process.env.MONGODB_URI
 * (or DATABASE_URL) is evaluated at *runtime*, so the Vercel environment
 * variable automatically takes effect without any code changes.
 *
 * Do NOT hardcode credentials here — always set them in your .env.local
 * (local dev) or Vercel environment variables (production).
 */
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient }

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.MONGODB_URI ?? process.env.DATABASE_URL,
      },
    },
    log: ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}
