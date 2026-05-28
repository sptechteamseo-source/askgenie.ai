import { Marks } from '@/components/connectors/Connectors'
import { CONNECTOR_LIST } from '@/lib/data'

export default function Logos() {
  const track = [...CONNECTOR_LIST, ...CONNECTOR_LIST]

  return (
    <>
      <style>{`
        .logos { padding: 56px 0; border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .logos-head { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 32px; flex-wrap: wrap; gap: 12px; }
        .logos-lede { color: var(--fg-muted); font-size: 14.5px; }
        .logos-tile {
          display: inline-flex; align-items: center; gap: 12px;
          color: var(--fg-subtle); font-family: var(--font-display); font-weight: 500;
          font-size: 18px; letter-spacing: -0.01em;
          transition: color var(--dur) var(--ease);
        }
        .logos-tile:hover { color: var(--fg); }
        .logos-mark { width: 26px; height: 26px; display: inline-flex; align-items: center; justify-content: center; }
        .logos-mark svg { width: 24px; height: 24px; }
      `}</style>

      <section className="logos" aria-label="Connectors">
        <div className="container">
          <div className="logos-head">
            <span className="eyebrow">Connect everything</span>
            <p className="logos-lede">30+ native connectors. Add your own with the API.</p>
          </div>
        </div>
        <div className="marquee-track">
          <div className="marquee">
            {track.map((name, i) => (
              <div className="logos-tile" key={i}>
                <span className="logos-mark">{Marks[name]}</span>
                <span>{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
