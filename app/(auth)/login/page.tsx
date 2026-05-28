'use client'

import { Suspense, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { login } from '@/app/actions/auth'

// Wrap in Suspense because useSearchParams() causes a CSR bailout at build time
export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'
  const message = searchParams.get('message')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.set('callbackUrl', callbackUrl)

    const result = await login(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <>
      <h1 className="auth-title">Welcome back</h1>
      <p className="auth-subtitle">Sign in to your dashboard</p>

      {message === 'password-reset' && (
        <div className="auth-alert auth-alert--success">
          Password updated! You can now log in.
        </div>
      )}

      {error && (
        <div className="auth-alert auth-alert--error">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        <div className="auth-field">
          <label htmlFor="email">Email</label>
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
          <label htmlFor="password">
            Password
            <Link href="/forgot-password" className="auth-link-small">
              Forgot password?
            </Link>
          </label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn btn-accent auth-submit" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="auth-footer">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="auth-link">
          Sign up
        </Link>
      </p>

      <AuthStyles />
    </>
  )
}

function AuthStyles() {
  return (
    <style>{`
      .auth-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--fg);
        margin-bottom: 4px;
      }
      .auth-subtitle {
        color: var(--fg-muted);
        font-size: 0.9rem;
        margin-bottom: 24px;
      }
      .auth-form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-top: 24px;
      }
      .auth-field {
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      .auth-field label {
        font-size: 0.85rem;
        font-weight: 500;
        color: var(--fg);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .auth-field input {
        padding: 10px 14px;
        border: 1px solid var(--border);
        border-radius: var(--radius-sm);
        background: var(--bg);
        color: var(--fg);
        font-size: 0.9rem;
        transition: border-color var(--transition-fast);
        outline: none;
      }
      .auth-field input:focus {
        border-color: var(--accent);
      }
      .auth-submit {
        width: 100%;
        margin-top: 8px;
        padding: 11px;
      }
      .auth-submit:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
      .auth-footer {
        text-align: center;
        font-size: 0.85rem;
        color: var(--fg-muted);
        margin-top: 20px;
      }
      .auth-link { color: var(--accent); text-decoration: none; font-weight: 500; }
      .auth-link-small { color: var(--accent); text-decoration: none; font-size: 0.8rem; }
      .auth-alert {
        padding: 10px 14px;
        border-radius: var(--radius-sm);
        font-size: 0.85rem;
        margin-bottom: 16px;
      }
      .auth-alert--error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
      .auth-alert--success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
    `}</style>
  )
}
