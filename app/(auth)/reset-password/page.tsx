'use client'

import { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { resetPassword } from '@/app/actions/auth'

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetForm />
    </Suspense>
  )
}

function ResetForm() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') || ''

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!token) {
    return (
      <>
        <h1 className="auth-title">Invalid link</h1>
        <p className="auth-subtitle">This reset link is missing or expired.</p>
        <style>{`
          .auth-title { font-size: 1.5rem; font-weight: 700; color: var(--fg); margin-bottom: 4px; }
          .auth-subtitle { color: var(--fg-muted); font-size: 0.9rem; }
        `}</style>
      </>
    )
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set('token', token)

    const result = await resetPassword(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="auth-title">Set new password</h1>
      <p className="auth-subtitle">Choose a strong password for your account.</p>

      {error && <div className="auth-alert auth-alert--error">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label htmlFor="password">New password</label>
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
          {loading ? 'Saving…' : 'Save new password'}
        </button>
      </form>

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
        .auth-alert { padding: 10px 14px; border-radius: var(--radius-sm); font-size: 0.85rem; margin-bottom: 16px; }
        .auth-alert--error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
      `}</style>
    </>
  )
}
