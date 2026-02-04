import { getManagers } from './actions'
import ManagersClient from './manager-client'

export const dynamic = 'force-dynamic'

export default async function ManagersPage() {
    const managers = await getManagers()
    return <ManagersClient initialManagers={managers} />
}
