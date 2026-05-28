'use client'

import { useState } from 'react'
import { Icons } from '@/components/icons/Icons'
import { PERSONAS } from '@/lib/data'

export default function UseCases() {
  const [active, setActive] = useState(0)
  const p = PERSONAS[active]
  const Icon = Icons[p.icon]

  return (
    <>
      <style>{`
        .usecases-head { margin-bottom: 56px; }
        .usecases-grid { display: grid; grid-template-columns: 360px 1fr; gap: 16px; }
        @media (max-width: 900px) { .usecases-grid { grid-template-columns: 1fr; } }
        .usecases-tabs { display: flex; flex-direction: column; gap: 8px; }
        .uc-tab {
          display: flex; align-items: flex-start; gap: 14px; padding: 18px;
          border-radius: var(--radius-md); background: transparent;
          border: 1px solid var(--border); text-align: left;
          transition: background var(--dur) var(--ease), border-color var(--dur) var(--ease);
        }
        .uc-tab:hover { background: var(--bg-elevated); }
        .uc-tab.is-active { background: var(--bg-elevated); border-color: var(--accent); }
        .uc-tab-icon {
          width: 34px; height: 34px; border-radius: 9px;
          background: var(--bg-sunken); display: inline-flex; align-items: center;
          justify-content: center; color: var(--fg-muted); flex-shrink: 0;
        }
        .uc-tab.is-active .uc-tab-icon { background: var(--accent-soft); color: var(--accent); }
        .uc-tab-meta { display: flex; flex-direction: column; gap: 4px; }
        .uc-tab-role { font-family: var(--font-label); font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: var(--fg-subtle); }
        .uc-tab-title { font-family: var(--font-display); font-size: 15px; font-weight: 600; color: var(--fg); letter-spacing: -0.005em; line-height: 1.3; }
        .uc-panel { padding: 32px; animation: fadeUp .35s var(--ease); }
        .uc-panel-head { display: flex; align-items: center; gap: 14px; margin-bottom: 22px; }
        .uc-icon { width: 42px; height: 42px; border-radius: 10px; background: var(--accent-soft); color: var(--accent); display: inline-flex; align-items: center; justify-content: center; }
        .uc-title { font-family: var(--font-display); font-weight: 600; font-size: 24px; letter-spacing: -0.02em; margin-top: 2px; }
        .uc-asks { display: flex; flex-direction: column; gap: 8px; margin-bottom: 22px; }
        .uc-ask { display: flex; align-items: center; gap: 9px; padding: 12px 14px; border-radius: var(--radius-md); background: var(--bg-sunken); font-size: 14.5px; color: var(--fg); }
        .uc-ask svg { color: var(--accent); flex-shrink: 0; }
        .uc-proof { display: inline-flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 9999px; background: var(--accent-soft); color: var(--accent); font-size: 13px; font-weight: 600; font-family: var(--font-display); }
      `}</style>

      <section id="usecases" className="usecases">
        <div className="container">
          <div className="usecases-head">
            <span className="eyebrow">Use cases</span>
            <h2 className="section-title">
              Built for the teams that <em>need to know</em>.
            </h2>
          </div>

          <div className="usecases-grid">
            <div className="usecases-tabs">
              {PERSONAS.map((p2, i) => {
                const TabIcon = Icons[p2.icon]
                return (
                  <button
                    key={i}
                    className={`uc-tab ${active === i ? 'is-active' : ''}`}
                    onClick={() => setActive(i)}
                  >
                    <span className="uc-tab-icon">
                      {TabIcon && <TabIcon size={18} />}
                    </span>
                    <span className="uc-tab-meta">
                      <span className="uc-tab-role">{p2.role}</span>
                      <span className="uc-tab-title">{p2.title}</span>
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="uc-panel card" key={active}>
              <div className="uc-panel-head">
                <span className="uc-icon">
                  {Icon && <Icon size={20} />}
                </span>
                <div>
                  <div className="muted" style={{ fontSize: 12, letterSpacing: '.06em', textTransform: 'uppercase' }}>
                    {p.role}
                  </div>
                  <h3 className="uc-title">{p.title}</h3>
                </div>
              </div>
              <div className="uc-asks">
                <div className="muted" style={{ fontSize: 12, marginBottom: 8 }}>
                  Real questions {p.role.toLowerCase()} teams ask
                </div>
                {p.asks.map((q, i) => (
                  <div key={i} className="uc-ask">
                    <Icons.spark size={13} /> {q}
                  </div>
                ))}
              </div>
              <div className="uc-proof">
                <Icons.zap size={14} /> {p.proof}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
