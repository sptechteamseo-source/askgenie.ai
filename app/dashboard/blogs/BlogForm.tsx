'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

interface Category {
  id: string
  name: string
  slug: string
}

interface FaqItem {
  q: string
  a: string
}

interface BlogFormProps {
  initialData?: {
    id: string
    title: string
    slug: string
    excerpt: string | null
    content: string
    coverimage: string | null
    ogimage: string | null
    seotitle: string | null
    seodescription: string | null
    faq: FaqItem[] | null
    tag: string | null
    status: string
    readmin: number
    categoryid: string | null
  }
  categories: Category[]
}

export default function BlogForm({ initialData, categories }: BlogFormProps) {
  const router = useRouter()
  const isEditing = !!initialData

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // ── Cover image state ──
  const [coverImage, setCoverImage] = useState(initialData?.coverimage || '')
  const [coverPreview, setCoverPreview] = useState(initialData?.coverimage || '')
  const [coverUploading, setCoverUploading] = useState(false)
  const [coverError, setCoverError] = useState('')
  const coverRef = useRef<HTMLInputElement>(null)

  // ── OG image state (for social sharing) ──
  const [ogImage, setOgImage] = useState(initialData?.ogimage || '')
  const [ogPreview, setOgPreview] = useState(initialData?.ogimage || '')
  const [ogUploading, setOgUploading] = useState(false)
  const [ogError, setOgError] = useState('')
  const ogRef = useRef<HTMLInputElement>(null)

  // ── FAQ state ──
  const [faqItems, setFaqItems] = useState<FaqItem[]>(initialData?.faq || [])

  // Auto-generate slug from title
  function generateSlug(title: string) {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
  }

  // Generic image uploader (used for both cover + og).
  // Creates an object URL for instant preview, then swaps to the server URL.
  // Always revokes the temporary blob URL to avoid memory leaks.
  async function uploadImage(
    file: File,
    setPreview: (url: string) => void,
    setSaved: (url: string) => void,
    setUploading: (v: boolean) => void,
    setErr: (msg: string) => void,
    current: string
  ) {
    const tempUrl = URL.createObjectURL(file)
    setPreview(tempUrl)
    setErr('')
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      if (!res.ok && res.status >= 500) {
        setErr('Upload failed — server error')
        setPreview(current)
        return
      }
      const data = await res.json()
      if (!data.success) {
        setErr(data.error || 'Upload failed')
        setPreview(current)
        return
      }
      setSaved(data.url)
      setPreview(data.url)
    } catch {
      setErr('Upload failed — please try again')
      setPreview(current)
    } finally {
      setUploading(false)
      // Release the blob URL once preview has been replaced (or restored).
      URL.revokeObjectURL(tempUrl)
    }
  }

  // ── FAQ helpers ──
  function addFaq() { setFaqItems([...faqItems, { q: '', a: '' }]) }
  function removeFaq(i: number) { setFaqItems(faqItems.filter((_, idx) => idx !== i)) }
  function updateFaq(i: number, field: 'q' | 'a', value: string) {
    const copy = [...faqItems]
    copy[i] = { ...copy[i], [field]: value }
    setFaqItems(copy)
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const fd = new FormData(e.currentTarget)

    // Helper: get text field value, return undefined when empty so API stores NULL
    const text = (name: string) => (fd.get(name) as string | null) || undefined

    const body = {
      title:          text('title')!,
      slug:           text('slug')!,
      excerpt:        text('excerpt'),
      content:        text('content')!,
      coverimage:     coverImage  || null,
      ogimage:        ogImage     || null,
      seotitle:       text('seotitle'),
      seodescription: text('seodescription'),
      // Only include FAQ items that have a non-empty question
      faq:            faqItems.filter(f => f.q.trim().length > 0),
      tag:            text('tag'),
      status:         text('status')!,
      readmin:        Number(fd.get('readmin')) || 5,
      categoryid:     text('categoryid'),
    }

    const url    = isEditing ? `/api/blogs/${initialData.id}` : '/api/blogs'
    const method = isEditing ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })

      if (!res.ok && res.status >= 500) {
        setError('Server error — please try again')
        setLoading(false)
        return
      }

      const data = await res.json()

      if (!data.success) { setError(data.error || 'Something went wrong'); setLoading(false); return }
      router.push('/dashboard/blogs')
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

        {/* ── Main content ── */}
        <div className="cms-form-main">
          <div className="form-field">
            <label htmlFor="title">Title *</label>
            <input id="title" name="title" type="text" defaultValue={initialData?.title}
              placeholder="Blog post title" required
              onChange={e => { if (!isEditing) { const s = document.getElementById('slug') as HTMLInputElement; if (s) s.value = generateSlug(e.target.value) } }}
            />
          </div>

          <div className="form-field">
            <label htmlFor="slug">Slug *</label>
            <input id="slug" name="slug" type="text" defaultValue={initialData?.slug} placeholder="url-friendly-slug" required />
          </div>

          <div className="form-field">
            <label htmlFor="excerpt">Excerpt — shown as page subtitle</label>
            <textarea id="excerpt" name="excerpt" rows={2} defaultValue={initialData?.excerpt || ''} placeholder="Short summary shown in blog listing and as the page deck" />
          </div>

          <div className="form-field">
            <label htmlFor="content">Content * — write HTML (h2, h3, p, blockquote, ul, etc.)</label>
            <textarea id="content" name="content" rows={20} defaultValue={initialData?.content}
              placeholder={'<h2>Section heading</h2>\n<p>Paragraph text here...</p>\n<blockquote>A quote</blockquote>'}
              required className="content-textarea"
            />
          </div>
        </div>

        {/* ── Right sidebar ── */}
        <div className="cms-form-sidebar">

          {/* PUBLISH */}
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
            <div className="form-actions">
              <button type="submit" className="btn btn-accent" disabled={loading || coverUploading || ogUploading}>
                {loading ? 'Saving…' : isEditing ? 'Update' : 'Publish'}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => router.back()} disabled={loading}>Cancel</button>
            </div>
          </div>

          {/* COVER IMAGE */}
          <ImageUploadCard
            title="Cover Image"
            hint="Shown on the blog detail page hero"
            preview={coverPreview}
            uploading={coverUploading}
            uploadError={coverError}
            fileRef={coverRef}
            onSelect={f => uploadImage(f, setCoverPreview, setCoverImage, setCoverUploading, setCoverError, coverImage)}
            onRemove={() => { setCoverImage(''); setCoverPreview(''); if (coverRef.current) coverRef.current.value = '' }}
          />

          {/* OG / SOCIAL IMAGE */}
          <ImageUploadCard
            title="Social Share Image"
            hint="Open Graph image for Twitter & LinkedIn previews"
            preview={ogPreview}
            uploading={ogUploading}
            uploadError={ogError}
            fileRef={ogRef}
            onSelect={f => uploadImage(f, setOgPreview, setOgImage, setOgUploading, setOgError, ogImage)}
            onRemove={() => { setOgImage(''); setOgPreview(''); if (ogRef.current) ogRef.current.value = '' }}
          />

          {/* SEO */}
          <div className="form-card">
            <h3 className="form-card-title">SEO & Metadata</h3>

            <div className="form-field">
              <label htmlFor="seotitle">SEO Title</label>
              <input id="seotitle" name="seotitle" type="text"
                defaultValue={initialData?.seotitle || ''}
                placeholder="Leave blank to use post title"
              />
              <span className="field-hint">Shown in browser tab and Google results</span>
            </div>

            <div className="form-field">
              <label htmlFor="seodescription">Meta Description</label>
              <textarea id="seodescription" name="seodescription" rows={3}
                defaultValue={initialData?.seodescription || ''}
                placeholder="Leave blank to use excerpt"
              />
              <span className="field-hint">Google shows ~160 characters</span>
            </div>
          </div>

          {/* DETAILS */}
          <div className="form-card">
            <h3 className="form-card-title">Details</h3>
            <div className="form-field">
              <label htmlFor="tag">Tag</label>
              <input id="tag" name="tag" type="text" defaultValue={initialData?.tag || ''} placeholder="Engineering, Product, Research…" />
            </div>
            <div className="form-field">
              <label htmlFor="readmin">Read time (minutes)</label>
              <input id="readmin" name="readmin" type="number" defaultValue={initialData?.readmin ?? 5} min={1} max={60} />
            </div>
            <div className="form-field">
              <label htmlFor="categoryid">Category</label>
              <select id="categoryid" name="categoryid" defaultValue={initialData?.categoryid || ''}>
                <option value="">No category</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>

        </div>
      </div>

      {/* ── FAQ Editor — full width below the grid ── */}
      <div className="form-card faq-card">
        <div className="faq-header">
          <div>
            <h3 className="form-card-title">FAQ Section</h3>
            <p className="field-hint" style={{ marginTop: 2 }}>These Q&amp;As appear at the bottom of the post with schema markup for Google rich results</p>
          </div>
          <button type="button" className="btn btn-ghost btn-sm" onClick={addFaq}>+ Add Question</button>
        </div>

        {faqItems.length === 0 && (
          <p className="faq-empty">No FAQ items yet — click "Add Question" to add your first one.</p>
        )}

        {faqItems.map((item, i) => (
          <div key={i} className="faq-item-editor">
            <div className="faq-item-top">
              <span className="faq-item-num">Q{i + 1}</span>
              <button type="button" className="faq-remove" onClick={() => removeFaq(i)} title="Remove">✕</button>
            </div>
            <input
              className="faq-q-input"
              value={item.q}
              onChange={e => updateFaq(i, 'q', e.target.value)}
              placeholder="Question"
            />
            <textarea
              className="faq-a-input"
              rows={3}
              value={item.a}
              onChange={e => updateFaq(i, 'a', e.target.value)}
              placeholder="Answer"
            />
          </div>
        ))}
      </div>

      <FormStyles />
    </form>
  )
}

// ── Reusable image upload card ──
function ImageUploadCard({
  title, hint, preview, uploading, uploadError, fileRef, onSelect, onRemove
}: {
  title: string
  hint: string
  preview: string
  uploading: boolean
  uploadError: string
  fileRef: React.RefObject<HTMLInputElement | null>
  onSelect: (file: File) => void
  onRemove: () => void
}) {
  return (
    <div className="form-card">
      <h3 className="form-card-title">{title}</h3>
      <p className="field-hint" style={{ marginTop: -4 }}>{hint}</p>

      {preview ? (
        <div className="image-preview-wrap">
          <img src={preview} alt="Preview" className="image-preview" />
          {uploading && <div className="image-uploading-badge">Uploading…</div>}
          <button type="button" className="image-remove-btn" onClick={onRemove}>✕ Remove</button>
        </div>
      ) : (
        <div className="image-dropzone" onClick={() => fileRef.current?.click()}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
          </svg>
          <span>Click to upload</span>
          <span className="image-hint">JPG, PNG, WebP · max 5 MB</span>
        </div>
      )}

      <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }}
        onChange={e => { const f = e.target.files?.[0]; if (f) onSelect(f) }}
      />
      {uploadError && <p className="upload-error">{uploadError}</p>}
      {preview && !uploading && (
        <button type="button" className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()}>Change image</button>
      )}
    </div>
  )
}

function FormStyles() {
  return (
    <style>{`
      .cms-form { display: flex; flex-direction: column; gap: 20px; }
      .cms-error { padding: 10px 14px; background: #fef2f2; color: #dc2626; border: 1px solid #fecaca; border-radius: var(--radius-sm); font-size: 0.875rem; }
      .cms-form-grid { display: grid; grid-template-columns: 1fr 280px; gap: 24px; align-items: start; }
      .cms-form-main { display: flex; flex-direction: column; gap: 16px; }
      .cms-form-sidebar { display: flex; flex-direction: column; gap: 16px; }
      .form-card { background: var(--bg-elevated); border: 1px solid var(--border); border-radius: var(--radius-md); padding: 16px; display: flex; flex-direction: column; gap: 12px; }
      .form-card-title { font-size: 0.85rem; font-weight: 600; color: var(--fg); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.04em; }
      .form-field { display: flex; flex-direction: column; gap: 6px; }
      .form-field label { font-size: 0.825rem; font-weight: 500; color: var(--fg-muted); }
      .form-field input, .form-field select, .form-field textarea {
        padding: 9px 12px; border: 1px solid var(--border); border-radius: var(--radius-sm);
        background: var(--bg); color: var(--fg); font-size: 0.875rem; font-family: inherit;
        outline: none; transition: border-color var(--transition-fast); resize: vertical;
      }
      .form-field input:focus, .form-field select:focus, .form-field textarea:focus { border-color: var(--accent); }
      .content-textarea { min-height: 380px; font-family: var(--font-mono); font-size: 0.825rem; }
      .field-hint { font-size: 0.75rem; color: var(--fg-subtle); }
      .form-actions { display: flex; flex-direction: column; gap: 8px; }
      .form-actions .btn { width: 100%; text-align: center; }
      .form-actions .btn:disabled { opacity: 0.6; cursor: not-allowed; }
      /* Image upload */
      .image-dropzone { border: 2px dashed var(--border); border-radius: var(--radius-sm); padding: 20px 14px; display: flex; flex-direction: column; align-items: center; gap: 6px; cursor: pointer; color: var(--fg-muted); text-align: center; font-size: 0.825rem; transition: border-color 0.15s, background 0.15s; }
      .image-dropzone:hover { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 5%, transparent); color: var(--fg); }
      .image-hint { font-size: 0.75rem; color: var(--fg-subtle); }
      .image-preview-wrap { position: relative; border-radius: var(--radius-sm); overflow: hidden; border: 1px solid var(--border); }
      .image-preview { width: 100%; height: 130px; object-fit: cover; display: block; }
      .image-uploading-badge { position: absolute; top: 8px; left: 8px; background: rgba(0,0,0,0.7); color: #fff; font-size: 0.75rem; padding: 3px 8px; border-radius: 4px; }
      .image-remove-btn { position: absolute; top: 8px; right: 8px; background: rgba(0,0,0,0.65); color: #fff; border: none; border-radius: 4px; font-size: 0.75rem; padding: 3px 8px; cursor: pointer; transition: background 0.15s; }
      .image-remove-btn:hover { background: #dc2626; }
      .upload-error { font-size: 0.8rem; color: #dc2626; margin: 0; }
      .btn-sm { font-size: 0.8rem; padding: 6px 12px; }
      /* FAQ editor */
      .faq-card { grid-column: 1 / -1; }
      .faq-header { display: flex; justify-content: space-between; align-items: flex-start; }
      .faq-empty { font-size: 0.85rem; color: var(--fg-subtle); text-align: center; padding: 16px 0; }
      .faq-item-editor { border: 1px solid var(--border); border-radius: var(--radius-sm); padding: 12px; display: flex; flex-direction: column; gap: 8px; background: var(--bg); }
      .faq-item-top { display: flex; justify-content: space-between; align-items: center; }
      .faq-item-num { font-size: 0.75rem; font-weight: 700; color: var(--accent); letter-spacing: 0.04em; }
      .faq-remove { background: none; border: none; color: var(--fg-subtle); cursor: pointer; font-size: 0.8rem; padding: 2px 6px; border-radius: 4px; transition: color 0.15s, background 0.15s; }
      .faq-remove:hover { color: #dc2626; background: #fef2f2; }
      .faq-q-input, .faq-a-input { width: 100%; padding: 8px 10px; border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--bg-elevated); color: var(--fg); font-size: 0.85rem; font-family: inherit; outline: none; box-sizing: border-box; }
      .faq-a-input { resize: vertical; min-height: 72px; }
      .faq-q-input:focus, .faq-a-input:focus { border-color: var(--accent); }
    `}</style>
  )
}
