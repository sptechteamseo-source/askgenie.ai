'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signup } from '@/app/actions/auth'

export default function SignupPage() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    const result = await signup(formData)

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="auth-title">Create an account</h1>
      <p className="auth-subtitle">Join the askgenie.ai team</p>

      {error && <div className="auth-alert auth-alert--error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Jane Smith"
            required
            autoComplete="name"
          />
        </div>

        <div className="auth-field">
          <label htmlFor="email">Work email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@company.com"
            required
            autoComplete="email"
          />
        </div>

        <div className="auth-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Min 8 characters"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </div>

        <button type="submit" className="btn btn-accent auth-submit" disabled={loading}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <p className="auth-footer">
        Already have an account?{' '}
        <Link href="/login" className="auth-link">
          Sign in
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
        .auth-alert { padding: 10px 14px; border-radius: var(--radius-sm); font-size: 0.85rem; margin-bottom: 16px; }
        .auth-alert--error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
      `}</style>
    </>
  )
}
