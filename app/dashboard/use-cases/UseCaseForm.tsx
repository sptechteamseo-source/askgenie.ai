'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

/* ─── Types matching the use-case page sections ─── */
interface HeroCard { pvh: string; pvt: string; pvCite: string; hasPvBar: boolean }
interface ExplainedRow { kicker: string; n: string; heading: string; body: string; bullets: string[]; placeholder: string; img: string; imgAlt: string }
interface Step { kicker: string; n: string; title: string; body: string }
interface IconItem { icon: string; title: string; body: string }
interface Stat { n: string; label: string; source: string }
interface Quote { name: string; role: string; quote: string; attr: string }
interface MoreLink { icon: string; title: string; desc: string; link: string; href: string }

export interface PageData {
  hero: { eyebrow: string; h1: string; lede: string; cards: HeroCard[] }
  explained: ExplainedRow[]
  steps: Step[]
  problems: IconItem[]
  features: IconItem[]
  benefits: string[]
  stats: Stat[]
  quote: Quote
  logos: string[]
  more: MoreLink[]
}

const makeCard = (): HeroCard => ({ pvh: '', pvt: '', pvCite: '', hasPvBar: false })
const makeExplained = (kicker: string, n: string): ExplainedRow => ({ kicker, n, heading: '', body: '', bullets: ['', '', '', '', ''], placeholder: '', img: '', imgAlt: '' })
const makeStep = (n: string): Step => ({ kicker: `Step ${n}`, n, title: '', body: '' })
const makeIcon = (): IconItem => ({ icon: '', title: '', body: '' })
const makeStat = (): Stat => ({ n: '', label: '', source: '' })
const makeMore = (): MoreLink => ({ icon: '', title: '', desc: '', link: '', href: '' })

const DEFAULT_PAGEDATA: PageData = {
  hero: {
    eyebrow: '',
    h1: '',
    lede: '',
    cards: [makeCard(), makeCard(), makeCard()],
  },
  explained: [
    makeExplained('How it works', '01'),
    makeExplained('Why teams use it', '02'),
    makeExplained('What you get', '03'),
  ],
  steps: [makeStep('01'), makeStep('02'), makeStep('03'), makeStep('04')],
  problems: Array.from({ length: 6 }, makeIcon),
  features: Array.from({ length: 6 }, makeIcon),
  benefits: Array(6).fill(''),
  stats: Array.from({ length: 4 }, makeStat),
  quote: { name: '', role: '', quote: '', attr: '' },
  logos: Array(12).fill(''),
  more: Array.from({ length: 4 }, makeMore),
}

const TABS = [
  { key: 'basics',   label: 'Basics' },
  { key: 'hero',     label: 'Hero' },
  { key: 'explained',label: 'How It Works' },
  { key: 'steps',    label: 'Steps' },
  { key: 'problems', label: 'Problems' },
  { key: 'features', label: 'Features' },
  { key: 'stats',    label: 'Stats & Quote' },
  { key: 'logos',    label: 'Logos & More' },
]

const PERSONAS   = ['Revenue', 'Customer Success', 'Operations', 'Legal', 'Finance', 'Engineering', 'Marketing', 'Healthcare', 'Research']
const INDUSTRIES = ['Fintech', 'SaaS', 'Healthcare', 'Logistics', 'Legal', 'Media', 'Manufacturing']
const TEAMS      = ['RevOps', 'Support', 'Operations', 'Legal', 'Finance', 'Engineering', 'Marketing', 'Research']

interface Props {
  initialData?: {
    id: string
    title: string
    slug: string
    persona: string
    excerpt: string | null
    content: string
    pagedata: any
    metric: string | null
    industry: string | null
    teamtype: string | null
    status: string
  }
}

export default function UseCaseForm({ initialData }: Props) {
  const router  = useRouter()
  const isEditing = !!initialData

  const [tab,      setTab]      = useState('basics')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState('')
  const [pagedata, setPagedata] = useState<PageData>(() => {
    if (initialData?.pagedata && typeof initialData.pagedata === 'object') {
      return { ...DEFAULT_PAGEDATA, ...(initialData.pagedata as PageData) }
    }
    return DEFAULT_PAGEDATA
  })

  /* ── helpers ── */
  function slug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  function setPd<K extends keyof PageData>(key: K, val: PageData[K]) {
    setPagedata(p => ({ ...p, [key]: val }))
  }

  function setHero(k: keyof PageData['hero'], v: string) {
    setPagedata(p => ({ ...p, hero: { ...p.hero, [k]: v } }))
  }

  function setCard(i: number, k: keyof HeroCard, v: string | boolean) {
    setPagedata(p => {
      const cards = [...p.hero.cards]
      cards[i] = { ...cards[i], [k]: v }
      return { ...p, hero: { ...p.hero, cards } }
    })
  }

  function setExplained(i: number, k: keyof ExplainedRow, v: string | string[]) {
    setPagedata(p => {
      const rows = [...p.explained]
      rows[i] = { ...rows[i], [k]: v }
      return { ...p, explained: rows }
    })
  }

  function setBullet(rowIdx: number, bIdx: number, v: string) {
    setPagedata(p => {
      const rows = [...p.explained]
      const bullets = [...rows[rowIdx].bullets]
      bullets[bIdx] = v
      rows[rowIdx] = { ...rows[rowIdx], bullets }
      return { ...p, explained: rows }
    })
  }

  function setStep(i: number, k: keyof Step, v: string) {
    setPagedata(p => {
      const steps = [...p.steps]
      steps[i] = { ...steps[i], [k]: v }
      return { ...p, steps }
    })
  }

  function setArrayItem(key: 'problems' | 'features', i: number, k: keyof IconItem, v: string) {
    setPagedata(p => {
      const arr = [...(p[key] as IconItem[])]
      arr[i] = { ...arr[i], [k]: v }
      return { ...p, [key]: arr }
    })
  }

  function setStat(i: number, k: keyof Stat, v: string) {
    setPagedata(p => {
      const stats = [...p.stats]
      stats[i] = { ...stats[i], [k]: v }
      return { ...p, stats }
    })
  }

  function setQuote(k: keyof Quote, v: string) {
    setPagedata(p => ({ ...p, quote: { ...p.quote, [k]: v } }))
  }

  function setLogo(i: number, v: string) {
    setPagedata(p => {
      const logos = [...p.logos]
      logos[i] = v
      return { ...p, logos }
    })
  }

  function setMore(i: number, k: keyof MoreLink, v: string) {
    setPagedata(p => {
      const more = [...p.more]
      more[i] = { ...more[i], [k]: v }
      return { ...p, more }
    })
  }

  /* ── submit ── */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const body = {
      title:    fd.get('title') as string,
      slug:     fd.get('slug') as string,
      persona:  fd.get('persona') as string,
      excerpt:  fd.get('excerpt') as string,
      content:  fd.get('content') as string,
      metric:   fd.get('metric') as string,
      industry: fd.get('industry') as string,
      teamtype: fd.get('teamtype') as string,
      status:   fd.get('status') as string,
      pagedata,
    }
    const url    = isEditing ? `/api/use-cases/${initialData.id}` : '/api/use-cases'
    const method = isEditing ? 'PUT' : 'POST'
    try {
      const res  = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      const data = await res.json()
      if (!data.success) { setError(data.error || 'Something went wrong'); setLoading(false); return }
      router.push('/dashboard/use-cases')
      router.refresh()
    } catch {
      setError('Network error — please try again')
      setLoading(false)
    }
  }

  /* ── Reusable field components (inline so they share setters) ── */
  const F = ({ label, id, name, value, onChange, placeholder, type = 'text', required = false }: any) => (
    <div className="ff">
      <label htmlFor={id}>{label}{required && ' *'}</label>
      <input id={id} name={name} type={type} value={value} onChange={onChange} placeholder={placeholder} required={required} />
    </div>
  )

  const TA = ({ label, id, name, value, onChange, rows = 3, placeholder, mono = false }: any) => (
    <div className="ff">
      {label && <label htmlFor={id}>{label}</label>}
      <textarea id={id} name={name} rows={rows} value={value} onChange={onChange} placeholder={placeholder} className={mono ? 'mono-ta' : ''} />
    </div>
  )

  /* ── Tab content ── */
  const renderTab = () => {
    if (tab === 'basics') return (
      <div className="tab-body">
        <div className="two-col">
          <F label="Title" id="title" name="title" defaultValue={initialData?.title} required
            onChange={(e: any) => {
              if (!isEditing) {
                const s = document.getElementById('slug') as HTMLInputElement
                if (s && !s.dataset.edited) s.value = slug(e.target.value)
              }
            }}
          />
          <div className="ff">
            <label htmlFor="slug">Slug *</label>
            <input id="slug" name="slug" type="text" defaultValue={initialData?.slug} required
              onInput={(e: any) => { e.target.dataset.edited = '1' }} />
          </div>
        </div>

        <div className="ff">
          <label htmlFor="excerpt">Excerpt</label>
          <textarea id="excerpt" name="excerpt" rows={2} defaultValue={initialData?.excerpt || ''} placeholder="One-line summary shown in listings and SEO description" />
        </div>

        <div className="three-col">
          <div className="ff">
            <label htmlFor="persona">Persona *</label>
            <select id="persona" name="persona" defaultValue={initialData?.persona ?? ''} required>
              <option value="">Select persona</option>
              {PERSONAS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="ff">
            <label htmlFor="industry">Industry</label>
            <select id="industry" name="industry" defaultValue={initialData?.industry ?? ''}>
              <option value="">Select industry</option>
              {INDUSTRIES.map(i => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div className="ff">
            <label htmlFor="teamtype">Team</label>
            <select id="teamtype" name="teamtype" defaultValue={initialData?.teamtype ?? ''}>
              <option value="">Select team</option>
              {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div className="two-col">
          <div className="ff">
            <label htmlFor="metric">Headline metric</label>
            <input id="metric" name="metric" type="text" defaultValue={initialData?.metric || ''} placeholder="e.g. 88% faster policy lookup" />
          </div>
          <div className="ff">
            <label htmlFor="status">Status</label>
            <select id="status" name="status" defaultValue={initialData?.status ?? 'draft'}>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div className="ff">
          <label htmlFor="content">Internal notes</label>
          <textarea id="content" name="content" rows={3} defaultValue={initialData?.content || ''} placeholder="Any notes visible only inside the dashboard" />
        </div>
      </div>
    )

    if (tab === 'hero') return (
      <div className="tab-body">
        <div className="section-label">Page header copy</div>
        <div className="ff">
          <label>Eyebrow label</label>
          <input value={pagedata.hero.eyebrow} onChange={e => setHero('eyebrow', e.target.value)} placeholder="For sales reps, RevOps & revenue leaders" />
        </div>
        <div className="ff">
          <label>H1 headline</label>
          <input value={pagedata.hero.h1} onChange={e => setHero('h1', e.target.value)} placeholder="AI for Sales that knows every deal as well as you do." />
        </div>
        <div className="ff">
          <label>Lede paragraph</label>
          <textarea rows={3} value={pagedata.hero.lede} onChange={e => setHero('lede', e.target.value)} placeholder="Intro paragraph shown below the headline…" />
        </div>

        <div className="section-label" style={{ marginTop: 28 }}>Hero visual — 3 floating cards</div>
        <div className="cards-grid">
          {pagedata.hero.cards.map((card, i) => (
            <div key={i} className="inner-card">
              <div className="inner-card-title">Card {i + 1}{i === 0 ? ' · Question' : i === 1 ? ' · Answer' : ' · Source'}</div>
              <div className="ff">
                <label>Header label</label>
                <input value={card.pvh} onChange={e => setCard(i, 'pvh', e.target.value)} placeholder={i === 0 ? 'Question' : i === 1 ? 'Answer · 5s' : 'Source · Gong call · Mar 14'} />
              </div>
              <div className="ff">
                <label>Body text</label>
                <textarea rows={2} value={card.pvt} onChange={e => setCard(i, 'pvt', e.target.value)} />
              </div>
              <div className="ff">
                <label>Citation tag</label>
                <input value={card.pvCite} onChange={e => setCard(i, 'pvCite', e.target.value)} placeholder={i === 1 ? '4 sources cited' : i === 0 ? '● CRM · Calls · Email' : 'Verified'} />
              </div>
              {i === 1 && (
                <label className="checkbox-label">
                  <input type="checkbox" checked={card.hasPvBar} onChange={e => setCard(i, 'hasPvBar', e.target.checked)} />
                  Show progress bar
                </label>
              )}
            </div>
          ))}
        </div>
      </div>
    )

    if (tab === 'explained') return (
      <div className="tab-body">
        <p className="tab-hint">Three alternating rows — How it works (01) · Why teams use it (02) · What you get (03). Each row has content on the left and an image on the right.</p>
        {pagedata.explained.map((row, i) => (
          <details key={i} className="accordion" open={i === 0}>
            <summary className="accordion-summary">
              <span className="acc-badge">{row.n}</span>
              {row.kicker || `Row ${i + 1}`}
            </summary>
            <div className="accordion-body">
              <div className="two-col">
                <div className="ff">
                  <label>Kicker label</label>
                  <input value={row.kicker} onChange={e => setExplained(i, 'kicker', e.target.value)} placeholder="How it works" />
                </div>
                <div className="ff">
                  <label>Number badge</label>
                  <input value={row.n} onChange={e => setExplained(i, 'n', e.target.value)} placeholder="01" />
                </div>
              </div>
              <div className="ff">
                <label>Heading</label>
                <input value={row.heading} onChange={e => setExplained(i, 'heading', e.target.value)} placeholder="From scattered data to a cited answer, instantly." />
              </div>
              <div className="ff">
                <label>Body paragraph</label>
                <textarea rows={4} value={row.body} onChange={e => setExplained(i, 'body', e.target.value)} />
              </div>

              <div className="section-label">Bullet points</div>
              {row.bullets.map((b, bi) => (
                <div key={bi} className="ff bullet-row">
                  <label>Bullet {bi + 1}</label>
                  <input value={b} onChange={e => setBullet(i, bi, e.target.value)} placeholder="Connect your sources…" />
                </div>
              ))}

              <div className="section-label" style={{ marginTop: 16 }}>Image beside content</div>
              <div className="two-col">
                <div className="ff">
                  <label>Image path <span className="hint">(relative to /public)</span></label>
                  <input value={row.img} onChange={e => setExplained(i, 'img', e.target.value)} placeholder="/images/marketing-how-it-works.png" />
                </div>
                <div className="ff">
                  <label>Image alt text</label>
                  <input value={row.imgAlt} onChange={e => setExplained(i, 'imgAlt', e.target.value)} placeholder="Descriptive alt text for accessibility" />
                </div>
              </div>
              {row.img && (
                <div className="img-preview">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={row.img} alt={row.imgAlt || ''} style={{ maxHeight: 180, maxWidth: '100%', borderRadius: 8, objectFit: 'contain', background: 'var(--bg-sunken)', padding: 8 }} />
                </div>
              )}
            </div>
          </details>
        ))}
      </div>
    )

    if (tab === 'steps') return (
      <div className="tab-body">
        <p className="tab-hint">Four step cards shown in a horizontal grid below the Explained section.</p>
        <div className="four-col">
          {pagedata.steps.map((step, i) => (
            <div key={i} className="inner-card">
              <div className="inner-card-title">Step {step.n}</div>
              <div className="ff">
                <label>Kicker</label>
                <input value={step.kicker} onChange={e => setStep(i, 'kicker', e.target.value)} placeholder={`Step ${i + 1}`} />
              </div>
              <div className="ff">
                <label>Title</label>
                <input value={step.title} onChange={e => setStep(i, 'title', e.target.value)} placeholder="Connect your sources" />
              </div>
              <div className="ff">
                <label>Body</label>
                <textarea rows={4} value={step.body} onChange={e => setStep(i, 'body', e.target.value)} />
              </div>
            </div>
          ))}
        </div>
      </div>
    )

    if (tab === 'problems') return (
      <div className="tab-body">
        <p className="tab-hint">Six problem/solution pairs shown in a two-column list. Each has an icon, title and one-line description.</p>
        <div className="section-label">Problems we solve (6 items)</div>
        <div className="two-col">
          {pagedata.problems.map((p, i) => (
            <div key={i} className="inner-card">
              <div className="inner-card-title">Problem {i + 1}</div>
              <div className="icon-title-row">
                <div className="ff" style={{ width: 72 }}>
                  <label>Icon</label>
                  <input value={p.icon} onChange={e => setArrayItem('problems', i, 'icon', e.target.value)} placeholder="⚠" style={{ textAlign: 'center', fontSize: 18 }} />
                </div>
                <div className="ff" style={{ flex: 1 }}>
                  <label>Title</label>
                  <input value={p.title} onChange={e => setArrayItem('problems', i, 'title', e.target.value)} placeholder="Slow policy lookup" />
                </div>
              </div>
              <div className="ff">
                <label>Description</label>
                <textarea rows={2} value={p.body} onChange={e => setArrayItem('problems', i, 'body', e.target.value)} placeholder="Find the current protocol in seconds — no binders or stale portals." />
              </div>
            </div>
          ))}
        </div>

        <div className="section-label" style={{ marginTop: 32 }}>Features — key capabilities (6 items)</div>
        <div className="two-col">
          {pagedata.features.map((f, i) => (
            <div key={i} className="inner-card">
              <div className="inner-card-title">Feature {i + 1}</div>
              <div className="icon-title-row">
                <div className="ff" style={{ width: 72 }}>
                  <label>Icon</label>
                  <input value={f.icon} onChange={e => setArrayItem('features', i, 'icon', e.target.value)} placeholder="✚" style={{ textAlign: 'center', fontSize: 18 }} />
                </div>
                <div className="ff" style={{ flex: 1 }}>
                  <label>Title</label>
                  <input value={f.title} onChange={e => setArrayItem('features', i, 'title', e.target.value)} placeholder="Protocol lookup" />
                </div>
              </div>
              <div className="ff">
                <label>Description</label>
                <textarea rows={2} value={f.body} onChange={e => setArrayItem('features', i, 'body', e.target.value)} placeholder="Instant, cited answers from your current clinical protocols." />
              </div>
            </div>
          ))}
        </div>

        <div className="section-label" style={{ marginTop: 32 }}>Benefits — checkmark chips (6 items)</div>
        <div className="three-col">
          {pagedata.benefits.map((b, i) => (
            <div key={i} className="ff">
              <label>Benefit {i + 1}</label>
              <input value={b} onChange={e => { const arr = [...pagedata.benefits]; arr[i] = e.target.value; setPd('benefits', arr) }} placeholder="Faster policy lookup" />
            </div>
          ))}
        </div>
      </div>
    )

    if (tab === 'features') return (
      <div className="tab-body">
        <p className="tab-hint">This section is managed inside the Problems tab above (Features & Benefits are grouped together).</p>
        <div className="empty-hint">← Use the <strong>Problems</strong> tab to edit Features and Benefits.</div>
      </div>
    )

    if (tab === 'stats') return (
      <div className="tab-body">
        <div className="section-label">Stats band — 4 big numbers</div>
        <div className="four-col">
          {pagedata.stats.map((st, i) => (
            <div key={i} className="inner-card">
              <div className="inner-card-title">Stat {i + 1}</div>
              <div className="ff">
                <label>Number / value</label>
                <input value={st.n} onChange={e => setStat(i, 'n', e.target.value)} placeholder="88%" style={{ fontWeight: 700, fontSize: 18 }} />
              </div>
              <div className="ff">
                <label>Label</label>
                <textarea rows={2} value={st.label} onChange={e => setStat(i, 'label', e.target.value)} placeholder="Faster policy & protocol lookup across clinics" />
              </div>
              <div className="ff">
                <label>Source</label>
                <input value={st.source} onChange={e => setStat(i, 'source', e.target.value)} placeholder="source: Helio Health deployment · 2026" />
              </div>
            </div>
          ))}
        </div>

        <div className="section-label" style={{ marginTop: 32 }}>Big testimonial quote</div>
        <div className="inner-card">
          <div className="two-col">
            <div className="ff">
              <label>Speaker name</label>
              <input value={pagedata.quote.name} onChange={e => setQuote('name', e.target.value)} placeholder="Dr. Riya Kapoor" />
            </div>
            <div className="ff">
              <label>Role & company</label>
              <input value={pagedata.quote.role} onChange={e => setQuote('role', e.target.value)} placeholder="Chief Medical Officer · Helio Health" />
            </div>
          </div>
          <div className="ff">
            <label>Quote text</label>
            <textarea rows={4} value={pagedata.quote.quote} onChange={e => setQuote('quote', e.target.value)} placeholder="Our clinicians used to dig through binders and outdated portals…" />
          </div>
          <div className="ff">
            <label>Attribution line</label>
            <input value={pagedata.quote.attr} onChange={e => setQuote('attr', e.target.value)} placeholder="— Helio Health · 1,100 clinicians · 14 clinics" />
          </div>
        </div>
      </div>
    )

    if (tab === 'logos') return (
      <div className="tab-body">
        <div className="section-label">Logo wall — 12 company names</div>
        <div className="three-col">
          {pagedata.logos.map((l, i) => (
            <div key={i} className="ff">
              <label>Logo {i + 1}</label>
              <input value={l} onChange={e => setLogo(i, e.target.value)} placeholder="Helio Health" />
            </div>
          ))}
        </div>

        <div className="section-label" style={{ marginTop: 32 }}>Discover more — 4 cross-links to other use cases</div>
        <div className="two-col">
          {pagedata.more.map((m, i) => (
            <div key={i} className="inner-card">
              <div className="inner-card-title">Card {i + 1}</div>
              <div className="icon-title-row">
                <div className="ff" style={{ width: 72 }}>
                  <label>Icon</label>
                  <input value={m.icon} onChange={e => setMore(i, 'icon', e.target.value)} placeholder="⚖" style={{ textAlign: 'center', fontSize: 18 }} />
                </div>
                <div className="ff" style={{ flex: 1 }}>
                  <label>Title</label>
                  <input value={m.title} onChange={e => setMore(i, 'title', e.target.value)} placeholder="AI for Legal Documents" />
                </div>
              </div>
              <div className="ff">
                <label>Description</label>
                <textarea rows={2} value={m.desc} onChange={e => setMore(i, 'desc', e.target.value)} />
              </div>
              <div className="two-col">
                <div className="ff">
                  <label>Link label</label>
                  <input value={m.link} onChange={e => setMore(i, 'link', e.target.value)} placeholder="Explore legal use case" />
                </div>
                <div className="ff">
                  <label>href</label>
                  <input value={m.href} onChange={e => setMore(i, 'href', e.target.value)} placeholder="/use-cases/ai-for-legal-documents" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )

    return null
  }

  return (
    <form onSubmit={handleSubmit} className="uc-form">
      {error && <div className="cms-error">{error}</div>}

      {/* ── Tab bar ── */}
      <div className="tab-bar">
        {TABS.map(t => (
          <button
            key={t.key}
            type="button"
            className={`tab-btn${tab === t.key ? ' is-active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Tab content ── */}
      <div className="tab-panel">
        {renderTab()}
      </div>

      {/* ── Sticky save bar ── */}
      <div className="save-bar">
        <button type="button" className="btn btn-ghost" onClick={() => router.back()}>Cancel</button>
        <button type="submit" className="btn btn-accent" disabled={loading}>
          {loading ? 'Saving…' : isEditing ? 'Update use case' : 'Create use case'}
        </button>
      </div>

      <style>{`
        .uc-form { display: flex; flex-direction: column; gap: 0; }

        /* ── Tabs ── */
        .tab-bar {
          display: flex; flex-wrap: wrap; gap: 4px;
          padding: 16px 28px 0;
          border-bottom: 1px solid var(--border);
          background: var(--bg-elevated);
          position: sticky; top: 64px; z-index: 20;
        }
        .tab-btn {
          padding: 9px 16px;
          font-family: var(--font-display); font-size: 13px; font-weight: 500;
          color: var(--fg-muted); background: transparent; border: none;
          border-bottom: 2px solid transparent; margin-bottom: -1px;
          cursor: pointer; border-radius: 6px 6px 0 0;
          transition: color .15s, border-color .15s;
          white-space: nowrap;
        }
        .tab-btn:hover { color: var(--fg); }
        .tab-btn.is-active { color: var(--accent); border-bottom-color: var(--accent); font-weight: 600; }

        /* ── Panel ── */
        .tab-panel { padding: 28px 28px 120px; }
        .tab-body { display: flex; flex-direction: column; gap: 18px; max-width: 1000px; }
        .tab-hint { font-size: 13px; color: var(--fg-muted); margin: 0 0 4px; line-height: 1.55; }
        .empty-hint { padding: 40px; text-align: center; color: var(--fg-muted); border: 1px dashed var(--border); border-radius: var(--radius-md); font-size: 14px; }

        /* ── Grid layouts ── */
        .two-col   { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .three-col { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 14px; }
        .four-col  { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .cards-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        @media (max-width: 900px) { .four-col, .cards-grid { grid-template-columns: 1fr 1fr; } }
        @media (max-width: 640px) { .two-col, .three-col, .four-col, .cards-grid { grid-template-columns: 1fr; } }

        /* ── Form elements ── */
        .ff { display: flex; flex-direction: column; gap: 5px; }
        .ff label { font-size: 12px; font-weight: 500; color: var(--fg-muted); }
        .ff input, .ff textarea, .ff select {
          padding: 8px 11px;
          border: 1px solid var(--border); border-radius: var(--radius-sm);
          background: var(--bg); color: var(--fg);
          font-size: 13.5px; font-family: inherit;
          outline: none; resize: vertical;
          transition: border-color .15s;
        }
        .ff input:focus, .ff textarea:focus, .ff select:focus { border-color: var(--accent); }
        .mono-ta { font-family: var(--font-mono); font-size: 12px; }
        .hint { font-weight: 400; color: var(--fg-subtle); font-size: 11px; }

        /* ── Cards ── */
        .inner-card {
          background: var(--bg-elevated); border: 1px solid var(--border);
          border-radius: var(--radius-md); padding: 16px;
          display: flex; flex-direction: column; gap: 12px;
        }
        .inner-card-title {
          font-size: 11px; font-weight: 600; text-transform: uppercase;
          letter-spacing: .08em; color: var(--accent);
        }
        .icon-title-row { display: flex; gap: 10px; align-items: flex-start; }
        .bullet-row { }

        /* ── Section label ── */
        .section-label {
          font-size: 11px; font-weight: 600; text-transform: uppercase;
          letter-spacing: .1em; color: var(--fg-subtle);
          padding-bottom: 8px; border-bottom: 1px solid var(--border);
        }

        /* ── Accordion ── */
        .accordion {
          border: 1px solid var(--border); border-radius: var(--radius-md);
          overflow: hidden; background: var(--bg-elevated);
        }
        .accordion-summary {
          display: flex; align-items: center; gap: 12px;
          padding: 14px 18px; cursor: pointer;
          font-family: var(--font-display); font-size: 14px; font-weight: 600;
          color: var(--fg); list-style: none; user-select: none;
          background: var(--bg-elevated);
          transition: background .15s;
        }
        .accordion-summary:hover { background: var(--bg-sunken); }
        .accordion[open] .accordion-summary { border-bottom: 1px solid var(--border); }
        .acc-badge {
          display: inline-flex; align-items: center; justify-content: center;
          width: 28px; height: 28px; border-radius: 50%;
          background: var(--accent-soft); border: 1px solid color-mix(in oklab, var(--accent) 30%, transparent);
          color: var(--accent); font-size: 12px; flex-shrink: 0;
        }
        .accordion-body { padding: 20px 18px; display: flex; flex-direction: column; gap: 14px; }

        /* ── Checkbox ── */
        .checkbox-label {
          display: flex; align-items: center; gap: 8px;
          font-size: 13px; color: var(--fg-muted); cursor: pointer;
        }
        .checkbox-label input { width: auto; }

        /* ── Image preview ── */
        .img-preview { padding: 8px 0; }

        /* ── Error ── */
        .cms-error {
          margin: 16px 28px 0;
          padding: 10px 14px; background: #fef2f2; color: #dc2626;
          border: 1px solid #fecaca; border-radius: var(--radius-sm);
          font-size: 13px;
        }

        /* ── Save bar ── */
        .save-bar {
          position: fixed; bottom: 0; left: 220px; right: 0;
          display: flex; justify-content: flex-end; gap: 10px;
          padding: 14px 28px;
          background: color-mix(in oklab, var(--bg) 90%, transparent);
          backdrop-filter: blur(12px);
          border-top: 1px solid var(--border);
          z-index: 30;
        }
        @media (max-width: 768px) { .save-bar { left: 0; } }

        /* ── Responsive ── */
        @media (max-width: 640px) {
          .tab-panel { padding: 16px 12px 120px; }
        }
      `}</style>
    </form>
  )
}
