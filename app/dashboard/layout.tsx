import type { ReactNode } from 'react'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'
import type { UserRole } from '@/types'

// Protect the entire dashboard — redirect to login if not authenticated
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth()

  if (!session?.user) {
    redirect('/login')
  }

  const role = session.user.role as UserRole | undefined

  return (
    <div className="dash-layout">
      <Sidebar role={role} />

      <main className="dash-main">
        {children}
      </main>

      <style>{`
        .dash-layout {
          display: flex;
          min-height: 100vh;
          background: var(--bg);
        }
        .dash-main {
          flex: 1;
          margin-left: 220px;
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          min-width: 0;
        }
        @media (max-width: 768px) {
          .dash-main {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  )
}
