'use client'

import { useState } from 'react'
import { Icons } from '@/components/icons/Icons'
import { Marks } from '@/components/connectors/Connectors'
import { SHOWCASE_THREADS, SHOWCASE_SOURCES } from '@/lib/data'

interface TabDef {
  id: string
  label: string
  icon: string
}

const TABS: TabDef[] = [
  { id: 'ask',     label: 'Ask',     icon: 'spark'   },
  { id: 'threads', label: 'Threads', icon: 'message' },
  { id: 'sources', label: 'Sources', icon: 'layers'  },
]

function ShowcaseAsk() {
  return (
    <div className="sc-grid">
      <aside className="sc-side">
        <div className="sc-side-head">Workspaces</div>
        {(['Revenue', 'Customer Success', 'Engineering', 'Marketing'] as const).map((w, i) => (
          <div key={w} className={`sc-side-row ${i === 0 ? 'is-active' : ''}`}>
            <span className="sc-side-bullet" style={{ background: ['#E8A14A', '#5FD3A4', '#A992FF', '#71717A'][i] }} />
            {w}
          </div>
        ))}
        <div className="sc-side-head" style={{ marginTop: 18 }}>Recent threads</div>
        {['Acme renewal — risks', 'Q3 launch decisions', 'Refund policy', 'Globex SOC 2'].map((t) => (
          <div key={t} className="sc-side-row sc-side-row--sub">{t}</div>
        ))}
      </aside>
      <div className="sc-main">
        <div className="sc-q">
          <div className="muted" style={{ fontSize: 12, marginBottom: 6 }}>You asked</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, letterSpacing: '-.015em' }}>
            What&apos;s blocking the Acme renewal?
          </div>
        </div>
        <div className="sc-a">
          <div className="ask-pill" style={{ marginBottom: 12 }}>
            <Icons.spark size={12} /> Answer
          </div>
          <p style={{ fontSize: 15, lineHeight: 1.65, margin: 0 }}>
            Two things. <mark className="cite">SSO must ship before signature<sup>1</sup></mark> — Lena
            (Acme CTO) raised it on the May 5 QBR. And procurement is asking
            for a <mark className="cite">12% volume discount<sup>2</sup></mark>, with Friday as the soft
            deadline. Champion strength is high; the deal is not at risk if SSO
            timeline lands by EOD Wednesday.
          </p>
          <div className="sc-sources">
            <div className="sc-source"><span>1</span> Fathom · Acme QBR · May 5</div>
            <div className="sc-source"><span>2</span> Gmail · Re: discount tiers</div>
            <div className="sc-source"><span>3</span> Salesforce · Opp #44829</div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ShowcaseThreads() {
  return (
    <div className="sc-threads">
      {SHOWCASE_THREADS.map((th, i) => (
        <div key={i} className="sc-thread">
          <div className="sc-thread-head">
            <span className="sc-avatar" />
            <span className="sc-who">{th.who}</span>
            <span className="sc-time muted">{th.t}</span>
          </div>
          <div className="sc-thread-q">{th.q}</div>
          <div className="sc-thread-meta">
            <span className="chip">3 sources</span>
            <span className="chip">Salesforce</span>
            <span className="chip">Fathom</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function ShowcaseSourcesPanel() {
  return (
    <div className="sc-sources-grid">
      {SHOWCASE_SOURCES.map((s) => (
        <div key={s.name} className="sc-src-card">
          <div className="sc-src-mark">{Marks[s.name]}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 15 }}>{s.name}</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 2 }}>
              {s.count.toLocaleString()} items · {s.status}
            </div>
          </div>
          <Icons.check size={14} style={{ color: 'var(--accent)' }} />
        </div>
      ))}
    </div>
  )
}

export default function Showcase() {
  const [tab, setTab] = useState('ask')

  return (
    <>
      <style>{`
        .showcase-head { max-width: 760px; margin-bottom: 48px; }
        .showcase-frame { padding: 0; overflow: hidden; }
        .showcase-tabs {
          display: flex; align-items: center; gap: 4px;
          padding: 12px 14px; border-bottom: 1px solid var(--border);
          background: var(--bg);
        }
        .showcase-tab {
          display: inline-flex; align-items: center; gap: 7px;
          padding: 7px 12px; border-radius: 9999px;
          background: transparent; border: 0;
          font-family: var(--font-display); font-size: 13px; font-weight: 500;
          color: var(--fg-subtle);
          transition: color var(--dur-fast) var(--ease), background var(--dur-fast) var(--ease);
        }
        .showcase-tab:hover { color: var(--fg); }
        .showcase-tab.is-active { background: var(--bg-elevated); color: var(--fg); border: 1px solid var(--border); }
        .showcase-body { min-height: 420px; }

        .sc-grid { display: grid; grid-template-columns: 230px 1fr; min-height: 420px; }
        @media (max-width: 800px) { .sc-grid { grid-template-columns: 1fr; } }
        .sc-side { padding: 18px 12px; border-right: 1px solid var(--border); background: var(--bg); }
        @media (max-width: 800px) { .sc-side { display: none; } }
        .sc-side-head { font-family: var(--font-label); font-size: 11px; letter-spacing: .08em; text-transform: uppercase; color: var(--fg-subtle); padding: 4px 10px; }
        .sc-side-row { display: flex; align-items: center; gap: 9px; padding: 8px 10px; border-radius: 9px; font-size: 13.5px; color: var(--fg-muted); cursor: pointer; }
        .sc-side-row:hover { background: var(--bg-elevated); color: var(--fg); }
        .sc-side-row.is-active { background: var(--bg-elevated); color: var(--fg); }
        .sc-side-row--sub { color: var(--fg-subtle); padding-left: 18px; }
        .sc-side-bullet { width: 8px; height: 8px; border-radius: 2px; }
        .sc-main { padding: 26px 30px; display: flex; flex-direction: column; gap: 22px; background: var(--bg-elevated); }
        .sc-q, .sc-a { padding: 18px 20px; border-radius: var(--radius-md); border: 1px solid var(--border); background: var(--bg); }
        .sc-sources { display: flex; flex-direction: column; gap: 6px; margin-top: 14px; padding-top: 14px; border-top: 1px solid var(--border); }
        .sc-source { display: flex; gap: 10px; font-size: 12.5px; color: var(--fg-muted); }
        .sc-source span { display: inline-flex; width: 18px; height: 18px; align-items: center; justify-content: center; border-radius: 4px; background: var(--accent-soft); color: var(--accent); font-size: 10px; font-weight: 700; }

        .sc-threads { padding: 16px; display: grid; grid-template-columns: 1fr 1fr; gap: 12px; background: var(--bg-elevated); }
        @media (max-width: 800px) { .sc-threads { grid-template-columns: 1fr; } }
        .sc-thread { padding: 14px 16px; border-radius: var(--radius-md); background: var(--bg); border: 1px solid var(--border); }
        .sc-thread-head { display: flex; align-items: center; gap: 9px; }
        .sc-avatar { width: 18px; height: 18px; border-radius: 50%; background: linear-gradient(135deg, var(--accent), color-mix(in oklab, var(--accent) 50%, var(--neutral-400))); }
        .sc-who { font-size: 12.5px; font-weight: 600; color: var(--fg); font-family: var(--font-display); }
        .sc-time { font-size: 11.5px; margin-left: auto; }
        .sc-thread-q { margin: 8px 0 10px; font-size: 14.5px; line-height: 1.45; color: var(--fg); }
        .sc-thread-meta { display: flex; gap: 5px; flex-wrap: wrap; }

        .sc-sources-grid { padding: 16px; display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; background: var(--bg-elevated); }
        @media (max-width: 800px) { .sc-sources-grid { grid-template-columns: 1fr; } }
        .sc-src-card { display: flex; align-items: center; gap: 12px; padding: 14px; border-radius: var(--radius-md); background: var(--bg); border: 1px solid var(--border); }
        .sc-src-mark { width: 34px; height: 34px; border-radius: 8px; background: var(--bg-elevated); border: 1px solid var(--border); display: inline-flex; align-items: center; justify-content: center; color: var(--fg-muted); }
        .sc-src-mark svg { width: 20px; height: 20px; }
        .ask-pill { display: inline-flex; align-items: center; gap: 6px; padding: 4px 9px; border-radius: 9999px; font-size: 11.5px; letter-spacing: .04em; background: var(--accent-soft); color: var(--accent); font-family: var(--font-label); font-weight: 600; }
      `}</style>

      <section className="showcase">
        <div className="container">
          <div className="showcase-head">
            <span className="eyebrow">A closer look</span>
            <h2 className="section-title">
              One workspace.<br />Every system. Every answer.
            </h2>
            <p className="section-lede">
              Genie isn&apos;t a wrapper around a chat model. It&apos;s a retrieval-first
              workspace built so revenue, support and operations teams can answer
              their own questions without pinging anyone.
            </p>
          </div>

          <div className="showcase-frame card">
            <div className="showcase-tabs">
              {TABS.map((t) => {
                const Icon = Icons[t.icon]
                return (
                  <button
                    key={t.id}
                    className={`showcase-tab ${tab === t.id ? 'is-active' : ''}`}
                    onClick={() => setTab(t.id)}
                  >
                    {Icon && <Icon size={14} />} {t.label}
                  </button>
                )
              })}
              <div style={{ flex: 1 }} />
              <span className="chip">⌘ K</span>
            </div>

            <div className="showcase-body">
              {tab === 'ask'     && <ShowcaseAsk />}
              {tab === 'threads' && <ShowcaseThreads />}
              {tab === 'sources' && <ShowcaseSourcesPanel />}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
