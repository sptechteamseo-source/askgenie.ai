/**
 * PostgreSQL → MongoDB Atlas data migration script
 *
 * Usage:
 *   1. Temporarily set PG_DATABASE_URL in your shell to the old Postgres connection string.
 *   2. Ensure DATABASE_URL in .env / .env.local points to MongoDB Atlas.
 *   3. Run:  npx tsx prisma/migrate-pg-to-mongo.ts
 *
 * What it does:
 *   - Reads every row from Postgres using a raw pg Pool (bypassing the new Prisma schema)
 *   - Upserts each record into MongoDB via the new PrismaClient
 *   - Preserves all original IDs, timestamps, and relations
 *   - Safe to run multiple times (idempotent via upsert)
 *
 * The old Postgres schema used CUIDs as string IDs, which map directly to MongoDB
 * string _id fields — no ID translation needed.
 */

import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

// ─── Clients ────────────────────────────────────────────────────────────────

const PG_URL = process.env.PG_DATABASE_URL
if (!PG_URL) {
  console.error('❌  PG_DATABASE_URL is not set. Export it before running this script.')
  console.error('   Example: $env:PG_DATABASE_URL="postgresql://postgres:1234@localhost:5432/atg-marketing"')
  process.exit(1)
}

const pg = new Pool({ connectionString: PG_URL })
const mongo = new PrismaClient()

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function query<T = any>(sql: string): Promise<T[]> {
  const { rows } = await pg.query(sql)
  return rows as T[]
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚚  Starting PostgreSQL → MongoDB migration…\n')

  // 1. Users
  console.log('📦  Migrating users…')
  const users = await query<{
    id: string; name: string; email: string; password: string; role: string;
    image: string | null; bio: string | null; jobtitle: string | null;
    twitter: string | null; linkedin: string | null; resettoken: string | null;
    resettokenexpiry: Date | null; createdat: Date; updatedat: Date;
  }>('SELECT * FROM users')

  for (const u of users) {
    await mongo.users.upsert({
      where: { id: u.id },
      update: {},
      create: {
        id: u.id,
        name: u.name,
        email: u.email,
        password: u.password,
        role: u.role as any,
        image: u.image,
        bio: u.bio,
        jobtitle: u.jobtitle,
        twitter: u.twitter,
        linkedin: u.linkedin,
        resettoken: u.resettoken,
        resettokenexpiry: u.resettokenexpiry,
        createdat: u.createdat,
        updatedat: u.updatedat,
      },
    })
  }
  console.log(`   ✅  ${users.length} users migrated`)

  // 2. Blog categories
  console.log('📦  Migrating blog categories…')
  const categories = await query<{ id: string; name: string; slug: string }>(
    'SELECT * FROM blogcategory'
  )
  for (const c of categories) {
    await mongo.blogcategory.upsert({
      where: { id: c.id },
      update: {},
      create: { id: c.id, name: c.name, slug: c.slug },
    })
  }
  console.log(`   ✅  ${categories.length} categories migrated`)

  // 3. Blog tags
  console.log('📦  Migrating blog tags…')
  const tags = await query<{ id: string; name: string; slug: string }>('SELECT * FROM blogtag')
  for (const t of tags) {
    await mongo.blogtag.upsert({
      where: { id: t.id },
      update: {},
      create: { id: t.id, name: t.name, slug: t.slug },
    })
  }
  console.log(`   ✅  ${tags.length} tags migrated`)

  // 4. Blogs
  console.log('📦  Migrating blogs…')
  const blogs = await query<{
    id: string; title: string; slug: string; excerpt: string | null;
    content: string; coverimage: string | null; ogimage: string | null;
    seotitle: string | null; seodescription: string | null; faq: any;
    tag: string | null; status: string; readmin: number;
    publishedat: Date | null; createdat: Date; updatedat: Date;
    authorid: string; categoryid: string | null;
  }>('SELECT * FROM blog')

  for (const b of blogs) {
    await mongo.blog.upsert({
      where: { id: b.id },
      update: {},
      create: {
        id: b.id,
        title: b.title,
        slug: b.slug,
        excerpt: b.excerpt,
        content: b.content,
        coverimage: b.coverimage,
        ogimage: b.ogimage,
        seotitle: b.seotitle,
        seodescription: b.seodescription,
        faq: b.faq ?? undefined,
        tag: b.tag,
        status: b.status as any,
        readmin: b.readmin,
        publishedat: b.publishedat,
        createdat: b.createdat,
        updatedat: b.updatedat,
        authorid: b.authorid,
        categoryid: b.categoryid,
      },
    })
  }
  console.log(`   ✅  ${blogs.length} blogs migrated`)

  // 5. Blog tag mappings
  console.log('📦  Migrating blog tag mappings…')
  const tagMaps = await query<{ blogid: string; tagid: string }>('SELECT * FROM blogtagmap')
  for (const m of tagMaps) {
    const exists = await mongo.blogtagmap.findFirst({
      where: { blogid: m.blogid, tagid: m.tagid },
    })
    if (!exists) {
      await mongo.blogtagmap.create({ data: { blogid: m.blogid, tagid: m.tagid } })
    }
  }
  console.log(`   ✅  ${tagMaps.length} tag mappings migrated`)

  // 6. Use cases
  console.log('📦  Migrating use cases…')
  const usecases = await query<{
    id: string; title: string; slug: string; persona: string; excerpt: string | null;
    content: string; pagedata: any; metric: string | null; industry: string | null;
    teamtype: string | null; status: string; publishedat: Date | null;
    createdat: Date; updatedat: Date; authorid: string;
  }>('SELECT * FROM usecase')

  for (const uc of usecases) {
    await mongo.usecase.upsert({
      where: { id: uc.id },
      update: {},
      create: {
        id: uc.id,
        title: uc.title,
        slug: uc.slug,
        persona: uc.persona,
        excerpt: uc.excerpt,
        content: uc.content,
        pagedata: uc.pagedata ?? undefined,
        metric: uc.metric,
        industry: uc.industry,
        teamtype: uc.teamtype,
        status: uc.status as any,
        publishedat: uc.publishedat,
        createdat: uc.createdat,
        updatedat: uc.updatedat,
        authorid: uc.authorid,
      },
    })
  }
  console.log(`   ✅  ${usecases.length} use cases migrated`)

  // 7. Testimonials
  console.log('📦  Migrating testimonials…')
  const testimonials = await query<{
    id: string; quote: string; authorname: string; authorrole: string | null;
    company: string | null; initials: string | null; seats: string | null;
    status: string; order: number; createdat: Date; updatedat: Date;
  }>('SELECT * FROM testimonial')

  for (const t of testimonials) {
    await mongo.testimonial.upsert({
      where: { id: t.id },
      update: {},
      create: {
        id: t.id,
        quote: t.quote,
        authorname: t.authorname,
        authorrole: t.authorrole,
        company: t.company,
        initials: t.initials,
        seats: t.seats,
        status: t.status as any,
        order: t.order,
        createdat: t.createdat,
        updatedat: t.updatedat,
      },
    })
  }
  console.log(`   ✅  ${testimonials.length} testimonials migrated`)

  // 8. Contact submissions
  console.log('📦  Migrating contact submissions…')
  const contacts = await query<{
    id: string; name: string; email: string; company: string | null;
    role: string | null; teamsize: string | null; message: string;
    status: string; createdat: Date; updatedat: Date;
  }>('SELECT * FROM contactsubmission')

  for (const c of contacts) {
    await mongo.contactsubmission.upsert({
      where: { id: c.id },
      update: {},
      create: {
        id: c.id,
        name: c.name,
        email: c.email,
        company: c.company,
        role: c.role,
        teamsize: c.teamsize,
        message: c.message,
        status: c.status,
        createdat: c.createdat,
        updatedat: c.updatedat,
      },
    })
  }
  console.log(`   ✅  ${contacts.length} contact submissions migrated`)

  console.log('\n🎉  Migration complete!')
  console.log('   Run `npx prisma studio` to verify the data in MongoDB.')
}

main()
  .catch((err) => {
    console.error('❌  Migration failed:', err)
    process.exit(1)
  })
  .finally(async () => {
    await pg.end()
    await mongo.$disconnect()
  })
