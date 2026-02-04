'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { EmployeeDialog } from './EmployeeDialog'
import {
  createCounterpartyAddress,
  deleteCounterpartyAddress,
  createBankAccount,
  deleteBankAccount,
  createEmployee,
  deleteEmployee,
  createTransport,
  deleteTransport,
  createTransportDocument,
  deleteTransportDocument,
  createDeclaration,
  deleteDeclaration,
  createDeclarationDocument,
  deleteDeclarationDocument,
  createScan,
  deleteScan,
  createHistory,
  deleteHistory,
} from './actions'

type ContragentDetails = {
  id: number
  name: string
  status: string
  type: string
  inn: string | null
  kpp: string | null
  address: string | null
  phone: string | null
  email: string | null
  contactPerson: string | null
  addresses: any[]
  bankAccounts: any[]
  employees: any[]
  transports: any[]
  declarations: any[]
  scans: any[]
  history: any[]
  contracts: any[]
}

export default function ContragentDetailsClient({ contragent }: { contragent: ContragentDetails }) {
  const [addressState, addressAction] = useActionState(createCounterpartyAddress.bind(null, contragent.id), null)
  const [bankState, bankAction] = useActionState(createBankAccount.bind(null, contragent.id), null)
  const [employeeState, employeeAction] = useActionState(createEmployee.bind(null, contragent.id), null)
  const [transportState, transportAction] = useActionState(createTransport.bind(null, contragent.id), null)
  const [declarationState, declarationAction] = useActionState(createDeclaration.bind(null, contragent.id), null)
  const [scanState, scanAction] = useActionState(createScan.bind(null, contragent.id), null)
  const [historyState, historyAction] = useActionState(createHistory.bind(null, contragent.id), null)

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen font-sans text-slate-900">
      <div className="flex items-center gap-3">
        <Link href="/contragents" className="text-slate-500 hover:text-slate-900 flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          Назад к списку
        </Link>
      </div>

      <Card className="p-6 border-slate-200">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{contragent.name}</h1>
            <p className="text-slate-500 mt-1">{contragent.address || 'Адрес не указан'}</p>
          </div>
          <div className="flex gap-2 items-center">
            <Link href={`/contragents/edit/${contragent.id}`}>
              <Button variant="outline" size="sm" className="h-6 gap-2 text-xs">
                Редактировать
              </Button>
            </Link>
            <Badge variant="secondary" className="bg-slate-100 text-slate-700">
              {{
                'Client': 'Клиент',
                'Supplier': 'Поставщик',
                'Carrier': 'Перевозчик'
              }[contragent.type] || contragent.type}
            </Badge>
            <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50">
              {{
                'active': 'Активный',
                'ACTIVE': 'Активный',
                'inactive': 'Неактивный',
                'INACTIVE': 'Неактивный',
                'blocked': 'Заблокирован',
                'BLOCKED': 'Заблокирован'
              }[contragent.status] || contragent.status}
            </Badge>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mt-6 text-sm text-slate-600">
          <div>ИНН: {contragent.inn || '—'}</div>
          <div>КПП: {contragent.kpp || '—'}</div>
          <div>Контакт: {contragent.contactPerson || '—'}</div>
          <div>Телефон: {contragent.phone || '—'}</div>
          <div>Email: {contragent.email || '—'}</div>
        </div>
      </Card>

      <Tabs defaultValue="addresses">
        <TabsList className="bg-white border border-slate-200">
          <TabsTrigger value="addresses">Адреса</TabsTrigger>
          <TabsTrigger value="bank">Банк</TabsTrigger>
          <TabsTrigger value="employees">Сотрудники</TabsTrigger>
          <TabsTrigger value="transport">Транспорт</TabsTrigger>
          <TabsTrigger value="declarations">Декларации</TabsTrigger>
          <TabsTrigger value="scans">Сканы</TabsTrigger>
          <TabsTrigger value="history">История</TabsTrigger>
          <TabsTrigger value="contracts">Договоры</TabsTrigger>
        </TabsList>

        <TabsContent value="addresses" className="space-y-4">
          <Card className="p-6 border-slate-200 space-y-4">
            <form action={addressAction} className="grid grid-cols-3 gap-3 items-end">
              <div className="space-y-2">
                <Label>Тип</Label>
                <Input name="type" placeholder="Юр/факт/погрузка" required />
              </div>
              <div className="space-y-2">
                <Label>Город</Label>
                <Input name="city" />
              </div>
              <div className="space-y-2">
                <Label>Улица</Label>
                <Input name="street" />
              </div>
              <div className="space-y-2">
                <Label>Дом</Label>
                <Input name="house" />
              </div>
              <div className="space-y-2">
                <Label>Комментарий</Label>
                <Input name="comment" />
              </div>
              <Button type="submit" className="bg-[#E66400] hover:bg-orange-700 text-white">
                <Plus className="w-4 h-4" />
              </Button>
            </form>
            {addressState?.error && <p className="text-sm text-red-500">{addressState.error}</p>}
            <div className="space-y-2">
              {(contragent.addresses || []).map((addr: any) => (
                <div key={addr.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <div className="text-xs text-slate-400">
                      {{
                        'legal': 'Юридический',
                        'actual': 'Фактический',
                        'postal': 'Почтовый'
                      }[addr.type] || addr.type}
                    </div>
                    <div className="font-medium">{[addr.city, addr.street, addr.house].filter(Boolean).join(', ') || '—'}</div>
                  </div>
                  <form action={deleteCounterpartyAddress.bind(null, addr.id, contragent.id)}>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="bank" className="space-y-4">
          <Card className="p-6 border-slate-200 space-y-4">
            <form action={bankAction} className="grid grid-cols-3 gap-3">
              <Input name="bankName" placeholder="Банк" required />
              <Input name="bik" placeholder="БИК" />
              <Input name="checkingAccount" placeholder="Р/с" />
              <Input name="correspondentAccount" placeholder="К/с" />
              <Input name="comment" placeholder="Комментарий" />
              <Button type="submit" className="bg-[#E66400] hover:bg-orange-700 text-white col-span-3">
                Добавить счет
              </Button>
            </form>
            {bankState?.error && <p className="text-sm text-red-500">{bankState.error}</p>}
            <div className="space-y-2">
              {(contragent.bankAccounts || []).map((acc: any) => (
                <div key={acc.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <div className="font-medium">{acc.bankName}</div>
                    <div className="text-xs text-slate-500">БИК: {acc.bik || '—'} ? Р/с: {acc.checkingAccount || '—'}</div>
                  </div>
                  <form action={deleteBankAccount.bind(null, acc.id, contragent.id)}>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="employees" className="space-y-4">
          <Card className="p-6 border-slate-200 space-y-4">
            <form action={employeeAction} className="grid grid-cols-3 gap-3">
              <Input name="fullName" placeholder="ФИО" required />
              <Input name="position" placeholder="Должность" />
              <Input name="phone" placeholder="Телефон" />
              <Input name="email" placeholder="Email" />
              <Input name="roles" placeholder="Роли" />
              <Button type="submit" className="bg-[#E66400] hover:bg-orange-700 text-white col-span-3">
                Добавить сотрудника
              </Button>
            </form>
            {employeeState?.error && <p className="text-sm text-red-500">{employeeState.error}</p>}
            <div className="space-y-2">
              {(contragent.employees || []).map((emp: any) => (
                <div key={emp.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <div className="font-medium">{emp.fullName}</div>
                    <div className="text-xs text-slate-500">{emp.position || '—'} - {emp.phone || '—'}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <EmployeeDialog
                      employee={emp}
                      contragentId={contragent.id}
                      trigger={
                        <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50 cursor-pointer">
                          Открыть
                        </Button>
                      }
                    />
                    <form action={deleteEmployee.bind(null, emp.id, contragent.id)}>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="transport" className="space-y-4">
          <Card className="p-6 border-slate-200 space-y-4">
            <form action={transportAction} className="grid grid-cols-3 gap-3">
              <Input name="type" placeholder="Тип" required />
              <Input name="brand" placeholder="Марка" />
              <Input name="model" placeholder="Модель" />
              <Input name="plate" placeholder="Госномер" required />
              <Input name="capacity" placeholder="Грузоподъемность" />
              <Input name="driverName" placeholder="Водитель" />
              <Input name="driverPhone" placeholder="Телефон" />
              <Button type="submit" className="bg-[#E66400] hover:bg-orange-700 text-white col-span-3">
                Добавить транспорт
              </Button>
            </form>
            {transportState?.error && <p className="text-sm text-red-500">{transportState.error}</p>}
            <div className="space-y-4">
              {(contragent.transports || []).map((tr: any) => (
                <div key={tr.id} className="border border-slate-200 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{tr.plate}</div>
                      <div className="text-xs text-slate-500">{tr.type} - {tr.driverName || '—'}</div>
                    </div>
                    <form action={deleteTransport.bind(null, tr.id, contragent.id)}>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                  <form action={createTransportDocument.bind(null, tr.id, contragent.id)} className="grid grid-cols-3 gap-3">
                    <Input name="title" placeholder="Документ" required />
                    <Input name="date" type="date" />
                    <Input name="fileUrl" placeholder="Ссылка" />
                    <Button type="submit" className="bg-[#E66400] hover:bg-orange-700 text-white col-span-3">
                      Добавить документ
                    </Button>
                  </form>
                  <div className="space-y-2">
                    {(tr.documents || []).map((doc: any) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 border border-slate-100 rounded">
                        <div className="text-sm">{doc.title}</div>
                        <form action={deleteTransportDocument.bind(null, doc.id, contragent.id)}>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </form>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="declarations" className="space-y-4">
          <Card className="p-6 border-slate-200 space-y-4">
            <form action={declarationAction} className="grid grid-cols-3 gap-3">
              <Input name="number" placeholder="Номер" required />
              <Input name="date" type="date" />
              <Input name="product" placeholder="Продукт" />
              <Input name="weight" placeholder="Вес" />
              <Input name="validUntil" type="date" />
              <Input name="status" placeholder="Статус" />
              <Button type="submit" className="bg-[#E66400] hover:bg-orange-700 text-white col-span-3">
                Добавить декларацию
              </Button>
            </form>
            {declarationState?.error && <p className="text-sm text-red-500">{declarationState.error}</p>}
            <div className="space-y-4">
              {(contragent.declarations || []).map((decl: any) => (
                <div key={decl.id} className="border border-slate-200 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium">{decl.number}</div>
                      <div className="text-xs text-slate-500">{decl.product || '—'} - {decl.status || '—'}</div>
                    </div>
                    <form action={deleteDeclaration.bind(null, decl.id, contragent.id)}>
                      <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </form>
                  </div>
                  <form action={createDeclarationDocument.bind(null, decl.id, contragent.id)} className="grid grid-cols-3 gap-3">
                    <Input name="title" placeholder="Документ" required />
                    <Input name="date" type="date" />
                    <Input name="fileUrl" placeholder="Ссылка" />
                    <Button type="submit" className="bg-[#E66400] hover:bg-orange-700 text-white col-span-3">
                      Добавить документ
                    </Button>
                  </form>
                  <div className="space-y-2">
                    {(decl.documents || []).map((doc: any) => (
                      <div key={doc.id} className="flex items-center justify-between p-2 border border-slate-100 rounded">
                        <div className="text-sm">{doc.title}</div>
                        <form action={deleteDeclarationDocument.bind(null, doc.id, contragent.id)}>
                          <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </form>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="scans" className="space-y-4">
          <Card className="p-6 border-slate-200 space-y-4">
            <form action={scanAction} className="grid grid-cols-3 gap-3">
              <Input name="title" placeholder="Название" required />
              <Input name="type" placeholder="Тип" />
              <Input name="fileUrl" placeholder="Ссылка" />
              <Button type="submit" className="bg-[#E66400] hover:bg-orange-700 text-white col-span-3">
                Добавить скан
              </Button>
            </form>
            {scanState?.error && <p className="text-sm text-red-500">{scanState.error}</p>}
            <div className="space-y-2">
              {(contragent.scans || []).map((scan: any) => (
                <div key={scan.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <div className="font-medium">{scan.title}</div>
                    <div className="text-xs text-slate-500">{scan.type || '—'}</div>
                  </div>
                  <form action={deleteScan.bind(null, scan.id, contragent.id)}>
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
            <form action={historyAction} className="grid grid-cols-3 gap-3">
              <Input name="type" placeholder="Событие" required />
              <Input name="product" placeholder="Продукт" />
              <Input name="status" placeholder="Статус" />
              <Input name="description" placeholder="Описание" />
              <Button type="submit" className="bg-[#E66400] hover:bg-orange-700 text-white col-span-3">
                Добавить запись
              </Button>
            </form>
            {historyState?.error && <p className="text-sm text-red-500">{historyState.error}</p>}
            <div className="space-y-2">
              {(contragent.history || []).map((item: any) => (
                <div key={item.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                  <div>
                    <div className="font-medium">{item.type || '—'}</div>
                    <div className="text-xs text-slate-500">{item.status || '—'}</div>
                    {item.description && <div className="text-sm text-slate-600">{item.description}</div>}
                  </div>
                  <form action={deleteHistory.bind(null, item.id, contragent.id)}>
                    <Button variant="ghost" size="icon" className="text-red-500 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </form>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="contracts" className="space-y-4">
          <Card className="p-6 border-slate-200 space-y-2">
            {(contragent.contracts || []).map((contract: any) => (
              <div key={contract.id} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <div className="font-medium">{contract.number}</div>
                  <div className="text-xs text-slate-500">{contract.status}</div>
                </div>
                <Link href={`/contracts/${contract.id}`} className="text-sm text-[#E66400] hover:underline">
                  Открыть
                </Link>
              </div>
            ))}
            {(contragent.contracts || []).length === 0 && (
              <p className="text-sm text-slate-500">Договоры отсутствуют.</p>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
