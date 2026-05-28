import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardHeader from '@/components/dashboard/Header'
import UserManagement from './UserManagement'

// Only ADMIN can access this page
export default async function UsersPage() {
  const session = await auth()

  if (session?.user?.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { blogs: true, useCases: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <>
      <DashboardHeader
        title="User Management"
        description={`${users.length} team member${users.length !== 1 ? 's' : ''}`}
      />
      <div className="dash-content">
        <UserManagement users={users} currentUserId={session.user.id} />
      </div>
      <style>{`.dash-content { padding: 28px 32px; }`}</style>
    </>
  )
}
