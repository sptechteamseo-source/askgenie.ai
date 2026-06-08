'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: string
  image: string | null
  bio: string | null
  jobtitle: string | null
  twitter: string | null
  linkedin: string | null
}

export default function ProfileForm({ user }: { user: User }) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Avatar upload state
  const [avatarUrl, setAvatarUrl] = useState(user.image || '')
  const [avatarPreview, setAvatarPreview] = useState(user.image || '')
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  // Upload avatar image — generates a temp blob URL for preview, swaps to
  // the real server URL on success, and always revokes the blob URL to
  // avoid memory leaks.
  async function handleAvatarSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const prevUrl = avatarUrl
    const prevPreview = avatarPreview
    const tempUrl = URL.createObjectURL(file)
    setAvatarPreview(tempUrl)
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (data.success) {
        setAvatarUrl(data.url)
        setAvatarPreview(data.url)
      } else {
        setError(data.error || 'Avatar upload failed')
        setAvatarUrl(prevUrl)
        setAvatarPreview(prevPreview)
      }
    } catch {
      setError('Avatar upload failed — please try again')
      setAvatarUrl(prevUrl)
      setAvatarPreview(prevPreview)
    } finally {
      setUploading(false)
      URL.revokeObjectURL(tempUrl)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)

    const fd = new FormData(e.currentTarget)
    const body = {
      name:     fd.get('name') as string,
      bio:      fd.get('bio') as string,
      jobtitle: fd.get('jobtitle') as string,
      twitter:  fd.get('twitter') as string,
      linkedin: fd.get('linkedin') as string,
      image:    avatarUrl,
    }

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok && res.status >= 500) {
        setError('Server error — please try again')
        return
      }

      const data = await res.json()
      if (!data.success) {
        setError(data.error || 'Failed to save')
      } else {
        setSuccess(true)
        router.refresh()
      }
    } catch {
      setError('Network error — please try again')
    } finally {
      setSaving(false)
    }
  }

  // Generate initials for avatar placeholder
  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <form onSubmit={handleSubmit} className="profile-form">
      {error   && <div className="form-banner form-banner--error">{error}</div>}
      {success && <div className="form-banner form-banner--ok">Profile saved ✓</div>}

      <div className="profile-grid">

        {/* ── Left — avatar + role badge ── */}
        <div className="profile-left">
          <div className="avatar-wrap">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="avatar-img" />
            ) : (
              <div className="avatar-placeholder">{initials}</div>
            )}
            {uploading && <div className="avatar-uploading">…</div>}
            <button
              type="button"
              className="avatar-change"
              onClick={() => fileRef.current?.click()}
            >
              Change photo
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleAvatarSelect}
          />
          <div className="role-badge">{user.role}</div>
          <p className="profile-email">{user.email}</p>
        </div>

        {/* ── Right — form fields ── */}
        <div className="profile-right">

          <div className="form-card">
            <h3 className="form-card-title">Basic Info</h3>

            <div className="form-field">
              <label htmlFor="name">Display Name *</label>
              <input id="name" name="name" type="text" defaultValue={user.name} required />
            </div>

            <div className="form-field">
              <label htmlFor="jobtitle">Job Title / Company</label>
              <input
                id="jobtitle" name="jobtitle" type="text"
                defaultValue={user.jobtitle || ''}
                placeholder="e.g. Director of RevOps · Northwind Capital"
              />
              <span className="field-hint">Shown below your name on blog posts</span>
            </div>

            <div className="form-field">
              <label htmlFor="bio">Author Bio</label>
              <textarea
                id="bio" name="bio" rows={4}
                defaultValue={user.bio || ''}
                placeholder="Write a short bio that appears at the bottom of every blog post you author…"
              />
            </div>
          </div>

          <div className="form-card">
            <h3 className="form-card-title">Social Links</h3>

            <div className="form-field">
              <label htmlFor="twitter">Twitter / X URL</label>
              <input
                id="twitter" name="twitter" type="url"
                defaultValue={user.twitter || ''}
                placeholder="https://twitter.com/yourhandle"
              />
            </div>

            <div className="form-field">
              <label htmlFor="linkedin">LinkedIn URL</label>
              <input
                id="linkedin" name="linkedin" type="url"
                defaultValue={user.linkedin || ''}
                placeholder="https://linkedin.com/in/yourprofile"
              />
            </div>
          </div>

          <div className="profile-actions">
            <button type="submit" className="btn btn-accent" disabled={saving || uploading}>
              {saving ? 'Saving…' : 'Save Profile'}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .profile-form { display: flex; flex-direction: column; gap: 20px; max-width: 780px; }
        .form-banner {
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          font-size: 0.875rem;
        }
        .form-banner--error { background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; }
        .form-banner--ok    { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
        .profile-grid {
          display: grid;
          grid-template-columns: 180px 1fr;
          gap: 28px;
          align-items: start;
        }
        .profile-left {
          display: flex; flex-direction: column; align-items: center; gap: 12px;
        }
        .avatar-wrap { position: relative; width: 120px; height: 120px; }
        .avatar-img {
          width: 120px; height: 120px; border-radius: 50%;
          object-fit: cover; border: 2px solid var(--border);
        }
        .avatar-placeholder {
          width: 120px; height: 120px; border-radius: 50%;
          background: linear-gradient(135deg, var(--accent-soft), var(--bg-sunken));
          display: flex; align-items: center; justify-content: center;
          font-size: 2rem; font-weight: 700; color: var(--accent);
          border: 2px solid var(--border);
        }
        .avatar-uploading {
          position: absolute; inset: 0; border-radius: 50%;
          background: rgba(0,0,0,0.4); color: #fff;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.8rem;
        }
        .avatar-change {
          font-size: 0.78rem; color: var(--accent); background: none;
          border: none; cursor: pointer; text-decoration: underline; padding: 0;
        }
        .role-badge {
          background: var(--accent-soft); color: var(--accent);
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em;
          padding: 3px 10px; border-radius: 999px; text-transform: uppercase;
        }
        .profile-email { font-size: 0.8rem; color: var(--fg-subtle); text-align: center; }
        .profile-right { display: flex; flex-direction: column; gap: 16px; }
        .form-card {
          background: var(--bg-elevated); border: 1px solid var(--border);
          border-radius: var(--radius-md); padding: 16px;
          display: flex; flex-direction: column; gap: 12px;
        }
        .form-card-title {
          font-size: 0.85rem; font-weight: 600; color: var(--fg);
          text-transform: uppercase; letter-spacing: 0.04em; margin-bottom: 4px;
        }
        .form-field { display: flex; flex-direction: column; gap: 6px; }
        .form-field label { font-size: 0.825rem; font-weight: 500; color: var(--fg-muted); }
        .form-field input, .form-field textarea {
          padding: 9px 12px; border: 1px solid var(--border);
          border-radius: var(--radius-sm); background: var(--bg); color: var(--fg);
          font-size: 0.875rem; font-family: inherit; outline: none; resize: vertical;
          transition: border-color var(--transition-fast);
        }
        .form-field input:focus, .form-field textarea:focus { border-color: var(--accent); }
        .field-hint { font-size: 0.75rem; color: var(--fg-subtle); }
        .profile-actions { display: flex; gap: 12px; }
      `}</style>
    </form>
  )
}
