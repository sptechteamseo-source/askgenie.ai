'use client'

import { useState, useEffect, useRef } from 'react'

interface Category {
  id: string
  name: string
  slug: string
  _count?: { blogs: number }
}

export default function CategoriesClient({ canDelete }: { canDelete: boolean }) {
  const [categories, setCategories] = useState<Category[]>([])
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const slugTouched = useRef(false)

  // Inline edit state
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [editSlug, setEditSlug] = useState('')
  const [editSaving, setEditSaving] = useState(false)

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((d) => d.success && setCategories(d.data))
      .catch(() => setError('Failed to load categories'))
  }, [])

  function generateSlug(value: string) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  function handleNameChange(value: string) {
    setName(value)
    if (!slugTouched.current) setSlug(generateSlug(value))
  }

  function handleSlugChange(value: string) {
    slugTouched.current = true
    setSlug(value)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, slug }),
      })
      if (!res.ok && res.status >= 500) {
        setError('Server error — please try again')
        return
      }
      const data = await res.json()
      if (!data.success) {
        setError(data.error || 'Could not create category')
        return
      }
      setCategories((prev) => [...prev, data.data])
      setName('')
      setSlug('')
      slugTouched.current = false
    } catch {
      setError('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }

  function startEdit(cat: Category) {
    setEditingId(cat.id)
    setEditName(cat.name)
    setEditSlug(cat.slug)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditName('')
    setEditSlug('')
  }

  async function saveEdit(id: string) {
    setEditSaving(true)
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, slug: editSlug }),
      })
      const data = await res.json()
      if (!data.success) {
        alert(data.error || 'Update failed')
        return
      }
      setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...data.data } : c)))
      cancelEdit()
    } catch {
      alert('Network error')
    } finally {
      setEditSaving(false)
    }
  }

  async function handleDelete(id: string, catName: string) {
    if (!confirm(`Delete "${catName}"? This cannot be undone.`)) return
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!data.success) {
        alert(data.error || 'Delete failed')
        return
      }
      setCategories((prev) => prev.filter((c) => c.id !== id))
    } catch {
      alert('Network error')
    }
  }

  return (
    <div className="dash-content">
      {/* Create form */}
      <div className="form-card">
        <h3 className="form-card-title">New Category</h3>
        {error && <div className="cms-error">{error}</div>}
        <form onSubmit={handleCreate} className="inline-form">
          <div className="form-field">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Engineering"
              required
            />
          </div>
          <div className="form-field">
            <label>Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="engineering"
              required
            />
          </div>
          <button type="submit" className="btn btn-accent" disabled={loading}>
            {loading ? 'Adding…' : 'Add'}
          </button>
        </form>
      </div>

      {/* Categories list */}
      <div className="data-table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Slug</th>
              <th>Posts</th>
              <th style={{ width: 1 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr><td colSpan={4} style={{ padding: '20px', textAlign: 'center', color: 'var(--fg-muted)' }}>No categories yet</td></tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id}>
                  {editingId === cat.id ? (
                    <>
                      <td>
                        <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="row-edit-input" />
                      </td>
                      <td>
                        <input type="text" value={editSlug} onChange={(e) => setEditSlug(e.target.value)} className="row-edit-input" />
                      </td>
                      <td>{cat._count?.blogs ?? 0}</td>
                      <td>
                        <div className="row-actions">
                          <button onClick={() => saveEdit(cat.id)} disabled={editSaving} className="action-btn">
                            {editSaving ? '…' : 'Save'}
                          </button>
                          <button onClick={cancelEdit} disabled={editSaving} className="action-btn action-btn--ghost">
                            Cancel
                          </button>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td style={{ fontWeight: 500 }}>{cat.name}</td>
                      <td style={{ color: 'var(--fg-muted)', fontFamily: 'monospace', fontSize: '0.8rem' }}>{cat.slug}</td>
                      <td>{cat._count?.blogs ?? 0}</td>
                      <td>
                        <div className="row-actions">
                          <button onClick={() => startEdit(cat)} className="action-btn">Edit</button>
                          {canDelete && (
                            <button onClick={() => handleDelete(cat.id, cat.name)} className="action-btn action-btn--danger-ghost">
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .dash-content { padding: 28px 32px; display: flex; flex-direction: column; gap: 20px; }
        .form-card { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 20px; display: flex; flex-direction: column; gap: 16px; }
        .form-card-title { font-size: 0.85rem; font-weight: 600; color: var(--fg); text-transform: uppercase; letter-spacing: 0.04em; }
        .inline-form { display: flex; align-items: flex-end; gap: 12px; flex-wrap: wrap; }
        .form-field { display: flex; flex-direction: column; gap: 6px; flex: 1; min-width: 180px; }
        .form-field label { font-size: 0.825rem; font-weight: 500; color: var(--fg-muted); }
        .form-field input { padding: 9px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--bg); color: var(--fg); font-size: 0.875rem; outline: none; }
        .form-field input:focus { border-color: var(--accent); }
        .cms-error { padding: 10px 14px; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; border-radius: var(--radius-sm); font-size: 0.875rem; }
        .data-table-wrap { border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; background: var(--bg-elevated); overflow-x: auto; }
        .data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; min-width: 500px; }
        .data-table th { background: var(--bg-sunken); padding: 10px 16px; text-align: left; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--fg-muted); border-bottom: 1px solid var(--border); white-space: nowrap; }
        .data-table td { padding: 12px 16px; border-bottom: 1px solid var(--border); color: var(--fg); vertical-align: middle; }
        .data-table tr:last-child td { border-bottom: none; }
        .row-edit-input { padding: 6px 10px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--bg); color: var(--fg); font-size: 0.875rem; outline: none; width: 100%; min-width: 140px; }
        .row-edit-input:focus { border-color: var(--accent); }
        .row-actions { display: flex; gap: 6px; flex-wrap: wrap; }
        .action-btn { padding: 4px 12px; border-radius: var(--radius-sm); font-size: 0.8rem; font-weight: 500; cursor: pointer; border: none; background: var(--accent-soft); color: var(--accent); transition: all var(--transition-fast); white-space: nowrap; }
        .action-btn:hover:not(:disabled) { background: var(--accent); color: white; }
        .action-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .action-btn--ghost { background: transparent; color: var(--fg-muted); border: 1px solid var(--border); }
        .action-btn--ghost:hover:not(:disabled) { background: var(--bg-sunken); color: var(--fg); }
        .action-btn--danger-ghost { background: transparent; color: #dc2626; border: 1px solid #fecaca; }
        .action-btn--danger-ghost:hover:not(:disabled) { background: #fef2f2; }
        @media (max-width: 768px) {
          .dash-content { padding: 16px; }
        }
        @media (max-width: 480px) {
          .dash-content { padding: 12px; }
        }
      `}</style>
    </div>
  )
}
