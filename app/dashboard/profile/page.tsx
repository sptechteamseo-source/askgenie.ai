import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import PageHeader from '@/components/dashboard/PageHeader'
import ProfileForm from './ProfileForm'

export default async function ProfilePage() {
  const session = await auth()
  if (!session?.user) redirect('/login')

  const user = await prisma.users.findUnique({
    where: { id: session.user.id },
    select: {
      id: true, name: true, email: true, role: true,
      image: true, bio: true, jobtitle: true, twitter: true, linkedin: true,
    },
  })

  if (!user) redirect('/login')

  return (
    <>
      <PageHeader
        title="My Profile"
        description="Update your author bio, photo, and social links — shown on blog posts"
      />
      <div className="dash-content">
        <ProfileForm user={user} />
      </div>
      <style>{`.dash-content { padding: 28px 32px; }`}</style>
    </>
  )
}
