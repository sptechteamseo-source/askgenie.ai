import { Icons } from '@/components/icons/Icons'
import { STEPS } from '@/lib/data'

export default function HowItWorks() {
  return (
    <>
      <style>{`
        .how-head { margin-bottom: 56px; }
        .how-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 1040px) { .how-grid { grid-template-columns: 1fr; } }
        .how-step { padding: 28px 26px 32px; position: relative; }
        .how-step-head { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; }
        .how-num {
          font-family: var(--font-display); font-size: 14px; font-weight: 600;
          letter-spacing: .06em; color: var(--accent); background: var(--accent-soft);
          padding: 6px 10px; border-radius: 9999px;
          border: 1px solid color-mix(in oklab, var(--accent) 30%, transparent);
        }
        .how-rail { flex: 1; height: 1px; background: var(--border); }
        .how-title { font-family: var(--font-display); font-weight: 600; font-size: 22px; letter-spacing: -0.02em; margin-bottom: 10px; }
        .how-body { color: var(--fg-muted); font-size: 15px; line-height: 1.55; margin-bottom: 18px; text-wrap: pretty; }
        .how-bullets { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
        .how-bullets li { display: flex; align-items: center; gap: 10px; color: var(--fg-muted); font-size: 13.5px; }
        .how-bullets svg { color: var(--accent); }
      `}</style>

      <section id="product" className="how">
        <div className="container">
          <div className="how-head">
            <span className="eyebrow">How it works</span>
            <h2 className="section-title">
              From scattered to <em>searchable</em> in an afternoon.
            </h2>
          </div>

          <div className="how-grid">
            {STEPS.map((s) => (
              <div key={s.n} className="how-step card">
                <div className="how-step-head">
                  <span className="how-num">{s.n}</span>
                  <span className="how-rail" aria-hidden="true" />
                </div>
                <h3 className="how-title">{s.title}</h3>
                <p className="how-body">{s.body}</p>
                <ul className="how-bullets">
                  {s.bullets.map((b) => (
                    <li key={b}><Icons.check size={14} /> {b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
