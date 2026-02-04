import { getContracts, getManagers } from './actions'
import { getContragents } from '../contragents/actions'
import ContractsClient from './contracts-client'

export const dynamic = 'force-dynamic'

export default async function ContractsPage() {
  const [contractsData, contragents, managers] = await Promise.all([
    getContracts(),
    getContragents(),
    getManagers()
  ])

  const contracts = contractsData.map(c => ({
    ...c,
    date: c.date.toISOString()
  }))
  return <ContractsClient initialContracts={contracts} contragents={contragents} managers={managers} />
}
