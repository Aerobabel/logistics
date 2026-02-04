'use client'

import { useActionState, useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { FileText, Plus, Calendar } from 'lucide-react'
import { createContract, deleteContract } from './actions'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

type Contract = {
  id: number
  number: string
  date: string
  amount: number
  status: string
  type: string | null
  product: string | null
  manager: string | null
  counterparty: { name: string }
}

export default function ContractsClient({ initialContracts, contragents }: { initialContracts: Contract[], contragents: any[] }) {
  const [state, formAction] = useActionState(createContract, null)
  const [selectedCounterparty, setSelectedCounterparty] = useState("")

  useEffect(() => {
    if (state?.success) {
      const closeButton = document.getElementById('close-contract-dialog')
      if (closeButton) closeButton.click()
    }
  }, [state])

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen font-sans text-slate-900">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-6 h-6 text-[#E66400]" />
            Договоры
          </h1>
          <p className="text-slate-500 text-sm mt-1">Полный реестр договоров и связанных документов.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#E66400] hover:bg-orange-700 text-white gap-2 font-medium shadow-sm">
              <Plus className="w-4 h-4" /> Новый договор
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>Создание договора</DialogTitle>
            </DialogHeader>
            <form action={formAction} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="number">Номер договора *</Label>
                  <Input id="number" name="number" placeholder="Д-2026/001" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="date">Дата *</Label>
                  <Input id="date" name="date" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount">Сумма *</Label>
                  <Input id="amount" name="amount" type="number" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Статус</Label>
                  <Input id="status" name="status" defaultValue="ACTIVE" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="counterpartyName">Контрагент *</Label>
                  <input type="hidden" name="counterpartyName" value={selectedCounterparty} />
                  <Select value={selectedCounterparty} onValueChange={setSelectedCounterparty}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Выберите контрагента" />
                    </SelectTrigger>
                    <SelectContent>
                      {contragents.map((c) => (
                        <SelectItem key={c.id} value={c.name}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Тип договора</Label>
                  <Input id="type" name="type" placeholder="Поставка/агентский" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product">Продукт</Label>
                  <Input id="product" name="product" placeholder="Пшеница 3 класс" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="manager">Менеджер</Label>
                  <Input id="manager" name="manager" placeholder="Иванов И.И." />
                </div>
              </div>
              <div className="flex gap-3">
                <Button type="submit" className="bg-[#E66400] hover:bg-orange-700 text-white">
                  Сохранить
                </Button>
                <Button id="close-contract-dialog" type="button" variant="secondary">
                  Отмена
                </Button>
              </div>
              {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {initialContracts.map((contract) => (
          <Card key={contract.id} className="p-4 hover:shadow-md transition-shadow border-slate-200">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div className="flex gap-4 items-start">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <Link href={`/contracts/${contract.id}`} className="font-bold text-lg text-slate-900 hover:text-[#E66400]">
                      {contract.number}
                    </Link>
                    <Badge variant="outline" className="text-slate-600 border-slate-200">
                      {contract.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-500 font-medium mt-1">{contract.type || '—'}</p>
                  <div className="mt-2 text-sm text-slate-500">
                    Контрагент: <span className="text-slate-900 font-medium">{contract.counterparty.name}</span>
                  </div>
                  <div className="text-sm text-slate-500">
                    Продукт: <span className="text-slate-900 font-medium">{contract.product || '—'}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col justify-between items-end gap-4 min-w-[200px]">
                <div className="text-right">
                  <p className="text-xs text-slate-400 uppercase">Сумма договора</p>
                  <p className="text-lg font-bold text-[#E66400]">{contract.amount.toLocaleString()} ₽</p>
                  <p className="text-xs text-slate-400 mt-1 flex items-center justify-end gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(contract.date).toLocaleDateString()}
                  </p>
                </div>
                <form action={deleteContract.bind(null, contract.id)}>
                  <Button variant="secondary" size="sm" className="bg-red-50 text-red-600 hover:bg-red-100">
                    Удалить
                  </Button>
                </form>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
