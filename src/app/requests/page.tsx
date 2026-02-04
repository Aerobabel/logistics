import {
    getRequests,
    getLogisticsInvoices,
    getRailTariffs,
    getAutoTariffs,
    getRegistryImportRows,
    getDocuments
} from './actions'
import RequestsClient from './requests-client'

export const dynamic = 'force-dynamic'

export default async function RequestsPage() {
    const [
        requests,
        invoices,
        railTariffs,
        autoTariffs,
        registryRows,
        documents
    ] = await Promise.all([
        getRequests(),
        getLogisticsInvoices(),
        getRailTariffs(),
        getAutoTariffs(),
        getRegistryImportRows(),
        getDocuments()
    ])

    return (
        <RequestsClient
            initialRequests={requests.map(r => ({ ...r, date: r.date.toISOString(), vehicle: r.vehicle ? { ...r.vehicle, type: r.vehicle.type || '' } : null }))}
            initialInvoices={invoices.map(i => ({ ...i, date: i.date?.toISOString() ?? null }))}
            initialRailTariffs={railTariffs.map(t => ({ ...t, date: t.date?.toISOString() ?? null }))}
            initialAutoTariffs={autoTariffs.map(t => ({ ...t, date: t.date?.toISOString() ?? null }))}
            initialRegistryRows={registryRows.map(r => ({
                ...r,
                dateSent: r.dateSent?.toISOString() ?? null,
                dateRecv: r.dateRecv?.toISOString() ?? null
            }))}
            initialDocuments={documents.map(d => ({ ...d, date: d.date.toISOString() }))}
        />
    )
}
