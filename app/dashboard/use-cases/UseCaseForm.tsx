'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface UseCaseFormProps {
  initialData?: {
    id: string
    title: string
    slug: string
    persona: string
    excerpt: string | null
    content: string
    metric: string | null
    industry: string | null
    teamType: string | null
    status: string
  }
}

const PERSONAS = ['Revenue', 'Customer Success', 'Operations', 'Legal', 'Finance', 'Engineering']
const INDUSTRIES = ['Fintech', 'SaaS', 'Healthcare', 'Logistics', 'Legal', 'Media', 'Manufacturing']
const TEAMS = ['RevOps', 'Support', 'Operations', 'Legal', 'Finance', 'Engineering']

export default function UseCaseForm({ initialData }: UseCaseFormProps) {
  const router = useRouter()
  const isEditing = !!initialData

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    const body = {
      title: fd.get('title') as string,
      slug: fd.get('slug') as string,
      persona: fd.get('persona') as string,
      excerpt: fd.get('excerpt') as string,
      content: fd.get('content') as string,
      metric: fd.get('metric') as string,
      industry: fd.get('industry') as string,
      teamType: fd.get('teamType') as string,
      status: fd.get('status') as string,
    }

    const url = isEditing ? `/api/use-cases/${initialData.id}` : '/api/use-cases'
    const method = isEditing ? 'PUT' : 'POST'

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await res.json()

    if (!data.success) {
      setError(data.error || 'Something went wrong')
      setLoading(false)
      return
    }

    router.push('/dashboard/use-cases')
    router.refresh()
  }

  return (
    <form onSubmit={handleSubmit} className="cms-form">
      {error && <div className="cms-error">{error}</div>}

      <div className="cms-form-grid">
        <div className="cms-form-main">
          <div className="form-field">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              defaultValue={initialData?.title}
              placeholder="Use case title"
              required
              onChange={(e) => {
                if (!isEditing) {
                  const s = document.getElementById('slug') as HTMLInputElement
                  if (s) s.value = generateSlug(e.target.value)
                }
              }}
            />
          </div>

          <div className="form-field">
            <label htmlFor="slug">Slug *</label>
            <input id="slug" name="slug" type="text" defaultValue={initialData?.slug} required />
          </div>

          <div className="form-field">
            <label htmlFor="excerpt">Excerpt</label>
            <textarea id="excerpt" name="excerpt" rows={2} defaultValue={initialData?.excerpt || ''} />
          </div>

          <div className="form-field">
            <label htmlFor="content">Content *</label>
            <textarea
              id="content"
              name="content"
              rows={16}
              defaultValue={initialData?.content}
              required
              className="content-textarea"
              placeholder="Describe the use case in detail…"
            />
          </div>
        </div>

        <div className="cms-form-sidebar">
          <div className="form-card">
            <h3 className="form-card-title">Publish</h3>
            <div className="form-field">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={initialData?.status ?? 'DRAFT'}>
                <option value="DRAFT">Draft</option>
                <option value="PUBLISHED">Published</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-accent" disabled={loading}>
                {loading ? 'Saving…' : isEditing ? 'Update' : 'Create'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => router.back()}>Cancel</button>
            </div>
          </div>

          <div className="form-card">
            <h3 className="form-card-title">Details</h3>
            <div className="form-field">
              <label htmlFor="persona">Persona *</label>
              <select id="persona" name="persona" defaultValue={initialData?.persona ?? ''} required>
                <option value="">Select persona</option>
                {PERSONAS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="metric">Metric</label>
              <input id="metric" name="metric" type="text" defaultValue={initialData?.metric || ''} placeholder="40 min saved per deal" />
            </div>
            <div className="form-field">
              <label htmlFor="industry">Industry</label>
              <select id="industry" name="industry" defaultValue={initialData?.industry ?? ''}>
                <option value="">Select industry</option>
                {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="teamType">Team</label>
              <select id="teamType" name="teamType" defaultValue={initialData?.teamType ?? ''}>
                <option value="">Select team</option>
                {TEAMS.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .cms-form { display: flex; flex-direction: column; gap: 20px; }
        .cms-error { padding: 10px 14px; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; border-radius: var(--radius-sm); font-size: 0.875rem; }
        .cms-form-grid { display: grid; grid-template-columns: 1fr 280px; gap: 24px; align-items: start; }
        .cms-form-main { display: flex; flex-direction: column; gap: 16px; }
        .cms-form-sidebar { display: flex; flex-direction: column; gap: 16px; }
        .form-card { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 16px; display: flex; flex-direction: column; gap: 12px; }
        .form-card-title { font-size: 0.85rem; font-weight: 600; color: var(--fg); text-transform: uppercase; letter-spacing: 0.04em; }
        .form-field { display: flex; flex-direction: column; gap: 6px; }
        .form-field label { font-size: 0.825rem; font-weight: 500; color: var(--fg-muted); }
        .form-field input, .form-field select, .form-field textarea { padding: 9px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--bg); color: var(--fg); font-size: 0.875rem; font-family: inherit; outline: none; transition: border-color var(--transition-fast); resize: vertical; }
        .form-field input:focus, .form-field select:focus, .form-field textarea:focus { border-color: var(--accent); }
        .content-textarea { min-height: 320px; font-family: var(--font-mono); font-size: 0.825rem; }
        .form-actions { display: flex; flex-direction: column; gap: 8px; }
        .form-actions .btn { width: 100%; text-align: center; }
        .form-actions .btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </form>
  )
}
