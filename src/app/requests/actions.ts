'use server'

import { prisma } from '@/lib/db'
import { requestSchema } from '@/lib/schemas'
import { revalidatePath } from 'next/cache'

export async function getRequests() {
    try {
        const requests = await prisma.request.findMany({
            orderBy: { date: 'desc' },
            include: {
                vehicle: true
            }
        })
        return requests
    } catch (error) {
        console.error('Failed to fetch requests:', error)
        return []
    }
}

export async function getLogisticsInvoices() {
    try {
        // Mock implementation or map to Document model with type='INVOICE'
        const docs = await prisma.document.findMany({
            where: { type: 'INVOICE' },
            orderBy: { date: 'desc' }
        })
        return docs
    } catch (error) {
        console.error('Failed to fetch invoices:', error)
        return []
    }
}

export async function getRailTariffs() {
    // No DB model yet, returning empty array
    return []
}

export async function getAutoTariffs() {
    // No DB model yet, returning empty array
    return []
}

export async function getRegistryImportRows() {
    // No DB model for raw import rows yet, returning empty array
    return []
}

export async function getDocuments() {
    try {
        const docs = await prisma.document.findMany({
            orderBy: { date: 'desc' }
        })
        return docs
    } catch (error) {
        console.error('Failed to fetch documents:', error)
        return []
    }
}

export async function createRequest(prevState: any, formData: FormData) {
    const rawData = {
        date: formData.get('date'),
        cargo: formData.get('cargo'),
        weight: formData.get('weight'),
        weightFloat: parseFloat(formData.get('weight') as string),
        routeFrom: formData.get('routeFrom'),
        routeTo: formData.get('routeTo'),
        clientName: formData.get('clientName'),
        cost: formData.get('cost'),
        costFloat: parseFloat(formData.get('cost') as string),
    }

    // Basic validation
    if (!rawData.date || !rawData.cargo || !rawData.routeFrom || !rawData.routeTo) {
        return { message: 'Missing required fields' }
    }

    try {
        await prisma.request.create({
            data: {
                date: new Date(rawData.date as string),
                cargo: rawData.cargo as string,
                weight: rawData.weightFloat || 0,
                routeFrom: rawData.routeFrom as string,
                routeTo: rawData.routeTo as string,
                clientName: rawData.clientName as string,
                cost: rawData.costFloat || 0,
                status: 'PENDING',
            },
        })
    } catch (error) {
        console.log("Error creating request", error)
        return {
            message: 'Database Error: Failed to Create Request.',
        }
    }

    revalidatePath('/requests')
    return { success: true, message: 'Request created successfully' }
}

export async function updateRequest(id: number, prevState: any, formData: FormData) {
    const rawData = {
        date: formData.get('date'),
        cargo: formData.get('cargo'),
        weight: formData.get('weight'),
        weightFloat: parseFloat(formData.get('weight') as string),
        routeFrom: formData.get('routeFrom'),
        routeTo: formData.get('routeTo'),
        clientName: formData.get('clientName'),
        cost: formData.get('cost'),
        costFloat: parseFloat(formData.get('cost') as string),
        status: formData.get('status') as string,
    }

    try {
        await prisma.request.update({
            where: { id },
            data: {
                date: rawData.date ? new Date(rawData.date as string) : undefined,
                cargo: rawData.cargo as string,
                weight: rawData.weightFloat,
                routeFrom: rawData.routeFrom as string,
                routeTo: rawData.routeTo as string,
                clientName: rawData.clientName as string,
                cost: rawData.costFloat,
                status: rawData.status,
            },
        })
        revalidatePath('/requests')
        return { success: true, message: 'Request updated successfully' }
    } catch (error) {
        console.error("Error updating request", error)
        return { success: false, message: 'Failed to update request' }
    }
}

export async function deleteRequest(id: number) {
    try {
        await prisma.request.delete({ where: { id } })
        revalidatePath('/requests')
        return { success: true, message: 'Request deleted successfully' }
    } catch (error) {
        console.error("Error deleting request", error)
        return { success: false, message: 'Failed to delete request' }
    }
}
