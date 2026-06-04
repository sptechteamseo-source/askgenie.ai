import { prisma } from '@/lib/prisma'
import DashboardHeader from '@/components/dashboard/Header'
import BlogForm from '../BlogForm'

export default async function NewBlogPage() {
  // Load categories for the dropdown
  const categories = await prisma.blogcategory.findMany({
    orderBy: { name: 'asc' },
  })

  return (
    <>
      <DashboardHeader title="New Blog" description="Write and publish a new blog post" />
      <div className="dash-content">
        <BlogForm categories={categories} />
      </div>
      <style>{`.dash-content { padding: 28px 32px; }`}</style>
    </>
  )
}
