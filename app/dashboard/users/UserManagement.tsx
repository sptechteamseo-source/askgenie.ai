'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import DeleteButton from '@/components/dashboard/DeleteButton'

interface User {
  id: string
  name: string
  email: string
  role: string
  createdat: Date
  _count: { blogs: number; usecases: number }
}

const ROLE_COLORS: Record<string, string> = {
  admin: '#7c3aed',
  editor: '#2563eb',
  author: '#059669',
}

export default function UserManagement({
  users,
  currentUserId,
}: {
  users: User[]
  currentUserId: string
}) {
  const router = useRouter()
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // Per-row role-change error so we can surface failures
  const [roleError, setRoleError] = useState<{ id: string; msg: string } | null>(null)

  async function handleCreateUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    const body = {
      name: fd.get('name'),
      email: fd.get('email'),
      password: fd.get('password'),
      role: fd.get('role'),
    }

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok && res.status >= 500) {
        setError('Server error — please try again')
        return
      }

      const data = await res.json()
      if (!data.success) {
        setError(data.error || 'Could not create user')
        return
      }

      setShowForm(false)
      router.refresh()
    } catch {
      setError('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }

  async function handleRoleChange(userId: string, newRole: string) {
    setRoleError(null)
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      const data = await res.json()
      if (!data.success) {
        setRoleError({ id: userId, msg: data.error || 'Could not change role' })
        // Refresh anyway to reset the dropdown to the actual DB value
        router.refresh()
        return
      }
      router.refresh()
    } catch {
      setRoleError({ id: userId, msg: 'Network error — please try again' })
    }
  }

  return (
    <div className="user-mgmt">
      {/* Toolbar */}
      <div className="list-toolbar">
        <button className="btn btn-accent" onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : '+ Invite User'}
        </button>
      </div>

      {/* Create user form */}
      {showForm && (
        <div className="invite-form-card">
          <h3 className="form-card-title">Invite New User</h3>
          {error && <div className="cms-error">{error}</div>}
          <form onSubmit={handleCreateUser} className="invite-form">
            <div className="form-row">
              <div className="form-field">
                <label>Name</label>
                <input name="name" type="text" required placeholder="Jane Smith" />
              </div>
              <div className="form-field">
                <label>Email</label>
                <input name="email" type="email" required placeholder="jane@company.com" />
              </div>
            </div>
            <div className="form-row">
              <div className="form-field">
                <label>Password</label>
                <input name="password" type="password" required minLength={8} placeholder="Min 8 characters" />
              </div>
              <div className="form-field">
                <label>Role</label>
                <select name="role" defaultValue="author">
                  <option value="author">Author</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-accent" disabled={loading}>
              {loading ? 'Creating…' : 'Create User'}
            </button>
          </form>
        </div>
      )}

      {/* Users table */}
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Content</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-avatar" style={{ background: ROLE_COLORS[user.role] + '20', color: ROLE_COLORS[user.role] }}>
                      {user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="user-name">
                        {user.name}
                        {user.id === currentUserId && <span className="you-badge">You</span>}
                      </div>
                      <div className="user-email">{user.email}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={user.id === currentUserId}
                    className="role-select"
                  >
                    <option value="author">Author</option>
                    <option value="editor">Editor</option>
                    <option value="admin">Admin</option>
                  </select>
                  {roleError?.id === user.id && (
                    <div className="role-err">{roleError.msg}</div>
                  )}
                </td>
                <td>
                  {user._count.blogs} blog{user._count.blogs !== 1 ? 's' : ''},{' '}
                  {user._count.usecases} use case{user._count.usecases !== 1 ? 's' : ''}
                </td>
                <td>{new Date(user.createdat).toLocaleDateString()}</td>
                <td>
                  {user.id !== currentUserId && (
                    <DeleteButton id={user.id} apiPath="users" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <style>{`
        .user-mgmt { display: flex; flex-direction: column; gap: 20px; }
        .list-toolbar { display: flex; justify-content: flex-end; }
        .invite-form-card { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 20px; display: flex; flex-direction: column; gap: 16px; }
        .form-card-title { font-size: 0.85rem; font-weight: 600; color: var(--fg); text-transform: uppercase; letter-spacing: 0.04em; }
        .invite-form { display: flex; flex-direction: column; gap: 12px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .form-field { display: flex; flex-direction: column; gap: 6px; }
        .form-field label { font-size: 0.825rem; font-weight: 500; color: var(--fg-muted); }
        .form-field input, .form-field select, .role-select { padding: 9px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--bg); color: var(--fg); font-size: 0.875rem; font-family: inherit; outline: none; }
        .form-field input:focus, .role-select:focus { border-color: var(--accent); }
        .cms-error { padding: 10px 14px; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; border-radius: var(--radius-sm); font-size: 0.875rem; }
        .role-err { font-size: 0.72rem; color: #dc2626; margin-top: 4px; }
        .data-table-wrap { border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; background: var(--bg-elevated); overflow-x: auto; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; min-width: 480px; }
        .data-table th { background: var(--bg-sunken); padding: 10px 16px; text-align: left; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--fg-muted); border-bottom: 1px solid var(--border); white-space: nowrap; }
        .data-table td { padding: 12px 16px; border-bottom: 1px solid var(--border); color: var(--fg); vertical-align: middle; }
        .data-table tr:last-child td { border-bottom: none; }
        .data-table tr:hover td { background: var(--bg-sunken); }
        .user-cell { display: flex; align-items: center; gap: 10px; }
        .user-avatar { width: 32px; height: 32px; border-radius: 50%; font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .user-name { font-weight: 500; display: flex; align-items: center; gap: 6px; }
        .user-email { font-size: 0.75rem; color: var(--fg-muted); }
        .you-badge { font-size: 0.65rem; background: var(--accent-soft); color: var(--accent); padding: 1px 6px; border-radius: 999px; font-weight: 600; }
        .role-select { padding: 4px 8px; font-size: 0.8rem; }
        @media (max-width: 768px) {
          .form-row { grid-template-columns: 1fr; }
          .dash-content { padding: 16px !important; }
        }
        @media (max-width: 480px) {
          .dash-content { padding: 12px !important; }
        }
      `}</style>
    </div>
  )
}
