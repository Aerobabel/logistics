'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createEmployeeDocument(contragentId: number, employeeId: number, formData: FormData) {
    try {
        const title = formData.get('title') as string
        const dateStr = formData.get('date') as string
        const date = dateStr ? new Date(dateStr) : undefined

        await prisma.counterpartyEmployeeDocument.create({
            data: {
                employeeId,
                title,
                date,
                // type: 'SCAN' // Not in schema, assuming implicit by table or handled elsewhere
            }
        })
        revalidatePath(`/contragents/edit/${contragentId}`)
    } catch (e) {
        console.error('Create employee doc error:', e)
    }
}

export async function deleteEmployeeDocument(contragentId: number, employeeId: number, docId: number) {
    try {
        await prisma.counterpartyEmployeeDocument.delete({
            where: { id: docId }
        })
        revalidatePath(`/contragents/edit/${contragentId}`)
    } catch (e) {
        console.error('Delete employee doc error:', e)
    }
}

export async function updateEmployeeDetails(contragentId: number, employeeId: number, formData: FormData) {
    try {
        const rawData: any = {}
        formData.forEach((value, key) => {
            if (key !== 'employeeId' && key !== 'contragentId') {
                rawData[key] = value as string
            }
        })

        // Handle dates if necessary or other types. 
        // Assuming loose mapping for now, but strict typing is better.
        // The schema has specific fields. We should map explicitly if possible, 
        // but 'Object.fromEntries' is what the previous code tried to do essentially.
        // To be safe, let's map known fields.

        const dataToUpdate: any = {
            fullName: formData.get('fullName') as string,
            position: formData.get('position') as string,
            phone: formData.get('phone') as string,
            email: formData.get('email') as string,
            roles: formData.get('roles') as string,
            passport: formData.get('passport') as string,
        }

        const poaDate = formData.get('poaDate') as string
        if (poaDate) dataToUpdate.poaDate = new Date(poaDate)

        const dlExpiry = formData.get('dlExpiry') as string
        if (dlExpiry) dataToUpdate.dlExpiry = new Date(dlExpiry)

        const contractFrom = formData.get('contractFrom') as string
        if (contractFrom) dataToUpdate.contractFrom = new Date(contractFrom)

        const contractTo = formData.get('contractTo') as string
        if (contractTo) dataToUpdate.contractTo = new Date(contractTo)

        // Filter out undefined/nulls if needed or let Prisma handle nullable updates
        // Prisma ignores undefined in update usually, but we constructed explicit object.

        await prisma.counterpartyEmployee.update({
            where: { id: employeeId },
            data: dataToUpdate
        })
        revalidatePath(`/contragents/edit/${contragentId}`)
    } catch (e) {
        console.error('Update employee error:', e)
    }
}
