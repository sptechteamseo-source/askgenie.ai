import { auth } from '@/lib/auth'
import { MobileMenuButton } from './MobileMenuButton'

interface HeaderProps {
  title: string
  description?: string
}

export default async function DashboardHeader({ title, description }: HeaderProps) {
  const session = await auth()

  const initials = session?.user?.name
    ? session.user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : 'U'

  return (
    <header className="dash-header">
      {/* Left: hamburger (mobile) + title */}
      <div className="dash-header-left">
        <MobileMenuButton />
        <div>
          <h1 className="dash-header-title">{title}</h1>
          {description && <p className="dash-header-desc">{description}</p>}
        </div>
      </div>

      {/* Right: avatar + user info */}
      <div className="dash-header-right">
        <div className="dash-user-avatar">{initials}</div>
        <div className="dash-user-info">
          <span className="dash-user-name">{session?.user?.name || 'User'}</span>
          <span className="dash-user-role">{session?.user?.role || 'author'}</span>
        </div>
      </div>

      <style>{`
        .dash-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 32px;
          border-bottom: 1px solid var(--border);
          background: var(--bg-elevated);
          gap: 12px;
          min-height: 64px;
        }
        .dash-header-left {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 0;
        }
        .dash-header-title {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--fg);
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dash-header-desc {
          font-size: 0.82rem;
          color: var(--fg-muted);
          margin: 2px 0 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .dash-header-right {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }
        .dash-user-avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--accent-soft);
          color: var(--accent);
          font-size: 0.8rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .dash-user-info {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
        }
        .dash-user-name {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--fg);
          white-space: nowrap;
        }
        .dash-user-role {
          font-size: 0.7rem;
          color: var(--fg-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
        }

        /* ── Mobile ──────────────────────────────────────── */
        @media (max-width: 768px) {
          .dash-header {
            padding: 12px 16px;
          }
          .dash-header-title {
            font-size: 1rem;
          }
          /* Hide text name/role on small screens — keep only avatar */
          .dash-user-info {
            display: none;
          }
        }
        @media (max-width: 480px) {
          .dash-header-desc {
            display: none;
          }
        }
      `}</style>
    </header>
  )
}
