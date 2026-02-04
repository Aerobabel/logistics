import { getContragentById } from '../actions'
import ContragentDetailsClient from '../contragent-details-client'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function ContragentDetailsPage({ params }: PageProps) {
  const { id: paramId } = await params
  const id = Number(paramId)
  const contragent = Number.isNaN(id) ? null : await getContragentById(id)

  if (!contragent) {
    return (
      <div className="p-6">
        <p className="text-slate-500">Контрагент не найден.</p>
      </div>
    )
  }

  return <ContragentDetailsClient contragent={contragent} />
}
