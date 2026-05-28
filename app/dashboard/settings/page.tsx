import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import DashboardHeader from '@/components/dashboard/Header'
import SettingsForm from './SettingsForm'
import { prisma } from '@/lib/prisma'

// Only ADMIN can access settings
export default async function SettingsPage() {
  const session = await auth()

  if (session?.user?.role !== 'ADMIN') {
    redirect('/dashboard')
  }

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, image: true },
  })

  return (
    <>
      <DashboardHeader title="Settings" description="Manage your account and CMS settings" />
      <div className="dash-content">
        <SettingsForm currentUser={currentUser!} />
      </div>
      <style>{`.dash-content { padding: 28px 32px; }`}</style>
    </>
  )
}
