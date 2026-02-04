'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getManagers() {
    try {
        const managers = await prisma.manager.findMany({
            orderBy: { efficiency: 'desc' }
        })
        return managers
    } catch (error) {
        console.error('Failed to fetch managers:', error)
        return []
    }
}

export async function createManager(prevState: any, formData: FormData) {
    try {
        const rawData = {
            name: formData.get('name') as string,
            role: "Sales Manager", // Default for now
            status: "Active",
            avatar: "MS", // Mock initials
            avatarColor: "bg-blue-500",
            contractsCount: 0,
            tonnage: 0,
            farmsCount: 0,
            shipmentsTotal: 0,
            shipmentsActive: 0,
            efficiency: 100,
            rating: 5,
            planExecution: 0,
            sum: "0",
            avgPrice: "0"
        }

        await prisma.manager.create({ data: rawData })
        revalidatePath('/managers')
        return { success: true }
    } catch (error) {
        console.error('Create manager error:', error)
        return { success: false, error: 'Failed to create manager' }
    }
}
