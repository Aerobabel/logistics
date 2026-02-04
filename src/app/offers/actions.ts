'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export async function getOffers() {
  try {
    return await prisma.offer.findMany({
      orderBy: { date: 'desc' }
    })
  } catch (error) {
    console.error('Failed to fetch offers:', error)
    return []
  }
}

export async function createOffer(prevState: any, formData: FormData) {
  try {
    const rawData = {
      farmer: formData.get('farmer') as string,
      status: (formData.get('status') as string) || 'pending',
      date: new Date(formData.get('date') as string),
      manager: formData.get('manager') as string,
      product: formData.get('product') as string,
      quantity: formData.get('quantity') as string,
      price: formData.get('price') as string,
      loadingAddress: formData.get('loadingAddress') as string,
      deliveryAddress: formData.get('deliveryAddress') as string,
      quality: formData.get('quality') as string,
      note: formData.get('note') as string,
    }

    if (!rawData.farmer || !rawData.date || !rawData.product) {
      return { success: false, error: 'Missing required fields' }
    }

    await prisma.offer.create({ data: rawData })
    revalidatePath('/offers')
    return { success: true }
  } catch (error) {
    console.error('Create offer error:', error)
    return { success: false, error: 'Failed to create offer' }
  }
}

export async function updateOfferStatus(offerId: number, status: string) {
  try {
    await prisma.offer.update({
      where: { id: offerId },
      data: { status }
    })
    revalidatePath('/offers')
    return { success: true }
  } catch (error) {
    console.error('Update offer status error:', error)
    return { success: false }
  }
}

export async function toggleOfferArchive(offerId: number, isArchived: boolean) {
  try {
    await prisma.offer.update({
      where: { id: offerId },
      data: { isArchived: !isArchived }
    })
    revalidatePath('/offers')
    return { success: true }
  } catch (error) {
    console.error('Toggle archive error:', error)
    return { success: false }
  }
}

export async function deleteOffer(offerId: number) {
  try {
    await prisma.offer.delete({ where: { id: offerId } })
    revalidatePath('/offers')
    return { success: true }
  } catch (error) {
    console.error('Delete offer error:', error)
    return { success: false }
  }
}
