import { prisma } from '@/lib/db'
import FleetClient from './fleet-client'

export const dynamic = 'force-dynamic'

export default async function FleetPage() {
    // Seed some dummy vehicles if none exist (for demo purposes)
    const count = await prisma.vehicle.count()
    if (count === 0) {
        await prisma.vehicle.createMany({
            data: [
                { plate: 'A 123 AA 777', driver: 'Ivanov I.I.', type: 'Truck 20t', status: 'AVAILABLE' },
                { plate: 'B 456 BB 777', driver: 'Petrov P.P.', type: 'Truck 10t', status: 'BUSY' },
                { plate: 'C 789 CC 777', driver: 'Sidorov S.S.', type: 'Grain Carrier', status: 'AVAILABLE' },
            ]
        })
    }

    const vehicles = await prisma.vehicle.findMany({
        orderBy: { plate: 'asc' }
    })

    return <FleetClient initialVehicles={vehicles} />
}
