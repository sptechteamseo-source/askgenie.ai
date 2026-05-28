'use client'

import { useState } from 'react'
import { Icons } from '@/components/icons/Icons'

export default function CTA() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  return (
    <>
      <style>{`
        .cta { padding: 0 0 var(--section-pad-y); }
        .cta-card {
          position: relative; border-radius: var(--radius-lg); border: 1px solid var(--border);
          background: var(--bg-elevated); overflow: hidden;
          padding: clamp(48px, 8vw, 96px) clamp(24px, 6vw, 80px);
        }
        .cta-bg { position: absolute; inset: 0; opacity: .35; mask-image: radial-gradient(ellipse 90% 70% at 80% 50%, black 0%, transparent 65%); }
        .cta-card::after {
          content: ""; position: absolute; right: -10%; top: -30%; width: 600px; height: 600px;
          background: radial-gradient(closest-side, var(--accent-glow), transparent 70%);
          filter: blur(20px); pointer-events: none;
        }
        .cta-inner { position: relative; max-width: 720px; }
        .cta-title { font-family: var(--font-display); font-weight: 600; font-size: clamp(36px, 5vw, 64px); line-height: 1; letter-spacing: -0.03em; }
        .cta-lede { color: var(--fg-muted); font-size: clamp(16px, 1.3vw, 18px); margin-top: 16px; max-width: 540px; line-height: 1.55; }
        .cta-form { display: flex; gap: 8px; margin-top: 28px; max-width: 480px; flex-wrap: wrap; }
        .cta-form input {
          flex: 1; min-width: 200px; padding: 13px 16px;
          border-radius: var(--radius-md); border: 1px solid var(--border);
          background: var(--bg); color: var(--fg);
          font-family: var(--font-body); font-size: 14.5px; outline: none;
          transition: border-color var(--dur-fast) var(--ease);
        }
        .cta-form input:focus { border-color: var(--accent); }
        .cta-foot { margin-top: 14px; font-size: 13px; }
      `}</style>

      <section id="cta" className="cta">
        <div className="container">
          <div className="cta-card">
            <div className="cta-bg dot-grid" aria-hidden="true" />
            <div className="cta-inner">
              <h2 className="cta-title">
                Ask once.<br />Trust the answer.
              </h2>
              <p className="cta-lede">
                Spin up a workspace, connect your stack, and get your first cited
                answer in the next ten minutes.
              </p>
              <form
                className="cta-form"
                onSubmit={(e) => { e.preventDefault(); if (email) setSent(true) }}
              >
                <input
                  type="email" required placeholder="you@company.com"
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  aria-label="Work email"
                />
                <button type="submit" className="btn btn-accent">
                  {sent
                    ? <><Icons.check size={15} /> Check your inbox</>
                    : <>Start free <Icons.arrowRight size={14} /></>
                  }
                </button>
              </form>
              <div className="cta-foot muted">
                No credit card · 14-day Team trial · Set up in 10 min
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
