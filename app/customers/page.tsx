'use client'

import { useState } from 'react'
import Nav    from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import CTA    from '@/components/sections/CTA'

const INDUSTRY_FILTERS = ['All', 'Fintech', 'SaaS', 'Healthcare', 'Logistics', 'Legal', 'Media'] as const
const TEAM_FILTERS     = ['RevOps', 'Support', 'Operations', 'Legal'] as const

type IndustryFilter = typeof INDUSTRY_FILTERS[number]
type TeamFilter     = typeof TEAM_FILTERS[number]

interface Metric {
  n: string
  l: string
}

interface CaseStudyCard {
  slug: string
  logo: string
  tag: string
  media: string
  industry: string
  team: string
  title: string
  body: string
  metrics: Metric[]
  foot: { team: string; read: string }
}

interface Industry {
  count: string
  h: string
  d: string
}

const CARDS: CaseStudyCard[] = [
  {
    slug: 'helio-health',
    logo: 'Helio Health',
    tag: 'Healthcare',
    media: 'cm-a',
    industry: 'Healthcare',
    team: 'RevOps',
    title: 'Audit-ready answers in 38 seconds across 14 clinics.',
    body: 'How a regional healthcare network gave 1,100 clinicians instant access to the right policy, every time — without compromising PHI.',
    metrics: [
      { n: '88%',   l: 'Faster policy lookup' },
      { n: '100%',  l: 'Audit pass rate'       },
      { n: '1,100', l: 'Active users'          },
    ],
    foot: { team: 'RevOps + Compliance', read: '8 min read' },
  },
  {
    slug: 'lattice-saas',
    logo: 'Lattice SaaS',
    tag: 'SaaS',
    media: 'cm-b',
    industry: 'SaaS',
    team: 'Support',
    title: 'Cutting support resolution time 2.4× without hiring.',
    body: 'A 300-seat SaaS company doubled their CSAT and halved escalations by giving agents grounded answers, not search results.',
    metrics: [
      { n: '2.4×', l: 'Faster resolution' },
      { n: '+18',  l: 'CSAT points'        },
      { n: '-46%', l: 'Escalation rate'    },
    ],
    foot: { team: 'Customer success', read: '6 min read' },
  },
  {
    slug: 'orbit-logistics',
    logo: 'Orbit Logistics',
    tag: 'Logistics',
    media: 'cm-c',
    industry: 'Logistics',
    team: 'Operations',
    title: 'Institutional memory for 2,000 distributed ops staff.',
    body: "When tribal knowledge lives in 12 timezones, you need an answer surface that doesn't sleep. Orbit's 90-day rollout, in detail.",
    metrics: [
      { n: '90d',   l: 'Full rollout'   },
      { n: '2,000', l: 'Active users'   },
      { n: '11',    l: 'Source systems' },
    ],
    foot: { team: 'Operations', read: '11 min read' },
  },
  {
    slug: 'finch-legal',
    logo: 'Finch Legal',
    tag: 'Legal',
    media: 'cm-d',
    industry: 'Legal',
    team: 'Legal',
    title: 'Onboarding associates in days, not months.',
    body: 'A boutique firm rebuilt onboarding around grounded AI — and cut billable ramp time from 14 weeks to 6 days.',
    metrics: [
      { n: '14w → 6d', l: 'Ramp time'                   },
      { n: '+312h',    l: 'Billable per associate / yr'  },
      { n: '0',        l: 'Citation errors'              },
    ],
    foot: { team: 'Legal · Onboarding', read: '7 min read' },
  },
  {
    slug: 'parallax-media',
    logo: 'Parallax Media',
    tag: 'Media',
    media: 'cm-e',
    industry: 'Media',
    team: 'Operations',
    title: 'Newsroom-grade citations at editorial scale.',
    body: 'A 240-journalist newsroom adopted askthegenie for research, fact-checking, and archive search — without losing editorial control.',
    metrics: [
      { n: '3.7×', l: 'Faster fact-checks'      },
      { n: '100%', l: 'Citation traceability'    },
      { n: '240',  l: 'Journalists'              },
    ],
    foot: { team: 'Newsroom · Research', read: '9 min read' },
  },
  {
    slug: 'atlas-robotics',
    logo: 'Atlas Robotics',
    tag: 'Manufacturing',
    media: 'cm-f',
    industry: 'SaaS',
    team: 'Operations',
    title: 'Field service answers, online and offline.',
    body: "When your service techs are in a basement with no signal, grounded answers need to work offline too. Atlas's edge-AI deployment.",
    metrics: [
      { n: '62%',  l: 'Faster first-fix'        },
      { n: '4.2h', l: 'Saved per tech / week'   },
      { n: '95%',  l: 'Offline coverage'         },
    ],
    foot: { team: 'Field service', read: '10 min read' },
  },
]

const LOGOS = [
  'Northwind', 'Helio Health', 'Lattice', 'Orbit',
  'Finch Legal', 'Parallax', 'Atlas Robotics', 'Vector Bank',
  'Quanta Lab', 'Meridian', 'Cascade', 'Beacon AI',
]

const INDUSTRIES: Industry[] = [
  { count: '22 stories', h: 'Financial services', d: 'Banks, fintechs and asset managers shipping audit-grade AI answers.' },
  { count: '18 stories', h: 'Healthcare',          d: 'Clinical, ops and revenue cycle teams answering questions without leaking PHI.' },
  { count: '34 stories', h: 'SaaS & technology',   d: 'From 50-seat startups to 5,000-seat platforms — grounded AI across the stack.' },
  { count: '11 stories', h: 'Legal & professional', d: 'Firms cutting research time and ramping associates in days, not months.' },
]

export default function CustomersPage() {
  const [activeIndustry, setActiveIndustry] = useState<IndustryFilter>('All')
  const [activeTeam,     setActiveTeam]     = useState<TeamFilter | null>(null)

  const filtered = CARDS.filter((c) => {
    const indOk  = activeIndustry === 'All' || c.industry === activeIndustry
    const teamOk = !activeTeam || c.team === activeTeam
    return indOk && teamOk
  })

  return (
    <>
      <Nav basePath="/" />

      <main id="main">

        {/* ── HERO ── */}
        <section className="cs-hero" aria-labelledby="cs-h1">
          <div className="cs-hero-bg" aria-hidden="true">
            <div className="glow"></div>
            <div className="grid"></div>
          </div>
          <div className="container cs-hero-inner">
            <span className="eyebrow">Customer stories · 142 teams in production</span>
            <h1 id="cs-h1" className="cs-hero-title">
              Real teams. Real <em>numbers</em>. Real citations.
            </h1>
            <p className="cs-hero-lede">
              These aren&apos;t testimonials. They&apos;re operating playbooks — how revenue, support, ops and legal teams replaced four search bars with one and got their week back. Every number is sourced; every quote is on the record.
            </p>
            <div className="cs-hero-stats" role="list" aria-label="Aggregate customer outcomes">
              <div className="cs-stat" role="listitem">
                <div className="cs-stat-n">95%</div>
                <div className="cs-stat-l">Median drop in time-to-answer across deployed teams</div>
              </div>
              <div className="cs-stat" role="listitem">
                <div className="cs-stat-n">3.2h</div>
                <div className="cs-stat-l">Recovered per knowledge worker, per week</div>
              </div>
              <div className="cs-stat" role="listitem">
                <div className="cs-stat-n">71%</div>
                <div className="cs-stat-l">Fewer &quot;does anyone know&quot; Slack messages</div>
              </div>
              <div className="cs-stat" role="listitem">
                <div className="cs-stat-n">14d</div>
                <div className="cs-stat-l">Median time to first verified answer in production</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FILTER BAR ── */}
        <div className="cs-filter" role="navigation" aria-label="Filter case studies">
          <div className="container cs-filter-inner">
            <span className="cs-filter-label">Industry</span>
            {INDUSTRY_FILTERS.map((f) => (
              <button
                key={f}
                className={`cs-chip${activeIndustry === f ? ' is-active' : ''}`}
                onClick={() => setActiveIndustry(f)}
                type="button"
              >
                {f}
              </button>
            ))}
            <span className="cs-filter-label" style={{ marginLeft: '18px' }}>Team</span>
            {TEAM_FILTERS.map((f) => (
              <button
                key={f}
                className={`cs-chip${activeTeam === f ? ' is-active' : ''}`}
                onClick={() => setActiveTeam(activeTeam === f ? null : f)}
                type="button"
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* ── FEATURED CASE STUDY ── */}
        <section className="cs-section" aria-labelledby="cs-featured-h">
          <div className="container">
            <div className="cs-eyebrow-row">
              <span className="eyebrow" id="cs-featured-h">Featured story</span>
              <a className="view-all" href="/customers/featured">
                All editor picks
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>

            <article className="cs-featured">
              <a className="cs-featured-media" href="/customers/northwind-capital" aria-label="Read: Northwind Capital case study">
                <span className="cs-featured-logo">Northwind Capital</span>
                <span className="ph-label">cover · northwind-capital.png</span>
              </a>
              <div>
                <span className="cs-featured-tag">Fintech · 600 seats · RevOps + Support</span>
                <h2 className="cs-featured-title">
                  <a href="/customers/northwind-capital">From four search bars to one — and a 95% drop in time-to-answer.</a>
                </h2>
                <p className="cs-featured-quote">
                  &ldquo;The first time I got a cited answer to &lsquo;what&rsquo;s blocking the Acme renewal&rsquo; in eight seconds, I forwarded it to my CEO and said: this is the only tool we&rsquo;re keeping.&rdquo;
                </p>
                <div className="cs-featured-metrics">
                  <div className="cs-fm"><div className="cs-fm-n">14m → 38s</div><div className="cs-fm-l">Time-to-answer (median)</div></div>
                  <div className="cs-fm"><div className="cs-fm-n">2.4×</div><div className="cs-fm-l">Faster ticket resolution</div></div>
                  <div className="cs-fm"><div className="cs-fm-n">2 → 14 days</div><div className="cs-fm-l">Quarterly audit prep</div></div>
                </div>
                <a className="btn btn-primary btn-sm" href="/customers/northwind-capital">
                  Read the full story
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
                </a>
              </div>
            </article>
          </div>
        </section>

        {/* ── CASE STUDY GRID ── */}
        <section className="cs-section" style={{ paddingTop: 0 }} aria-labelledby="cs-grid-h">
          <div className="container">
            <div className="cs-eyebrow-row">
              <span className="eyebrow" id="cs-grid-h">All case studies</span>
              <span className="muted" style={{ fontSize: '13px' }}>Showing {filtered.length} of 142</span>
            </div>

            <div className="cs-grid">
              {filtered.map((c) => (
                <article className="cs-card" key={c.slug}>
                  <a href={`/customers/${c.slug}`} className={`cs-card-media ${c.media}`} aria-hidden="true" tabIndex={-1}>
                    <span className="cs-card-logo">{c.logo}</span>
                    <span className="cs-card-tag">{c.tag}</span>
                  </a>
                  <div className="cs-card-body">
                    <h3 className="cs-card-title">
                      <a href={`/customers/${c.slug}`}>{c.title}</a>
                    </h3>
                    <p className="muted" style={{ fontSize: '13.5px', margin: 0 }}>{c.body}</p>
                    <div className="cs-card-metrics">
                      {c.metrics.map((m, i) => (
                        <div className="cs-card-metric" key={i}>
                          <div className="n">{m.n}</div>
                          <div className="l">{m.l}</div>
                        </div>
                      ))}
                    </div>
                    <div className="cs-card-foot">
                      <span>{c.foot.team}</span>
                      <span>{c.foot.read}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="pagination" style={{ marginTop: '56px' }}>
              <span className="disabled" aria-disabled="true">← Newer</span>
              <a href="/customers?page=1" className="is-current" aria-current="page">1</a>
              <a href="/customers?page=2">2</a>
              <a href="/customers?page=3">3</a>
              <span>…</span>
              <a href="/customers?page=24">24</a>
              <a href="/customers?page=2">Older →</a>
            </div>
          </div>
        </section>

        {/* ── LOGO WALL ── */}
        <section className="cs-section" style={{ paddingTop: 0 }} aria-labelledby="cs-logos-h">
          <div className="container">
            <div className="cs-eyebrow-row">
              <span className="eyebrow" id="cs-logos-h">Trusted by teams at</span>
            </div>
            <div className="cs-logos" role="list">
              {LOGOS.map((name) => (
                <div className="cs-logo" role="listitem" key={name}>{name}</div>
              ))}
            </div>
          </div>
        </section>

        {/* ── BROWSE BY INDUSTRY ── */}
        <section className="cs-section" aria-labelledby="cs-ind-h">
          <div className="container">
            <div className="cs-eyebrow-row">
              <span className="eyebrow" id="cs-ind-h">Browse by industry</span>
              <a className="view-all" href="/customers/industries">
                All industries
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </a>
            </div>
            <div className="cs-industries">
              {INDUSTRIES.map((ind) => (
                <a href="#" className="cs-industry" key={ind.h}>
                  <span className="cs-industry-c">{ind.count}</span>
                  <span className="cs-industry-h">{ind.h}</span>
                  <span className="cs-industry-d">{ind.d}</span>
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
