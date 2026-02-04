'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function createRegistry(requestIds: number[]) {
    if (!requestIds.length) {
        return { message: 'No requests selected' }
    }

    try {
        // 1. Create the Registry
        const registry = await prisma.registry.create({
            data: {
                status: 'DRAFT',
                number: `REG-${Date.now()}`, // Simple auto-generation
            }
        })

        // 2. Update Requests to link to this registry and change status
        await prisma.request.updateMany({
            where: {
                id: { in: requestIds }
            },
            data: {
                registryId: registry.id,
                status: 'IN_REGISTRY'
            }
        })

        revalidatePath('/registries')
        revalidatePath('/requests')
        return { success: true, registryId: registry.id }
    } catch (error) {
        console.error(error)
        return { message: 'Failed to create registry' }
    }
}
