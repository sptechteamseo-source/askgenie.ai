interface StatsCardProps {
  title: string
  value: number | string
  description?: string
  accent?: boolean
}

export default function StatsCard({ title, value, description, accent }: StatsCardProps) {
  return (
    <div className={`stats-card ${accent ? 'stats-card--accent' : ''}`}>
      <p className="stats-card-title">{title}</p>
      <p className="stats-card-value">{value}</p>
      {description && <p className="stats-card-desc">{description}</p>}

      <style>{`
        .stats-card {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 20px 24px;
        }
        .stats-card--accent {
          background: var(--accent-soft);
          border-color: var(--accent);
        }
        .stats-card-title {
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--fg-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
        }
        .stats-card--accent .stats-card-title {
          color: var(--accent);
        }
        .stats-card-value {
          font-size: 2rem;
          font-weight: 700;
          color: var(--fg);
          font-family: var(--font-display);
          line-height: 1;
          margin-bottom: 4px;
        }
        .stats-card-desc {
          font-size: 0.8rem;
          color: var(--fg-muted);
          margin-top: 4px;
        }
      `}</style>
    </div>
  )
}
