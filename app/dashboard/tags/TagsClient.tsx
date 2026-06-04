'use client'

import { useState, useEffect, useRef } from 'react'

interface Tag {
  id: string
  name: string
  slug: string
  _count?: { posts: number }
}

export default function TagsClient({ canDelete }: { canDelete: boolean }) {
  const [tags, setTags] = useState<Tag[]>([])
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
    fetch('/api/tags')
      .then((r) => r.json())
      .then((d) => d.success && setTags(d.data))
      .catch(() => setError('Failed to load tags'))
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
      const res = await fetch('/api/tags', {
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
        setError(data.error || 'Could not create tag')
        return
      }
      setTags((prev) => [...prev, data.data])
      setName('')
      setSlug('')
      slugTouched.current = false
    } catch {
      setError('Network error — please try again')
    } finally {
      setLoading(false)
    }
  }

  function startEdit(tag: Tag) {
    setEditingId(tag.id)
    setEditName(tag.name)
    setEditSlug(tag.slug)
  }

  function cancelEdit() {
    setEditingId(null)
    setEditName('')
    setEditSlug('')
  }

  async function saveEdit(id: string) {
    setEditSaving(true)
    try {
      const res = await fetch(`/api/tags/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName, slug: editSlug }),
      })
      const data = await res.json()
      if (!data.success) {
        alert(data.error || 'Update failed')
        return
      }
      setTags((prev) => prev.map((t) => (t.id === id ? { ...t, ...data.data } : t)))
      cancelEdit()
    } catch {
      alert('Network error')
    } finally {
      setEditSaving(false)
    }
  }

  async function handleDelete(id: string, tagName: string) {
    if (!confirm(`Delete "${tagName}"? This cannot be undone.`)) return
    try {
      const res = await fetch(`/api/tags/${id}`, { method: 'DELETE' })
      const data = await res.json()
      if (!data.success) {
        alert(data.error || 'Delete failed')
        return
      }
      setTags((prev) => prev.filter((t) => t.id !== id))
    } catch {
      alert('Network error')
    }
  }

  return (
    <div className="dash-content">
      <div className="form-card">
        <h3 className="form-card-title">New Tag</h3>
        {error && <div className="cms-error">{error}</div>}
        <form onSubmit={handleCreate} className="inline-form">
          <div className="form-field">
            <label>Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="RAG"
              required
            />
          </div>
          <div className="form-field">
            <label>Slug</label>
            <input
              type="text"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              placeholder="rag"
              required
            />
          </div>
          <button type="submit" className="btn btn-accent" disabled={loading}>
            {loading ? 'Adding…' : 'Add'}
          </button>
        </form>
      </div>

      <div className="tags-list">
        {tags.length === 0 ? (
          <p style={{ color: 'var(--fg-muted)', fontSize: '0.875rem' }}>No tags yet</p>
        ) : (
          tags.map((tag) => (
            <div key={tag.id} className="tag-row">
              {editingId === tag.id ? (
                <>
                  <input type="text" value={editName} onChange={(e) => setEditName(e.target.value)} className="tag-edit-input" placeholder="Name" />
                  <input type="text" value={editSlug} onChange={(e) => setEditSlug(e.target.value)} className="tag-edit-input" placeholder="slug" />
                  <button onClick={() => saveEdit(tag.id)} disabled={editSaving} className="action-btn">
                    {editSaving ? '…' : 'Save'}
                  </button>
                  <button onClick={cancelEdit} disabled={editSaving} className="action-btn action-btn--ghost">
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div className="tag-chip">
                    <span className="tag-name">{tag.name}</span>
                    <span className="tag-count">{tag._count?.posts ?? 0}</span>
                  </div>
                  <span className="tag-slug">/{tag.slug}</span>
                  <div className="tag-actions">
                    <button onClick={() => startEdit(tag)} className="action-btn">Edit</button>
                    {canDelete && (
                      <button onClick={() => handleDelete(tag.id, tag.name)} className="action-btn action-btn--danger-ghost">
                        Delete
                      </button>
                    )}
                  </div>
                </>
              )}
            </div>
          ))
        )}
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

        .tags-list { display: flex; flex-direction: column; gap: 8px; }
        .tag-row { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); flex-wrap: wrap; }
        .tag-chip { display: flex; align-items: center; gap: 6px; padding: 4px 10px; background: var(--bg); border: 1px solid var(--border); border-radius: 999px; font-size: 0.85rem; }
        .tag-name { font-weight: 500; color: var(--fg); }
        .tag-count { font-size: 0.7rem; background: var(--accent-soft); color: var(--accent); padding: 1px 6px; border-radius: 999px; font-weight: 600; }
        .tag-slug { font-family: monospace; font-size: 0.78rem; color: var(--fg-muted); }
        .tag-actions { display: flex; gap: 6px; margin-left: auto; flex-wrap: wrap; }
        .tag-edit-input { padding: 6px 10px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--bg); color: var(--fg); font-size: 0.85rem; outline: none; flex: 1; min-width: 100px; }
        .tag-edit-input:focus { border-color: var(--accent); }

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
