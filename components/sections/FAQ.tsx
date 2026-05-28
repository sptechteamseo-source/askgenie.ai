'use client'

import { useState } from 'react'
import { Icons } from '@/components/icons/Icons'
import { FAQS } from '@/lib/data'

interface ItemProps {
  q: string
  a: string
  open: boolean
  onToggle: () => void
}

function Item({ q, a, open, onToggle }: ItemProps) {
  return (
    <div className={`faq-item ${open ? 'is-open' : ''}`}>
      <button className="faq-q" onClick={onToggle} aria-expanded={open}>
        <span>{q}</span>
        <span className="faq-icon">
          {open ? <Icons.minus size={16} /> : <Icons.plus size={16} />}
        </span>
      </button>
      <div className="faq-a-wrap" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
        <div className="faq-a-inner">
          <p>{a}</p>
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const [open, setOpen] = useState(0)

  return (
    <>
      <style>{`
        .faq-grid { display: grid; grid-template-columns: 360px 1fr; gap: 56px; }
        @media (max-width: 900px) { .faq-grid { grid-template-columns: 1fr; gap: 32px; } }
        .faq-side { position: sticky; top: 100px; align-self: flex-start; }
        .faq-list { display: flex; flex-direction: column; }
        .faq-item { border-bottom: 1px solid var(--border); }
        .faq-item:first-child { border-top: 1px solid var(--border); }
        .faq-q {
          width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 24px;
          padding: 22px 4px; background: transparent; border: 0; text-align: left;
          font-family: var(--font-display); font-size: 16.5px; font-weight: 500; letter-spacing: -0.005em;
          color: var(--fg); transition: color var(--dur-fast) var(--ease);
        }
        .faq-q:hover { color: var(--accent); }
        .faq-icon {
          width: 28px; height: 28px; border-radius: 9999px; border: 1px solid var(--border);
          display: inline-flex; align-items: center; justify-content: center;
          color: var(--fg-muted); flex-shrink: 0;
          transition: background var(--dur-fast) var(--ease), color var(--dur-fast) var(--ease);
        }
        .faq-item.is-open .faq-icon { background: var(--accent); color: var(--accent-fg); border-color: var(--accent); }
        .faq-a-wrap { display: grid; transition: grid-template-rows var(--dur) var(--ease); }
        .faq-a-inner { overflow: hidden; }
        .faq-a-inner p { color: var(--fg-muted); font-size: 14.5px; line-height: 1.6; padding: 0 4px 22px; max-width: 640px; text-wrap: pretty; }
      `}</style>

      <section id="faq" className="faq">
        <div className="container faq-grid">
          <div className="faq-side">
            <span className="eyebrow">FAQ</span>
            <h2 className="section-title">Things you&apos;ll want to <em>ask</em>.</h2>
            <p className="section-lede">
              More questions? Email{' '}
              <a href="mailto:hello@askthegenie.ai">hello@askthegenie.ai</a>{' '}
              — a real human responds in under an hour.
            </p>
          </div>
          <div className="faq-list">
            {FAQS.map((f, i) => (
              <Item
                key={i} q={f.q} a={f.a} open={open === i}
                onToggle={() => setOpen(open === i ? -1 : i)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
