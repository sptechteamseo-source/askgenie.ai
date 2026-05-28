import { auth } from '@/lib/auth'

interface HeaderProps {
  title: string
  description?: string
}

// Server component — reads session to show user name
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
      <div className="dash-header-left">
        <h1 className="dash-header-title">{title}</h1>
        {description && <p className="dash-header-desc">{description}</p>}
      </div>

      <div className="dash-header-right">
        <div className="dash-user-avatar">{initials}</div>
        <div className="dash-user-info">
          <span className="dash-user-name">{session?.user?.name || 'User'}</span>
          <span className="dash-user-role">{session?.user?.role || 'AUTHOR'}</span>
        </div>
      </div>

      <style>{`
        .dash-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
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
        .dash-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
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
        }
        .dash-user-role {
          font-size: 0.7rem;
          color: var(--fg-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      `}</style>
    </header>
  )
}
