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
          transition: background .25s, color .25s, transform .3s var(--ease), box-shadow .3s;
        }
        .how-step:hover .how-num {
          background: var(--accent); color: var(--accent-fg);
          transform: scale(1.1);
          box-shadow: 0 4px 14px -4px var(--accent-glow);
        }
        @keyframes railFill { from { width:0; opacity:0; } to { width:100%; opacity:1; } }
        .how-rail {
          flex: 1; height: 1px; background: var(--border);
          position: relative; overflow: hidden;
        }
        .how-rail::after {
          content: ""; position: absolute; inset: 0;
          background: var(--accent); width: 0; opacity: 0;
          transition: width .6s var(--ease), opacity .3s;
        }
        .how-step:hover .how-rail::after { width: 100%; opacity: 1; }
        .how-title { font-family: var(--font-display); font-weight: 600; font-size: 22px; letter-spacing: -0.02em; margin-bottom: 10px; }
        .how-body { color: var(--fg-muted); font-size: 15px; line-height: 1.55; margin-bottom: 18px; text-wrap: pretty; }
        .how-bullets { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 8px; }
        .how-bullets li { display: flex; align-items: center; gap: 10px; color: var(--fg-muted); font-size: 13.5px; }
        .how-bullets svg { color: var(--accent); }
        @media (max-width: 640px) {
          .how-head { margin-bottom: 32px; }
          .how-step { padding: 20px 18px 24px; }
          .how-title { font-size: 19px; }
        }
      `}</style>

      <section id="product" className="how">
        <div className="container">
          <div className="how-head" data-reveal="fade-up">
            <span className="eyebrow">How it works</span>
            <h2 className="section-title">
              From scattered to <em>searchable</em> in an afternoon.
            </h2>
          </div>

          <div className="how-grid">
            {STEPS.map((s, i) => (
              <div key={s.n} className="how-step card" data-reveal="fade-up" style={{'--reveal-delay':`${i*100}ms`} as any}>
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
