'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface TestimonialFormProps {
  initialData?: {
    id: string
    quote: string
    authorname: string
    authorrole: string | null
    company: string | null
    initials: string | null
    seats: string | null
    status: string
    order: number
  }
}

export default function TestimonialForm({ initialData }: TestimonialFormProps) {
  const router = useRouter()
  const isEditing = !!initialData
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const fd = new FormData(e.currentTarget)
    const body = {
      quote: fd.get('quote') as string,
      authorname: fd.get('authorname') as string,
      authorrole: fd.get('authorrole') as string,
      company: fd.get('company') as string,
      initials: fd.get('initials') as string,
      seats: fd.get('seats') as string,
      status: fd.get('status') as string,
      order: Number(fd.get('order') || 0),
    }

    const url = isEditing ? `/api/testimonials/${initialData.id}` : '/api/testimonials'
    const method = isEditing ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!res.ok && res.status >= 500) {
        setError('Server error — please try again')
        setLoading(false)
        return
      }

      const data = await res.json()

      if (!data.success) {
        setError(data.error || 'Something went wrong')
        setLoading(false)
        return
      }

      router.push('/dashboard/testimonials')
      router.refresh()
    } catch {
      setError('Network error — please try again')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="cms-form">
      {error && <div className="cms-error">{error}</div>}

      <div className="cms-form-grid">
        <div className="cms-form-main">
          <div className="form-field">
            <label htmlFor="quote">Quote *</label>
            <textarea
              id="quote"
              name="quote"
              rows={4}
              defaultValue={initialData?.quote}
              placeholder="What the customer said…"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="authorname">Author name *</label>
              <input id="authorname" name="authorname" type="text" defaultValue={initialData?.authorname} required />
            </div>
            <div className="form-field">
              <label htmlFor="initials">Initials (avatar)</label>
              <input id="initials" name="initials" type="text" defaultValue={initialData?.initials || ''} maxLength={3} placeholder="JD" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-field">
              <label htmlFor="authorrole">Role</label>
              <input id="authorrole" name="authorrole" type="text" defaultValue={initialData?.authorrole || ''} placeholder="Head of RevOps" />
            </div>
            <div className="form-field">
              <label htmlFor="company">Company</label>
              <input id="company" name="company" type="text" defaultValue={initialData?.company || ''} placeholder="Acme Corp" />
            </div>
          </div>

          <div className="form-field">
            <label htmlFor="seats">Seats / size</label>
            <input id="seats" name="seats" type="text" defaultValue={initialData?.seats || ''} placeholder="800 seats" />
          </div>
        </div>

        <div className="cms-form-sidebar">
          <div className="form-card">
            <h3 className="form-card-title">Publish</h3>
            <div className="form-field">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={initialData?.status ?? 'draft'}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="form-field">
              <label htmlFor="order">Display order</label>
              <input id="order" name="order" type="number" defaultValue={initialData?.order ?? 0} min={0} />
            </div>
            <div className="form-actions">
              <button type="submit" className="btn btn-accent" disabled={loading}>
                {loading ? 'Saving…' : isEditing ? 'Update' : 'Create'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => router.back()}>Cancel</button>
              {/* Delete is handled from the testimonials list page via <DeleteButton />. */}
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
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .form-field { display: flex; flex-direction: column; gap: 6px; }
        .form-field label { font-size: 0.825rem; font-weight: 500; color: var(--fg-muted); }
        .form-field input, .form-field select, .form-field textarea { padding: 9px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--bg); color: var(--fg); font-size: 0.875rem; font-family: inherit; outline: none; transition: border-color var(--transition-fast); resize: vertical; }
        .form-field input:focus, .form-field select:focus, .form-field textarea:focus { border-color: var(--accent); }
        .form-actions { display: flex; flex-direction: column; gap: 8px; }
        .form-actions .btn { width: 100%; text-align: center; }
        .form-actions .btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
    </form>
  )
}
