'use server'

import { prisma } from '@/lib/db'

export async function getAnalyticsData() {
    try {
        const [requestsCount, contractsCount, offersCount, vehiclesCount] = await Promise.all([
            prisma.request.count(),
            prisma.contract.count(),
            prisma.offer.count(),
            prisma.vehicle.count(),
        ])

        const topCounterparties = await prisma.counterparty.findMany({
            include: { contracts: true },
            orderBy: { contracts: { _count: 'desc' } },
            take: 5,
        })

        const recentRequests = await prisma.request.findMany({
            orderBy: { createdAt: 'desc' },
            take: 6,
        })

        return {
            requestsCount,
            contractsCount,
            offersCount,
            vehiclesCount,
            topCounterparties,
            recentRequests
        }
    } catch (error) {
        console.error("Failed to fetch analytics:", error)
        return {
            requestsCount: 0,
            contractsCount: 0,
            offersCount: 0,
            vehiclesCount: 0,
            topCounterparties: [],
            recentRequests: []
        }
    }
}
