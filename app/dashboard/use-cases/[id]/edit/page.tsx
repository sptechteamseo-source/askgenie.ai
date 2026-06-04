import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import DashboardHeader from '@/components/dashboard/Header'
import UseCaseForm from '../../UseCaseForm'

export default async function EditUseCasePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const useCase = await prisma.usecase.findUnique({ where: { id } })

  if (!useCase) notFound()

  return (
    <>
      <DashboardHeader title="Edit Use Case" description={useCase.title} />
      <div className="dash-content">
        <UseCaseForm
          initialData={{
            id:       useCase.id,
            title:    useCase.title,
            slug:     useCase.slug,
            persona:  useCase.persona,
            excerpt:  useCase.excerpt,
            content:  useCase.content,
            pagedata: useCase.pagedata,
            metric:   useCase.metric,
            industry: useCase.industry,
            teamtype: useCase.teamtype,
            status:   useCase.status,
          }}
        />
      </div>
      <style>{`.dash-content { padding: 28px 32px; }`}</style>
    </>
  )
}
