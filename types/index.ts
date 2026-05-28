// ─── Shared types used across the app ────────────────────────────────────────

export type UserRole = 'ADMIN' | 'EDITOR' | 'AUTHOR'
export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

// Extend NextAuth session to include role and id
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      name: string
      email: string
      role: UserRole
      image?: string | null
    }
  }
  interface User {
    role: UserRole
  }
  interface JWT {
    id: string
    role: UserRole
  }
}

// ─── Blog ─────────────────────────────────────────────────────────────────────

export type BlogWithAuthor = {
  id: string
  title: string
  slug: string
  excerpt: string | null
  coverImage: string | null
  tag: string | null
  status: ContentStatus
  readMin: number
  publishedAt: Date | null
  createdAt: Date
  author: {
    id: string
    name: string
    email: string
  }
}

// ─── UseCase ──────────────────────────────────────────────────────────────────

export type UseCaseWithAuthor = {
  id: string
  title: string
  slug: string
  persona: string
  excerpt: string | null
  metric: string | null
  industry: string | null
  teamType: string | null
  status: ContentStatus
  publishedAt: Date | null
  createdAt: Date
  author: {
    id: string
    name: string
    email: string
  }
}

// ─── Testimonial ─────────────────────────────────────────────────────────────

export type TestimonialItem = {
  id: string
  quote: string
  authorName: string
  authorRole: string | null
  company: string | null
  initials: string | null
  seats: string | null
  status: ContentStatus
  order: number
  createdAt: Date
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export type DashboardStats = {
  totalBlogs: number
  totalUseCases: number
  totalTestimonials: number
  totalAuthors: number
  publishedContent: number
  draftContent: number
}

// ─── API Response helper ──────────────────────────────────────────────────────

export type ApiResponse<T = unknown> =
  | { success: true; data: T }
  | { success: false; error: string }

// ─── Blog public page types (serialized — Dates converted to strings) ─────────

export interface FaqItem {
  q: string
  a: string
}

export interface SerializedAuthor {
  id: string
  name: string
  image: string | null
  bio: string | null
  jobTitle: string | null
  twitter: string | null
  linkedin: string | null
}

export interface SerializedCategory {
  id: string
  name: string
  slug: string
}

export interface SerializedTagEntry {
  blogId: string
  tagId: string
  tag: { id: string; name: string; slug: string }
}

export interface SerializedBlog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverImage: string | null
  ogImage: string | null
  seoTitle: string | null
  seoDescription: string | null
  faq: FaqItem[]
  tag: string | null
  status: string
  readMin: number
  publishedAt: string | null
  updatedAt: string
  createdAt: string
  author: SerializedAuthor
  category: SerializedCategory | null
  tags: SerializedTagEntry[]
}

export interface RelatedPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  tag: string | null
  coverImage: string | null
  readMin: number
  author: { name: string }
}
