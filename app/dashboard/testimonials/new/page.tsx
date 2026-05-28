import DashboardHeader from '@/components/dashboard/Header'
import TestimonialForm from '../TestimonialForm'

export default function NewTestimonialPage() {
  return (
    <>
      <DashboardHeader title="New Testimonial" description="Add a customer testimonial" />
      <div className="dash-content">
        <TestimonialForm />
      </div>
      <style>{`.dash-content { padding: 28px 32px; }`}</style>
    </>
  )
}
