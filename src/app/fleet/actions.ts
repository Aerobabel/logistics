'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function toggleVehicleStatus(vehicleId: number, currentStatus: string) {
    const newStatus = currentStatus === 'AVAILABLE' ? 'BUSY' : 'AVAILABLE'

    try {
        await prisma.vehicle.update({
            where: { id: vehicleId },
            data: { status: newStatus }
        })
        revalidatePath('/fleet')
    } catch (error) {
        console.error('Failed to update vehicle status', error)
    }
}

export async function createVehicle(prevState: any, formData: FormData) {
    try {
        const rawData = {
            plate: formData.get('plate') as string,
            driver: formData.get('driver') as string,
            type: formData.get('type') as string,
            status: 'AVAILABLE'
        }

        await prisma.vehicle.create({ data: rawData })
        revalidatePath('/fleet')
        return { success: true }
    } catch (error) {
        console.error('Create vehicle error:', error)
        return { success: false, error: 'Failed to create vehicle' }
    }
}
