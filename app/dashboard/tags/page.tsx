import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import PageHeader from '@/components/dashboard/PageHeader'
import TagsClient from './TagsClient'
import type { UserRole } from '@/types'

// Server-side role guard
export default async function TagsPage() {
  const session = await auth()
  const role = session?.user?.role as UserRole | undefined

  if (role !== 'admin' && role !== 'editor') {
    redirect('/dashboard')
  }

  return (
    <>
      <PageHeader title="Tags" description="Label blog posts with tags" />
      <TagsClient canDelete={role === 'admin'} />
    </>
  )
}
