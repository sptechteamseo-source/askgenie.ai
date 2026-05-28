import DashboardHeader from '@/components/dashboard/Header'
import UseCaseForm from '../UseCaseForm'

export default function NewUseCasePage() {
  return (
    <>
      <DashboardHeader title="New Use Case" description="Create a new use case" />
      <div className="dash-content">
        <UseCaseForm />
      </div>
      <style>{`.dash-content { padding: 28px 32px; }`}</style>
    </>
  )
}
