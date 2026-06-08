'use client'

import { useState } from 'react'
import { Icons } from '@/components/icons/Icons'
import { TIERS } from '@/lib/data'

export default function Pricing() {
  const [annual, setAnnual] = useState(true)

  return (
    <>
      <style>{`
        .pricing-head { text-align: center; margin-bottom: 56px; display: flex; flex-direction: column; align-items: center; gap: 8px; }
        .pricing-head .section-lede { margin-left: auto; margin-right: auto; }
        .billing-toggle { display: inline-flex; padding: 4px; border-radius: 9999px; border: 1px solid var(--border); background: var(--bg-elevated); margin-top: 24px; }
        .bt { background: transparent; border: 0; padding: 9px 16px; border-radius: 9999px; font-family: var(--font-display); font-weight: 500; font-size: 13px; color: var(--fg-muted); display: inline-flex; align-items: center; gap: 8px; }
        .bt.is-active { background: var(--fg); color: var(--bg); }
        .bt-save { font-size: 10.5px; padding: 2px 6px; border-radius: 4px; background: var(--accent-soft); color: var(--accent); font-weight: 600; }
        .bt.is-active .bt-save { background: var(--accent); color: var(--accent-fg); }
        .tiers { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; align-items: stretch; }
        @media (max-width: 1000px) { .tiers { grid-template-columns: 1fr; } }
        .tier { padding: 32px 28px; display: flex; flex-direction: column; gap: 6px; position: relative; }
        @media (max-width: 640px) {
          .pricing-head { margin-bottom: 32px; }
          .tier { padding: 24px 18px; }
          .tier-price-num { font-size: 40px; }
          .pricing-foot { flex-direction: column; text-align: center; font-size: 12px; }
        }
        .tier--featured { border-color: var(--accent); box-shadow: 0 30px 60px -30px var(--accent-glow); }
        .tier-badge {
          position: absolute; top: -12px; left: 28px;
          padding: 5px 10px; border-radius: 9999px;
          background: var(--accent); color: var(--accent-fg);
          font-family: var(--font-display); font-weight: 600; font-size: 11.5px; letter-spacing: .03em;
        }
        .tier-name { font-family: var(--font-display); font-weight: 600; font-size: 22px; letter-spacing: -0.02em; transition: color .2s; }
        .tier:hover .tier-name { color: var(--accent); }
        .tier-tag { color: var(--fg-muted); font-size: 13.5px; }
        .tier-price { display: flex; align-items: baseline; gap: 4px; margin-top: 18px; }
        @keyframes priceHop { 0%,100%{transform:translateY(0)} 40%{transform:translateY(-4px)} }
        .tier-price-num {
          font-family: var(--font-display); font-weight: 600; font-size: 48px; letter-spacing: -0.03em;
          color: var(--accent); display: inline-block;
        }
        .tier:hover .tier-price-num { animation: priceHop .45s var(--ease); }
        .tier-price-suffix { color: var(--fg-muted); font-size: 14px; }
        .tier-billing { font-size: 12.5px; }
        .tier-cta { margin-top: 18px; justify-content: center; }
        .tier-features { list-style: none; padding: 0; margin: 22px 0 0; display: flex; flex-direction: column; gap: 10px; border-top: 1px solid var(--border); padding-top: 22px; }
        .tier-features li { display: flex; align-items: center; gap: 10px; font-size: 13.5px; color: var(--fg-muted); }
        .tier-features svg { color: var(--accent); flex-shrink: 0; }
        .pricing-foot { display: flex; align-items: center; justify-content: center; gap: 8px; margin-top: 36px; color: var(--fg-subtle); font-size: 13px; }
      `}</style>

      <section id="pricing" className="pricing">
        <div className="container">
          <div className="pricing-head" data-reveal="fade-up">
            <span className="eyebrow">Pricing</span>
            <h2 className="section-title">Simple, per-seat. <em>Honest</em>.</h2>
            <p className="section-lede">No usage limits to learn. No surprise overages. Cancel anytime.</p>

            <div className="billing-toggle" role="tablist">
              <button
                className={`bt ${!annual ? 'is-active' : ''}`}
                onClick={() => setAnnual(false)}
                role="tab" aria-selected={!annual}
              >
                Monthly
              </button>
              <button
                className={`bt ${annual ? 'is-active' : ''}`}
                onClick={() => setAnnual(true)}
                role="tab" aria-selected={annual}
              >
                Annual <span className="bt-save">Save 20%</span>
              </button>
            </div>
          </div>

          <div className="tiers">
            {TIERS.map((t, i) => (
              <div key={t.name} className={`tier card ${t.featured ? 'tier--featured' : ''}`} data-reveal="pop" style={{'--reveal-delay':`${i*80}ms`} as any}>
                {t.featured && <div className="tier-badge">{t.tag}</div>}
                <div className="tier-name">{t.name}</div>
                <div className="tier-tag">{t.featured ? 'Built for fast-growing teams' : t.tag}</div>

                <div className="tier-price">
                  {t.priceM == null ? (
                    <span className="tier-price-num">Custom</span>
                  ) : (
                    <>
                      <span className="tier-price-num">${annual ? t.priceA : t.priceM}</span>
                      <span className="tier-price-suffix">/seat /mo</span>
                    </>
                  )}
                </div>
                <div className="tier-billing muted">
                  {t.priceM == null
                    ? 'Annual contract'
                    : annual ? 'Billed annually' : 'Billed monthly'}
                </div>

                <a
                  href="#cta"
                  className={`btn ${t.ctaStyle === 'accent' ? 'btn-accent' : 'btn-ghost'} tier-cta`}
                >
                  {t.cta} <Icons.arrowRight size={14} />
                </a>

                <ul className="tier-features">
                  {t.features.map((f) => (
                    <li key={f}><Icons.check size={14} /> {f}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="pricing-foot">
            <Icons.shield size={14} /> SOC 2 Type II · HIPAA available · Data residency in US, EU, AU
          </div>
        </div>
      </section>
    </>
  )
}
