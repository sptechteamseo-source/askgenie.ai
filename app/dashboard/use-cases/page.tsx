import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import DashboardHeader from '@/components/dashboard/Header'
import Link from 'next/link'

export default async function UseCasesPage() {
  const session = await auth()

  const useCases = await prisma.useCase.findMany({
    where: session?.user?.role === 'AUTHOR' ? { authorId: session.user.id } : {},
    include: { author: { select: { name: true } } },
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <>
      <DashboardHeader
        title="Use Cases"
        description={`${useCases.length} use case${useCases.length !== 1 ? 's' : ''}`}
      />

      <div className="dash-content">
        <div className="list-toolbar">
          <Link href="/dashboard/use-cases/new" className="btn btn-accent">
            + New Use Case
          </Link>
        </div>

        {useCases.length === 0 ? (
          <div className="empty-box">
            <p>No use cases yet.</p>
            <Link href="/dashboard/use-cases/new" className="btn btn-accent" style={{ marginTop: '12px' }}>
              Create your first use case
            </Link>
          </div>
        ) : (
          <div className="data-table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Persona</th>
                  <th>Author</th>
                  <th>Status</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {useCases.map((uc) => (
                  <tr key={uc.id}>
                    <td>
                      <div className="table-title">{uc.title}</div>
                      <div className="table-slug">/{uc.slug}</div>
                    </td>
                    <td>{uc.persona}</td>
                    <td>{uc.author.name}</td>
                    <td>
                      <span className={`status-badge status-${uc.status.toLowerCase()}`}>
                        {uc.status}
                      </span>
                    </td>
                    <td>{new Date(uc.updatedAt).toLocaleDateString()}</td>
                    <td>
                      <div className="table-actions">
                        <Link href={`/dashboard/use-cases/${uc.id}/edit`} className="action-btn">
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <SharedTableStyles />
    </>
  )
}

function SharedTableStyles() {
  return (
    <style>{`
      .dash-content { padding: 28px 32px; display: flex; flex-direction: column; gap: 20px; }
      .list-toolbar { display: flex; justify-content: flex-end; }
      .empty-box { text-align: center; padding: 60px 20px; border: 1px dashed var(--border); border-radius: var(--radius-md); color: var(--fg-muted); display: flex; flex-direction: column; align-items: center; }
      .data-table-wrap { border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden; background: var(--bg-elevated); }
      .data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
      .data-table th { background: var(--bg-sunken); padding: 10px 16px; text-align: left; font-size: 0.75rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--fg-muted); border-bottom: 1px solid var(--border); }
      .data-table td { padding: 12px 16px; border-bottom: 1px solid var(--border); color: var(--fg); vertical-align: middle; }
      .data-table tr:last-child td { border-bottom: none; }
      .data-table tr:hover td { background: var(--bg-sunken); }
      .table-title { font-weight: 500; }
      .table-slug { font-size: 0.75rem; color: var(--fg-muted); margin-top: 2px; }
      .table-actions { display: flex; gap: 8px; }
      .action-btn { padding: 4px 12px; border-radius: var(--radius-sm); font-size: 0.8rem; font-weight: 500; text-decoration: none; background: var(--accent-soft); color: var(--accent); transition: all var(--transition-fast); }
      .action-btn:hover { background: var(--accent); color: white; }
      .status-badge { font-size: 0.7rem; font-weight: 600; padding: 2px 8px; border-radius: 999px; text-transform: uppercase; letter-spacing: 0.05em; }
      .status-published { background: #f0fdf4; color: #16a34a; }
      .status-draft { background: var(--bg-sunken); color: var(--fg-muted); border: 1px solid var(--border); }
      .status-archived { background: #fef2f2; color: #dc2626; }
    `}</style>
  )
}
