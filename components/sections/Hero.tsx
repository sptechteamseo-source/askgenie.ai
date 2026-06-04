'use client'

import { useState, useEffect } from 'react'
import { useTypewriter } from '@/hooks/useTypewriter'
import { Marks } from '@/components/connectors/Connectors'
import { Icons } from '@/components/icons/Icons'
import { SUGGESTIONS, ANSWERS } from '@/lib/data'

interface VideoModalProps {
  onClose: () => void
}

function VideoModal({ onClose }: VideoModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <>
      <style>{`
        .vmodal-backdrop {
          position: fixed; inset: 0; z-index: 1000;
          background: rgba(0,0,0,.75);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 20px;
          animation: vFadeIn .18s ease;
        }
        @keyframes vFadeIn { from { opacity: 0; } to { opacity: 1; } }
        .vmodal-box {
          position: relative;
          width: 100%; max-width: 900px;
          border-radius: 16px; overflow: hidden;
          box-shadow: 0 40px 80px rgba(0,0,0,.6);
          animation: vSlideUp .22s ease;
          background: #000;
          aspect-ratio: 16/9;
        }
        @keyframes vSlideUp { from { transform: translateY(24px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .vmodal-box iframe { width: 100%; height: 100%; border: 0; display: block; }
        .vmodal-close {
          position: absolute; top: -44px; right: 0;
          background: rgba(255,255,255,.12); border: 1px solid rgba(255,255,255,.2);
          color: #fff; width: 36px; height: 36px; border-radius: 50%;
          display: inline-flex; align-items: center; justify-content: center;
          cursor: pointer; transition: background .15s;
          font-size: 18px; line-height: 1;
        }
        .vmodal-close:hover { background: rgba(255,255,255,.25); }
      `}</style>

      <div className="vmodal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-label="Demo video">
        <div className="vmodal-box" onClick={(e) => e.stopPropagation()}>
          <button className="vmodal-close" onClick={onClose} aria-label="Close video">✕</button>
          <iframe
            src="https://www.youtube.com/embed/YRXcdO77qq0?start=7&autoplay=1&rel=0"
            title="askthegenie 90s demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </>
  )
}

function HeroAsk() {
  const [submitted, setSubmitted] = useState(SUGGESTIONS[0])
  const [draft, setDraft] = useState('')

  const data = ANSWERS[submitted] ?? {
    text: `I haven't been trained on "${submitted}" in this demo, but in your workspace I'd search every connected source, rank passages by relevance, and answer with citations you can click.`,
    sources: [{ tag: 'All sources', title: 'Demo response · live workspace', icon: 'Notion' }],
  }

  const { out, done } = useTypewriter(data.text)

  const ask = (q: string) => {
    setSubmitted(q)
    setDraft('')
  }

  return (
    <>
      <style>{`
        .ask {
          padding: 18px 18px 20px; position: relative;
          box-shadow: 0 30px 60px -30px color-mix(in oklab, var(--accent) 18%, transparent),
                      0 0 0 1px var(--border);
        }
        .ask-head { display: flex; justify-content: space-between; align-items: center; padding: 4px 6px 14px; }
        .ask-tabs { display: flex; gap: 6px; }
        .ask-tab {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 6px 11px; border-radius: 9999px;
          font-family: var(--font-label); font-size: 12px; font-weight: 500;
          color: var(--fg-subtle);
        }
        .ask-tab.is-active { color: var(--fg); background: var(--bg-sunken); }
        .ask-status { display: inline-flex; align-items: center; gap: 6px; font-size: 12px; color: var(--fg-subtle); }
        .ask-dot { width: 7px; height: 7px; border-radius: 50%; background: #4ade80; box-shadow: 0 0 0 4px color-mix(in oklab, #4ade80 25%, transparent); }
        .ask-input {
          display: flex; align-items: center; gap: 10px; padding: 14px;
          background: var(--bg-sunken); border-radius: var(--radius-md);
          border: 1px solid var(--border); color: var(--fg-muted);
        }
        .ask-input input {
          flex: 1; background: transparent; border: 0; outline: none;
          color: var(--fg); font-family: var(--font-body); font-size: 15px;
        }
        .ask-input input::placeholder { color: var(--fg-subtle); }
        .ask-send {
          background: var(--accent); color: var(--accent-fg);
          border: 0; width: 32px; height: 32px; border-radius: 9px;
          display: inline-flex; align-items: center; justify-content: center;
          transition: transform var(--dur-fast) var(--ease);
        }
        .ask-send:hover { transform: translateX(1px); }
        .ask-suggestions { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 12px; }
        .ask-chip { cursor: pointer; transition: color var(--dur-fast) var(--ease), border-color var(--dur-fast) var(--ease), background var(--dur-fast) var(--ease); }
        .ask-chip:hover { color: var(--fg); border-color: var(--neutral-400); }
        .ask-chip.is-active { background: var(--accent-soft); color: var(--accent); border-color: color-mix(in oklab, var(--accent) 40%, transparent); }
        .ask-divider { height: 1px; background: var(--border); margin: 16px -18px 0; }
        .ask-answer { padding-top: 16px; }
        .ask-answer-head { display: flex; align-items: center; justify-content: space-between; }
        .ask-pill {
          display: inline-flex; align-items: center; gap: 6px;
          padding: 4px 9px; border-radius: 9999px; font-size: 11.5px; letter-spacing: .04em;
          background: var(--accent-soft); color: var(--accent);
          font-family: var(--font-label); font-weight: 600;
        }
        .ask-text { margin-top: 10px; font-size: 15px; line-height: 1.6; color: var(--fg); min-height: 6.4em; text-wrap: pretty; }
        .ask-sources { display: flex; flex-direction: column; gap: 6px; margin-top: 14px; }
        .ask-source {
          display: grid; grid-template-columns: 32px 1fr 16px; gap: 10px;
          align-items: center; padding: 10px 12px; border-radius: 12px;
          background: var(--bg-sunken); border: 1px solid transparent;
          opacity: 0; transform: translateY(6px);
          transition: border-color var(--dur-fast) var(--ease);
        }
        .ask-source.is-in { animation: fadeUp .5s var(--ease) forwards; }
        .ask-source:hover { border-color: var(--border); }
        .ask-source-mark {
          width: 32px; height: 32px; border-radius: 8px;
          background: var(--bg-elevated); display: inline-flex; align-items: center; justify-content: center;
          color: var(--fg-muted); border: 1px solid var(--border);
        }
        .ask-source-mark svg { width: 18px; height: 18px; }
        .ask-source-tag { font-family: var(--font-label); font-size: 11px; letter-spacing: .06em; text-transform: uppercase; color: var(--fg-subtle); }
        .ask-source-title { font-size: 13.5px; color: var(--fg); margin-top: 2px; }
        .ask-source-go { color: var(--fg-subtle); }
      `}</style>

      <div className="ask card" role="region" aria-label="Try askthegenie live">
        <div className="ask-head">
          <div className="ask-tabs">
            <span className="ask-tab is-active"><Icons.spark size={13} /> Ask</span>
            <span className="ask-tab"><Icons.search size={13} /> Search</span>
            <span className="ask-tab"><Icons.layers size={13} /> Sources</span>
          </div>
          <div className="ask-status">
            <span className="ask-dot" /> 14 sources connected
          </div>
        </div>

        <form
          className="ask-input"
          onSubmit={(e) => { e.preventDefault(); if (draft.trim()) ask(draft.trim()) }}
        >
          <Icons.search size={17} />
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={submitted}
            aria-label="Ask the genie"
          />
          <button type="submit" className="ask-send" aria-label="Ask">
            <Icons.send size={15} />
          </button>
        </form>

        <div className="ask-suggestions">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              className={`chip ask-chip ${s === submitted ? 'is-active' : ''}`}
              onClick={() => ask(s)}
            >
              {s.length > 48 ? s.slice(0, 46) + '…' : s}
            </button>
          ))}
        </div>

        <div className="ask-divider" />

        <div className="ask-answer">
          <div className="ask-answer-head">
            <span className="ask-pill"><Icons.spark size={12} /> Answer</span>
            <span className="muted tnum" style={{ fontSize: 12 }}>
              {done ? '0.8s · 14 sources scanned' : 'thinking…'}
            </span>
          </div>
          <p className="ask-text">
            {out}{!done && <span className="caret" />}
          </p>

          <div className="ask-sources">
            {data.sources.map((src, i) => (
              <div
                key={i}
                className={`ask-source ${done ? 'is-in' : ''}`}
                style={{ animationDelay: `${i * 90}ms` }}
              >
                <span className="ask-source-mark" aria-hidden="true">
                  {Marks[src.icon] ?? Marks['Notion']}
                </span>
                <div className="ask-source-meta">
                  <div className="ask-source-tag">{src.tag}</div>
                  <div className="ask-source-title">{src.title}</div>
                </div>
                <Icons.arrowUpRight size={14} className="ask-source-go" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default function Hero() {
  const [videoOpen, setVideoOpen] = useState(false)

  return (
    <>
      <style>{`
        .hero { padding-top: 56px; padding-bottom: var(--section-pad-y); position: relative; overflow: hidden; }
        .hero-bg { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
        .hero-dot-grid { position: absolute; inset: -40px 0 0 0; opacity: .35; mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 70%); }
        .hero-glow {
          position: absolute; left: 50%; top: -200px; transform: translateX(-50%);
          width: 1000px; height: 600px; border-radius: 50%;
          background: radial-gradient(closest-side, var(--accent-glow), transparent 70%);
          filter: blur(40px); opacity: .9;
        }
        .hero-grid-layout {
          position: relative; z-index: 1;
          display: grid; grid-template-columns: 1.05fr 1fr; gap: 64px;
          align-items: center; padding-top: 56px;
        }
        @media (max-width: 1040px) {
          .hero-grid-layout { grid-template-columns: 1fr; gap: 40px; }
        }
        .hero-eyebrow {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: var(--font-label); font-size: 12.5px; letter-spacing: .06em;
          color: var(--fg-muted); padding: 6px 12px;
          border: 1px solid var(--border); border-radius: 9999px; background: var(--bg-elevated);
        }
        .hero-pin {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--accent); box-shadow: 0 0 0 4px var(--accent-glow);
        }
        .hero-title {
          font-family: var(--font-display); font-weight: 600;
          font-size: clamp(36px, 5.6vw, 84px); line-height: .98;
          letter-spacing: -0.035em; margin: 22px 0; text-wrap: balance;
        }
        .hero-title em { font-style: normal; color: var(--accent); }
        .hero-lede {
          font-size: clamp(15px, 1.35vw, 19px); line-height: 1.55;
          color: var(--fg-muted); max-width: 540px; text-wrap: pretty;
        }
        .hero-cta { display: flex; gap: 10px; margin-top: 28px; flex-wrap: wrap; }
        .hero-trust { display: flex; align-items: center; gap: 14px; margin-top: 28px; color: var(--fg-subtle); font-size: 13px; flex-wrap: wrap; }
        .hero-avatars { display: flex; }
        .hero-avatar { width: 28px; height: 28px; border-radius: 50%; border: 2px solid var(--bg); margin-left: -8px; transition: transform .2s; }
        .hero-avatar:first-child { margin-left: 0; }
        .hero-avatars:hover .hero-avatar { transform: translateY(-2px); }

        /* ── Hero glow pulse ── */
        @keyframes heroGlowBreath {
          0%,100% { opacity:.7; transform:translateX(-50%) scale(1); }
          50%      { opacity:1;  transform:translateX(-50%) scale(1.12); }
        }
        .hero-glow { animation: heroGlowBreath 6s ease-in-out infinite; }

        /* ── Hero pin pulse ── */
        @keyframes pinPulse {
          0%,100% { box-shadow: 0 0 0 4px var(--accent-glow); }
          50%      { box-shadow: 0 0 0 8px var(--accent-glow); }
        }
        .hero-pin { animation: pinPulse 2.5s ease-in-out infinite; }

        /* ── Eyebrow badge hover ── */
        .hero-eyebrow { transition: border-color .2s, background .2s; cursor: default; }
        .hero-eyebrow:hover { border-color: color-mix(in oklab,var(--accent) 50%,transparent); background: var(--accent-soft); }

        /* ── Demo card hover lift ── */
        .hero-demo .ask { transition: transform .35s var(--ease), box-shadow .35s var(--ease); }
        .hero-demo .ask:hover { transform: translateY(-4px); box-shadow: 0 32px 80px -24px color-mix(in oklab,var(--accent) 22%,transparent), 0 0 0 1px var(--border) !important; }

        /* ── CTA button glow ring ── */
        .btn-accent { transition: box-shadow .25s var(--ease), transform .15s; }
        .btn-accent:hover { box-shadow: 0 0 0 6px var(--accent-glow); }
        .btn-accent:active { transform: translateY(1px); }

        /* ── Mobile tweaks ─────────────────────────────── */
        @media (max-width: 640px) {
          .hero { padding-top: 32px; }
          .hero-grid-layout { padding-top: 24px; gap: 28px; }
          .hero-cta .btn { flex: 1; justify-content: center; min-width: 140px; }
          .hero-eyebrow { font-size: 11px; }
        }
        @media (max-width: 400px) {
          .hero-cta { flex-direction: column; }
          .hero-cta .btn { width: 100%; justify-content: center; }
        }
      `}</style>

      <section id="top" className="hero">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-glow" />
          <div className="hero-dot-grid dot-grid" />
        </div>

        <div className="container">
          <div className="hero-grid-layout">
            <div className="hero-copy">
              <div className="hero-eyebrow hero-anim" style={{ animationDelay: '0ms' }}>
                <span className="hero-pin" />
                The AI your company actually has the answers for
              </div>
              <h1 className="hero-title hero-anim" style={{ animationDelay: '90ms' }}>
                Ask anything.<br />
                <em>Grounded</em> in everything<br />
                your team knows.
              </h1>
              <p className="hero-lede hero-anim" style={{ animationDelay: '190ms' }}>
                Connect Gmail, Drive, Salesforce, Notion, Fathom and 30+ more.
                askthegenie reads what your company already wrote, then answers
                with citations you can verify in one click.
              </p>
              <div className="hero-cta hero-anim" style={{ animationDelay: '290ms' }}>
                <a href="https://app.askthegenie.ai/signup" className="btn btn-accent btn-lg">
                  Start free <Icons.arrowRight size={15} />
                </a>
                <button className="btn btn-ghost btn-lg" onClick={() => setVideoOpen(true)}>
                  <Icons.play size={13} /> Watch 90s demo
                </button>
              </div>
              <div className="hero-trust hero-anim" style={{ animationDelay: '380ms' }}>
                <div className="hero-avatars" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <span
                      key={i}
                      className="hero-avatar"
                      style={{ background: `oklch(${72 - i * 4}% 0.05 ${30 + i * 40})` }}
                    />
                  ))}
                </div>
                <span>Trusted by 1,200+ teams · SOC 2 Type II</span>
              </div>
            </div>

            <div className="hero-demo hero-anim" style={{ animationDelay: '160ms' }}>
              <HeroAsk />
            </div>
          </div>
        </div>
      </section>

      {videoOpen && <VideoModal onClose={() => setVideoOpen(false)} />}
    </>
  )
}
