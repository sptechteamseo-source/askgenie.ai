import { Icons } from '@/components/icons/Icons'
import { QUOTES, STATS } from '@/lib/data'

export default function Testimonials() {
  return (
    <>
      <style>{`
        .testimonials-head { margin-bottom: 48px; max-width: 720px; }
        .quotes-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        @media (max-width: 1000px) { .quotes-grid { grid-template-columns: 1fr; } }
        .quote { padding: 28px 26px 26px; display: flex; flex-direction: column; gap: 18px; }
        .quote-stars { display: flex; gap: 2px; color: var(--accent); }
        .quote-text { font-family: var(--font-display); font-weight: 500; font-size: 18px; line-height: 1.45; letter-spacing: -0.01em; margin: 0; text-wrap: pretty; }
        .quote-by { display: flex; align-items: center; gap: 12px; margin-top: auto; }
        .quote-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--accent-soft); color: var(--accent);
          display: inline-flex; align-items: center; justify-content: center;
          font-family: var(--font-display); font-weight: 700; font-size: 13px;
          border: 1px solid color-mix(in oklab, var(--accent) 25%, transparent);
        }
        .quote-name { display: block; font-family: var(--font-display); font-weight: 600; font-size: 14px; }
        .quote-org  { display: block; color: var(--fg-subtle); font-size: 12.5px; }
        .stats {
          margin-top: 56px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
          padding: 28px; border: 1px solid var(--border); border-radius: var(--radius-lg);
          background: var(--bg-elevated);
        }
        @media (max-width: 800px) { .stats { grid-template-columns: repeat(2, 1fr); } }
        .stat { display: flex; flex-direction: column; gap: 4px; }
        .stat-n { font-family: var(--font-display); font-weight: 600; font-size: clamp(28px, 3vw, 40px); letter-spacing: -0.02em; }
        .stat-l { color: var(--fg-muted); font-size: 13px; }
      `}</style>

      <section className="testimonials">
        <div className="container">
          <div className="testimonials-head">
            <span className="eyebrow">Loved by leaders</span>
            <h2 className="section-title">
              Teams ship faster when the answers are <em>right there</em>.
            </h2>
          </div>

          <div className="quotes-grid">
            {QUOTES.map((q, i) => (
              <figure key={i} className="quote card">
                <div className="quote-stars" aria-hidden="true">
                  {[0, 1, 2, 3, 4].map((s) => <Icons.star key={s} size={13} />)}
                </div>
                <blockquote className="quote-text">&ldquo;{q.q}&rdquo;</blockquote>
                <figcaption className="quote-by">
                  <span className="quote-avatar">{q.initials}</span>
                  <span>
                    <span className="quote-name">{q.by}</span>
                    <span className="quote-org">{q.org}</span>
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>

          <div className="stats">
            {STATS.map((s, i) => (
              <div key={i} className="stat">
                <div className="stat-n">{s.n}</div>
                <div className="stat-l">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
