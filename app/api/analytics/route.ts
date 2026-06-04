import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'

// GET /api/analytics — dashboard stats
export async function GET() {
  try {
    await requirePermission('view:analytics')

    // Run all count queries in parallel for speed
    const [
      totalblogs,
      totalusecases,
      totaltestimonials,
      totalauthors,
      publishedblogs,
      publishedusecases,
      draftblogs,
      draftusecases,
      recentblogs,
      recentusecases,
    ] = await Promise.all([
      prisma.blog.count(),
      prisma.usecase.count(),
      prisma.testimonial.count(),
      prisma.users.count({ where: { role: 'author' } }),
      prisma.blog.count({ where: { status: 'published' } }),
      prisma.usecase.count({ where: { status: 'published' } }),
      prisma.blog.count({ where: { status: 'draft' } }),
      prisma.usecase.count({ where: { status: 'draft' } }),

      // Last 6 months of blog activity
      prisma.blog.findMany({
        where: {
          createdat: {
            gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          },
        },
        select: { createdat: true, status: true },
        orderBy: { createdat: 'asc' },
      }),

      // Last 6 months of use case activity
      prisma.usecase.findMany({
        where: {
          createdat: {
            gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          },
        },
        select: { createdat: true, status: true },
        orderBy: { createdat: 'asc' },
      }),
    ])

    // Build monthly activity chart data
    const monthlyActivity = buildMonthlyData([...recentblogs, ...recentusecases])

    return Response.json({
      success: true,
      data: {
        stats: {
          totalblogs,
          totalusecases,
          totaltestimonials,
          totalauthors,
          publishedcontent: publishedblogs + publishedusecases,
          draftcontent: draftblogs + draftusecases,
        },
        charts: {
          publishedVsDraft: [
            { label: 'Published', value: publishedblogs + publishedusecases },
            { label: 'Draft', value: draftblogs + draftusecases },
          ],
          monthlyActivity,
        },
      },
    })
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return Response.json({ success: false, error: 'Please log in' }, { status: 401 })
    }
    return Response.json({ success: false, error: 'Failed to fetch analytics' }, { status: 500 })
  }
}

// Group items by month (last 6 months)
function buildMonthlyData(items: { createdat: Date }[]) {
  const months: Record<string, number> = {}

  // Pre-populate last 6 months with 0
  for (let i = 5; i >= 0; i--) {
    const d = new Date()
    d.setMonth(d.getMonth() - i)
    const key = d.toLocaleString('default', { month: 'short', year: '2-digit' })
    months[key] = 0
  }

  // Count items per month
  for (const item of items) {
    const key = new Date(item.createdat).toLocaleString('default', {
      month: 'short',
      year: '2-digit',
    })
    if (key in months) {
      months[key]++
    }
  }

  return Object.entries(months).map(([month, count]) => ({ month, count }))
}
