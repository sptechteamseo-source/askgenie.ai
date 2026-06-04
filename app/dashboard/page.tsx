import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import DashboardHeader from '@/components/dashboard/Header'
import StatsCard from '@/components/dashboard/StatsCard'
import Link from 'next/link'

// Dashboard overview — fetches live stats from the database
export default async function DashboardPage() {
  const session = await auth()

  // Fetch all stats in parallel
  const [
    totalBlogs,
    totalUseCases,
    totalTestimonials,
    totalUsers,
    publishedBlogs,
    publishedUseCases,
    draftBlogs,
    draftUseCases,
    recentBlogs,
    recentUseCases,
  ] = await Promise.all([
    prisma.blog.count(),
    prisma.usecase.count(),
    prisma.testimonial.count(),
    prisma.users.count(),
    prisma.blog.count({ where: { status: 'published' } }),
    prisma.usecase.count({ where: { status: 'published' } }),
    prisma.blog.count({ where: { status: 'draft' } }),
    prisma.usecase.count({ where: { status: 'draft' } }),

    // 5 most recent blogs
    prisma.blog.findMany({
      take: 5,
      orderBy: { createdat: 'desc' },
      include: { author: { select: { name: true } } },
    }),

    // 5 most recent use cases
    prisma.usecase.findMany({
      take: 5,
      orderBy: { createdat: 'desc' },
      include: { author: { select: { name: true } } },
    }),
  ])

  return (
    <>
      <DashboardHeader
        title={`Welcome back, ${session?.user?.name?.split(' ')[0] || 'there'} 👋`}
        description="Here's a summary of your content"
      />

      <div className="dash-content">
        {/* Stats grid */}
        <section className="dash-section">
          <h2 className="dash-section-title">Overview</h2>
          <div className="stats-grid">
            <StatsCard title="Total Blogs" value={totalBlogs} description={`${publishedBlogs} published`} />
            <StatsCard title="Use Cases" value={totalUseCases} description={`${publishedUseCases} published`} />
            <StatsCard title="Testimonials" value={totalTestimonials} />
            <StatsCard title="Team Members" value={totalUsers} />
            <StatsCard title="Published" value={publishedBlogs + publishedUseCases} accent />
            <StatsCard title="Drafts" value={draftBlogs + draftUseCases} description="Awaiting publish" />
          </div>
        </section>

        {/* Recent activity */}
        <div className="dash-two-col">
          {/* Recent blogs */}
          <section className="dash-section">
            <div className="dash-section-header">
              <h2 className="dash-section-title">Recent Blogs</h2>
              <Link href="/dashboard/blogs/new" className="btn btn-accent dash-new-btn">
                + New Blog
              </Link>
            </div>
            <div className="recent-list">
              {recentBlogs.length === 0 ? (
                <p className="empty-state">No blogs yet. <Link href="/dashboard/blogs/new">Create one.</Link></p>
              ) : (
                recentBlogs.map((blog) => (
                  <Link key={blog.id} href={`/dashboard/blogs/${blog.id}/edit`} className="recent-item">
                    <div className="recent-item-info">
                      <span className="recent-item-title">{blog.title}</span>
                      <span className="recent-item-meta">
                        {blog.author.name} · {new Date(blog.createdat).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`status-badge status-${blog.status.toLowerCase()}`}>
                      {blog.status}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </section>

          {/* Recent use cases */}
          <section className="dash-section">
            <div className="dash-section-header">
              <h2 className="dash-section-title">Recent Use Cases</h2>
              <Link href="/dashboard/use-cases/new" className="btn btn-accent dash-new-btn">
                + New
              </Link>
            </div>
            <div className="recent-list">
              {recentUseCases.length === 0 ? (
                <p className="empty-state">No use cases yet. <Link href="/dashboard/use-cases/new">Create one.</Link></p>
              ) : (
                recentUseCases.map((uc) => (
                  <Link key={uc.id} href={`/dashboard/use-cases/${uc.id}/edit`} className="recent-item">
                    <div className="recent-item-info">
                      <span className="recent-item-title">{uc.title}</span>
                      <span className="recent-item-meta">
                        {uc.persona} · {new Date(uc.createdat).toLocaleDateString()}
                      </span>
                    </div>
                    <span className={`status-badge status-${uc.status.toLowerCase()}`}>
                      {uc.status}
                    </span>
                  </Link>
                ))
              )}
            </div>
          </section>
        </div>
      </div>

      <style>{`
        .dash-content {
          padding: 28px 32px;
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        .dash-section { display: flex; flex-direction: column; gap: 16px; }
        .dash-section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 8px;
        }
        .dash-section-title {
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--fg);
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }
        .dash-new-btn { font-size: 0.8rem; padding: 6px 14px; }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .dash-two-col {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }
        .recent-list {
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          overflow: hidden;
          background: var(--bg-elevated);
        }
        .recent-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          text-decoration: none;
          transition: background var(--transition-fast);
          color: var(--fg);
          gap: 12px;
        }
        .recent-item:last-child { border-bottom: none; }
        .recent-item:hover { background: var(--bg-sunken); }
        .recent-item-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .recent-item-title {
          font-size: 0.875rem;
          font-weight: 500;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .recent-item-meta { font-size: 0.75rem; color: var(--fg-muted); white-space: nowrap; }
        .empty-state { padding: 20px; font-size: 0.875rem; color: var(--fg-muted); }
        .empty-state a { color: var(--accent); }
        .status-badge {
          font-size: 0.7rem;
          font-weight: 600;
          padding: 2px 8px;
          border-radius: 999px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          flex-shrink: 0;
        }
        .status-published { background: #f0fdf4; color: #16a34a; }
        .status-draft { background: var(--bg-sunken); color: var(--fg-muted); }
        .status-archived { background: #fef2f2; color: #dc2626; }

        /* ── Responsive ─────────────────────────────────── */
        @media (max-width: 900px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
          .dash-two-col { grid-template-columns: 1fr; }
        }
        @media (max-width: 768px) {
          .dash-content { padding: 16px; gap: 20px; }
        }
        @media (max-width: 480px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .dash-content { padding: 12px; }
        }
      `}</style>
    </>
  )
}
