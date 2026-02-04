import { getReports } from './actions'
import ReportsClient from './reports-client'

export const dynamic = 'force-dynamic'

export default async function ReportsPage() {
  const reports = await getReports()
  return <ReportsClient initialReports={reports} />
}
