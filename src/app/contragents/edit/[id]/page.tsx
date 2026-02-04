import { notFound } from 'next/navigation'
import EditContragentClient from './client'
import { getContragentById } from '../../actions'

type Props = {
    params: Promise<{ id: string }>
}

export default async function EditContragentPage({ params }: Props) {
    const { id } = await params
    const contragentId = parseInt(id)

    if (isNaN(contragentId)) notFound()

    const contragent = await getContragentById(contragentId)

    if (!contragent) notFound()

    return <EditContragentClient contragent={contragent} />
}
