import { prisma } from '@/lib/prisma'
import { requirePermission } from '@/lib/rbac'

// GET /api/analytics — dashboard stats
export async function GET() {
  try {
    await requirePermission('view:analytics')

    // Run all count queries in parallel for speed
    const [
      totalBlogs,
      totalUseCases,
      totalTestimonials,
      totalAuthors,
      publishedBlogs,
      publishedUseCases,
      draftBlogs,
      draftUseCases,
      recentBlogs,
      recentUseCases,
    ] = await Promise.all([
      prisma.blog.count(),
      prisma.useCase.count(),
      prisma.testimonial.count(),
      prisma.user.count({ where: { role: 'AUTHOR' } }),
      prisma.blog.count({ where: { status: 'PUBLISHED' } }),
      prisma.useCase.count({ where: { status: 'PUBLISHED' } }),
      prisma.blog.count({ where: { status: 'DRAFT' } }),
      prisma.useCase.count({ where: { status: 'DRAFT' } }),

      // Last 6 months of blog activity
      prisma.blog.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          },
        },
        select: { createdAt: true, status: true },
        orderBy: { createdAt: 'asc' },
      }),

      // Last 6 months of use case activity
      prisma.useCase.findMany({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
          },
        },
        select: { createdAt: true, status: true },
        orderBy: { createdAt: 'asc' },
      }),
    ])

    // Build monthly activity chart data
    const monthlyActivity = buildMonthlyData([...recentBlogs, ...recentUseCases])

    return Response.json({
      success: true,
      data: {
        stats: {
          totalBlogs,
          totalUseCases,
          totalTestimonials,
          totalAuthors,
          publishedContent: publishedBlogs + publishedUseCases,
          draftContent: draftBlogs + draftUseCases,
        },
        charts: {
          publishedVsDraft: [
            { label: 'Published', value: publishedBlogs + publishedUseCases },
            { label: 'Draft', value: draftBlogs + draftUseCases },
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
function buildMonthlyData(items: { createdAt: Date }[]) {
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
    const key = new Date(item.createdAt).toLocaleString('default', {
      month: 'short',
      year: '2-digit',
    })
    if (key in months) {
      months[key]++
    }
  }

  return Object.entries(months).map(([month, count]) => ({ month, count }))
}
