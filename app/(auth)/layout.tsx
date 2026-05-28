import type { ReactNode } from 'react'
import Link from 'next/link'

// Shared layout for all auth pages (login, signup, forgot password, reset)
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="auth-shell">
      {/* Logo */}
      <Link href="/" className="auth-logo">
        <span className="auth-logo-text">askgenie.ai</span>
      </Link>

      {/* Card */}
      <div className="auth-card">
        {children}
      </div>

      <style>{`
        .auth-shell {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: var(--bg);
        }

        .auth-logo {
          margin-bottom: 32px;
          text-decoration: none;
        }

        .auth-logo-text {
          font-family: var(--font-display);
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--fg);
        }

        .auth-card {
          width: 100%;
          max-width: 420px;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 40px;
          box-shadow: var(--shadow-md);
        }
      `}</style>
    </div>
  )
}
