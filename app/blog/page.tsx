'use client'

import { useState, useEffect, useRef } from 'react'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import CTA from '@/components/sections/CTA'
import PageAnimations from '@/components/ui/PageAnimations'

const FILTERS = ['All', 'Product', 'Engineering', 'Research', 'Customer stories', 'RevOps', 'Security', 'Changelog']

const PH_COLORS = ['ph-a', 'ph-b', 'ph-c', 'ph-d', 'ph-e', 'ph-f'] as const
type PhColor = typeof PH_COLORS[number]

interface Post {
  href: string
  ph: PhColor
  coverImage?: string
  tag: string
  title: string
  excerpt: string
  initials: string
  author: string
  date: string
  dateLabel: string
  readMin: number
}

interface MostReadItem {
  href: string
  label: string
}

interface TopicItem {
  href: string
  count: string
  title: string
  desc: string
}

const STATIC_POSTS: Post[] = [
  { href: '/blog/rag-grows-up', ph: 'ph-a', tag: 'Engineering', title: "RAG isn't dead. It's just growing up.", excerpt: 'Six retrieval patterns that actually ship to production — with the failure modes that nobody puts in the demo videos.', initials: 'JR', author: 'Jordan Reyes', date: '2026-05-04', dateLabel: 'May 4', readMin: 9 },
  { href: '/blog/verifiable-answers', ph: 'ph-b', tag: 'Design', title: 'Designing for verifiable answers: citation chips, source ranking, and trust.', excerpt: 'A walkthrough of the UI patterns we use to make every AI answer audit-ready in under three seconds.', initials: 'PS', author: 'Priya Shah', date: '2026-04-22', dateLabel: 'Apr 22', readMin: 7 },
  { href: '/blog/evals-monday-morning', ph: 'ph-c', tag: 'Research', title: 'Evals that survive Monday morning: a practical playbook.', excerpt: "Most LLM eval suites die the day a real customer logs in. Here's the lightweight setup we ship with every release.", initials: 'LM', author: 'Lena Müller', date: '2026-04-10', dateLabel: 'Apr 10', readMin: 11 },
  { href: '/blog/connectors-as-contracts', ph: 'ph-d', tag: 'Engineering', title: "Connectors as contracts: building integrations that age well.", excerpt: "Every connector is a long-term promise. Here's how we structure ours so they don't break when an upstream API changes.", initials: 'MD', author: 'Marco Diaz', date: '2026-03-28', dateLabel: 'Mar 28', readMin: 8 },
  { href: '/blog/revops-institutional-memory', ph: 'ph-e', tag: 'RevOps', title: 'The quiet revolution in revenue ops: AI as institutional memory.', excerpt: 'A field report from RevOps leaders using grounded AI to surface deal context, blockers, and exec briefings in seconds.', initials: 'AP', author: 'Aisha Patel', date: '2026-03-15', dateLabel: 'Mar 15', readMin: 6 },
  { href: '/blog/soc2-and-ai', ph: 'ph-f', tag: 'Security', title: "SOC 2 in an AI-grounded workspace: what auditors are asking in 2026.", excerpt: "Auditor questions changed this year. Here's how we answer the new ones about retention, training, and tenant isolation.", initials: 'RK', author: 'Reza Karimi', date: '2026-03-02', dateLabel: 'Mar 2', readMin: 5 },
  { href: '/blog/answer-quality-rubric', ph: 'ph-a', tag: 'Research', title: "An answer-quality rubric that doesn't suck.", excerpt: 'Five axes, three reviewers, ninety-second median rating time. The exact rubric our eval team uses every Friday.', initials: 'JR', author: 'Jordan Reyes', date: '2026-02-19', dateLabel: 'Feb 19', readMin: 10 },
  { href: '/blog/change-management-ai', ph: 'ph-b', tag: 'Change', title: 'Rolling out AI to 800 people without a town hall.', excerpt: "Nobody wants another all-hands. A quieter, opt-in rollout pattern that beat top-down mandates 4 to 1 in adoption.", initials: 'MO', author: 'Maya Okonkwo', date: '2026-02-04', dateLabel: 'Feb 4', readMin: 7 },
  { href: '/blog/citations-as-product', ph: 'ph-c', tag: 'Product', title: "Citations are the product, not the footnote.", excerpt: "When we moved citations from 'below the answer' to 'alongside every claim', trust scores doubled. Here's the redesign.", initials: 'PS', author: 'Priya Shah', date: '2026-01-22', dateLabel: 'Jan 22', readMin: 9 },
]

const MOST_READ: MostReadItem[] = [
  { href: '/blog/how-to-solve-information-overload-in-team-collaboration', label: 'We replaced four search bars with one' },
  { href: '/blog/rag-grows-up', label: "RAG isn't dead. It's just growing up." },
  { href: '/blog/citations-as-product', label: 'Citations are the product, not the footnote' },
  { href: '/blog/evals-monday-morning', label: 'Evals that survive Monday morning' },
  { href: '/blog/change-management-ai', label: 'Rolling out AI to 800 people without a town hall' },
]

const TAGS = ['RAG', 'Connectors', 'Evals', 'Security', 'RevOps', 'Support', 'Design', 'LLMOps', 'Retrieval', 'Citations', 'Agents', 'Research']

const TOPICS: TopicItem[] = [
  { href: '/blog/topic/rag', count: '22 articles', title: 'Retrieval & RAG', desc: 'How we chunk, embed, rank and rerank — with failure modes from real production traffic.' },
  { href: '/blog/topic/connectors', count: '18 articles', title: 'Connectors & sync', desc: 'Per-source integration playbooks for Notion, Drive, Slack, Salesforce, HubSpot and 30+ more.' },
  { href: '/blog/topic/evals', count: '14 articles', title: 'Evals & LLMOps', desc: 'Rubrics, regression suites, and the post-deploy monitoring we wish we had from day one.' },
  { href: '/blog/topic/customers', count: '31 articles', title: 'Customer stories', desc: 'How real teams in finance, healthcare and SaaS rolled out grounded AI — and what they learned.' },
]

export default function BlogPage() {
  const [activeFilter, setActiveFilter] = useState('All')
  const [posts, setPosts] = useState<Post[]>(STATIC_POSTS)
  const searchRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    fetch('/api/blogs?status=published')
      .then((r) => r.json())
      .then((data: { success: boolean; data: Array<{
        slug: string; coverimage?: string; tag?: string; title: string; excerpt?: string;
        author: { name: string }; publishedat?: string; createdat: string; readmin: number
      }> }) => {
        if (data.success && data.data.length > 0) {
          const dbPosts: Post[] = data.data.map((blog, i) => ({
            href: `/blog/${blog.slug}`,
            ph: PH_COLORS[i % PH_COLORS.length],
            coverImage: blog.coverimage ?? '',
            tag: blog.tag ?? 'General',
            title: blog.title,
            excerpt: blog.excerpt ?? '',
            initials: blog.author.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase(),
            author: blog.author.name,
            date: blog.publishedat ?? blog.createdat,
            dateLabel: new Date(blog.publishedat ?? blog.createdat).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            readMin: blog.readmin,
          }))
          setPosts(dbPosts)
        }
      })
      .catch(() => {
        // Silently fall back to static posts
      })
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <PageAnimations />
      <a href="#main" className="visually-hidden" style={{ position: 'absolute', left: '-9999px', top: 'auto' }}>Skip to main content</a>
      <Nav basePath="/" />

      <main id="main">

        {/* ── HERO ── */}
        <section className="blog-hero" aria-labelledby="blog-h1">
          <div className="blog-hero-bg" aria-hidden="true">
            <div className="dot-grid" />
            <div className="glow" />
          </div>
          <div className="container blog-hero-inner">
            <span className="eyebrow hero-anim" style={{ animationDelay: '0ms' }}>The Genie Blog · est. 2024</span>
            <h1 id="blog-h1" className="blog-hero-title hero-anim" style={{ animationDelay: '90ms' }}>
              Field notes on <em>grounded</em> AI for the modern company.
            </h1>
            <p className="blog-hero-lede hero-anim" style={{ animationDelay: '190ms' }}>
              Stories, patterns and unhinged opinions on building AI that answers from your company's own work — connectors, retrieval, evals, change management, and what comes next.
            </p>
            <div className="blog-hero-meta hero-anim" style={{ animationDelay: '280ms' }}>
              <span><strong style={{ color: 'var(--fg)' }}>142</strong> articles</span>
              <span className="dot" />
              <span>Updated weekly</span>
              <span className="dot" />
              <span>Read time avg. 6 min</span>
              <span className="dot" />
              <span>RSS · <a href="/blog/rss.xml" style={{ color: 'inherit' }}>/rss.xml</a></span>
            </div>
          </div>
        </section>

        {/* ── FILTER / SEARCH BAR ── */}
        <div className="blog-tools" role="search">
          <div className="container blog-tools-inner">
            <label className="blog-search" aria-label="Search the blog">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
              <input ref={searchRef} type="search" placeholder="Search articles, topics, authors…" name="q" />
              <kbd>⌘ K</kbd>
            </label>
            <nav className="blog-filters" aria-label="Filter by topic">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  className={`blog-filter${activeFilter === f ? ' is-active' : ''}`}
                  onClick={() => setActiveFilter(f)}
                  type="button"
                >
                  {f}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* ── FEATURED POST ── */}
        <section className="blog-section" aria-labelledby="featured-h">
          <div className="container">
            <div className="blog-eyebrow-row">
              <span className="eyebrow" id="featured-h">Featured</span>
             
           

            </div>

            <article className="featured" data-reveal="fade-up">
              <a className="featured-media" href="/blog/how-to-solve-information-overload-in-team-collaboration" aria-label="Read: How to solve information overload in team collaboration">
                <div className="ph" role="img" aria-label="Illustration placeholder" />
                <span className="ph-label">cover · information-overload.png</span>
              </a>
              <div className="featured-body">
                <span className="featured-tag">Productivity · 9 min read</span>
                <h2 className="featured-title">
                  <a href="/blog/how-to-solve-information-overload-in-team-collaboration">
                    How to solve information overload in team collaboration.
                  </a>
                </h2>
                <p className="featured-excerpt">
                  Your team isn't slow — it's drowning. A practical 7-step playbook to reduce noise, find answers faster, and give every knowledge worker back 3 hours a week without adding another tool to the stack.
                </p>
                <div className="featured-byline">
                  <span className="byline-avatar" aria-hidden="true">MO</span>
                  <div>
                    <div>
                      <span className="byline-name">Maya Okonkwo</span>
                      <span className="byline-sep">·</span>
                      <span className="byline-meta">Director of RevOps, Northwind Capital</span>
                    </div>
                    <div className="byline-meta">
                      <time dateTime="2026-05-21">May 21, 2026</time>
                      <span className="byline-sep">·</span>
                      Updated <time dateTime="2026-05-24">May 24</time>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </section>

        {/* ── POSTS + SIDEBAR ── */}
        <section className="blog-section" style={{ paddingTop: 0 }} aria-labelledby="latest-h">
          <div className="container">
            <div className="blog-eyebrow-row">
              <span className="eyebrow" id="latest-h">Latest articles</span>
             
            </div>

            <div className="blog-layout">
              <div className="posts-grid">
                {(activeFilter === 'All' ? posts : posts.filter(p => p.tag === activeFilter)).map((p, i) => (
                  <article key={p.href} className="post-card post-card-stagger" style={{ '--card-delay': `${i * 55}ms` } as any}>
                    <a href={p.href} className="post-card-media" aria-hidden="true" tabIndex={-1}>
                      {p.coverImage ? (
                        <img src={p.coverImage} alt={p.title} className="post-card-img" />
                      ) : (
                        <>
                          <div className={`ph ${p.ph}`} />
                          <span className="ph-label">post · {p.href.split('/').pop()}</span>
                        </>
                      )}
                    </a>
                    <div className="post-card-body">
                      <span className="post-card-tag">{p.tag}</span>
                      <h3 className="post-card-title">
                        <a href={p.href} style={{ textDecoration: 'none', color: 'inherit' }}>{p.title}</a>
                      </h3>
                      <p className="post-card-excerpt">{p.excerpt}</p>
                      <div className="post-card-foot">
                        <span className="byline-avatar" aria-hidden="true">{p.initials}</span>
                        <span>{p.author}</span>
                        <span className="byline-sep">·</span>
                        <time dateTime={p.date}>{p.dateLabel}</time>
                        <span className="byline-sep">·</span>
                        <span>{p.readMin} min</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* ── SIDEBAR ── */}
              <aside className="blog-sidebar" aria-label="Blog sidebar" data-reveal="fade-left" style={{ '--reveal-delay': '120ms' } as any}>
                <div className="side-newsletter">
                  <h3>The Genie, weekly.</h3>
                  <p>One article + one customer note + one engineering snippet. No tracking pixels. No &ldquo;limited-time offer&rdquo;.</p>
                  <form action="/blog/subscribe" method="post" aria-label="Subscribe to newsletter">
                    <input type="email" name="email" required placeholder="you@company.com" aria-label="Work email" />
                    <button type="submit" className="btn btn-accent" style={{ width: '100%', justifyContent: 'center' }}>
                      Subscribe
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                    </button>
                  </form>
                  <p style={{ marginTop: 10, fontSize: '11.5px', color: 'var(--fg-subtle)' }}>
                    12,400 readers · Unsubscribe in one click.
                  </p>
                </div>

                <div className="side-card">
                  <h3 className="side-h">Most read this month</h3>
                  <ol className="side-list">
                    {MOST_READ.map((item, i) => (
                      <li key={item.href}>
                        <a href={item.href}>
                          <span className="idx">{String(i + 1).padStart(2, '0')}</span>
                          <span>{item.label}</span>
                        </a>
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="side-card">
                  <h3 className="side-h">Browse by topic</h3>
                  <div className="side-tag-cloud">
                    {TAGS.map((tag) => (
                      <a key={tag} href={`/blog/topic/${tag.toLowerCase().replace(/\s+/g, '-')}`}>{tag}</a>
                    ))}
                  </div>
                </div>

                <div className="side-card">
                  <h3 className="side-h">Listen instead</h3>
                  <p style={{ fontSize: '13.5px', color: 'var(--fg-muted)', lineHeight: 1.5, margin: '0 0 12px' }}>
                    The <em>Grounded</em> podcast — 30-minute interviews with operators shipping AI to real teams.
                  </p>
                  <a className="btn btn-ghost btn-sm" href="/podcast">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="m6 4 14 8-14 8z"/></svg>
                    Latest episode
                  </a>
                </div>
              </aside>
            </div>

            {/* ── PAGINATION ── */}
            <nav className="pagination" aria-label="Article pagination">
              <span className="disabled" aria-disabled="true">← Newer</span>
              <a href="/blog?page=1" className="is-current" aria-current="page">1</a>
              <a href="/blog?page=2">2</a>
              <a href="/blog?page=3">3</a>
              <span>…</span>
              <a href="/blog?page=16">16</a>
              <a href="/blog?page=2">Older →</a>
            </nav>
          </div>
        </section>

        {/* ── TOPIC CLUSTERS ── */}
        <section className="blog-section" aria-labelledby="topics-h">
          <div className="container">
            <div className="blog-eyebrow-row">
              <span className="eyebrow" id="topics-h">Pillar topics</span>
              <a className="view-all" href="/blog/topics">
                All topics
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>
            <div className="topics">
              {TOPICS.map((t, i) => (
                <a key={t.href} href={t.href} className="topic" data-reveal="pop" style={{ '--reveal-delay': `${i * 70}ms` } as any}>
                  <span className="topic-c">{t.count}</span>
                  <span className="topic-h">{t.title}</span>
                  <span className="topic-d">{t.desc}</span>
                </a>
              ))}
            </div>
          </div>
        </section>

        <CTA />
      </main>

      <Footer />
    </>
  )
}
