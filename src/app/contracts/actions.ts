'use server'

import { prisma } from '@/lib/db'
import { revalidatePath } from 'next/cache'

async function ensureCounterparty(name: string) {
  const existing = await prisma.counterparty.findFirst({ where: { name } })
  if (existing) return existing
  return prisma.counterparty.create({
    data: {
      name,
      status: 'ACTIVE',
      trustRating: 80,
      type: 'Client',
    }
  })
}

export async function getContracts() {
  try {
    return await prisma.contract.findMany({
      include: { counterparty: true },
      orderBy: { date: 'desc' }
    })
  } catch (error) {
    console.error('Failed to fetch contracts:', error)
    return []
  }
}

export async function getContractById(id: number) {
  try {
    return await prisma.contract.findUnique({
      where: { id },
      include: {
        counterparty: true,
        addresses: true,
        invoices: true,
        acts: true,
        scans: true,
        history: true,
      }
    })
  } catch (error) {
    console.error('Failed to fetch contract:', error)
    return null
  }
}

export async function createContract(prevState: any, formData: FormData) {
  try {
    const counterpartyName = formData.get('counterpartyName') as string
    const counterparty = await ensureCounterparty(counterpartyName)

    const rawData = {
      number: formData.get('number') as string,
      date: new Date(formData.get('date') as string),
      amount: Number(formData.get('amount')),
      status: formData.get('status') as string,
      type: formData.get('type') as string,
      product: formData.get('product') as string,
      counterpartyRole: formData.get('counterpartyRole') as string,
      periodFrom: formData.get('periodFrom') ? new Date(formData.get('periodFrom') as string) : null,
      periodTo: formData.get('periodTo') ? new Date(formData.get('periodTo') as string) : null,
      manager: formData.get('manager') as string,
      managerSigned: formData.get('managerSigned') ? new Date(formData.get('managerSigned') as string) : null,
      basis: formData.get('basis') as string,
      hsCode: formData.get('hsCode') as string,
      year: formData.get('year') as string,
      sellerName: formData.get('sellerName') as string,
      buyerName: formData.get('buyerName') as string,
      deliveryFrom: formData.get('deliveryFrom') as string,
      deliveryTo: formData.get('deliveryTo') as string,
      paymentDays: formData.get('paymentDays') ? Number(formData.get('paymentDays')) : null,
      prepayment: formData.get('prepayment') ? Number(formData.get('prepayment')) : null,
      cost: formData.get('cost') ? Number(formData.get('cost')) : null,
      currency: formData.get('currency') as string,
      amountTons: formData.get('amountTons') ? Number(formData.get('amountTons')) : null,
      tolerance: formData.get('tolerance') ? Number(formData.get('tolerance')) : null,
      protein: formData.get('protein') as string,
      gluten: formData.get('gluten') as string,
      idk: formData.get('idk') as string,
      fallingNumber: formData.get('fallingNumber') as string,
      oil: formData.get('oil') as string,
      moisture: formData.get('moisture') as string,
      nature: formData.get('nature') as string,
      grainAdmixture: formData.get('grainAdmixture') as string,
      trashAdmixture: formData.get('trashAdmixture') as string,
      bug: formData.get('bug') as string,
      acidity: formData.get('acidity') as string,
      qualityComment: formData.get('qualityComment') as string,
      counterpartyId: counterparty.id,
    }

    if (!rawData.number || !rawData.date || !rawData.amount) {
      return { success: false, error: 'Missing required fields' }
    }

    await prisma.contract.create({ data: rawData })
    revalidatePath('/contracts')
    return { success: true }
  } catch (error) {
    console.error('Create contract error:', error)
    return { success: false, error: 'Failed to create contract' }
  }
}

export async function deleteContract(id: number) {
  try {
    await prisma.contract.delete({ where: { id } })
    revalidatePath('/contracts')
    return { success: true }
  } catch (error) {
    console.error('Delete contract error:', error)
    return { success: false }
  }
}

export async function createContractAddress(contractId: number, prevState: any, formData: FormData) {
  try {
    await prisma.contractAddress.create({
      data: {
        contractId,
        type: formData.get('type') as string,
        value: formData.get('value') as string,
      }
    })
    revalidatePath(`/contracts/${contractId}`)
    return { success: true }
  } catch (error) {
    console.error('Create address error:', error)
    return { success: false }
  }
}

export async function deleteContractAddress(id: number, contractId: number) {
  try {
    await prisma.contractAddress.delete({ where: { id } })
    revalidatePath(`/contracts/${contractId}`)
    return { success: true }
  } catch (error) {
    console.error('Delete address error:', error)
    return { success: false }
  }
}

export async function createContractInvoice(contractId: number, prevState: any, formData: FormData) {
  try {
    await prisma.contractInvoice.create({
      data: {
        contractId,
        number: formData.get('number') as string,
        date: formData.get('date') ? new Date(formData.get('date') as string) : null,
        type: formData.get('type') as string,
        status: formData.get('status') as string,
        product: formData.get('product') as string,
        carrier: formData.get('carrier') as string,
        loadingAddress: formData.get('loadingAddress') as string,
        unloadingAddress: formData.get('unloadingAddress') as string,
      }
    })
    revalidatePath(`/contracts/${contractId}`)
    return { success: true }
  } catch (error) {
    console.error('Create invoice error:', error)
    return { success: false }
  }
}

export async function deleteContractInvoice(id: number, contractId: number) {
  try {
    await prisma.contractInvoice.delete({ where: { id } })
    revalidatePath(`/contracts/${contractId}`)
    return { success: true }
  } catch (error) {
    console.error('Delete invoice error:', error)
    return { success: false }
  }
}

export async function createContractAct(contractId: number, prevState: any, formData: FormData) {
  try {
    await prisma.contractAct.create({
      data: {
        contractId,
        name: formData.get('name') as string,
        date: formData.get('date') ? new Date(formData.get('date') as string) : null,
        amount: formData.get('amount') as string,
        status: formData.get('status') as string,
      }
    })
    revalidatePath(`/contracts/${contractId}`)
    return { success: true }
  } catch (error) {
    console.error('Create act error:', error)
    return { success: false }
  }
}

export async function deleteContractAct(id: number, contractId: number) {
  try {
    await prisma.contractAct.delete({ where: { id } })
    revalidatePath(`/contracts/${contractId}`)
    return { success: true }
  } catch (error) {
    console.error('Delete act error:', error)
    return { success: false }
  }
}

export async function createContractScan(contractId: number, prevState: any, formData: FormData) {
  try {
    await prisma.contractScan.create({
      data: {
        contractId,
        name: formData.get('name') as string,
        type: formData.get('type') as string,
        date: formData.get('date') ? new Date(formData.get('date') as string) : null,
        fileUrl: formData.get('fileUrl') as string,
      }
    })
    revalidatePath(`/contracts/${contractId}`)
    return { success: true }
  } catch (error) {
    console.error('Create scan error:', error)
    return { success: false }
  }
}

export async function deleteContractScan(id: number, contractId: number) {
  try {
    await prisma.contractScan.delete({ where: { id } })
    revalidatePath(`/contracts/${contractId}`)
    return { success: true }
  } catch (error) {
    console.error('Delete scan error:', error)
    return { success: false }
  }
}

export async function createContractHistory(contractId: number, prevState: any, formData: FormData) {
  try {
    await prisma.contractHistory.create({
      data: {
        contractId,
        action: formData.get('action') as string,
        user: formData.get('user') as string,
        description: formData.get('description') as string,
      }
    })
    revalidatePath(`/contracts/${contractId}`)
    return { success: true }
  } catch (error) {
    console.error('Create history error:', error)
    return { success: false }
  }
}

export async function deleteContractHistory(id: number, contractId: number) {
  try {
    await prisma.contractHistory.delete({ where: { id } })
    revalidatePath(`/contracts/${contractId}`)
    return { success: true }
  } catch (error) {
    console.error('Delete history error:', error)
    return { success: false }
  }
}
