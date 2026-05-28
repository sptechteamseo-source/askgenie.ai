import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardHeader from '@/components/dashboard/Header'
import StatsCard from '@/components/dashboard/StatsCard'

// Only ADMIN and EDITOR can view analytics
export default async function AnalyticsPage() {
  const session = await auth()

  if (session?.user?.role === 'AUTHOR') {
    redirect('/dashboard')
  }

  const [
    totalBlogs,
    totalUseCases,
    totalTestimonials,
    publishedBlogs,
    publishedUseCases,
    publishedTestimonials,
    draftBlogs,
    draftUseCases,
    authorCount,
    editorCount,
    adminCount,
    tagCount,
    categoryCount,
  ] = await Promise.all([
    prisma.blog.count(),
    prisma.useCase.count(),
    prisma.testimonial.count(),
    prisma.blog.count({ where: { status: 'PUBLISHED' } }),
    prisma.useCase.count({ where: { status: 'PUBLISHED' } }),
    prisma.testimonial.count({ where: { status: 'PUBLISHED' } }),
    prisma.blog.count({ where: { status: 'DRAFT' } }),
    prisma.useCase.count({ where: { status: 'DRAFT' } }),
    prisma.user.count({ where: { role: 'AUTHOR' } }),
    prisma.user.count({ where: { role: 'EDITOR' } }),
    prisma.user.count({ where: { role: 'ADMIN' } }),
    prisma.blogTag.count(),
    prisma.blogCategory.count(),
  ])

  // Get recent 6 months data for chart
  const sixMonthsAgo = new Date()
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5)
  sixMonthsAgo.setDate(1)
  sixMonthsAgo.setHours(0, 0, 0, 0)

  const recentContent = await prisma.blog.findMany({
    where: { createdAt: { gte: sixMonthsAgo } },
    select: { createdAt: true },
    orderBy: { createdAt: 'asc' },
  })

  // Group by month
  const monthlyMap: Record<string, number> = {}
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const key = d.toLocaleString('default', { month: 'short' })
    monthlyMap[key] = 0
  }
  for (const item of recentContent) {
    const key = new Date(item.createdAt).toLocaleString('default', { month: 'short' })
    if (key in monthlyMap) monthlyMap[key]++
  }

  const chartData = Object.entries(monthlyMap)
  const maxValue = Math.max(...chartData.map(([, v]) => v), 1)

  return (
    <>
      <DashboardHeader title="Analytics" description="Content performance overview" />

      <div className="dash-content">
        {/* Content stats */}
        <section className="dash-section">
          <h2 className="dash-section-title">Content Overview</h2>
          <div className="stats-grid">
            <StatsCard title="Total Blogs" value={totalBlogs} description={`${publishedBlogs} published, ${draftBlogs} drafts`} />
            <StatsCard title="Use Cases" value={totalUseCases} description={`${publishedUseCases} published, ${draftUseCases} drafts`} />
            <StatsCard title="Testimonials" value={totalTestimonials} description={`${publishedTestimonials} published`} />
            <StatsCard title="Published Total" value={publishedBlogs + publishedUseCases + publishedTestimonials} accent />
            <StatsCard title="Categories" value={categoryCount} />
            <StatsCard title="Tags" value={tagCount} />
          </div>
        </section>

        {/* Team stats */}
        <section className="dash-section">
          <h2 className="dash-section-title">Team</h2>
          <div className="stats-grid stats-grid--3">
            <StatsCard title="Authors" value={authorCount} />
            <StatsCard title="Editors" value={editorCount} />
            <StatsCard title="Admins" value={adminCount} />
          </div>
        </section>

        {/* Monthly chart */}
        <section className="dash-section">
          <h2 className="dash-section-title">Blog Activity (last 6 months)</h2>
          <div className="chart-card">
            <div className="bar-chart">
              {chartData.map(([month, count]) => (
                <div key={month} className="bar-col">
                  <div className="bar-value">{count}</div>
                  <div
                    className="bar-fill"
                    style={{ height: `${(count / maxValue) * 100}%` }}
                  />
                  <div className="bar-label">{month}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Published vs Draft breakdown */}
        <section className="dash-section">
          <h2 className="dash-section-title">Published vs Draft</h2>
          <div className="breakdown-card">
            {[
              { label: 'Published Blogs', value: publishedBlogs, total: totalBlogs, color: '#16a34a' },
              { label: 'Published Use Cases', value: publishedUseCases, total: totalUseCases, color: '#2563eb' },
              { label: 'Draft Blogs', value: draftBlogs, total: totalBlogs, color: '#d97706' },
              { label: 'Draft Use Cases', value: draftUseCases, total: totalUseCases, color: '#9333ea' },
            ].map((row) => (
              <div key={row.label} className="breakdown-row">
                <span className="breakdown-label">{row.label}</span>
                <div className="breakdown-bar-wrap">
                  <div
                    className="breakdown-bar-fill"
                    style={{
                      width: row.total > 0 ? `${(row.value / row.total) * 100}%` : '0%',
                      background: row.color,
                    }}
                  />
                </div>
                <span className="breakdown-count">{row.value}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <style>{`
        .dash-content { padding: 28px 32px; display: flex; flex-direction: column; gap: 32px; }
        .dash-section { display: flex; flex-direction: column; gap: 16px; }
        .dash-section-title { font-size: 0.95rem; font-weight: 600; color: var(--fg); text-transform: uppercase; letter-spacing: 0.04em; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
        .stats-grid--3 { grid-template-columns: repeat(3, 1fr); }
        .chart-card {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 24px;
        }
        .bar-chart {
          display: flex;
          align-items: flex-end;
          gap: 12px;
          height: 160px;
        }
        .bar-col {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          flex: 1;
          height: 100%;
          justify-content: flex-end;
        }
        .bar-value { font-size: 0.75rem; font-weight: 600; color: var(--fg-muted); }
        .bar-fill {
          width: 100%;
          background: var(--accent);
          border-radius: 4px 4px 0 0;
          min-height: 4px;
          transition: height 0.3s ease;
        }
        .bar-label { font-size: 0.75rem; color: var(--fg-muted); }
        .breakdown-card {
          background: var(--bg-elevated);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .breakdown-row { display: flex; align-items: center; gap: 12px; }
        .breakdown-label { font-size: 0.875rem; color: var(--fg); min-width: 180px; }
        .breakdown-bar-wrap {
          flex: 1;
          height: 8px;
          background: var(--bg-sunken);
          border-radius: 999px;
          overflow: hidden;
        }
        .breakdown-bar-fill { height: 100%; border-radius: 999px; transition: width 0.3s ease; }
        .breakdown-count { font-size: 0.875rem; font-weight: 600; color: var(--fg); min-width: 30px; text-align: right; }
      `}</style>
    </>
  )
}
