'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SettingsFormProps {
  currentUser: {
    id: string
    name: string
    email: string
    image: string | null
  }
}

export default function SettingsForm({ currentUser }: SettingsFormProps) {
  const router = useRouter()
  const [profileSuccess, setProfileSuccess] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState(false)
  const [profileError, setProfileError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [loading, setLoading] = useState(false)

  async function updateProfile(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setProfileError('')
    setProfileSuccess(false)
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    const body = {
      name: fd.get('name') as string,
      email: fd.get('email') as string,
    }

    const res = await fetch('/api/users/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()
    setLoading(false)

    if (!data.success) {
      setProfileError(data.error)
    } else {
      setProfileSuccess(true)
      router.refresh()
    }
  }

  async function updatePassword(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPasswordError('')
    setPasswordSuccess(false)

    const fd = new FormData(e.currentTarget)
    const newPassword = fd.get('newPassword') as string
    const confirmPassword = fd.get('confirmPassword') as string

    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match')
      return
    }

    setLoading(true)

    const res = await fetch('/api/users/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: currentUser.name, password: newPassword }),
    })

    const data = await res.json()
    setLoading(false)

    if (!data.success) {
      setPasswordError(data.error)
    } else {
      setPasswordSuccess(true)
      ;(e.target as HTMLFormElement).reset()
    }
  }

  return (
    <div className="settings-sections">
      {/* Profile settings */}
      <div className="settings-card">
        <h2 className="settings-section-title">Profile</h2>
        <p className="settings-section-desc">Update your name and email address.</p>

        {profileSuccess && <div className="alert alert--success">Profile updated successfully.</div>}
        {profileError && <div className="alert alert--error">{profileError}</div>}

        <form onSubmit={updateProfile} className="settings-form">
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="name">Full name</label>
              <input id="name" name="name" type="text" defaultValue={currentUser.name} required />
            </div>
            <div className="form-field">
              <label htmlFor="email">Email</label>
              <input id="email" name="email" type="email" defaultValue={currentUser.email} required />
            </div>
          </div>
          <button type="submit" className="btn btn-accent settings-submit" disabled={loading}>
            {loading ? 'Saving…' : 'Save Profile'}
          </button>
        </form>
      </div>

      {/* Password change */}
      <div className="settings-card">
        <h2 className="settings-section-title">Change Password</h2>
        <p className="settings-section-desc">Choose a strong password of at least 8 characters.</p>

        {passwordSuccess && <div className="alert alert--success">Password updated successfully.</div>}
        {passwordError && <div className="alert alert--error">{passwordError}</div>}

        <form onSubmit={updatePassword} className="settings-form">
          <div className="form-row">
            <div className="form-field">
              <label htmlFor="newPassword">New password</label>
              <input id="newPassword" name="newPassword" type="password" minLength={8} required placeholder="Min 8 characters" />
            </div>
            <div className="form-field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input id="confirmPassword" name="confirmPassword" type="password" minLength={8} required placeholder="Repeat new password" />
            </div>
          </div>
          <button type="submit" className="btn btn-accent settings-submit" disabled={loading}>
            {loading ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Role permissions reference */}
      <div className="settings-card">
        <h2 className="settings-section-title">Role Permissions</h2>
        <p className="settings-section-desc">What each role can do in the CMS.</p>

        <div className="perms-table-wrap">
          <table className="perms-table">
            <thead>
              <tr>
                <th>Permission</th>
                <th>Admin</th>
                <th>Editor</th>
                <th>Author</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Manage users', true, false, false],
                ['Manage all blogs', true, true, false],
                ['Create/edit own blogs', true, true, true],
                ['Publish content', true, true, false],
                ['Manage use cases', true, true, false],
                ['Manage testimonials', true, true, false],
                ['View analytics', true, true, false],
                ['Manage settings', true, false, false],
              ].map(([label, admin, editor, author]) => (
                <tr key={label as string}>
                  <td>{label as string}</td>
                  <td>{admin ? '✓' : '—'}</td>
                  <td>{editor ? '✓' : '—'}</td>
                  <td>{author ? '✓' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .settings-sections { display: flex; flex-direction: column; gap: 24px; max-width: 800px; }
        .settings-card {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .settings-section-title { font-size: 1rem; font-weight: 600; color: var(--fg); }
        .settings-section-desc { font-size: 0.875rem; color: var(--fg-muted); margin-top: -8px; }
        .settings-form { display: flex; flex-direction: column; gap: 16px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-field { display: flex; flex-direction: column; gap: 6px; }
        .form-field label { font-size: 0.825rem; font-weight: 500; color: var(--fg-muted); }
        .form-field input { padding: 9px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--bg); color: var(--fg); font-size: 0.875rem; outline: none; transition: border-color var(--transition-fast); }
        .form-field input:focus { border-color: var(--accent); }
        .settings-submit { width: fit-content; }
        .settings-submit:disabled { opacity: 0.6; cursor: not-allowed; }
        .alert { padding: 10px 14px; border-radius: var(--radius-sm); font-size: 0.875rem; }
        .alert--success { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
        .alert--error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
        .perms-table-wrap { border: 1px solid var(--border); border-radius: var(--radius-sm); overflow: hidden; }
        .perms-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        .perms-table th { background: var(--bg-sunken); padding: 8px 16px; text-align: left; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--fg-muted); border-bottom: 1px solid var(--border); }
        .perms-table td { padding: 10px 16px; border-bottom: 1px solid var(--border); color: var(--fg); }
        .perms-table tr:last-child td { border-bottom: none; }
        .perms-table td:not(:first-child) { color: var(--accent); font-weight: 600; }
      `}</style>
    </div>
  )
}
