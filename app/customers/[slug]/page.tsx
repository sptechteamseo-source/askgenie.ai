'use client'

import { use, useState, useEffect } from 'react'
import Nav    from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import CTA    from '@/components/sections/CTA'

interface TocItem {
  id:    string
  label: string
}

interface Metric {
  n: string
  l: string
}

interface RelatedCard {
  slug:    string
  logo:    string
  tag:     string
  media:   string
  title:   string
  metrics: Metric[]
}

const TOC: TocItem[] = [
  { id: 'background', label: 'Background'               },
  { id: 'rollout',    label: 'The 90-day rollout'       },
  { id: 'numbers',    label: 'By the numbers'           },
  { id: 'mistakes',   label: "What we'd do differently" },
  { id: 'next',       label: "What's next"              },
]

const RELATED: RelatedCard[] = [
  {
    slug: 'helio-health',
    logo: 'Helio Health',
    tag: 'Healthcare',
    media: 'cm-a',
    title: 'Audit-ready answers in 38 seconds across 14 clinics.',
    metrics: [
      { n: '88%',   l: 'Faster policy lookup' },
      { n: '100%',  l: 'Audit pass rate'       },
      { n: '1,100', l: 'Active users'          },
    ],
  },
  {
    slug: 'lattice-saas',
    logo: 'Lattice SaaS',
    tag: 'SaaS',
    media: 'cm-b',
    title: 'Cutting support resolution time 2.4× without hiring.',
    metrics: [
      { n: '2.4×', l: 'Faster resolution' },
      { n: '+18',  l: 'CSAT points'        },
      { n: '-46%', l: 'Escalations'        },
    ],
  },
  {
    slug: 'finch-legal',
    logo: 'Finch Legal',
    tag: 'Legal',
    media: 'cm-d',
    title: 'Onboarding associates in days, not months.',
    metrics: [
      { n: '14w → 6d', l: 'Ramp time'      },
      { n: '+312h',    l: 'Billable / yr'   },
      { n: '0',        l: 'Citation errors' },
    ],
  },
]

export default function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug: _slug } = use(params)

  const [progress,      setProgress]      = useState(0)
  const [activeSection, setActiveSection] = useState('background')
  const [copied,        setCopied]        = useState(false)

  useEffect(() => {
    function onScroll() {
      const h        = document.documentElement
      const scrolled = h.scrollTop || document.body.scrollTop
      const height   = h.scrollHeight - h.clientHeight
      setProgress(height > 0 ? (scrolled / height) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    function onScroll() {
      const fromTop = window.scrollY + 160
      let current = TOC[0].id
      TOC.forEach(({ id }) => {
        const el = document.getElementById(id)
        if (el && el.offsetTop <= fromTop) current = id
      })
      setActiveSection(current)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function handleCopy(e: React.MouseEvent) {
    e.preventDefault()
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <div className="read-progress" aria-hidden="true">
        <div className="read-progress-bar" style={{ width: `${progress}%` }} />
      </div>

      <Nav basePath="/" />

      <main>

        {/* ── HERO ── */}
        <section className="csd-hero">
          <div className="csd-bg" aria-hidden="true">
            <div className="glow"></div>
            <div className="grid"></div>
          </div>
          <div className="container csd-hero-inner">
            <nav className="csd-crumb" aria-label="Breadcrumb">
              <a href="/">Home</a>
              <span className="sep">›</span>
              <a href="/customers">Customers</a>
              <span className="sep">›</span>
              <a href="/customers/industry/fintech">Fintech</a>
            </nav>

            <div className="csd-meta-row">
              <div className="csd-customer">
                <span className="csd-customer-logo" aria-hidden="true">NC</span>
                <span className="csd-customer-name">Northwind Capital</span>
              </div>
              <span className="csd-cat">Fintech · 600 seats</span>
              <span className="muted" style={{ fontSize: '13.5px' }}>
                <time dateTime="2026-05-12">Published May 12, 2026</time>
                {' · '}12 min read
              </span>
            </div>

            <h1 className="csd-title">From four search bars to one — and a 95% drop in time-to-answer.</h1>
            <p className="csd-deck">
              A 600-seat fintech consolidated Slack, Notion, Drive and Salesforce search into a single citation-first answer surface in 90 days. Here&apos;s exactly how they did it — and the three things they&apos;d do differently.
            </p>

            <div className="csd-bigmetrics" role="list" aria-label="Headline outcomes">
              <div className="csd-bm" role="listitem">
                <div className="csd-bm-n">95%</div>
                <div className="csd-bm-l">Drop in median time-to-answer (14m → 38s)</div>
              </div>
              <div className="csd-bm" role="listitem">
                <div className="csd-bm-n">2.4×</div>
                <div className="csd-bm-l">Faster customer-facing resolution on cross-tool tickets</div>
              </div>
              <div className="csd-bm" role="listitem">
                <div className="csd-bm-n">71%</div>
                <div className="csd-bm-l">Fewer &ldquo;does anyone know&rdquo; Slack messages</div>
              </div>
              <div className="csd-bm" role="listitem">
                <div className="csd-bm-n">14d → 2d</div>
                <div className="csd-bm-l">Quarterly audit prep, end-to-end</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── BODY ── */}
        <div className="container">
          <div className="csd-body">

            {/* Facts panel */}
            <aside className="csd-facts" aria-label="Customer at a glance">
              <div className="csd-facts-h">At a glance</div>
              <dl>
                <div><dt>Customer</dt><dd>Northwind Capital</dd></div>
                <div><dt>Industry</dt><dd>Financial services</dd></div>
                <div><dt>Size</dt><dd>600 employees · 3 offices</dd></div>
                <div><dt>HQ</dt><dd>New York, NY</dd></div>
                <div><dt>Teams using ATG</dt><dd>RevOps · Support · Legal · Finance</dd></div>
                <div><dt>Connectors</dt><dd>Slack, Notion, Google Drive, Salesforce, Fathom</dd></div>
                <div><dt>Rollout time</dt><dd>90 days, end-to-end</dd></div>
                <div><dt>Live since</dt><dd>May 2025</dd></div>
              </dl>
            </aside>

            {/* Prose */}
            <article className="prose2">
              <p>
                A year ago, the average employee at Northwind Capital opened four search bars to answer one question. Slack had its own. Notion had its own. Drive had its own. Salesforce had its own. None of them talked to each other, and none of them returned anything resembling an answer. They returned lists of links, sorted by recency, and prayed.
              </p>
              <p>
                This is the story of what happened when they replaced all four with one — and what they got wrong.
              </p>

              {/* Challenge / Solution / Outcome */}
              <div className="cso-stack" style={{ margin: '48px 0' }}>
                <div className="cso-card">
                  <div className="cso-h">Challenge</div>
                  <h3>Four search bars. Zero answers.</h3>
                  <p>Knowledge worked sat across Slack, Notion, Drive and Salesforce — with no canonical home. Audit prep took two weeks; cross-tool tickets took an hour just to scope. The CFO had stopped asking why a number had changed.</p>
                </div>
                <div className="cso-card">
                  <div className="cso-h">Solution</div>
                  <h3>One citation-first answer surface.</h3>
                  <p>askthegenie indexed all four systems behind a single grounded answer UI. Every claim came with citations to the source paragraph. RevOps got it first; support, legal and finance followed in 30-day waves.</p>
                </div>
                <div className="cso-card">
                  <div className="cso-h">Outcome</div>
                  <h3>14 minutes → 38 seconds.</h3>
                  <p>Time-to-answer dropped 95% across deployed teams. Tickets resolved 2.4× faster. Audit prep collapsed from a two-week sprint to a two-day pass. The CFO renewed for two years.</p>
                </div>
              </div>

              <h2 className="csd-section-h2" id="background">Background</h2>
              <p>
                Northwind is 600 seats spread across New York, London and Singapore. They&apos;re a regulated business, which means their knowledge isn&apos;t just sprawling — it&apos;s audit-bound. Every answer the team gives a customer can end up in front of a regulator. <em>Where did that number come from?</em> is not a rhetorical question.
              </p>
              <p>
                Before askthegenie, the answer was usually: &ldquo;I don&apos;t know, but I&apos;ll get back to you in an hour.&rdquo; An hour that, on a good day, became three.
              </p>

              <h2 className="csd-section-h2" id="rollout">The 90-day rollout</h2>
              <p>
                Northwind didn&apos;t do a town hall. They did the opposite. They picked the loudest, most skeptical team — RevOps — and gave them a 30-day private beta. No mandate. No training video. Just a Slack channel and a promise: if you find a wrong answer, we&apos;ll buy you lunch.
              </p>
              <p>
                By week two, RevOps stopped opening Salesforce search. By week four, they were forwarding answers to their CEO with a single sentence: &ldquo;this took 4 seconds, here are the sources.&rdquo; That was the rollout.
              </p>

              <div className="csd-timeline">
                <div className="csd-tli">
                  <div className="csd-tli-day">Week 1</div>
                  <h4>Connector setup &amp; access review</h4>
                  <p>Connected Slack, Notion, Drive and Salesforce. Spent the first three days auditing share permissions on Drive — and locking down 412 documents that should have been private years ago.</p>
                </div>
                <div className="csd-tli">
                  <div className="csd-tli-day">Week 2</div>
                  <h4>RevOps private beta (12 users)</h4>
                  <p>Soft launch in #revops-genie. Daily Slack thread for misses. Median time-to-answer drops from 14 min to 2 min by Friday.</p>
                </div>
                <div className="csd-tli">
                  <div className="csd-tli-day">Week 4</div>
                  <h4>Wider RevOps + Support (60 users)</h4>
                  <p>Roll forward to all of RevOps and the support team. Citations become the most-clicked element in the UI. CSAT on cross-tool tickets up 14 points.</p>
                </div>
                <div className="csd-tli">
                  <div className="csd-tli-day">Week 8</div>
                  <h4>Legal &amp; Finance opt-in (210 users)</h4>
                  <p>Legal asks to onboard. Then Finance. Both teams ship their own connector packs (Ironclad, NetSuite). Audit team starts using it for evidence prep.</p>
                </div>
                <div className="csd-tli">
                  <div className="csd-tli-day">Day 90</div>
                  <h4>Company-wide rollout (600 users)</h4>
                  <p>Final rollout. No company-wide training. The wait list got there first. Median time-to-answer: 38 seconds.</p>
                </div>
              </div>

              {/* Big quote */}
              <div className="csd-bigquote">
                <q>The first time I got a cited answer to &lsquo;what&rsquo;s blocking the Acme renewal&rsquo; in eight seconds, I forwarded it to my CEO and said: this is the only tool we&rsquo;re keeping. The shift wasn&rsquo;t AI. It was citations.</q>
                <div className="csd-bigquote-by">
                  <span className="csd-customer-logo" aria-hidden="true">MO</span>
                  <div>
                    <div><strong>Maya Okonkwo</strong></div>
                    <div className="muted">Director of RevOps · Northwind Capital</div>
                  </div>
                </div>
              </div>

              <h2 className="csd-section-h2" id="numbers">By the numbers</h2>
              <p>
                A year in, the numbers Northwind tracks tell the story. These come from their internal analytics and a quarterly user survey — not from a vendor pitch.
              </p>
              <ul>
                <li><strong>Average time-to-answer</strong> dropped from <strong>14 minutes to 38 seconds</strong> across the support team.</li>
                <li><strong>&ldquo;Does anyone know&rdquo; Slack messages</strong> dropped <strong>71%</strong> in the channels Northwind tracked.</li>
                <li><strong>Customer-facing response time</strong> improved by <strong>2.4×</strong> on tickets that required cross-tool research.</li>
                <li><strong>Quarterly audit prep</strong> — previously a two-week sprint — became a <strong>two-day pass</strong>.</li>
                <li><strong>Citation click-through</strong> reached <strong>62%</strong>: most users verify at least one source before acting on an answer.</li>
              </ul>

              <div className="takeaways">
                <div className="takeaways-h">What worked</div>
                <h3>Three patterns Northwind credit with the win</h3>
                <ul>
                  <li><strong>Citations bigger than the answer.</strong> Every claim got a source chip next to it. One click landed on the exact paragraph. Trust came from the citations, not from the AI.</li>
                  <li><strong>Per-team connector packs.</strong> RevOps got Salesforce + Gmail + Fathom. Support got Zendesk + Notion + Drive. Each team felt like the AI knew their job.</li>
                  <li><strong>Public failure modes.</strong> A weekly thread called <code>wrong-answer-of-the-week</code> made the system feel correctable, not magic.</li>
                </ul>
              </div>

              <h2 className="csd-section-h2" id="mistakes">Three things they&apos;d do differently</h2>
              <ol>
                <li><strong>Run the access review on day zero, not week one.</strong> An AI that reads everything in your Drive will surface everything in your Drive. Northwind locked down 412 docs that should have been private — better to do that before the AI ever sees them.</li>
                <li><strong>Pick a champion, not a committee.</strong> A 12-person rollout committee slowed Northwind down by six weeks. The actual progress came from one RevOps lead who used the product daily.</li>
                <li><strong>Train the answer, not the user.</strong> Northwind wrote prompt-engineering docs that nobody read. What worked was tuning retrieval until the bad version of any question still got a usable answer.</li>
              </ol>

              <h2 className="csd-section-h2" id="next">What&apos;s next</h2>
              <p>
                Northwind is piloting agents next. Same citation-first surface, but with the ability to actually <em>do</em> things — file a Jira, draft a renewal email, update an opportunity. The bar is the same: nothing ships that can&apos;t be audited.
              </p>

              {/* CTA inside article */}
              <div className="csd-cta">
                <div>
                  <h3>Want a rollout plan like Northwind&apos;s?</h3>
                  <p>We&apos;ll send you the exact 90-day playbook they used — connector packs, comms templates, and the eval rubric.</p>
                </div>
                <a className="btn btn-accent" href="/playbook">
                  Get the playbook
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
              </div>

              {/* Tags */}
              <div className="post2-tags" aria-label="Case study tags">
                <a href="/customers/tag/fintech">#fintech</a>
                <a href="/customers/tag/revops">#revops</a>
                <a href="/customers/tag/rollout">#rollout</a>
                <a href="/customers/tag/audit">#audit</a>
                <a href="/customers/tag/citations">#citations</a>
              </div>
            </article>

            {/* Right rail */}
            <aside className="csd-rail" aria-label="On this page">
              <div className="csd-toc">
                <div className="csd-toc-h">On this page</div>
                <ul className="csd-toc-list">
                  {TOC.map(({ id, label }) => (
                    <li key={id}>
                      <a
                        href={`#${id}`}
                        className={activeSection === id ? 'is-current' : ''}
                      >
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="csd-toc-h">Share</div>
                <div className="rail-actions" style={{ display: 'flex', gap: '8px' }}>
                  <a className="rail-btn" href="#" aria-label="Share on Twitter">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M18 4h3l-7 8 8 10h-6l-5-6.5L5 22H2l7.5-8.5L2 4h6l4.5 6Z"/></svg>
                  </a>
                  <a className="rail-btn" href="#" aria-label="Share on LinkedIn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6Z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
                  </a>
                  <button
                    className="rail-btn"
                    onClick={handleCopy}
                    aria-label={copied ? 'Copied!' : 'Copy link'}
                    title={copied ? 'Copied!' : 'Copy link'}
                    type="button"
                    style={{ background: copied ? 'var(--accent-soft)' : undefined }}
                  >
                    {copied ? (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 1 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 1 0 7 7l1-1"/></svg>
                    )}
                  </button>
                  <a className="rail-btn" href="#" aria-label="Download PDF">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                  </a>
                </div>
              </div>
            </aside>
          </div>

          {/* ── RELATED ── */}
          <section className="related" aria-labelledby="related-h">
            <div className="blog-eyebrow-row">
              <span className="eyebrow" id="related-h">More customer stories</span>
              <a className="view-all" href="/customers">
                All case studies
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>
            <div className="cs-grid">
              {RELATED.map((r) => (
                <article className="cs-card" key={r.slug}>
                  <a href={`/customers/${r.slug}`} className={`cs-card-media ${r.media}`} aria-hidden="true" tabIndex={-1}>
                    <span className="cs-card-logo">{r.logo}</span>
                    <span className="cs-card-tag">{r.tag}</span>
                  </a>
                  <div className="cs-card-body">
                    <h3 className="cs-card-title">
                      <a href={`/customers/${r.slug}`}>{r.title}</a>
                    </h3>
                    <div className="cs-card-metrics">
                      {r.metrics.map((m, i) => (
                        <div className="cs-card-metric" key={i}>
                          <div className="n">{m.n}</div>
                          <div className="l">{m.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <CTA />
      </main>

      <Footer />
    </>
  )
}
