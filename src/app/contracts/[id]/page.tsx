import { getContractById } from '../actions'
import ContractDetailsClient from '../contract-details-client'

export const dynamic = 'force-dynamic'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function ContractDetailsPage({ params }: PageProps) {
  const { id: paramId } = await params
  const id = Number(paramId)
  const contract = Number.isNaN(id) ? null : await getContractById(id)

  if (!contract) {
    return (
      <div className="p-6">
        <p className="text-slate-500">Договор не найден.</p>
      </div>
    )
  }

  return <ContractDetailsClient contract={{
    ...contract,
    date: contract.date.toISOString(),
    invoices: contract.invoices.map(i => ({ ...i, date: i.date?.toISOString() ?? null })),
    acts: contract.acts.map(a => ({ ...a, date: a.date?.toISOString() ?? null })),
    scans: contract.scans.map(s => ({ ...s, date: s.date?.toISOString() ?? null })),
    history: contract.history.map(h => ({ ...h, date: h.date.toISOString() }))
  }} />
}
