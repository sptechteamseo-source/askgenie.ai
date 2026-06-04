import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardHeader from '@/components/dashboard/Header'
import UserManagement from './UserManagement'

// Only admin can access this page
export default async function UsersPage() {
  const session = await auth()

  if (session?.user?.role !== 'admin') {
    redirect('/dashboard')
  }

  const users = await prisma.users.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdat: true,
      _count: { select: { blogs: true, usecases: true } },
    },
    orderBy: { createdat: 'desc' },
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
      <style>{`
        .dash-content { padding: 28px 32px; }
        @media (max-width: 768px) { .dash-content { padding: 16px; } }
        @media (max-width: 480px) { .dash-content { padding: 12px; } }
      `}</style>
    </>
  )
}
