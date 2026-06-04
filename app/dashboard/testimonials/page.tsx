import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import DashboardHeader from '@/components/dashboard/Header'
import DeleteButton from '@/components/dashboard/DeleteButton'
import Link from 'next/link'

export default async function TestimonialsPage() {
  const session = await auth()
  const isAdmin = session?.user?.role === 'admin'

  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ order: 'asc' }, { createdat: 'desc' }],
  })

  return (
    <>
      <DashboardHeader
        title="Testimonials"
        description={`${testimonials.length} testimonial${testimonials.length !== 1 ? 's' : ''}`}
      />

      <div className="dash-content">
        <div className="list-toolbar">
          <Link href="/dashboard/testimonials/new" className="btn btn-accent">
            + New Testimonial
          </Link>
        </div>

        {testimonials.length === 0 ? (
          <div className="empty-box">
            <p>No testimonials yet.</p>
            <Link href="/dashboard/testimonials/new" className="btn btn-accent" style={{ marginTop: '12px' }}>
              Add your first testimonial
            </Link>
          </div>
        ) : (
          <div className="testimonials-grid">
            {testimonials.map((t) => (
              <div key={t.id} className="testimonial-card">
                {/* Header row: avatar + name + status */}
                <div className="testimonial-card-header">
                  <div className="testimonial-avatar">
                    {t.initials || t.authorname.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="testimonial-name-block">
                    <div className="testimonial-author">{t.authorname}</div>
                    <div className="testimonial-meta">
                      {t.authorrole && <span>{t.authorrole}</span>}
                      {t.company && <span> · {t.company}</span>}
                    </div>
                  </div>
                  <span className={`status-badge status-${t.status.toLowerCase()}`}>
                    {t.status}
                  </span>
                </div>

                {/* Quote */}
                <p className="testimonial-quote">&ldquo;{t.quote}&rdquo;</p>

                {/* Footer: seats + actions */}
                <div className="testimonial-card-footer">
                  {t.seats && <span className="testimonial-seats">{t.seats}</span>}
                  <div className="t-actions">
                    <Link href={`/dashboard/testimonials/${t.id}/edit`} className="action-btn">
                      Edit
                    </Link>
                    {isAdmin && (
                      <DeleteButton id={t.id} apiPath="testimonials" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .dash-content { padding: 28px 32px; display: flex; flex-direction: column; gap: 20px; }
        .list-toolbar { display: flex; justify-content: flex-end; }
        .empty-box {
          text-align: center; padding: 60px 20px; border: 1px dashed var(--border);
          border-radius: var(--radius-md); color: var(--fg-muted);
          display: flex; flex-direction: column; align-items: center;
        }

        /* ── Grid ── */
        .testimonials-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 16px;
        }
        .testimonial-card {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .testimonial-card-header {
          display: flex;
          align-items: flex-start;
          gap: 10px;
        }
        .testimonial-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: var(--accent-soft); color: var(--accent);
          font-size: 0.8rem; font-weight: 700;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .testimonial-name-block { flex: 1; min-width: 0; }
        .testimonial-author { font-size: 0.875rem; font-weight: 600; color: var(--fg); }
        .testimonial-meta { font-size: 0.75rem; color: var(--fg-muted); }

        .testimonial-quote {
          font-size: 0.875rem; color: var(--fg-muted);
          line-height: 1.6; font-style: italic; flex: 1;
        }
        .testimonial-card-footer {
          display: flex; align-items: center; gap: 8px; flex-wrap: wrap;
        }
        .testimonial-seats {
          font-size: 0.75rem; color: var(--fg-muted);
          background: var(--bg-sunken); padding: 2px 8px; border-radius: 999px;
        }
        .t-actions {
          display: flex; gap: 6px; align-items: center; margin-left: auto; flex-wrap: wrap;
        }

        /* Shared action btn */
        .action-btn {
          padding: 4px 12px; border-radius: var(--radius-sm); font-size: 0.8rem; font-weight: 500;
          text-decoration: none; background: var(--accent-soft); color: var(--accent);
          transition: all var(--transition-fast); white-space: nowrap; border: none;
          cursor: pointer; display: inline-flex; align-items: center;
        }
        .action-btn:hover { background: var(--accent); color: white; }

        .status-badge {
          font-size: 0.7rem; font-weight: 600; padding: 2px 8px; border-radius: 999px;
          text-transform: uppercase; letter-spacing: 0.05em; flex-shrink: 0; white-space: nowrap;
        }
        .status-published { background: #f0fdf4; color: #16a34a; }
        .status-draft { background: var(--bg-sunken); color: var(--fg-muted); border: 1px solid var(--border); }
        .status-archived { background: #fef2f2; color: #dc2626; }

        /* ── Responsive ── */
        @media (max-width: 768px) {
          .dash-content { padding: 16px; }
          .testimonials-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .dash-content { padding: 12px; }
          .testimonials-grid { gap: 10px; }
        }
      `}</style>
    </>
  )
}
