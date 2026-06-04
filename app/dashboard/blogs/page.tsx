import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import DashboardHeader from '@/components/dashboard/Header'
import DeleteButton from '@/components/dashboard/DeleteButton'
import Link from 'next/link'

export default async function BlogsPage() {
  const session = await auth()

  const blogs = await prisma.blog.findMany({
    where: session?.user?.role === 'author'
      ? { authorid: session.user.id }
      : {},
    include: {
      author:   { select: { id: true, name: true } },
      category: { select: { name: true } },
    },
    orderBy: { updatedat: 'desc' },
  })

  const isAdmin = session?.user?.role === 'admin'

  return (
    <>
      <DashboardHeader
        title="Blogs"
        description={`${blogs.length} post${blogs.length !== 1 ? 's' : ''} total`}
      />

      <div className="dash-content">
        {/* Toolbar */}
        <div className="list-toolbar">
          <Link href="/dashboard/blogs/new" className="btn btn-accent">
            + New Blog
          </Link>
        </div>

        {/* Empty state */}
        {blogs.length === 0 ? (
          <div className="empty-box">
            <p>No blogs yet.</p>
            <Link href="/dashboard/blogs/new" className="btn btn-accent" style={{ marginTop: '12px' }}>
              Create your first blog
            </Link>
          </div>
        ) : (
          <>
            {/* ── Desktop table ── */}
            <div className="data-table-wrap table-desktop">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {blogs.map((blog) => (
                    <tr key={blog.id}>
                      <td>
                        <div className="table-title">{blog.title}</div>
                        <div className="table-slug">/{blog.slug}</div>
                      </td>
                      <td>{blog.author.name}</td>
                      <td>{blog.category?.name ?? '—'}</td>
                      <td>
                        <span className={`status-badge status-${blog.status.toLowerCase()}`}>
                          {blog.status}
                        </span>
                      </td>
                      <td className="col-date">{new Date(blog.updatedat).toLocaleDateString()}</td>
                      <td>
                        <div className="table-actions">
                          <Link href={`/dashboard/blogs/${blog.id}/edit`} className="action-btn">
                            Edit
                          </Link>
                          <Link href={`/blog/${blog.slug}`} target="_blank" className="action-btn action-btn--ghost">
                            View
                          </Link>
                          {isAdmin && (
                            <DeleteButton id={blog.id} apiPath="blogs" />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── Mobile cards ── */}
            <div className="card-list table-mobile">
              {blogs.map((blog) => (
                <div key={blog.id} className="blog-card">
                  <div className="blog-card-top">
                    <div className="blog-card-info">
                      <div className="table-title">{blog.title}</div>
                      <div className="table-slug">/{blog.slug}</div>
                    </div>
                    <span className={`status-badge status-${blog.status.toLowerCase()}`}>
                      {blog.status}
                    </span>
                  </div>
                  <div className="blog-card-meta">
                    <span>{blog.author.name}</span>
                    {blog.category && <span> · {blog.category.name}</span>}
                    <span> · {new Date(blog.updatedat).toLocaleDateString()}</span>
                  </div>
                  <div className="table-actions">
                    <Link href={`/dashboard/blogs/${blog.id}/edit`} className="action-btn">Edit</Link>
                    <Link href={`/blog/${blog.slug}`} target="_blank" className="action-btn action-btn--ghost">View</Link>
                    {isAdmin && <DeleteButton id={blog.id} apiPath="blogs" />}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <TableStyles />
    </>
  )
}

function TableStyles() {
  return (
    <style>{`
      .dash-content { padding: 28px 32px; display: flex; flex-direction: column; gap: 20px; }
      .list-toolbar { display: flex; justify-content: flex-end; }

      .empty-box {
        text-align: center;
        padding: 60px 20px;
        border: 1px dashed var(--border);
        border-radius: var(--radius-md);
        color: var(--fg-muted);
        display: flex;
        flex-direction: column;
        align-items: center;
      }

      /* ── Desktop table ── */
      .table-mobile { display: none; }
      .data-table-wrap {
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        overflow: hidden;
        background: var(--bg-elevated);
        overflow-x: auto;
      }
      .data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; min-width: 580px; }
      .data-table th {
        background: var(--bg-sunken);
        padding: 10px 16px;
        text-align: left;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        color: var(--fg-muted);
        border-bottom: 1px solid var(--border);
        white-space: nowrap;
      }
      .data-table td {
        padding: 12px 16px;
        border-bottom: 1px solid var(--border);
        color: var(--fg);
        vertical-align: middle;
      }
      .data-table tr:last-child td { border-bottom: none; }
      .data-table tr:hover td { background: var(--bg-sunken); }

      .table-title { font-weight: 500; }
      .table-slug { font-size: 0.75rem; color: var(--fg-muted); margin-top: 2px; }
      .col-date { white-space: nowrap; }

      .table-actions { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }

      /* Shared action button styles used by DeleteButton too */
      .action-btn {
        padding: 4px 12px;
        border-radius: var(--radius-sm);
        font-size: 0.8rem;
        font-weight: 500;
        text-decoration: none;
        background: var(--accent-soft);
        color: var(--accent);
        transition: all var(--transition-fast);
        white-space: nowrap;
        border: none;
        cursor: pointer;
        display: inline-flex;
        align-items: center;
      }
      .action-btn:hover { background: var(--accent); color: white; }
      .action-btn--ghost {
        background: transparent;
        color: var(--fg-muted);
        border: 1px solid var(--border);
      }
      .action-btn--ghost:hover { background: var(--bg-sunken); color: var(--fg); }

      .status-badge {
        font-size: 0.7rem;
        font-weight: 600;
        padding: 2px 8px;
        border-radius: 999px;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        white-space: nowrap;
        flex-shrink: 0;
      }
      .status-published { background: #f0fdf4; color: #16a34a; }
      .status-draft { background: var(--bg-sunken); color: var(--fg-muted); border: 1px solid var(--border); }
      .status-archived { background: #fef2f2; color: #dc2626; }

      /* ── Mobile cards ────────────────────────────────── */
      .card-list { display: flex; flex-direction: column; gap: 12px; }
      .blog-card {
        background: var(--bg-elevated);
        border: 1px solid var(--border);
        border-radius: var(--radius-md);
        padding: 14px 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .blog-card-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 10px;
      }
      .blog-card-info { min-width: 0; flex: 1; }
      .blog-card-meta { font-size: 0.78rem; color: var(--fg-muted); }

      /* ── Responsive breakpoints ──────────────────────── */
      @media (max-width: 768px) {
        .dash-content { padding: 16px; }
        .table-desktop { display: none; }
        .table-mobile  { display: flex; }
      }
      @media (max-width: 480px) {
        .dash-content { padding: 12px; }
      }
    `}</style>
  )
}
