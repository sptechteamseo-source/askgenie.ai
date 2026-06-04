import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import PageHeader from '@/components/dashboard/PageHeader'
import CategoriesClient from './CategoriesClient'
import type { UserRole } from '@/types'

// Server-side role guard — only admin/editor can manage categories
export default async function CategoriesPage() {
  const session = await auth()
  const role = session?.user?.role as UserRole | undefined

  if (role !== 'admin' && role !== 'editor') {
    redirect('/dashboard')
  }

  return (
    <>
      <PageHeader title="Categories" description="Organize blog posts into categories" />
      <CategoriesClient canDelete={role === 'admin'} />
    </>
  )
}
