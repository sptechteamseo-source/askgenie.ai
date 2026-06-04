/**
 * Database seed script
 * Run with: npx prisma db seed
 *
 * Creates:
 * - 1 admin user (admin@askgenie.ai / Admin@1234)
 * - 1 editor user
 * - 1 author user
 * - 3 blog categories
 * - 3 sample published blogs
 * - 2 use cases
 * - 3 testimonials
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database…')

  // ─── Users ─────────────────────────────────────────────────────────────────

  const adminPassword = await bcrypt.hash('Admin@1234', 12)
  const editorPassword = await bcrypt.hash('Editor@1234', 12)
  const authorPassword = await bcrypt.hash('Author@1234', 12)

  const admin = await prisma.users.upsert({
    where: { email: 'admin@askgenie.ai' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@askgenie.ai',
      password: adminPassword,
      role: 'admin',
    },
  })

  const editor = await prisma.users.upsert({
    where: { email: 'editor@askgenie.ai' },
    update: {},
    create: {
      name: 'Jordan Reyes',
      email: 'editor@askgenie.ai',
      password: editorPassword,
      role: 'editor',
    },
  })

  const author = await prisma.users.upsert({
    where: { email: 'author@askgenie.ai' },
    update: {},
    create: {
      name: 'Priya Shah',
      email: 'author@askgenie.ai',
      password: authorPassword,
      role: 'author',
    },
  })

  console.log('✅ Created users:', admin.email, editor.email, author.email)

  // ─── Blog Categories ───────────────────────────────────────────────────────

  const categories = await Promise.all([
    prisma.blogcategory.upsert({
      where: { slug: 'engineering' },
      update: {},
      create: { name: 'Engineering', slug: 'engineering' },
    }),
    prisma.blogcategory.upsert({
      where: { slug: 'product' },
      update: {},
      create: { name: 'Product', slug: 'product' },
    }),
    prisma.blogcategory.upsert({
      where: { slug: 'research' },
      update: {},
      create: { name: 'Research', slug: 'research' },
    }),
  ])

  console.log('✅ Created categories')

  // ─── Blogs ─────────────────────────────────────────────────────────────────

  await prisma.blog.upsert({
    where: { slug: 'rag-grows-up' },
    update: {},
    create: {
      title: "RAG isn't dead. It's just growing up.",
      slug: 'rag-grows-up',
      excerpt:
        'Six retrieval patterns that actually ship to production — with the failure modes that nobody puts in the demo videos.',
      content: `# RAG isn't dead. It's just growing up.

Retrieval-Augmented Generation gets a lot of criticism lately. People say it's too brittle, too slow, or that fine-tuning is better. All of those critiques are partially correct — but they miss the point.

RAG isn't a single technique. It's a family of patterns. Here are six that we've actually shipped to production:

## 1. Hybrid search

Pure vector search misses exact matches. Pure keyword search misses semantic similarity. Hybrid search combines both using reciprocal rank fusion.

## 2. Hierarchical chunking

Chunk at multiple levels: sentences, paragraphs, and sections. Retrieve at the right granularity for the query.

## 3. Query rewriting

Before retrieval, rewrite the user's query to improve recall. This is especially useful for conversational queries.

## 4. Re-ranking

After retrieval, use a cross-encoder model to re-rank candidates for precision.

## 5. Metadata filtering

Filter by date, source, department, or other metadata before vector search to reduce noise.

## 6. Contextual compression

Once you have retrieved chunks, compress them to include only the relevant parts before passing to the LLM.

Each of these patterns solves a specific failure mode. Master all six and RAG becomes reliable enough for production.`,
      tag: 'Engineering',
      status: 'published',
      readmin: 9,
      publishedat: new Date('2026-05-04'),
      authorid: editor.id,
      categoryid: categories[0].id,
    },
  })

  await prisma.blog.upsert({
    where: { slug: 'citations-as-product' },
    update: {},
    create: {
      title: 'Citations are the product, not the footnote.',
      slug: 'citations-as-product',
      excerpt:
        "When we moved citations from 'below the answer' to 'alongside every claim', trust scores doubled.",
      content: `# Citations are the product, not the footnote.

When we first launched, citations were an afterthought — tiny footnote numbers at the bottom of the answer. Then we moved them inline, next to each claim. Trust scores doubled.

## Why citations matter more than the answer

An AI answer without sources is just a confident assertion. When users can see exactly where each claim came from, they can:

- Verify the answer independently
- Understand which source was authoritative
- Catch when the AI hallucinated (it does happen)

## Our citation design

We show citations as inline chips: [Notion · Updated 3h ago]. Clicking opens a side panel with the source context highlighted.

The key insight: the citation is a navigation tool, not a bibliography.

## What we learned

1. Users click more citations when they're positioned next to the claim (not at the bottom)
2. Source freshness matters — users trust "updated 3h ago" more than "updated last year"
3. The citation count itself is a trust signal — more sources = more confident answer`,
      tag: 'Product',
      status: 'published',
      readmin: 9,
      publishedat: new Date('2026-01-22'),
      authorid: author.id,
      categoryid: categories[1].id,
    },
  })

  await prisma.blog.upsert({
    where: { slug: 'evals-monday-morning' },
    update: {},
    create: {
      title: 'Evals that survive Monday morning: a practical playbook.',
      slug: 'evals-monday-morning',
      excerpt:
        "Most LLM eval suites die the day a real customer logs in. Here's the lightweight setup we ship with every release.",
      content: `# Evals that survive Monday morning

Most teams build eval suites that pass during development and fail the moment real users arrive. Here's how to build evals that actually survive contact with reality.

## The problem with synthetic evals

Synthetic test sets are easy to build but they don't represent your actual users. When a real customer asks "what are our Q3 targets?" the query distribution is completely different from what you imagined.

## Our five-axis rubric

We rate every answer on five axes:

1. **Factual accuracy** — Is every claim verifiable from the cited sources?
2. **Coverage** — Does the answer address all parts of the question?
3. **Relevance** — Is the cited source actually relevant to the claim?
4. **Completeness** — Are there important things the answer missed?
5. **Conciseness** — Is the answer appropriately brief?

## The 90-second rating protocol

Each answer takes 90 seconds to rate. We use a panel of 3 reviewers and take the median score. We run this every Friday on a sample of 20 real queries from the previous week.`,
      tag: 'Research',
      status: 'published',
      readmin: 11,
      publishedat: new Date('2026-04-10'),
      authorid: editor.id,
      categoryid: categories[2].id,
    },
  })

  console.log('✅ Created blogs')

  // ─── Use Cases ─────────────────────────────────────────────────────────────

  await prisma.usecase.upsert({
    where: { slug: 'revenue-ops' },
    update: {},
    create: {
      title: 'Close more without context-switching',
      slug: 'revenue-ops',
      persona: 'Revenue',
      excerpt: 'Revenue teams save 40 minutes per deal by surfacing CRM context instantly.',
      content: `# Revenue Operations

Sales reps spend more time searching for context than actually selling. With askgenie.ai, all deal context — emails, Slack threads, Salesforce notes, Notion docs — surfaces in one answer.

## The problem

A rep preparing for a call with a key account needs to:
- Review the last 3 email threads
- Check Salesforce for deal history
- Find the product spec they sent last quarter
- Check if there were any support tickets

This takes 30-40 minutes. With askgenie.ai, it takes 30 seconds.

## The result

Teams using askgenie.ai for deal prep report:
- 40 minutes saved per deal cycle
- 28% faster time to first meeting
- Better prep quality`,
      metric: '40 min saved per deal',
      industry: 'SaaS',
      teamtype: 'RevOps',
      status: 'published',
      publishedat: new Date(),
      authorid: admin.id,
    },
  })

  await prisma.usecase.upsert({
    where: { slug: 'customer-success' },
    update: {},
    create: {
      title: 'Answer once, learn forever',
      slug: 'customer-success',
      persona: 'Customer Success',
      excerpt: 'CS teams close tickets 60% faster by surfacing resolutions from past support history.',
      content: `# Customer Success

Every support ticket is a chance to build institutional memory. With askgenie.ai, the knowledge from every resolved ticket becomes available to the whole team instantly.

## The problem

When a new CS rep joins, they spend weeks learning. When a senior rep leaves, that knowledge leaves with them. Every ticket resolved in isolation — no memory of how similar issues were solved before.

## The solution

askgenie.ai connects to your support system, documentation, and Slack. When a new ticket arrives, it automatically surfaces:
- How similar issues were resolved in the past
- Relevant documentation sections
- Slack conversations where the fix was discussed

## The result

- 60% faster average ticket resolution
- New reps reach full productivity in 2 weeks instead of 6
- 40% reduction in escalations`,
      metric: '60% faster tickets',
      industry: 'SaaS',
      teamtype: 'Support',
      status: 'published',
      publishedat: new Date(),
      authorid: admin.id,
    },
  })

  console.log('✅ Created use cases')

  // ─── Testimonials ──────────────────────────────────────────────────────────
  // Note: createMany with skipDuplicates is not supported in MongoDB.
  // Using individual upserts keyed on a unique field instead.

  const testimonialData = [
    {
      quote:
        'askgenie.ai changed how our revenue team prepares for meetings. What used to take 40 minutes now takes under a minute. Every rep feels like they have a personal research assistant.',
      authorname: 'Sarah Chen',
      authorrole: 'Head of RevOps',
      company: 'Lattice',
      initials: 'SC',
      seats: '2,400 seats',
      status: 'published' as const,
      order: 1,
    },
    {
      quote:
        "Our CS team resolves tickets 60% faster. The AI surfaces exactly the right precedent from our past resolutions — it's like having institutional memory that never forgets.",
      authorname: 'Marcus Williams',
      authorrole: 'VP Customer Success',
      company: 'Helio Health',
      initials: 'MW',
      seats: '1,100 seats',
      status: 'published' as const,
      order: 2,
    },
    {
      quote:
        'We rolled it out to 800 people without a single town hall. The opt-in approach meant early adopters became champions, and adoption spread organically.',
      authorname: 'Aisha Patel',
      authorrole: 'Chief of Staff',
      company: 'Atlas Robotics',
      initials: 'AP',
      seats: '800 seats',
      status: 'published' as const,
      order: 3,
    },
  ]

  for (const t of testimonialData) {
    const existing = await prisma.testimonial.findFirst({
      where: { authorname: t.authorname, company: t.company },
    })
    if (!existing) {
      await prisma.testimonial.create({ data: t })
    }
  }

  console.log('✅ Created testimonials')
  console.log('')
  console.log('🎉 Seed complete! Login credentials:')
  console.log('   Admin:  admin@askgenie.ai  /  Admin@1234')
  console.log('   Editor: editor@askgenie.ai /  Editor@1234')
  console.log('   Author: author@askgenie.ai /  Author@1234')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
