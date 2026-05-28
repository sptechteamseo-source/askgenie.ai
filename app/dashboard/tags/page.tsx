'use client'

import { useState, useEffect } from 'react'
import PageHeader from '@/components/dashboard/PageHeader'

export default function TagsPage() {
  const [tags, setTags] = useState<any[]>([])
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/tags')
      .then((r) => r.json())
      .then((d) => d.success && setTags(d.data))
  }, [])

  function generateSlug(name: string) {
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/tags', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug }),
    })

    const data = await res.json()

    if (!data.success) {
      setError(data.error)
      setLoading(false)
      return
    }

    setTags((prev) => [...prev, data.data])
    setName('')
    setSlug('')
    setLoading(false)
  }

  return (
    <>
      <PageHeader title="Tags" description="Label blog posts with tags" />

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
                onChange={(e) => {
                  setName(e.target.value)
                  setSlug(generateSlug(e.target.value))
                }}
                placeholder="RAG"
                required
              />
            </div>
            <div className="form-field">
              <label>Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="rag"
                required
              />
            </div>
            <button type="submit" className="btn btn-accent" disabled={loading}>
              {loading ? 'Adding…' : 'Add'}
            </button>
          </form>
        </div>

        <div className="tags-cloud">
          {tags.length === 0 ? (
            <p style={{ color: 'var(--fg-muted)', fontSize: '0.875rem' }}>No tags yet</p>
          ) : (
            tags.map((tag: any) => (
              <div key={tag.id} className="tag-chip">
                <span className="tag-name">{tag.name}</span>
                <span className="tag-count">{tag._count?.posts ?? 0}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        .dash-content { padding: 28px 32px; display: flex; flex-direction: column; gap: 20px; }
        .form-card { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 20px; display: flex; flex-direction: column; gap: 16px; }
        .form-card-title { font-size: 0.85rem; font-weight: 600; color: var(--fg); text-transform: uppercase; letter-spacing: 0.04em; }
        .inline-form { display: flex; align-items: flex-end; gap: 12px; }
        .form-field { display: flex; flex-direction: column; gap: 6px; flex: 1; }
        .form-field label { font-size: 0.825rem; font-weight: 500; color: var(--fg-muted); }
        .form-field input { padding: 9px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--bg); color: var(--fg); font-size: 0.875rem; outline: none; }
        .form-field input:focus { border-color: var(--accent); }
        .cms-error { padding: 10px 14px; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; border-radius: var(--radius-sm); font-size: 0.875rem; }
        .tags-cloud { display: flex; flex-wrap: wrap; gap: 8px; }
        .tag-chip {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: 999px;
          font-size: 0.85rem;
        }
        .tag-name { font-weight: 500; color: var(--fg); }
        .tag-count { font-size: 0.75rem; background: var(--accent-soft); color: var(--accent); padding: 1px 6px; border-radius: 999px; }
      `}</style>
    </>
  )
}
