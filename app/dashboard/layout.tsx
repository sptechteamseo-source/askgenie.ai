import type { ReactNode } from 'react'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/dashboard/Sidebar'

// Protect the entire dashboard — redirect to login if not authenticated
export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="dash-layout">
      <Sidebar />

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
        }
      `}</style>
    </div>
  )
}
