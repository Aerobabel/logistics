import { notFound } from 'next/navigation'
import EditContragentClient from './client'
import { getContragentById, getManagers } from '../../actions'

export const dynamic = 'force-dynamic'

type Props = {
    params: Promise<{ id: string }>
}

export default async function EditContragentPage({ params }: Props) {
    const { id } = await params
    const contragentId = parseInt(id)

    if (isNaN(contragentId)) notFound()

    const [contragent, managers] = await Promise.all([
        getContragentById(contragentId),
        getManagers()
    ])

    if (!contragent) notFound()

    return <EditContragentClient contragent={contragent} managers={managers} />
}
