'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface DeleteButtonProps {
  id: string
  apiPath: string // e.g. 'blogs' | 'use-cases' | 'testimonials'
}

export default function DeleteButton({ id, apiPath }: DeleteButtonProps) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    try {
      const res  = await fetch(`/api/${apiPath}/${id}`, { method: 'DELETE' })
      const json = await res.json()
      if (json.success) {
        router.refresh()
      } else {
        alert(json.error || 'Delete failed')
        setConfirming(false)
      }
    } catch {
      alert('Something went wrong. Please try again.')
      setConfirming(false)
    } finally {
      setLoading(false)
    }
  }

  if (confirming) {
    return (
      <>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="action-btn action-btn--danger"
        >
          {loading ? '…' : 'Confirm'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          disabled={loading}
          className="action-btn action-btn--ghost"
        >
          Cancel
        </button>

        <style>{`
          .action-btn--danger {
            background: #fef2f2;
            color: #dc2626;
            border: 1px solid #fecaca;
            padding: 4px 12px;
            border-radius: var(--radius-sm);
            font-size: 0.8rem;
            font-weight: 500;
            cursor: pointer;
            transition: all var(--transition-fast);
          }
          .action-btn--danger:hover:not(:disabled) { background: #dc2626; color: white; }
          .action-btn--danger:disabled { opacity: 0.6; cursor: not-allowed; }
          .action-btn--ghost {
            background: transparent;
            color: var(--fg-muted);
            border: 1px solid var(--border);
            padding: 4px 12px;
            border-radius: var(--radius-sm);
            font-size: 0.8rem;
            font-weight: 500;
            cursor: pointer;
            transition: all var(--transition-fast);
          }
          .action-btn--ghost:hover:not(:disabled) { background: var(--bg-sunken); color: var(--fg); }
        `}</style>
      </>
    )
  }

  return (
    <>
      <button
        onClick={() => setConfirming(true)}
        className="action-btn action-btn--danger-ghost"
      >
        Delete
      </button>

      <style>{`
        .action-btn--danger-ghost {
          background: transparent;
          color: #dc2626;
          border: 1px solid #fecaca;
          padding: 4px 12px;
          border-radius: var(--radius-sm);
          font-size: 0.8rem;
          font-weight: 500;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .action-btn--danger-ghost:hover { background: #fef2f2; }
      `}</style>
    </>
  )
}
