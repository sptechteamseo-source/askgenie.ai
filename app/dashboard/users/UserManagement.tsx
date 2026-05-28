'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: Date
  _count: { blogs: number; useCases: number }
}

const ROLE_COLORS: Record<string, string> = {
  ADMIN: '#7c3aed',
  EDITOR: '#2563eb',
  AUTHOR: '#059669',
}

export default function UserManagement({
  users: initialUsers,
  currentUserId,
}: {
  users: User[]
  currentUserId: string
}) {
  const router = useRouter()
  const [users, setUsers] = useState(initialUsers)
  const [showForm, setShowForm] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (!data.success) {
      setError(data.error)
      setLoading(false)
      return
    }

    setShowForm(false)
    setLoading(false)
    router.refresh()
  }

  async function handleRoleChange(userId: string, newRole: string) {
    await fetch(`/api/users/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: newRole }),
    })
    router.refresh()
  }

  async function handleDelete(userId: string) {
    if (!confirm('Delete this user? This cannot be undone.')) return

    const res = await fetch(`/api/users/${userId}`, { method: 'DELETE' })
    const data = await res.json()

    if (!data.success) {
      alert(data.error)
      return
    }

    router.refresh()
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
                <select name="role" defaultValue="AUTHOR">
                  <option value="AUTHOR">Author</option>
                  <option value="EDITOR">Editor</option>
                  <option value="ADMIN">Admin</option>
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
                    <option value="AUTHOR">Author</option>
                    <option value="EDITOR">Editor</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td>
                  {user._count.blogs} blog{user._count.blogs !== 1 ? 's' : ''},{' '}
                  {user._count.useCases} use case{user._count.useCases !== 1 ? 's' : ''}
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  {user.id !== currentUserId && (
                    <button
                      className="action-btn action-btn--danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      Remove
                    </button>
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
        .data-table-wrap { border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; background: var(--bg-elevated); }
        .data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        .data-table th { background: var(--bg-sunken); padding: 10px 16px; text-align: left; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--fg-muted); border-bottom: 1px solid var(--border); }
        .data-table td { padding: 12px 16px; border-bottom: 1px solid var(--border); color: var(--fg); vertical-align: middle; }
        .data-table tr:last-child td { border-bottom: none; }
        .data-table tr:hover td { background: var(--bg-sunken); }
        .user-cell { display: flex; align-items: center; gap: 10px; }
        .user-avatar { width: 32px; height: 32px; border-radius: 50%; font-size: 0.75rem; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
        .user-name { font-weight: 500; display: flex; align-items: center; gap: 6px; }
        .user-email { font-size: 0.75rem; color: var(--fg-muted); }
        .you-badge { font-size: 0.65rem; background: var(--accent-soft); color: var(--accent); padding: 1px 6px; border-radius: 999px; font-weight: 600; }
        .role-select { padding: 4px 8px; font-size: 0.8rem; }
        .action-btn { padding: 4px 12px; border-radius: var(--radius-sm); font-size: 0.8rem; font-weight: 500; cursor: pointer; border: none; transition: all var(--transition-fast); }
        .action-btn--danger { background: #fef2f2; color: #dc2626; }
        .action-btn--danger:hover { background: #dc2626; color: white; }
      `}</style>
    </div>
  )
}
