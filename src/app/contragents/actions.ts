'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getContragents() {
    try {
        const contragents = await prisma.counterparty.findMany()
        return contragents
    } catch (error) {
        console.error('Failed to fetch contragents:', error)
        return []
    }
}

export async function getContragentById(id: number) {
    try {
        const contragent = await prisma.counterparty.findUnique({
            where: { id },
            include: {
                contracts: true,
                addresses: true,
                bankAccounts: true,
                employees: true,
                transports: true,
                declarations: true,
                scans: true,
                history: true
            }
        })
        return contragent
    } catch (error) {
        console.error('Failed to fetch contragent:', error)
        return null
    }
}

export async function createContragent(prevState: any, formData: FormData) {
    try {
        const addressesStr = formData.get('addresses') as string
        const bankAccountsStr = formData.get('bankAccounts') as string
        const employeesStr = formData.get('employees') as string
        const transportStr = formData.get('transport') as string
        const declarationsStr = formData.get('declarations') as string

        const parseAndMap = (str: string) => {
            if (!str) return []
            try {
                const arr = JSON.parse(str)
                return Array.isArray(arr) ? arr.map(({ id, ...rest }: any) => rest) : []
            } catch (e) {
                return []
            }
        }

        const rawData = {
            name: formData.get('name') as string,
            type: formData.get('type') as string,
            status: formData.get('status') as string || 'ACTIVE',
            inn: formData.get('inn') as string,
            kpp: formData.get('kpp') as string,
            // okpo: formData.get('okpo') as string, // Not in schema?
            // ogrn: formData.get('ogrn') as string, // Not in schema?
            // regNumber: formData.get('regNumber') as string, // Not in schema?
            // The schema only has: name, inn, kpp, address, status, trustRating, phone, email, contactPerson, type
            // It seems "ogrn", "okpo" might be missing from schema or mapped to other fields?
            // Checking schema: Counterparty has `inn`, `kpp`, `address`, `phone`, `email`, `contactPerson`, `type`.
            // Missing `okpo`, `ogrn`. Detailed fields might be in `address` or ignored for now.
            // We will stick to schema fields to avoid errors.

            phone: formData.get('phone') as string,
            email: formData.get('email') as string,
            // edo: formData.get('edo') as string,
            // manager: formData.get('manager') as string, // Not in schema relation? 
            // comment: formData.get('comment') as string, // Not in schema?
            trustRating: parseInt(formData.get('trustRating') as string || '3'),

            addresses: {
                create: parseAndMap(addressesStr)
            },
            bankAccounts: {
                create: parseAndMap(bankAccountsStr)
            },
            employees: {
                create: parseAndMap(employeesStr)
            },
            transports: {
                create: parseAndMap(transportStr)
            },
            declarations: {
                create: parseAndMap(declarationsStr)
            },
            // scans: { create: [] },
            // history: { create: [] },
        }

        await prisma.counterparty.create({ data: rawData })
        revalidatePath('/contragents')
        return { success: true, message: 'Counterparty created successfully' }
    } catch (error) {
        console.error('Create error:', error)
        return { success: false, error: 'Failed to create contragent' }
    }
}

export async function updateContragent(id: number, prevState: any, formData: FormData) {
    try {
        const addressesStr = formData.get('addresses') as string
        const bankAccountsStr = formData.get('bankAccounts') as string
        const employeesStr = formData.get('employees') as string
        const phoneStr = formData.get('phone') as string
        const emailStr = formData.get('email') as string

        const parseAndMap = (str: string) => {
            if (!str) return undefined
            try {
                const arr = JSON.parse(str)
                if (!Array.isArray(arr)) return undefined
                return {
                    deleteMany: {}, // Clear existing and replace
                    create: arr.map(({ id, ...rest }: any) => rest)
                }
            } catch (e) { return undefined }
        }

        const rawData = {
            name: formData.get('name') as string,
            type: formData.get('type') as string,
            status: formData.get('status') as string || 'ACTIVE',
            inn: formData.get('inn') as string,
            kpp: formData.get('kpp') as string,

            // Handle parsing like in create
            phone: phoneStr && phoneStr.startsWith('[') ? JSON.parse(phoneStr)[0] : phoneStr,
            email: emailStr && emailStr.startsWith('[') ? JSON.parse(emailStr)[0] : emailStr,

            trustRating: parseInt(formData.get('trustRating') as string || '3'),

            // Complex objects
            addresses: parseAndMap(addressesStr),
            bankAccounts: parseAndMap(bankAccountsStr),
            employees: parseAndMap(employeesStr),
        }

        await prisma.counterparty.update({
            where: { id },
            data: rawData
        })
        revalidatePath('/contragents')
        revalidatePath(`/contragents/${id}`)
        return { success: true, message: 'Counterparty updated successfully' }
    } catch (error) {
        console.error('Update error:', error)
        return { success: false, error: 'Failed to update contragent' }
    }
}

export async function deleteContragent(id: number) {
    try {
        await prisma.counterparty.delete({
            where: { id }
        })
        revalidatePath('/contragents')
        return { success: true, message: 'Counterparty deleted successfully' }
    } catch (error) {
        console.error('Delete error:', error)
        return { success: false, error: 'Failed to delete contragent' }
    }
}

export async function createCounterpartyAddress(id: number, prevState: any, formData: FormData) { return { success: false, error: "Not implemented" } }
export async function deleteCounterpartyAddress(id: number, contragentId: number) { return { success: false, error: "Not implemented" } }

export async function createBankAccount(id: number, prevState: any, formData: FormData) { return { success: false, error: "Not implemented" } }
export async function deleteBankAccount(id: number, contragentId: number) { return { success: false, error: "Not implemented" } }

export async function createEmployee(id: number, prevState: any, formData: FormData) { return { success: false, error: "Not implemented" } }
export async function deleteEmployee(id: number, contragentId: number) { return { success: false, error: "Not implemented" } }

export async function createTransport(id: number, prevState: any, formData: FormData) { return { success: false, error: "Not implemented" } }
export async function deleteTransport(id: number, contragentId: number) { return { success: false, error: "Not implemented" } }

export async function createTransportDocument(id: number, contragentId: number, formData: FormData) { return { success: false, error: "Not implemented" } }
export async function deleteTransportDocument(id: number, contragentId: number) { return { success: false, error: "Not implemented" } }

export async function createDeclaration(id: number, prevState: any, formData: FormData) { return { success: false, error: "Not implemented" } }
export async function deleteDeclaration(id: number, contragentId: number) { return { success: false, error: "Not implemented" } }

export async function createDeclarationDocument(id: number, contragentId: number, formData: FormData) { return { success: false, error: "Not implemented" } }
export async function deleteDeclarationDocument(id: number, contragentId: number) { return { success: false, error: "Not implemented" } }

export async function createScan(id: number, prevState: any, formData: FormData) { return { success: false, error: "Not implemented" } }
export async function deleteScan(id: number, contragentId: number) { return { success: false, error: "Not implemented" } }

export async function createHistory(id: number, prevState: any, formData: FormData) { return { success: false, error: "Not implemented" } }
export async function deleteHistory(id: number, contragentId: number) { return { success: false, error: "Not implemented" } }

