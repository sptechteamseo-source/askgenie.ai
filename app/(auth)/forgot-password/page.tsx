'use client'

import { useState } from 'react'
import Link from 'next/link'
import { forgotPassword } from '@/app/actions/auth'

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    await forgotPassword(formData)

    setLoading(false)
    setSent(true)
  }

  if (sent) {
    return (
      <>
        <h1 className="auth-title">Check your email</h1>
        <p className="auth-body">
          If an account exists for that email, we sent a reset link. Check your inbox (and spam folder).
        </p>
        <Link href="/login" className="btn btn-accent auth-submit">
          Back to login
        </Link>

        <style>{`
          .auth-title { font-size: 1.5rem; font-weight: 700; color: var(--fg); margin-bottom: 12px; }
          .auth-body { color: var(--fg-muted); font-size: 0.9rem; line-height: 1.6; margin-bottom: 24px; }
          .auth-submit { display: block; width: 100%; text-align: center; padding: 11px; text-decoration: none; }
        `}</style>
      </>
    )
  }

  return (
    <>
      <h1 className="auth-title">Forgot password?</h1>
      <p className="auth-subtitle">Enter your email and we&apos;ll send a reset link.</p>

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@company.com"
            required
          />
        </div>

        <button type="submit" className="btn btn-accent auth-submit" disabled={loading}>
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
      </form>

      <p className="auth-footer">
        <Link href="/login" className="auth-link">
          ← Back to login
        </Link>
      </p>

      <style>{`
        .auth-title { font-size: 1.5rem; font-weight: 700; color: var(--fg); margin-bottom: 4px; }
        .auth-subtitle { color: var(--fg-muted); font-size: 0.9rem; margin-bottom: 24px; }
        .auth-form { display: flex; flex-direction: column; gap: 16px; margin-top: 24px; }
        .auth-field { display: flex; flex-direction: column; gap: 6px; }
        .auth-field label { font-size: 0.85rem; font-weight: 500; color: var(--fg); }
        .auth-field input {
          padding: 10px 14px;
          border: 1px solid var(--border);
          border-radius: var(--radius-sm);
          background: var(--bg);
          color: var(--fg);
          font-size: 0.9rem;
          outline: none;
          transition: border-color var(--transition-fast);
        }
        .auth-field input:focus { border-color: var(--accent); }
        .auth-submit { width: 100%; margin-top: 8px; padding: 11px; }
        .auth-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .auth-footer { text-align: center; font-size: 0.85rem; color: var(--fg-muted); margin-top: 20px; }
        .auth-link { color: var(--accent); text-decoration: none; font-weight: 500; }
      `}</style>
    </>
  )
}
