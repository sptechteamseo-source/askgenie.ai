// Simple client-safe page header — no server imports
// Used in 'use client' pages that can't import the server DashboardHeader

interface PageHeaderProps {
  title: string
  description?: string
}

export default function PageHeader({ title, description }: PageHeaderProps) {
  return (
    <header className="dash-header">
      <div className="dash-header-left">
        <h1 className="dash-header-title">{title}</h1>
        {description && <p className="dash-header-desc">{description}</p>}
      </div>

      <style>{`
        .dash-header {
          padding: 20px 32px;
          border-bottom: 1px solid var(--border);
          background: var(--bg-elevated);
        }
        .dash-header-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--fg);
          margin: 0;
        }
        .dash-header-desc {
          font-size: 0.85rem;
          color: var(--fg-muted);
          margin: 2px 0 0;
        }
      `}</style>
    </header>
  )
}
