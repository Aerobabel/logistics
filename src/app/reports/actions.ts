'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getReports() {
  try {
    return await prisma.report.findMany({
      orderBy: { createdAt: 'desc' }
    })
  } catch (error) {
    console.error('Failed to fetch reports:', error)
    return []
  }
}

export async function createReport(prevState: any, formData: FormData) {
  try {
    const rawData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      category: formData.get('category') as string,
      icon: formData.get('icon') as string,
      color: formData.get('color') as string,
    }

    if (!rawData.title || !rawData.description || !rawData.category) {
      return { success: false, error: 'Missing required fields' }
    }

    await prisma.report.create({ data: rawData })
    revalidatePath('/reports')
    return { success: true }
  } catch (error) {
    console.error('Create report error:', error)
    return { success: false, error: 'Failed to create report' }
  }
}
