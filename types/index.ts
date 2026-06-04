// ─── Shared types used across the app ────────────────────────────────────────

export type UserRole = 'admin' | 'editor' | 'author'
export type ContentStatus = 'draft' | 'published' | 'archived'

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
  coverimage: string | null
  tag: string | null
  status: ContentStatus
  readmin: number
  publishedat: Date | null
  createdat: Date
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
  teamtype: string | null
  status: ContentStatus
  publishedat: Date | null
  createdat: Date
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
  authorname: string
  authorrole: string | null
  company: string | null
  initials: string | null
  seats: string | null
  status: ContentStatus
  order: number
  createdat: Date
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export type DashboardStats = {
  totalblogs: number
  totalusecases: number
  totaltestimonials: number
  totalauthors: number
  publishedcontent: number
  draftcontent: number
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
  jobtitle: string | null
  twitter: string | null
  linkedin: string | null
}

export interface SerializedCategory {
  id: string
  name: string
  slug: string
}

export interface SerializedTagEntry {
  blogid: string
  tagid: string
  tag: { id: string; name: string; slug: string }
}

export interface SerializedBlog {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  coverimage: string | null
  ogimage: string | null
  seotitle: string | null
  seodescription: string | null
  faq: FaqItem[]
  tag: string | null
  status: string
  readmin: number
  publishedat: string | null
  updatedat: string
  createdat: string
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
  coverimage: string | null
  readmin: number
  author: { name: string }
}
