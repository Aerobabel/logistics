'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, FileText, Plus, Trash2 } from 'lucide-react'
import {
  createContractAddress,
  createContractInvoice,
  createContractAct,
  createContractScan,
  createContractHistory,
  deleteContractAddress,
  deleteContractInvoice,
  deleteContractAct,
  deleteContractScan,
  deleteContractHistory,
} from './actions'

type ContractDetails = {
  id: number
  number: string
  date: string
  amount: number
  status: string
  type: string | null
  product: string | null
  manager: string | null
  counterparty: { name: string }
  addresses: { id: number; type: string; value: string }[]
  invoices: { id: number; number: string; date: string | null; type: string | null; status: string | null }[]
  acts: { id: number; name: string; date: string | null; amount: string | null; status: string | null }[]
  scans: { id: number; name: string; type: string | null; date: string | null; fileUrl: string | null }[]
  history: { id: number; action: string; user: string | null; description: string | null; date: string }[]
}

export default function ContractDetailsClient({ contract }: { contract: ContractDetails }) {
  const [addressState, addressAction] = useActionState(createContractAddress.bind(null, contract.id), null)
  const [invoiceState, invoiceAction] = useActionState(createContractInvoice.bind(null, contract.id), null)
  const [actState, actAction] = useActionState(createContractAct.bind(null, contract.id), null)
  const [scanState, scanAction] = useActionState(createContractScan.bind(null, contract.id), null)
  const [historyState, historyAction] = useActionState(createContractHistory.bind(null, contract.id), null)

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen font-sans text-slate-900">
      <div className="flex items-center gap-3">
        <Link href="/contracts" className="text-slate-500 hover:text-slate-900 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Назад к договорам
        </Link>
      </div>

      <Card className="p-6 border-slate-200">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-6 h-6 text-[#E66400]" />
              {contract.number}
            </h1>
            <p className="text-slate-500 mt-1">Контрагент: {contract.counterparty.name}</p>
          </div>
          <Badge variant="outline" className="text-slate-600 border-slate-200">
            {contract.status}
          </Badge>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div>
            <div className="text-xs text-slate-400 uppercase">Дата</div>
            <div className="font-medium">{new Date(contract.date).toLocaleDateString()}</div>
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase">Сумма</div>
            <div className="font-medium">{contract.amount.toLocaleString()} ₽</div>
          </div>
          <div>
            <div className="text-xs text-slate-400 uppercase">Менеджер</div>
            <div className="font-medium">{contract.manager || '—'}</div>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="info">
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="info">Информация</TabsTrigger>
          <TabsTrigger value="addresses">Адреса</TabsTrigger>
          <TabsTrigger value="invoices">Накладные</TabsTrigger>
          <TabsTrigger value="acts">Акты</TabsTrigger>
          <TabsTrigger value="scans">Сканы</TabsTrigger>
          <TabsTrigger value="history">История</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-4">
          <Card className="p-6 border-slate-200">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-slate-400 uppercase">Тип</div>
                <div className="font-medium">{contract.type || '—'}</div>
              </div>
              <div>
                <div className="text-xs text-slate-400 uppercase">Продукт</div>
                <div className="font-medium">{contract.product || '—'}</div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="addresses" className="space-y-4">
          <Card className="p-6 border-slate-200 space-y-4">
            <form action={addressAction} className="grid grid-cols-[1fr_2fr_auto] gap-3 items-end">
              <div className="space-y-2">
                <Label>Тип</Label>
                <Input name="type" placeholder="Погрузка/выгрузка" required />
              </div>
              <div className="space-y-2">
                <Label>Адрес</Label>
                <Input name="value" placeholder="Адрес" required />
              </div>
              <Button type="submit" className="bg-[#E66400] hover:bg-orange-700 text-white">
                <Plus className="w-4 h-4" />
              </Button>
            </form>
            {addressState?.error && <p className="text-sm text-red-500">{addressState.error}</p>}
            <div className="space-y-2">
              {contract.addresses.map(addr => (
                <div key={addr.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <div className="text-xs text-slate-400">{addr.type}</div>
                    <div className="font-medium">{addr.value}</div>
                  </div>
                  <form action={deleteContractAddress.bind(null, addr.id, contract.id)}>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <Card className="p-6 border-slate-200 space-y-4">
            <form action={invoiceAction} className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Номер</Label>
                <Input name="number" required />
              </div>
              <div className="space-y-2">
                <Label>Дата</Label>
                <Input name="date" type="date" />
              </div>
              <div className="space-y-2">
                <Label>Тип</Label>
                <Input name="type" />
              </div>
              <div className="space-y-2">
                <Label>Статус</Label>
                <Input name="status" />
              </div>
              <div className="space-y-2">
                <Label>Продукт</Label>
                <Input name="product" />
              </div>
              <div className="space-y-2">
                <Label>Перевозчик</Label>
                <Input name="carrier" />
              </div>
              <div className="space-y-2">
                <Label>Адрес погрузки</Label>
                <Input name="loadingAddress" />
              </div>
              <div className="space-y-2">
                <Label>Адрес выгрузки</Label>
                <Input name="unloadingAddress" />
              </div>
              <div className="col-span-2">
                <Button type="submit" className="bg-[#E66400] hover:bg-orange-700 text-white">
                  Добавить накладную
                </Button>
              </div>
            </form>
            {invoiceState?.error && <p className="text-sm text-red-500">{invoiceState.error}</p>}
            <div className="space-y-2">
              {contract.invoices.map(inv => (
                <div key={inv.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <div className="font-medium">{inv.number}</div>
                    <div className="text-xs text-slate-400">{inv.type || '—'} - {inv.status || '—'}</div>
                  </div>
                  <form action={deleteContractInvoice.bind(null, inv.id, contract.id)}>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="acts" className="space-y-4">
          <Card className="p-6 border-slate-200 space-y-4">
            <form action={actAction} className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Название</Label>
                <Input name="name" required />
              </div>
              <div className="space-y-2">
                <Label>Дата</Label>
                <Input name="date" type="date" />
              </div>
              <div className="space-y-2">
                <Label>Сумма</Label>
                <Input name="amount" />
              </div>
              <div className="space-y-2">
                <Label>Статус</Label>
                <Input name="status" />
              </div>
              <div className="col-span-2">
                <Button type="submit" className="bg-[#E66400] hover:bg-orange-700 text-white">
                  Добавить акт
                </Button>
              </div>
            </form>
            {actState?.error && <p className="text-sm text-red-500">{actState.error}</p>}
            <div className="space-y-2">
              {contract.acts.map(act => (
                <div key={act.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <div className="font-medium">{act.name}</div>
                    <div className="text-xs text-slate-400">{act.status || '—'}</div>
                  </div>
                  <form action={deleteContractAct.bind(null, act.id, contract.id)}>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="scans" className="space-y-4">
          <Card className="p-6 border-slate-200 space-y-4">
            <form action={scanAction} className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Название</Label>
                <Input name="name" required />
              </div>
              <div className="space-y-2">
                <Label>Тип</Label>
                <Input name="type" />
              </div>
              <div className="space-y-2">
                <Label>Дата</Label>
                <Input name="date" type="date" />
              </div>
              <div className="space-y-2">
                <Label>Ссылка на файл</Label>
                <Input name="fileUrl" />
              </div>
              <div className="col-span-2">
                <Button type="submit" className="bg-[#E66400] hover:bg-orange-700 text-white">
                  Добавить скан
                </Button>
              </div>
            </form>
            {scanState?.error && <p className="text-sm text-red-500">{scanState.error}</p>}
            <div className="space-y-2">
              {contract.scans.map(scan => (
                <div key={scan.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <div className="font-medium">{scan.name}</div>
                    <div className="text-xs text-slate-400">{scan.type || '—'}</div>
                  </div>
                  <form action={deleteContractScan.bind(null, scan.id, contract.id)}>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card className="p-6 border-slate-200 space-y-4">
            <form action={historyAction} className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Действие</Label>
                <Input name="action" required />
              </div>
              <div className="space-y-2">
                <Label>Пользователь</Label>
                <Input name="user" />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Описание</Label>
                <Input name="description" />
              </div>
              <div className="col-span-2">
                <Button type="submit" className="bg-[#E66400] hover:bg-orange-700 text-white">
                  Добавить запись
                </Button>
              </div>
            </form>
            {historyState?.error && <p className="text-sm text-red-500">{historyState.error}</p>}
            <div className="space-y-2">
              {contract.history.map(item => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <div className="font-medium">{item.action}</div>
                    <div className="text-xs text-slate-400">{item.user || '—'} - {new Date(item.date).toLocaleString()}</div>
                    {item.description && <div className="text-sm text-slate-600">{item.description}</div>}
                  </div>
                  <form action={deleteContractHistory.bind(null, item.id, contract.id)}>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
