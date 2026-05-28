import { Icons } from '@/components/icons/Icons'
import { FEATURES } from '@/lib/data'

export default function Features() {
  return (
    <>
      <style>{`
        .features-head { display: flex; flex-direction: column; gap: 8px; margin-bottom: 56px; }
        .features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 1040px) { .features-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 640px)  { .features-grid { grid-template-columns: 1fr; } }
        .feature { padding: 28px 26px 30px; display: flex; flex-direction: column; min-height: 240px; }
        .feature-icon {
          width: 38px; height: 38px; border-radius: 10px;
          background: var(--accent-soft); color: var(--accent);
          display: inline-flex; align-items: center; justify-content: center;
          margin-bottom: 18px;
          border: 1px solid color-mix(in oklab, var(--accent) 25%, transparent);
        }
        .feature-title { font-family: var(--font-display); font-weight: 600; font-size: 19px; letter-spacing: -0.01em; color: var(--fg); margin-bottom: 8px; }
        .feature-body { color: var(--fg-muted); font-size: 14.5px; line-height: 1.55; text-wrap: pretty; }
      `}</style>

      <section id="features" className="features">
        <div className="container">
          <div className="features-head">
            <span className="eyebrow">Why teams switch</span>
            <h2 className="section-title">
              Not another chat box.<br />
              A retrieval engine your team can <em>trust</em>.
            </h2>
          </div>

          <div className="features-grid">
            {FEATURES.map((f, i) => {
              const Icon = Icons[f.icon]
              return (
                <div key={i} className="feature card">
                  {Icon && <div className="feature-icon"><Icon size={20} /></div>}
                  <h3 className="feature-title">{f.title}</h3>
                  <p className="feature-body">{f.body}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
