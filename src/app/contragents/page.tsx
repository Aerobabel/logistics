import { getContragents } from './actions'
import ContragentsClient from './contragent-client'

export const dynamic = 'force-dynamic'

export default async function ContragentsPage() {
    const contragents = await getContragents()
    return <ContragentsClient initialContragents={contragents} />
}
