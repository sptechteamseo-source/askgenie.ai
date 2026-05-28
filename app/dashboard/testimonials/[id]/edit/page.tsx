import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import DashboardHeader from '@/components/dashboard/Header'
import TestimonialForm from '../../TestimonialForm'

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const testimonial = await prisma.testimonial.findUnique({ where: { id } })

  if (!testimonial) notFound()

  return (
    <>
      <DashboardHeader title="Edit Testimonial" description={testimonial.authorName} />
      <div className="dash-content">
        <TestimonialForm
          initialData={{
            id: testimonial.id,
            quote: testimonial.quote,
            authorName: testimonial.authorName,
            authorRole: testimonial.authorRole,
            company: testimonial.company,
            initials: testimonial.initials,
            seats: testimonial.seats,
            status: testimonial.status,
            order: testimonial.order,
          }}
        />
      </div>
      <style>{`.dash-content { padding: 28px 32px; }`}</style>
    </>
  )
}
