import { getContracts } from './actions'
import { getContragents } from '../contragents/actions'
import ContractsClient from './contracts-client'

export const dynamic = 'force-dynamic'

export default async function ContractsPage() {
  const [contractsData, contragents] = await Promise.all([
    getContracts(),
    getContragents()
  ])

  const contracts = contractsData.map(c => ({
    ...c,
    date: c.date.toISOString()
  }))
  return <ContractsClient initialContracts={contracts} contragents={contragents} />
}
