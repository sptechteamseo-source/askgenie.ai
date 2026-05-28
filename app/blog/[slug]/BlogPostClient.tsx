'use client'

import { useState, useEffect } from 'react'
import Nav from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import CTA from '@/components/sections/CTA'
import { processContent, getInitials, formatDate, formatDateShort } from '@/lib/blog-helpers'
import type { SerializedBlog, RelatedPost } from '@/types'

const PH_COLORS = ['ph-a', 'ph-b', 'ph-c', 'ph-d', 'ph-e', 'ph-f'] as const

interface BlogPostClientProps {
  blog: SerializedBlog
  related: RelatedPost[]
}

export default function BlogPostClient({ blog, related }: BlogPostClientProps) {
  const [progress,       setProgress]       = useState(0)
  const [activeSection,  setActiveSection]  = useState('')
  const [feedback,       setFeedback]       = useState<string | null>(null)
  const [copied,         setCopied]         = useState(false)

  const { html: contentHtml, toc } = processContent(blog.content)

  // ── Scroll progress bar ──
  useEffect(() => {
    const update = () => {
      const h      = document.documentElement
      const scrolled = h.scrollTop || document.body.scrollTop
      const height   = h.scrollHeight - h.clientHeight
      setProgress(height > 0 ? (scrolled / height) * 100 : 0)
    }
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [])

  // ── Active TOC section tracking ──
  useEffect(() => {
    if (toc.length === 0) return
    const handler = () => {
      const fromTop = window.scrollY + 160
      let current = toc[0].id
      toc.forEach(({ id }) => {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= fromTop) current = id
      })
      setActiveSection(current)
    }
    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [toc])

  // ── Share URLs — computed after mount so SSR and client HTML match ──
  const [pageUrl, setPageUrl] = useState('')
  useEffect(() => {
    setPageUrl(encodeURIComponent(location.href))
  }, [])

  const shareTitle   = encodeURIComponent(blog.title)
  const twitterHref  = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${shareTitle}`
  const linkedinHref = `https://linkedin.com/sharing/share-offsite/?url=${pageUrl}`

  function handleCopy(e: React.MouseEvent) {
    e.preventDefault()
    if (navigator.clipboard) navigator.clipboard.writeText(location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const author   = blog.author
  const initials = getInitials(author.name)
  const tags     = (blog.tags ?? []).map((t) => t.tag)
  const faqItems = Array.isArray(blog.faq) ? blog.faq : []

  return (
    <>
      <div className="read-progress" aria-hidden="true">
        <div className="read-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <Nav basePath="/" />

      <main>
        {/* ── HERO ── */}
        <section className="post2-hero">
          <div className="post2-bg" aria-hidden="true">
            <div className="glow" />
            <div className="grid" />
          </div>
          <div className="container post2-hero-inner">

            <nav className="post2-crumb" aria-label="Breadcrumb">
              <a href="/">Home</a><span className="sep">›</span>
              <a href="/blog">Blog</a>
              {blog.category && (
                <><span className="sep">›</span>
                <a href={`/blog/topic/${blog.category.slug}`}>{blog.category.name}</a></>
              )}
            </nav>

            <a
              className="post2-category"
              href={blog.category ? `/blog/topic/${blog.category.slug}` : '/blog'}
            >
              {blog.category ? blog.category.name : (blog.tag ?? 'Article')} · {blog.readMin} min read
            </a>

            <h1 className="post2-title">{blog.title}</h1>

            {blog.excerpt && <p className="post2-deck">{blog.excerpt}</p>}

            <div className="post2-byline-strip">
              {author.image ? (
                <img src={author.image} alt={author.name} className="byline-avatar-img" />
              ) : (
                <span className="byline-avatar" aria-hidden="true">{initials}</span>
              )}
              <strong>{author.name}</strong>
              {blog.publishedAt && (
                <>
                  <span className="sep">·</span>
                  <time dateTime={blog.publishedAt}>{formatDate(blog.publishedAt)}</time>
                </>
              )}
              {blog.updatedAt !== blog.publishedAt && blog.publishedAt && (
                <>
                  <span className="sep">·</span>
                  <span>Updated <time dateTime={blog.updatedAt}>{formatDateShort(blog.updatedAt)}</time></span>
                </>
              )}
            </div>

            <div className="post2-cover" role="img" aria-label={`Cover image for ${blog.title}`}>
              {blog.coverImage ? (
                <img src={blog.coverImage} alt={blog.title} className="post2-cover-img" />
              ) : (
                <div className="ph" />
              )}
            </div>
          </div>
        </section>

        {/* ── BODY ── */}
        <div className="container">
          <div className={`post2-body${toc.length === 0 ? ' no-toc' : ''}`}>

            {toc.length > 0 && (
              <aside className="post2-toc" aria-label="On this page">
                <div className="post2-toc-h">On this page</div>
                <ul className="post2-toc-list">
                  {toc.map(({ id, label }) => (
                    <li key={id}>
                      <a href={`#${id}`} className={activeSection === id ? 'is-current' : ''}>{label}</a>
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            <article className="prose2">
              <div dangerouslySetInnerHTML={{ __html: contentHtml }} />

              {faqItems.length > 0 && (
                <section className="post2-faq" id="faq" aria-labelledby="faq-h">
                  <h2 className="post2-faq-h" id="faq-h">Frequently asked questions</h2>
                  {faqItems.map((item, i) => (
                    <details key={i} className="faq-item" open={i === 0}>
                      <summary>{item.q}</summary>
                      <div className="faq-body">{item.a}</div>
                    </details>
                  ))}
                </section>
              )}

              <div className="feedback">
                <span className="feedback-q">Was this article helpful?</span>
                <div className="feedback-actions">
                  {(['👍 Yes', '👎 Not really', '✉️ Share feedback'] as const).map((label) => (
                    <button
                      key={label}
                      type="button"
                      className={`fb-btn${feedback === label ? ' fb-active' : ''}`}
                      onClick={() => setFeedback(label)}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {tags.length > 0 && (
                <div className="post2-tags" aria-label="Article tags">
                  {tags.map((tag) => (
                    <a key={tag.id} href={`/blog/tag/${tag.slug}`}>#{tag.name}</a>
                  ))}
                </div>
              )}

              <div className="author-foot">
                {author.image ? (
                  <img src={author.image} alt={author.name} className="author-avatar-img" />
                ) : (
                  <span className="author-avatar" aria-hidden="true">{initials}</span>
                )}
                <div className="author-info">
                  <h4>{author.name}</h4>
                  {author.jobTitle && <div className="role">{author.jobTitle}</div>}
                  {author.bio && <p>{author.bio}</p>}
                </div>
                {(author.twitter || author.linkedin) && (
                  <div className="author-social">
                    {author.twitter && (
                      <a className="rail-btn" href={author.twitter} aria-label="Twitter" rel="noopener noreferrer" target="_blank">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 4h3l-7 8 8 10h-6l-5-6.5L5 22H2l7.5-8.5L2 4h6l4.5 6Z"/></svg>
                      </a>
                    )}
                    {author.linkedin && (
                      <a className="rail-btn" href={author.linkedin} aria-label="LinkedIn" rel="noopener noreferrer" target="_blank">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                      </a>
                    )}
                  </div>
                )}
              </div>
            </article>

            <aside className="post2-rail" aria-label="Share">
              <div>
                <div className="rail-h">Share</div>
                <div className="rail-actions" style={{ marginTop: 10 }}>
                  <a className="rail-btn" href={twitterHref} aria-label="Share on Twitter" target="_blank" rel="noopener noreferrer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 4h3l-7 8 8 10h-6l-5-6.5L5 22H2l7.5-8.5L2 4h6l4.5 6Z"/></svg>
                  </a>
                  <a className="rail-btn" href={linkedinHref} aria-label="Share on LinkedIn" target="_blank" rel="noopener noreferrer">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                  <button
                    className="rail-btn"
                    aria-label={copied ? 'Copied!' : 'Copy link'}
                    onClick={handleCopy}
                    style={{ background: copied ? 'var(--accent-soft)' : undefined, color: copied ? 'var(--accent)' : undefined }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 1 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 1 0 7 7l1-1"/></svg>
                  </button>
                </div>
              </div>
            </aside>
          </div>

          {/* ── RELATED POSTS ── */}
          {related.length > 0 && (
            <section className="related" aria-labelledby="related-h">
              <div className="blog-eyebrow-row">
                <span className="eyebrow" id="related-h">Continue reading</span>
                <a className="view-all" href="/blog">
                  All articles
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
              </div>
              <div className="posts-grid">
                {related.map((p, i) => (
                  <article key={p.id} className="post-card">
                    <a href={`/blog/${p.slug}`} className="post-card-media" tabIndex={-1} aria-hidden="true">
                      {p.coverImage ? (
                        <img src={p.coverImage} alt={p.title} className="post-card-img" />
                      ) : (
                        <div className={`ph ${PH_COLORS[i % PH_COLORS.length]}`} />
                      )}
                    </a>
                    <div className="post-card-body">
                      <span className="post-card-tag">{p.tag ?? 'Article'}</span>
                      <h3 className="post-card-title">
                        <a href={`/blog/${p.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>{p.title}</a>
                      </h3>
                      {p.excerpt && <p className="post-card-excerpt">{p.excerpt}</p>}
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>

        <CTA />
      </main>

      <Footer />
    </>
  )
}
