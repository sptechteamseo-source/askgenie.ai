'use client'

import { useEffect, useRef } from 'react'
import Nav    from '@/components/layout/Nav'
import Footer from '@/components/layout/Footer'
import CTA    from '@/components/sections/CTA'
import Image  from 'next/image'
import { ArrowRight } from '@/components/icons/Icons'

/* ─── Scroll-reveal hook ─── */
function useScrollReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('revealed')
          io.unobserve(e.target)
        }
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

/* ─── Count-up hook ─── */
function useCountUp() {
  useEffect(() => {
    const els = document.querySelectorAll('[data-countup]')
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return
        const el = e.target as HTMLElement
        const target = el.dataset.countup || ''
        const suffix = target.replace(/[\d.]+/, '')
        const num = parseFloat(target)
        if (isNaN(num)) { el.textContent = target; io.unobserve(el); return }
        let start = 0; const dur = 1600; const startTime = performance.now()
        const tick = (now: number) => {
          const p = Math.min((now - startTime) / dur, 1)
          const ease = 1 - Math.pow(1 - p, 3)
          const val = num < 10 ? (num * ease).toFixed(num % 1 !== 0 ? 0 : 0) : Math.round(num * ease)
          el.textContent = val + suffix
          if (p < 1) requestAnimationFrame(tick)
          else el.textContent = target
        }
        requestAnimationFrame(tick)
        io.unobserve(el)
      })
    }, { threshold: 0.5 })
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

function ImageSlot({ placeholder = 'Drop an image' }: { placeholder?: string }) {
  return (
    <div className="img-slot-frame">
      <div className="img-slot-ring" />
      <div className="img-slot-empty">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <path d="m21 15-5-5L5 21"/>
        </svg>
        <span className="img-slot-cap">{placeholder}</span>
      </div>
    </div>
  )
}

const EXPLAINED = [
  {
    kicker: 'How it works', n: '01',
    heading: 'From a folder of PDFs to a cited synthesis, automatically.',
    body: 'Connect your reference library or drop in PDFs and AI for Researchers reads every paper — extracting methods, findings, limitations and how studies relate. Ask a question and it returns a grounded synthesis, with each claim cited to the exact paper and page so you can verify in one click.',
    bullets: ['Ingests PDFs, preprints, DOIs & reference libraries', 'Extracts methods, findings, datasets & limitations', 'Answers in plain language, citing the exact paper'],
    placeholder: 'Extracted findings',
    img: '/images/researcher-how-it-works.png',
    imgAlt: 'AI for Researchers — reads PDFs and reference libraries, extracts methods, findings and limitations, returns cited answers',
  },
  {
    kicker: 'Why researchers use it', n: '02',
    heading: 'Because the literature grows faster than anyone can read it.',
    body: 'Researchers use AI for Researchers to keep pace with thousands of new papers a month and to synthesize across them without missing a critical result. Common use cases span the whole research lifecycle.',
    bullets: ['Literature reviews & systematic reviews', 'Grant proposals & background sections', 'Staying current on a fast-moving field', 'Comparing methods & results across studies', 'Fact-checking claims against primary sources'],
    placeholder: 'This week in your field',
    img: '/images/researcher-why-teams-use-it.png',
    imgAlt: 'AI for Researchers — keeps you current on fast-moving fields, surfaces new papers and flags contradicting studies',
  },
  {
    kicker: 'What you get', n: '03',
    heading: "A literature process that's faster, deeper and fully cited.",
    body: 'Every answer AI for Researchers returns is grounded in the papers you trust and cited to the source — so you move faster without trading away rigor. The outcome is a defensible, reproducible synthesis your collaborators and reviewers can follow.',
    bullets: ['Cited, verifiable answers on every question', 'Contradicting findings surfaced, not buried', 'A complete trail of every source & claim', 'Export-ready references in your citation style'],
    placeholder: 'Cited synthesis',
  },
]

const STEPS = [
  { kicker: 'Step 1', n: '01', title: 'Add your papers',             body: 'Connect Zotero, Mendeley or your reference library — or drag in a folder of PDFs and DOIs. AI for Researchers reads and indexes everything in minutes.' },
  { kicker: 'Step 2', n: '02', title: 'Ask your research question',  body: "Type a question like \"what methods did 2024 studies use, and what did they find?\" No search operators — just ask the way you'd ask a colleague." },
  { kicker: 'Step 3', n: '03', title: 'Verify the cited source',     body: 'Get a grounded synthesis with each claim cited to the exact paper, section and page. Click any citation to jump straight to the source and confirm.' },
  { kicker: 'Step 4', n: '04', title: 'Export a referenced summary', body: 'Turn your synthesis into a referenced literature summary in your citation style — ready to drop into a paper, grant or review.' },
]

const PROBLEMS = [
  { icon: '∞', title: 'Information overload',     body: 'Surface the findings that matter across thousands of papers — without reading each one.' },
  { icon: '⏱', title: 'Slow literature reviews',  body: 'Synthesize a topic in an afternoon instead of three weeks of manual reading.' },
  { icon: '◎', title: 'Missing key findings',     body: 'Catch the critical result — or the contradicting study — that a keyword search would bury.' },
  { icon: '"', title: 'Citation management',      body: 'Every claim is traced to its source and exported in your citation style automatically.' },
  { icon: '✓', title: 'Verifying claims',         body: 'Cited, grounded answers let you check primary sources instead of trusting a summary.' },
  { icon: '✧', title: 'Synthesis across sources', body: 'Compare methods, datasets and results across many papers in one grounded view.' },
]

const FEATURES = [
  { icon: '≡', title: 'Paper summarization',    body: 'A 30-page study distilled to its question, method, finding and limitation.' },
  { icon: '◎', title: 'Key-finding extraction', body: 'Pulls results, effect sizes, datasets and caveats into a structured view.' },
  { icon: '✧', title: 'Literature synthesis',   body: 'Synthesizes across many papers and flags where they agree or conflict.' },
  { icon: '"', title: 'Citation extraction',    body: 'Every claim cited to the source and exported in your reference style.' },
  { icon: '🔍', title: 'Cross-paper search',   body: 'Ask anything across your whole library and get the exact passage cited.' },
  { icon: '↻', title: 'Stay-current alerts',   body: 'Weekly digests of new papers that match your saved research topics.' },
]

const BENEFITS = ['Faster literature reviews', 'Stay current effortlessly', 'Never miss a key finding', 'Verifiable citations', 'More time for analysis', 'Stronger research synthesis']

const STATS = [
  { n: '10×',  raw: '10×',  label: 'Faster literature reviews across research teams', source: 'source: 9 research customer surveys · 2026' },
  { n: '100%', raw: '100%', label: 'Of claims cited to the source paper & page',      source: 'source: ATG answer logs' },
  { n: '8h',   raw: '8h',   label: 'Saved per researcher, per week',                  source: 'source: self-reported · validated' },
  { n: '12k',  raw: '12k',  label: 'Papers searchable in a typical lab library',      source: 'source: median ATG deployment' },
]

const LOGOS = ['Quanta Lab', 'Helio Health', 'Northwind', 'Orbit', 'Parallax', 'Meridian', 'Atlas Robotics', 'Vector Bank', 'Lattice', 'Finch Legal', 'Cascade', 'Beacon AI']
const LOGOS_DOUBLED = [...LOGOS, ...LOGOS] // for seamless marquee

const MORE = [
  { icon: '⚖', title: 'AI for Legal Documents', desc: 'Review contracts, extract clauses and surface risk in seconds — every answer cited to the exact clause.',       link: 'Explore legal use case',      href: '/use-cases/ai-for-legal-documents' },
  { icon: '◆', title: 'Sales',                  desc: 'Prep for calls in seconds, follow up the same day, and never lose a deal to a missed detail again.',           link: 'Explore sales use case',      href: '/use-cases/sales' },
  { icon: '✦', title: 'Marketing',              desc: 'Research campaigns, create on-brand content and get instant answers from your brand library.',                 link: 'Explore marketing use case',  href: '/use-cases/marketing' },
  { icon: '✚', title: 'Healthcare',             desc: 'Answer clinical, operational and compliance questions — cited from your protocols, policies, and payer rules.', link: 'Explore healthcare use case', href: '/use-cases/healthcare' },
]

export default function ResearcherPage() {
  useScrollReveal()
  useCountUp()

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: PAGE_CSS }} />
      <Nav basePath="/" />
      <main id="main">

        {/* ── HERO ── */}
        <section className="persona-hero" aria-labelledby="ph1">
          <div className="persona-hero-bg" aria-hidden="true">
            <div className="grid"></div>
            <div className="glow"></div>
            <div className="glow-pulse"></div>
          </div>
          <div className="container persona-hero-inner">
            <div>
              <div className="persona-eyebrow hero-anim" style={{ animationDelay: '0ms' }}>For researchers, analysts &amp; academics</div>
              <h1 id="ph1" className="persona-h1 hero-anim" style={{ animationDelay: '90ms' }}>
                <em>AI for Researchers</em> that reads every paper for you.
              </h1>
              <p className="persona-lede hero-anim" style={{ animationDelay: '190ms' }}>
                AI for Researchers from Ask the Genie reads, summarizes and synthesizes academic papers — extracting the key findings and citing every source. Run a literature review in an afternoon, stay on top of your field, and never miss a critical result again.
              </p>
              <div className="persona-cta-row hero-anim" style={{ animationDelay: '290ms' }}>
                <a className="btn btn-accent" href="/#cta">Start Free Trial <ArrowRight size={14} /></a>
                <a className="btn btn-ghost" href="/#demo">Schedule Demo</a>
              </div>
            </div>

            {/* Hero visual — 3 floating answer cards */}
            <div className="persona-visual hero-anim" style={{ animationDelay: '200ms' }} role="img" aria-label="Three illustrative research answer cards">
              <div className="pv-card pv-card-a float-card" style={{ animationDelay: '400ms' }}>
                <div className="pv-h">Research question</div>
                <p className="pv-t">What methods did 2024 studies on gut–brain axis use?</p>
                <span className="pv-cite">● 38 papers · PubMed · Zotero</span>
              </div>
              <div className="pv-card pv-card-b float-card" style={{ animationDelay: '550ms' }}>
                <div className="pv-h">Synthesis · 9s</div>
                <p className="pv-t">26 used RCTs, 8 meta-analyses. Common limitation: small samples (n&lt;50).</p>
                <span className="pv-cite">12 papers cited</span>
                <div className="pv-bar"><i className="pv-bar-fill"></i></div>
              </div>
              <div className="pv-card pv-card-c float-card" style={{ animationDelay: '700ms' }}>
                <div className="pv-h">Source · Chen et al. 2024</div>
                <p className="pv-t">Methods §3.2 — randomized, double-blind, n = 42</p>
                <span className="pv-cite">Verified</span>
              </div>
            </div>
          </div>
        </section>

        {/* ── EXPLAINED ── */}
        <section className="persona-uses" id="explained" aria-labelledby="explained-h">
          <div className="container">
            <h2 id="explained-h" className="persona-uses-h" data-reveal="fade-up">AI for Researchers — explained.</h2>
            <p className="persona-uses-lede" data-reveal="fade-up" style={{ '--reveal-delay': '80ms' } as any}>
              AI for Researchers is software that reads academic literature the way a domain expert would — understanding methods, findings, limitations and how papers relate — and answers your questions in plain language, with every claim cited back to the exact paper. It turns weeks of manual literature review into an afternoon of grounded synthesis.
            </p>
            {EXPLAINED.map((item, i) => (
              <div key={i}
                className={`use-row${i % 2 === 1 ? ' is-reversed' : ''}`}
                data-reveal={i % 2 === 0 ? 'fade-left' : 'fade-right'}
              >
                <div>
                  <div className="use-step-num"><span>{item.n}</span> {item.kicker}</div>
                  <h3 className="use-h">{item.heading}</h3>
                  <p className="use-p">{item.body}</p>
                  <ul className="use-list">
                    {item.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                </div>
                <div className={`use-visual--img${(item as any).img ? ' has-img' : ''}`}>
                  {(item as any).img ? (
                    <Image src={(item as any).img} alt={(item as any).imgAlt ?? item.placeholder} fill className="use-visual-img-real" style={{ objectFit: 'cover', padding: '12px' }} />
                  ) : (
                    <ImageSlot placeholder={item.placeholder} />
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW TO USE ── */}
        <section className="persona-more" aria-labelledby="howto-h">
          <div className="container">
            <h2 id="howto-h" className="persona-more-h" data-reveal="fade-up">How to use AI for Researchers: step-by-step.</h2>
            <p className="persona-uses-lede" data-reveal="fade-up" style={{ marginBottom: 36, '--reveal-delay': '60ms' } as any}>
              Getting started takes four steps — no setup project, no new query language. Add your papers, ask your question, verify the citation, and export a referenced summary.
            </p>
            <div className="legal-steps">
              {STEPS.map((s, i) => (
                <article className="legal-step step-hover" key={i} data-reveal="fade-up" style={{ '--reveal-delay': `${i * 90}ms` } as any}>
                  <div className="legal-step-kicker">{s.kicker}</div>
                  <div className="legal-step-n">{s.n}</div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── PROBLEMS ── */}
        <section className="persona-more" aria-labelledby="problems-h">
          <div className="container">
            <h2 id="problems-h" className="persona-more-h" data-reveal="fade-up">Problems we solve at Ask the Genie related to AI for Researchers.</h2>
            <div className="legal-problem-grid">
              {PROBLEMS.map((p, i) => (
                <div className="legal-problem problem-item" key={i} data-reveal="fade-up" style={{ '--reveal-delay': `${(i%2)*80}ms` } as any}>
                  <span className="legal-problem-ic">{p.icon}</span>
                  <div><h3>{p.title}</h3><p>{p.body}</p></div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES & BENEFITS ── */}
        <section className="persona-more" aria-labelledby="features-h" style={{ paddingTop: 0 }}>
          <div className="container">
            <h2 id="features-h" className="persona-more-h" data-reveal="fade-up">AI for Researchers — features, benefits &amp; key capabilities.</h2>

            <div className="cs-eyebrow-row"><span className="eyebrow">Key features</span></div>
            <div className="legal-feat-panel">
              {FEATURES.map((f, i) => (
                <div className="legal-feat feat-item" key={i} data-reveal="fade-up" style={{ '--reveal-delay': `${i*50}ms` } as any}>
                  <span className="legal-feat-ic">{f.icon}</span>
                  <div><h3>{f.title}</h3><p>{f.body}</p></div>
                </div>
              ))}
            </div>

            <div className="cs-eyebrow-row" style={{ marginTop: 48 }}>
              <span className="eyebrow">Benefits for researchers &amp; teams</span>
            </div>
            <div className="legal-benefit-grid">
              {BENEFITS.map((b, i) => (
                <div className="legal-benefit benefit-chip" key={i} data-reveal="pop" style={{ '--reveal-delay': `${i*60}ms` } as any}>
                  <span className="chk">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                  </span>
                  {b}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── QUOTE ── */}
        <section className="persona-quote" aria-labelledby="quote-h">
          <div className="container persona-quote-inner">
            <div className="persona-quote-card" data-reveal="fade-right">
              <div className="persona-quote-card-inner">
                <div className="name">Dr. Lena Müller</div>
                <div className="role">Principal Investigator · Quanta Lab</div>
              </div>
            </div>
            <div className="persona-quote-text" data-reveal="fade-left">
              <q id="quote-h">A literature review that used to eat three weeks of my postdocs&apos; time now takes an afternoon — and every claim cites the exact paper and page, so peer reviewers can follow our reasoning.</q>
              <div className="persona-quote-attr">— Quanta Lab · 40 researchers · life sciences</div>
            </div>
          </div>
        </section>

        {/* ── STATS ── */}
        <section className="persona-stats" aria-labelledby="stats-h" id="stats">
          <div className="container">
            <h2 id="stats-h" className="persona-stats-h" data-reveal="fade-up">The outcomes research teams report.</h2>
            <div className="persona-stat-grid" role="list">
              {STATS.map((s, i) => (
                <div className="persona-stat-cell" role="listitem" key={i} data-reveal="fade-up" style={{ '--reveal-delay': `${i*80}ms` } as any}>
                  <div className="persona-stat-n" data-countup={s.raw}>{s.n}</div>
                  <div className="persona-stat-l">{s.label}</div>
                  <div className="persona-stat-source">{s.source}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── DISCOVER MORE ── */}
        <section className="persona-more" aria-labelledby="more-h">
          <div className="container">
            <h2 id="more-h" className="persona-more-h" data-reveal="fade-up">Discover how other teams use askthegenie.</h2>
            <div className="persona-more-grid">
              {MORE.map((m, i) => (
                <a className="persona-more-card more-card" href={m.href} key={i} data-reveal="pop" style={{ '--reveal-delay': `${i*70}ms` } as any}>
                  <span className="persona-more-icon">{m.icon}</span>
                  <h3 className="persona-more-h3">{m.title}</h3>
                  <p className="persona-more-p">{m.desc}</p>
                  <span className="persona-more-link">{m.link} <ArrowRight size={13} /></span>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── LOGO WALL — marquee ── */}
        <section className="cs-section logo-section" style={{ paddingTop: 0 }} aria-labelledby="cs-logos-h">
          <div className="container">
            <div className="cs-eyebrow-row" data-reveal="fade-up">
              <span className="eyebrow" id="cs-logos-h">Trusted by research teams at</span>
            </div>
          </div>
          <div className="logo-marquee-track" role="list" aria-label="Trusted research teams">
            <div className="logo-marquee">
              {LOGOS_DOUBLED.map((l, i) => (
                <div className="logo-marquee-item" role="listitem" key={i}>{l}</div>
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

/* ─── All CSS (keyframes & scroll-reveal system are in globals.css) ─── */
const PAGE_CSS = `
/* ══════════════════ HERO ══════════════════ */

.persona-hero {
  position:relative;
  padding:clamp(72px,9vw,120px) 0 clamp(56px,7vw,96px);
  overflow:hidden;
  border-bottom:1px solid var(--border);
}
.persona-hero-bg { position:absolute; inset:0; z-index:0; pointer-events:none; }
.persona-hero-bg .glow {
  position:absolute; right:-200px; top:-200px;
  width:900px; height:700px; border-radius:50%;
  background:radial-gradient(closest-side,var(--accent-glow),transparent 70%);
  filter:blur(40px); opacity:.8;
}
.glow-pulse {
  position:absolute; left:50%; top:-260px;
  width:700px; height:500px; border-radius:50%;
  background:radial-gradient(closest-side,var(--accent-glow),transparent 70%);
  filter:blur(60px);
  animation: glowPulse 5s ease-in-out infinite;
}
.persona-hero-bg .grid {
  position:absolute; inset:0; opacity:.2;
  background-image:radial-gradient(circle,var(--border) 1px,transparent 1px);
  background-size:28px 28px;
  mask-image:radial-gradient(ellipse 70% 80% at 50% 0%,black 0%,transparent 70%);
}
.persona-hero-inner {
  position:relative; z-index:1;
  display:grid; grid-template-columns:1.1fr 1fr;
  gap:clamp(32px,5vw,72px); align-items:center;
}
@media(max-width:920px){.persona-hero-inner{grid-template-columns:1fr;}}

/* Hero entrance stagger */
.hero-anim {
  opacity:0;
  animation: heroIn .8s cubic-bezier(.2,0,0,1) both;
}

.persona-eyebrow {
  display:inline-flex; align-items:center; gap:10px;
  font-family:var(--font-label); font-size:12px; letter-spacing:.14em;
  text-transform:uppercase; color:var(--accent); font-weight:600; margin-bottom:18px;
}
.persona-eyebrow::before { content:""; width:28px; height:1px; background:currentColor; }
.persona-h1 {
  font-family:var(--font-display); font-weight:600;
  font-size:clamp(40px,5.6vw,76px); line-height:1;
  letter-spacing:-0.035em; margin:0 0 22px; text-wrap:balance; max-width:14ch;
}
.persona-h1 em { font-style:normal; color:var(--accent); }
.persona-lede {
  color:var(--fg-muted); font-size:clamp(17px,1.45vw,21px);
  line-height:1.55; max-width:58ch; text-wrap:pretty; margin:0 0 28px;
}
.persona-cta-row { display:flex; gap:10px; flex-wrap:wrap; }

/* Hero visual — floating cards */
.persona-visual {
  position:relative; aspect-ratio:4/5;
  border-radius:var(--radius-lg);
  background:radial-gradient(closest-side at 30% 30%,var(--accent-glow),transparent 70%),var(--bg-elevated);
  border:1px solid var(--border); overflow:hidden;
  box-shadow:0 40px 80px -40px color-mix(in oklab,var(--accent) 30%,transparent);
}
@media(max-width:920px){.persona-visual{aspect-ratio:16/11;}}

.pv-card {
  position:absolute; border:1px solid var(--border);
  border-radius:var(--radius-md);
  background:color-mix(in oklab,var(--bg) 88%,transparent);
  backdrop-filter:blur(8px); padding:14px 16px;
  box-shadow:0 12px 30px -10px rgba(0,0,0,.25);
  opacity:0;
}
.float-card { opacity:0; }
.float-card.pv-card-a { animation:heroIn .6s cubic-bezier(.2,0,0,1) both, floatCard 6s ease-in-out 1s infinite; animation-delay:400ms,1s; }
.float-card.pv-card-b { animation:heroIn .6s cubic-bezier(.2,0,0,1) both, floatCard 7s ease-in-out 1.5s infinite; animation-delay:550ms,1.5s; }
.float-card.pv-card-c { animation:heroIn .6s cubic-bezier(.2,0,0,1) both, floatCard 5.5s ease-in-out .5s infinite; animation-delay:700ms,.5s; }

.pv-card-a{left:8%;top:12%;width:56%;}
.pv-card-b{right:6%;top:38%;width:50%;}
.pv-card-c{left:14%;bottom:8%;width:64%;}

.pv-card .pv-h{font-family:var(--font-mono);font-size:10.5px;letter-spacing:.08em;text-transform:uppercase;color:var(--fg-subtle);margin-bottom:6px;}
.pv-card .pv-t{font-family:var(--font-display);font-weight:600;font-size:14px;line-height:1.3;letter-spacing:-0.005em;color:var(--fg);margin:0 0 8px;}
.pv-card .pv-cite{display:inline-flex;align-items:center;gap:6px;font-family:var(--font-mono);font-size:10px;color:var(--accent);padding:3px 8px;border:1px solid color-mix(in oklab,var(--accent) 30%,transparent);border-radius:999px;background:var(--accent-soft);}
.pv-card .pv-bar{height:4px;border-radius:4px;background:var(--bg-sunken);margin-top:8px;overflow:hidden;}
.pv-bar-fill{display:block;height:100%;background:var(--accent);width:0;border-radius:4px;animation:pvBarFill 1.2s cubic-bezier(.2,0,0,1) 1.4s forwards;}

/* ══════════════════ EXPLAINED SECTION ══════════════════ */

.persona-uses{padding:clamp(64px,8vw,112px) 0;}
.persona-uses-h{font-family:var(--font-display);font-size:clamp(32px,4vw,52px);font-weight:600;letter-spacing:-0.03em;line-height:1.05;margin:0 0 18px;max-width:22ch;text-wrap:balance;}
.persona-uses-lede{color:var(--fg-muted);font-size:clamp(16px,1.3vw,19px);line-height:1.55;max-width:60ch;margin:0 0 56px;}

.use-row{display:grid;grid-template-columns:1fr 1fr;gap:clamp(28px,5vw,72px);align-items:center;margin:clamp(48px,7vw,96px) 0;}
.use-row.is-reversed{direction:rtl;}
.use-row.is-reversed>*{direction:ltr;}
@media(max-width:880px){.use-row,.use-row.is-reversed{grid-template-columns:1fr;direction:ltr;}}

.use-step-num{display:inline-flex;align-items:center;gap:10px;font-family:var(--font-label);font-size:11.5px;letter-spacing:.14em;text-transform:uppercase;color:var(--accent);font-weight:600;margin-bottom:14px;}
.use-step-num span{display:inline-flex;align-items:center;justify-content:center;width:28px;height:28px;border:1px solid color-mix(in oklab,var(--accent) 40%,transparent);background:var(--accent-soft);border-radius:999px;font-family:var(--font-display);font-size:12px;}
.use-h{font-family:var(--font-display);font-size:clamp(26px,2.8vw,38px);font-weight:600;letter-spacing:-0.025em;line-height:1.1;margin:0 0 16px;text-wrap:balance;}
.use-p{color:var(--fg-muted);font-size:16.5px;line-height:1.65;max-width:52ch;margin:0 0 22px;}
.use-list{list-style:none;padding:0;margin:0 0 22px;display:flex;flex-direction:column;gap:10px;}
.use-list li{display:flex;align-items:flex-start;gap:12px;font-size:15px;line-height:1.5;color:var(--fg);}
.use-list li::before{content:"";flex-shrink:0;margin-top:7px;width:14px;height:14px;border-radius:50%;background:var(--accent-soft);border:1px solid color-mix(in oklab,var(--accent) 40%,transparent);}

.use-visual--img{position:relative;aspect-ratio:5/4;border-radius:16px;border:1px dashed var(--border);background:var(--bg-elevated);overflow:hidden;
  transition:transform .4s var(--ease),box-shadow .4s var(--ease);}
.use-visual--img:hover{transform:translateY(-4px) scale(1.01);box-shadow:0 24px 60px -20px color-mix(in oklab,var(--accent) 25%,transparent);}
.use-visual--img.has-img{border-style:solid;border-color:var(--border);background:var(--bg);}
.use-visual-img-real{border-radius:14px;}

.img-slot-frame{position:absolute;inset:0;border-radius:16px;overflow:hidden;background:color-mix(in oklab,var(--bg) 60%,transparent);display:flex;align-items:center;justify-content:center;}
.img-slot-ring{position:absolute;inset:0;border:1.5px dashed color-mix(in oklab,var(--fg) 22%,transparent);border-radius:16px;pointer-events:none;}
.img-slot-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px;text-align:center;padding:12px;color:var(--fg-subtle);}
.img-slot-empty svg{opacity:.4;}
.img-slot-cap{font-size:13px;font-weight:500;color:var(--fg-subtle);letter-spacing:.01em;}

/* ══════════════════ STEPS ══════════════════ */

.persona-more{padding:clamp(64px,8vw,112px) 0;border-top:1px solid var(--border);}
.persona-more-h{font-family:var(--font-display);font-size:clamp(26px,3vw,40px);font-weight:600;letter-spacing:-0.025em;margin:0 0 36px;text-wrap:balance;max-width:24ch;}
.legal-steps{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;}
@media(max-width:920px){.legal-steps{grid-template-columns:repeat(2,1fr);}}
@media(max-width:540px){.legal-steps{grid-template-columns:1fr;}}

.legal-step{position:relative;display:flex;flex-direction:column;gap:14px;padding:28px 26px;background:var(--bg-elevated);border:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;min-height:240px;
  transition:border-color .3s var(--ease),transform .3s var(--ease),box-shadow .3s var(--ease);}
.legal-step:hover{border-color:color-mix(in oklab,var(--accent) 50%,transparent);transform:translateY(-3px);box-shadow:0 16px 40px -16px color-mix(in oklab,var(--accent) 20%,transparent);}
.legal-step::before{content:"";position:absolute;right:-40px;top:-40px;width:150px;height:150px;border-radius:50%;background:radial-gradient(closest-side,var(--accent-glow),transparent 70%);opacity:.35;pointer-events:none;transition:opacity .3s;}
.legal-step:hover::before{opacity:.7;}
.legal-step-kicker{font-family:var(--font-label);font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--fg-subtle);position:relative;}
.legal-step-n{position:relative;display:inline-flex;align-items:baseline;gap:8px;font-family:var(--font-display);font-weight:600;font-size:48px;line-height:1;letter-spacing:-0.04em;color:var(--accent);}
.legal-step h3{position:relative;font-family:var(--font-display);font-weight:600;font-size:19px;line-height:1.2;letter-spacing:-0.015em;margin:0;text-wrap:balance;}
.legal-step p{position:relative;color:var(--fg-muted);font-size:14px;line-height:1.6;margin:0;flex:1;}

/* ══════════════════ PROBLEMS & FEATURES ══════════════════ */

.legal-problem-grid{display:grid;grid-template-columns:1fr 1fr;gap:0 40px;}
@media(max-width:760px){.legal-problem-grid{grid-template-columns:1fr;gap:0;}}
.legal-problem{display:flex;gap:16px;align-items:flex-start;padding:22px 0;border-bottom:1px solid var(--border);
  transition:background .2s;}
.legal-problem:hover{background:var(--bg-elevated);padding-left:8px;border-radius:8px;}
.legal-problem-ic{flex-shrink:0;width:38px;height:38px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;background:var(--accent-soft);border:1px solid color-mix(in oklab,var(--accent) 30%,transparent);color:var(--accent);font-size:17px;
  transition:transform .25s var(--ease);}
.legal-problem:hover .legal-problem-ic{transform:scale(1.15) rotate(-5deg);}
.legal-problem h3{font-family:var(--font-display);font-weight:600;font-size:16px;letter-spacing:-0.01em;margin:2px 0 5px;}
.legal-problem p{font-size:13.5px;color:var(--fg-muted);line-height:1.5;margin:0;}

.cs-eyebrow-row{display:flex;align-items:baseline;justify-content:space-between;margin-bottom:28px;gap:16px;flex-wrap:wrap;}
.legal-feat-panel{border-top:1px solid var(--border);border-left:1px solid var(--border);border-radius:var(--radius-lg);overflow:hidden;background:var(--bg-elevated);display:grid;grid-template-columns:1fr 1fr;}
@media(max-width:760px){.legal-feat-panel{grid-template-columns:1fr;}}
.legal-feat{display:flex;gap:16px;align-items:flex-start;padding:24px 26px;border-right:1px solid var(--border);border-bottom:1px solid var(--border);
  transition:background .25s;}
.legal-feat:hover{background:var(--bg-sunken);}
.legal-feat-ic{flex-shrink:0;width:36px;height:36px;border-radius:9px;display:inline-flex;align-items:center;justify-content:center;background:var(--bg-sunken);border:1px solid var(--border);color:var(--accent);font-size:16px;
  transition:transform .25s var(--ease),background .25s;}
.legal-feat:hover .legal-feat-ic{transform:scale(1.12) rotate(-4deg);background:var(--accent-soft);}
.legal-feat h3{font-family:var(--font-display);font-weight:600;font-size:16px;letter-spacing:-0.01em;margin:2px 0 5px;}
.legal-feat p{font-size:13px;color:var(--fg-muted);line-height:1.5;margin:0;}

/* ══════════════════ BENEFITS ══════════════════ */

.legal-benefit-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
@media(max-width:760px){.legal-benefit-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:460px){.legal-benefit-grid{grid-template-columns:1fr;}}
.legal-benefit{display:flex;align-items:center;gap:14px;padding:18px 20px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--bg-elevated);font-family:var(--font-display);font-weight:600;font-size:15px;letter-spacing:-0.01em;
  transition:border-color .25s var(--ease),transform .25s var(--ease),box-shadow .25s var(--ease);}
.legal-benefit:hover{border-color:color-mix(in oklab,var(--accent) 50%,transparent);transform:translateY(-2px);box-shadow:0 8px 24px -8px color-mix(in oklab,var(--accent) 15%,transparent);}
.legal-benefit .chk{flex-shrink:0;width:26px;height:26px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;background:var(--accent-soft);border:1px solid color-mix(in oklab,var(--accent) 30%,transparent);color:var(--accent);
  transition:transform .25s var(--ease);}
.legal-benefit:hover .chk{transform:scale(1.2) rotate(10deg);}

/* ══════════════════ QUOTE ══════════════════ */

.persona-quote{position:relative;padding:clamp(64px,8vw,112px) 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);background:radial-gradient(closest-side at 0% 50%,var(--accent-glow),transparent 70%),var(--bg);}
.persona-quote-inner{display:grid;grid-template-columns:1fr 1.4fr;gap:clamp(28px,5vw,72px);align-items:center;}
@media(max-width:880px){.persona-quote-inner{grid-template-columns:1fr;}}
.persona-quote-card{position:relative;aspect-ratio:1/1;border-radius:var(--radius-lg);background:repeating-linear-gradient(135deg,color-mix(in oklab,var(--accent) 12%,transparent) 0 14px,transparent 14px 30px),var(--bg-elevated);border:1px solid var(--border);overflow:hidden;display:flex;align-items:flex-end;padding:24px;
  transition:transform .4s var(--ease),box-shadow .4s var(--ease);}
.persona-quote-card:hover{transform:scale(1.02);box-shadow:0 32px 80px -24px color-mix(in oklab,var(--accent) 25%,transparent);}
.persona-quote-card::before{content:'"';position:absolute;left:20px;top:-10px;font-family:var(--font-display);font-weight:600;font-size:200px;color:var(--accent);line-height:1;opacity:.2;}
.persona-quote-card .name{font-family:var(--font-display);font-weight:600;font-size:20px;letter-spacing:-0.015em;color:var(--fg);}
.persona-quote-card .role{font-size:13px;color:var(--fg-muted);margin-top:4px;}
.persona-quote-card-inner{z-index:1;}
.persona-quote-text q{display:block;font-family:var(--font-display);font-weight:600;font-size:clamp(22px,2.6vw,36px);line-height:1.25;letter-spacing:-0.025em;color:var(--fg);text-wrap:pretty;quotes:none;margin:0 0 28px;}
.persona-quote-text q::before{content:'"';color:var(--accent);padding-right:4px;}
.persona-quote-text q::after{content:'"';color:var(--accent);padding-left:4px;}
.persona-quote-attr{font-family:var(--font-label);font-size:13px;letter-spacing:.04em;color:var(--fg-muted);text-transform:uppercase;}

/* ══════════════════ STATS — count-up ══════════════════ */

.persona-stats{padding:clamp(56px,7vw,96px) 0;}
.persona-stats-h{font-family:var(--font-display);font-size:clamp(28px,3vw,42px);font-weight:600;letter-spacing:-0.025em;text-align:center;margin:0 auto 48px;max-width:22ch;text-wrap:balance;}
.persona-stat-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0;border:1px solid var(--border);border-radius:var(--radius-lg);background:var(--bg-elevated);overflow:hidden;}
@media(max-width:720px){.persona-stat-grid{grid-template-columns:repeat(2,1fr);}}
.persona-stat-cell{padding:28px;border-right:1px solid var(--border);
  transition:background .25s;}
.persona-stat-cell:hover{background:var(--bg-sunken);}
.persona-stat-cell:last-child{border-right:0;}
@media(max-width:720px){.persona-stat-cell{border-right:1px solid var(--border);}.persona-stat-cell:nth-child(2n){border-right:0;}.persona-stat-cell:nth-child(1),.persona-stat-cell:nth-child(2){border-bottom:1px solid var(--border);}}
.persona-stat-n{font-family:var(--font-display);font-weight:600;font-size:clamp(36px,4.4vw,56px);line-height:1;letter-spacing:-0.03em;color:var(--accent);font-variant-numeric:tabular-nums;}
.persona-stat-l{font-size:13.5px;color:var(--fg-muted);line-height:1.45;margin-top:12px;}
.persona-stat-source{font-family:var(--font-mono);font-size:10.5px;color:var(--fg-subtle);margin-top:8px;}

/* ══════════════════ DISCOVER MORE ══════════════════ */

.persona-more-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;}
@media(max-width:880px){.persona-more-grid{grid-template-columns:repeat(2,1fr);}}
@media(max-width:480px){.persona-more-grid{grid-template-columns:1fr;}}
.persona-more-card{display:flex;flex-direction:column;gap:14px;padding:24px;border:1px solid var(--border);border-radius:var(--radius-md);background:var(--bg-elevated);text-decoration:none;color:inherit;position:relative;overflow:hidden;min-height:220px;
  transition:border-color .3s var(--ease),transform .3s var(--ease),box-shadow .3s var(--ease);}
.persona-more-card::after{content:"";position:absolute;right:-40px;bottom:-40px;width:140px;height:140px;border-radius:50%;background:radial-gradient(closest-side,var(--accent-glow),transparent 70%);opacity:0;transition:opacity .3s var(--ease);}
.persona-more-card:hover{border-color:var(--accent);transform:translateY(-3px);opacity:1;box-shadow:0 16px 40px -16px color-mix(in oklab,var(--accent) 20%,transparent);}
.persona-more-card:hover::after{opacity:.9;}
.persona-more-icon{width:40px;height:40px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;background:var(--accent-soft);border:1px solid color-mix(in oklab,var(--accent) 30%,transparent);color:var(--accent);font-family:var(--font-display);font-weight:600;font-size:17px;
  transition:transform .3s var(--ease);}
.persona-more-card:hover .persona-more-icon{transform:scale(1.12) rotate(-5deg);}
.persona-more-h3{font-family:var(--font-display);font-size:18px;font-weight:600;letter-spacing:-0.015em;margin:0;}
.persona-more-p{font-size:13.5px;color:var(--fg-muted);line-height:1.5;margin:0;flex:1;}
.persona-more-link{font-family:var(--font-label);font-size:12.5px;font-weight:500;color:var(--accent);display:inline-flex;align-items:center;gap:6px;margin-top:auto;
  transition:gap .2s var(--ease);}
.persona-more-card:hover .persona-more-link{gap:10px;}

/* ══════════════════ LOGO MARQUEE ══════════════════ */

.logo-section { overflow:hidden; }
.logo-marquee-track {
  overflow:hidden;
  mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);
  margin-top: 20px;
}
.logo-marquee {
  display:flex; gap:0;
  width:max-content;
  animation: logoMarquee 32s linear infinite;
}
.logo-marquee:hover { animation-play-state:paused; }
.logo-marquee-item {
  padding:28px 40px;
  display:flex; align-items:center; justify-content:center;
  font-family:var(--font-display); font-weight:600;
  font-size:18px; letter-spacing:-0.02em;
  color:var(--fg-muted); white-space:nowrap;
  border-right:1px solid var(--border);
  transition:color .2s, background .2s;
}
.logo-marquee-item:hover{color:var(--fg);background:var(--bg-elevated);}

.cs-section{padding:clamp(48px,6vw,80px) 0;}
`
