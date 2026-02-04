'use client'

import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Truck,
  Train,
  FileText,
  DollarSign,
  FileSpreadsheet,
  CreditCard,
  MoreHorizontal,
  Search,
  Plus,
  Filter,
  Download,
  Upload,
  PenLine,
  Trash2,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  Play,
  Eraser,
  RefreshCcw,
  Info,
  X
} from 'lucide-react'
import { cn } from '@/lib/utils'
import LogisticsPaymentTab from './payment-tab'
import { RequestForm } from './request-form'
import { updateRequest, deleteRequest } from './actions'
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog'

// Mock Data (kept for Invoices/Tariffs for now)
const mockLogisticsInvoices = [
  {
    id: 'НКЛ-2025/001',
    type: 'АВТО. Закупка с доставкой',
    status: 'delivered',
    product: 'Пшеница 3 класс',
    carrier: 'ООО "ТрансЛогистик"',
    transport: 'А123БВ777',
    netto: '14 500',
    diff: '- 14 450',
    date: '10.01.2025'
  },
  {
    id: 'НКЛ-2025/002',
    type: 'АВТО. Продажа с элеватора',
    status: 'in-transit',
    product: 'Ячмень',
    carrier: 'ИП "Перевозчик"',
    transport: 'С789ДЕ777',
    netto: '15 500',
    diff: '',
    date: '13.01.2025'
  }
]
// ... other mocks ...

type RequestWithVehicle = {
  id: number
  date: Date
  cargo: string
  weight: number | null
  routeFrom: string
  routeTo: string
  status: string
  vehicle: { driver: string; plate: string; type: string } | null
}

const mockRailTariffs = [
  {
    id: 1,
    departure: 'Воронеж-1',
    depCode: '593401',
    destination: 'Москва-Курская',
    destCode: '197408',
    tariff: '2 850 ₽',
    date: '2025-01-10'
  },
  {
    id: 2,
    departure: 'Курск',
    depCode: '596205',
    destination: 'Санкт-Петербург',
    destCode: '203802',
    tariff: '4 200 ₽',
    date: '2025-01-12'
  }
]

const mockAutoTariffs = [
  {
    id: 1,
    distance: '50 км',
    coefficient: '1.00',
    price: '2 500 ₽',
    priceKm: '50.00 ₽/км',
    date: '2025-01-10'
  },
  {
    id: 2,
    distance: '100 км',
    coefficient: '0.95',
    price: '4 750 ₽',
    priceKm: '47.50 ₽/км',
    date: '2025-01-10'
  },
  {
    id: 3,
    distance: '150 км',
    coefficient: '0.92',
    price: '6 900 ₽',
    priceKm: '46.00 ₽/км',
    date: '2025-01-10'
  },
  {
    id: 4,
    distance: '200 км',
    coefficient: '0.90',
    price: '9 000 ₽',
    priceKm: '45.00 ₽/км',
    date: '2025-01-10'
  }
]

export default function RequestsClient({
  initialRequests,
  initialInvoices,
  initialRailTariffs,
  initialAutoTariffs,
  initialRegistryRows, // Registry import logic seemingly uses local state, but we can accept this if needed
  initialDocuments
}: {
  initialRequests: any[],
  initialInvoices: any[],
  initialRailTariffs: any[],
  initialAutoTariffs: any[],
  initialRegistryRows: any[],
  initialDocuments: any[]
}) {
  // Use passed data or fallback to empty arrays. 
  // Note: Dates are passed as ISO strings from server.
  const requests = initialRequests
  const invoices = initialInvoices
  const railTariffs = initialRailTariffs
  const autoTariffs = initialAutoTariffs

  // Requests Stats
  const requestStats = useMemo(() => {
    return {
      inTransit: requests.filter((r: any) => r.status === 'ASSIGNED').length,
      loading: requests.filter((r: any) => r.status === 'PENDING').length,
      delivered: requests.filter((r: any) => r.status === 'COMPLETED' || r.status === 'DELIVERED').length,
      totalTransport: new Set(requests.map((r: any) => r.vehicle?.plate).filter(Boolean)).size
    }
  }, [requests])

  // Invoices Stats
  const invoiceStats = useMemo(() => {
    return {
      total: invoices.length,
      drafts: invoices.filter((i: any) => i.status === 'draft').length,
      loading: invoices.filter((i: any) => i.status === 'loading').length,
      inTransit: invoices.filter((i: any) => i.status === 'in-transit').length
    }
  }, [invoices])

  // Tariffs Stats
  const tariffStats = useMemo(() => {
    return {
      rail: railTariffs.length,
      auto: autoTariffs.length
    }
  }, [railTariffs, autoTariffs])


  // Edit/Delete State
  const [editingRequest, setEditingRequest] = useState<RequestWithVehicle | null>(null)

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this delivery?')) {
      await deleteRequest(id)
    }
  }

  // Import Data Tab State
  const [registryInput, setRegistryInput] = useState('')
  const [registryData, setRegistryData] = useState<any[]>([])
  const [showRegistryStats, setShowRegistryStats] = useState(false)

  // Loading Registry Tab State
  const [isRegistryModalOpen, setIsRegistryModalOpen] = useState(false)
  const [loadingRegistry, setLoadingRegistry] = useState<any[]>([])

  // Handlers for Import Data
  const handleLoadDemo = () => {
    const demoData = `A123BC36\tНКЛ-001\tВоронеж\tМосква\t25.5\t25.0\t35.5\t10.0\t25.5\t2026-01-01\t2026-01-05
B456HM46\tНКЛ-002\tБелгород\tКурск\t30.0\t29.5\t40.0\t10.0\t30.0\t2026-01-02\t2026-01-08
C789KO36\tНКЛ-003\tКурск\tВоронеж\t22.8\t22.8\t32.8\t10.0\t22.8\t2026-01-03\t2026-01-06
E234PT68\tНКЛ-004\tВоронеж\tСанкт-Петербург\t28.0\t27.2\t38.0\t10.0\t28.0\t2026-01-04\t2026-01-10
M111AA77\tНКЛ-005\tМосква\tКраснодар\t24.5\t24.5\t34.5\t10.0\t24.5\t2026-01-05\t2026-01-07`
    setRegistryInput(demoData)
  }

  const handleProcessData = () => {
    if (!registryInput.trim()) return

    const rows = registryInput.trim().split('\n')
    const processed = rows.map((row, index) => {
      const cols = row.split('\t')

      const shipped = parseFloat(cols[4]) || 0
      const accepted = parseFloat(cols[5]) || 0
      const shortage = (shipped - accepted).toFixed(2)

      const dateSent = new Date(cols[9])
      const dateRecv = new Date(cols[10])
      const downtime = Math.ceil((dateRecv.getTime() - dateSent.getTime()) / (1000 * 60 * 60 * 24))

      return {
        id: index + 1,
        transport: cols[0],
        invoice: cols[1],
        sender: cols[2],
        receiver: cols[3],
        shipped: shipped.toFixed(2),
        accepted: accepted.toFixed(2),
        shortage: shortage,
        brutto: cols[6],
        tare: cols[7],
        netto: cols[8],
        dateSent: cols[9],
        dateRecv: cols[10],
        downtime: downtime
      }
    })

    setRegistryData(processed)
    setShowRegistryStats(true)
  }

  const handleClearRegistry = () => {
    setRegistryInput('')
    setRegistryData([])
    setShowRegistryStats(false)
  }

  // Handlers for Loading Registry
  const toggleRegistryModal = () => {
    setIsRegistryModalOpen(!isRegistryModalOpen)
  }

  const handleAddLoadingRecord = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, gather form data here. For mock:
    const newItem = {
      id: loadingRegistry.length + 1,
      point: "Склад №1 (Воронеж)",
      auto: "A123BC36",
      driver: "Иванов И.И.",
      company: "ООО ТрансЛогистик",
      date: "2026-02-02",
      time: "14:00"
    }
    setLoadingRegistry([...loadingRegistry, newItem])
    setIsRegistryModalOpen(false)
  }

  const totalRecords = registryData.length
  const totalShortage = registryData.reduce((acc, curr) => acc + parseFloat(curr.shortage), 0).toFixed(2)
  const totalShipped = registryData.reduce((acc, curr) => acc + parseFloat(curr.shipped), 0).toFixed(2)
  const totalAccepted = registryData.reduce((acc, curr) => acc + parseFloat(curr.accepted), 0).toFixed(2)

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen font-sans text-slate-900 relative">
      {/* Header */}





      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Truck className="w-6 h-6 text-[#E66400]" />
            Логистика и доставка
          </h1>
          <p className="text-slate-500 mt-1">Отслеживание поставок и транспорта</p>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#E66400] hover:bg-orange-700 text-white gap-2 font-medium">
              <Plus className="w-4 h-4" />
              Новая доставка
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl">
            <RequestForm />
          </DialogContent>
        </Dialog>

        <Dialog open={!!editingRequest} onOpenChange={(open) => !open && setEditingRequest(null)}>
          <DialogContent className="max-w-3xl">
            {editingRequest && (
              <RequestForm
                initialData={editingRequest}
                action={updateRequest.bind(null, editingRequest.id)}
                onSuccess={() => setEditingRequest(null)}
              />
            )}
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-transparent p-0 h-auto gap-2 flex-wrap border-b border-slate-200 w-full justify-start rounded-none">
          <TabsTrigger
            value="general"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#E66400] data-[state=active]:text-[#E66400] text-slate-500 rounded-none bg-transparent h-10 px-4 font-medium"
          >
            <Truck className="w-4 h-4 mr-2" />
            Общая логистика
          </TabsTrigger>
          <TabsTrigger
            value="auto"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#E66400] data-[state=active]:text-[#E66400] text-slate-500 rounded-none bg-transparent h-10 px-4 font-medium"
          >
            <Truck className="w-4 h-4 mr-2" />
            Авто
          </TabsTrigger>
          <TabsTrigger
            value="wagons"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#E66400] data-[state=active]:text-[#E66400] text-slate-500 rounded-none bg-transparent h-10 px-4 font-medium"
          >
            <Train className="w-4 h-4 mr-2" />
            Вагоны
          </TabsTrigger>
          <TabsTrigger
            value="invoices"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#E66400] data-[state=active]:text-[#E66400] text-slate-500 rounded-none bg-transparent h-10 px-4 font-medium"
          >
            <FileText className="w-4 h-4 mr-2" />
            Накладные
          </TabsTrigger>
          <TabsTrigger
            value="tariffs"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#E66400] data-[state=active]:text-[#E66400] text-slate-500 rounded-none bg-transparent h-10 px-4 font-medium"
          >
            <DollarSign className="w-4 h-4 mr-2" />
            Тарифы
          </TabsTrigger>
          <TabsTrigger
            value="registry"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#E66400] data-[state=active]:text-[#E66400] text-slate-500 rounded-none bg-transparent h-10 px-4 font-medium"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Реестр
          </TabsTrigger>
          <TabsTrigger
            value="payment"
            className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#E66400] data-[state=active]:text-[#E66400] text-slate-500 rounded-none bg-transparent h-10 px-4 font-medium"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Оплата
          </TabsTrigger>
        </TabsList>

        {/* General Logistics Tab */}
        <TabsContent value="general" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 flex items-center justify-between border-slate-200 shadow-sm">
              <div>
                <div className="text-sm text-slate-500 font-medium">В пути</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{requestStats.inTransit}</div>
              </div>
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
            </Card>
            <Card className="p-4 flex items-center justify-between border-slate-200 shadow-sm">
              <div>
                <div className="text-sm text-slate-500 font-medium">На загрузке</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{requestStats.loading}</div>
              </div>
              <div className="w-10 h-10 bg-yellow-50 text-yellow-600 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
            </Card>
            <Card className="p-4 flex items-center justify-between border-slate-200 shadow-sm">
              <div>
                <div className="text-sm text-slate-500 font-medium">Доставлено сегодня</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{requestStats.delivered}</div>
              </div>
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </Card>
            <Card className="p-4 flex items-center justify-between border-slate-200 shadow-sm">
              <div>
                <div className="text-sm text-slate-500 font-medium">Всего транспорта</div>
                <div className="text-2xl font-bold text-slate-900 mt-1">{requestStats.totalTransport}</div>
              </div>
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-lg flex items-center justify-center">
                <Truck className="w-5 h-5" />
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            {requests.map((req) => (
              <Card key={req.id} className="p-6 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-lg text-slate-900">Req-{req.id}</h3>
                      <Badge variant="secondary" className={cn(
                        "font-normal",
                        req.status === 'ASSIGNED' ? "bg-blue-100 text-blue-700" :
                          req.status === 'PENDING' ? "bg-yellow-100 text-yellow-700" :
                            "bg-slate-100 text-slate-700"
                      )}>
                        {req.status === 'ASSIGNED' ? 'В пути' :
                          req.status === 'PENDING' ? 'Загрузка' : req.status}
                      </Badge>
                    </div>
                    <div className="text-slate-500 text-sm">{req.cargo} • {req.weight} т</div>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400 text-sm">
                    <Button variant="ghost" size="icon" onClick={() => setEditingRequest(req)} className="h-8 w-8">
                      <PenLine className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDelete(req.id)} className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6 bg-slate-50 p-4 rounded-lg">
                  <div className="relative">
                    <div className="font-medium text-slate-900 mb-1 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      Откуда
                    </div>
                    <div className="text-slate-600 pl-4">{req.routeFrom}</div>
                  </div>
                  <div className="relative">
                    <div className="font-medium text-slate-900 mb-1 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                      Куда
                    </div>
                    <div className="text-slate-600 pl-4">{req.routeTo}</div>
                  </div>
                </div>

                <div className="flex justify-between items-end mb-2">
                  <div className="grid grid-cols-2 gap-x-12 text-sm">
                    <div>
                      <span className="text-slate-400 flex items-center gap-2"><Truck className="w-4 h-4" /> Водитель:</span>
                      <span className="font-medium text-slate-900 ml-6">{req.vehicle?.driver || '-'}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-slate-400">Транспорт: </span>
                      <span className="font-medium text-slate-900">{req.vehicle?.plate || '-'}</span>
                    </div>
                  </div>
                </div>

                <div className="relative pt-2">
                  <div className="text-xs text-slate-400 mb-1 flex justify-between">
                    <span>Прогресс доставки</span>
                    <span>50%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full bg-blue-500")}
                      style={{ width: `50%` }}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* In Development Tabs */}
        <TabsContent value="auto" className="h-[400px] flex flex-col items-center justify-center bg-white rounded-lg border border-slate-200 mt-0">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-[#E66400] mb-4">
            <Truck className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Раздел "Авто"</h3>
          <p className="text-slate-500">Управление автомобильным транспортом</p>
          <Badge variant="secondary" className="mt-4 bg-slate-100 text-slate-500">В разработке</Badge>
        </TabsContent>

        <TabsContent value="wagons" className="h-[400px] flex flex-col items-center justify-center bg-white rounded-lg border border-slate-200 mt-0">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-[#E66400] mb-4">
            <Train className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">Раздел "Вагоны"</h3>
          <p className="text-slate-500">Управление Ж/Д перевозками</p>
          <Badge variant="secondary" className="mt-4 bg-slate-100 text-slate-500">В разработке</Badge>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6 mt-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-4 border-slate-200 shadow-sm">
              <div className="text-sm text-slate-500 font-medium">Всего</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{invoiceStats.total}</div>
            </Card>
            <Card className="p-4 border-slate-200 shadow-sm">
              <div className="text-sm text-slate-500 font-medium">Черновики</div>
              <div className="text-2xl font-bold text-slate-900 mt-1">{invoiceStats.drafts}</div>
            </Card>
            <Card className="p-4 border-slate-200 shadow-sm">
              <div className="text-sm text-slate-500 font-medium">На погрузке</div>
              <div className="text-2xl font-bold text-yellow-600 mt-1">{invoiceStats.loading}</div>
            </Card>
            <Card className="p-4 border-slate-200 shadow-sm">
              <div className="text-sm text-slate-500 font-medium">В пути</div>
              <div className="text-2xl font-bold text-blue-600 mt-1">{invoiceStats.inTransit}</div>
            </Card>
          </div>

          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Поиск по номеру, товару, перевозчику..." className="pl-9 bg-white" />
            </div>
            <Button variant="outline" className="gap-2 bg-white">
              <Filter className="w-4 h-4" /> Все статусы
            </Button>
            <Button className="bg-[#22C55E] hover:bg-green-600 text-white gap-2">
              <Plus className="w-4 h-4" /> Добавить накладную
            </Button>
          </div>

          <Card className="border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">Номер</th>
                    <th className="px-4 py-3 font-medium">Тип</th>
                    <th className="px-4 py-3 font-medium">Статус</th>
                    <th className="px-4 py-3 font-medium">Товар</th>
                    <th className="px-4 py-3 font-medium">Перевозчик</th>
                    <th className="px-4 py-3 font-medium">А/М</th>
                    <th className="px-4 py-3 font-medium">Нетто (кг)</th>
                    <th className="px-4 py-3 font-medium">Дата</th>
                    <th className="px-4 py-3 font-medium text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{inv.id}</td>
                      <td className="px-4 py-3 text-slate-500">{inv.type}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className={cn(
                          "font-normal",
                          inv.status === 'delivered' ? "bg-green-100 text-green-700 hover:bg-green-200" :
                            inv.status === 'in-transit' ? "bg-blue-100 text-blue-700 hover:bg-blue-200" :
                              "bg-slate-100 text-slate-700"
                        )}>
                          {inv.status === 'delivered' ? 'Доставлено' :
                            inv.status === 'in-transit' ? 'В пути' : inv.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-slate-900">{inv.product}</td>
                      <td className="px-4 py-3 text-slate-600">{inv.carrier}</td>
                      <td className="px-4 py-3 text-slate-600">{inv.transport}</td>
                      <td className="px-4 py-3">
                        <div className="text-slate-900 font-medium">{inv.netto}</div>
                        {inv.diff && <div className="text-red-500 text-xs">{inv.diff}</div>}
                      </td>
                      <td className="px-4 py-3 text-slate-500">{inv.date}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-orange-400 hover:text-orange-600 hover:bg-orange-50">
                            <PenLine className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Tariffs Tab */}
        <TabsContent value="tariffs" className="space-y-8 mt-0">

          {/* Rail Tariffs Section */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Train className="w-5 h-5 text-[#E66400]" />
                Тарифы ЖД (вагоны)
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" className="bg-slate-700 hover:bg-slate-800 text-white border-transparent gap-2 h-8 text-sm">
                  <Download className="w-4 h-4" /> Шаблон
                </Button>
                <Button variant="outline" className="bg-[#22C55E] hover:bg-green-600 text-white border-transparent gap-2 h-8 text-sm">
                  <Upload className="w-4 h-4" /> Экспорт
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2 h-8 text-sm">
                  <Upload className="w-4 h-4" /> Импорт из Excel
                </Button>
                <Button className="bg-[#E66400] hover:bg-orange-700 text-white gap-2 h-8 text-sm">
                  <Plus className="w-4 h-4" /> Добавить тариф
                </Button>
              </div>
            </div>
            <p className="text-sm text-slate-500 -mt-3">Управление тарифами для железнодорожных перевозок</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-purple-50/50 p-4 rounded-lg border border-purple-100">
              <div>
                <div className="text-xs text-purple-700 font-medium">Всего маршрутов</div>
                <div className="text-xl font-bold text-purple-900">{tariffStats.rail}</div>
              </div>
              <div>
                <div className="text-xs text-blue-700 font-medium">Найдено</div>
                <div className="text-xl font-bold text-blue-900">{tariffStats.rail}</div>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Поиск по станциям или кодам..." className="pl-9 bg-white" />
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
              <div className="font-bold mb-1 flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" /> Формат файла для импорта:
              </div>
              <p className="opacity-90">CSV или Excel файл с колонками: Станция отправления, Код станции отправления, Станция назначения, Код станции назначения, Тариф (в рублях без НДС)</p>
              <p className="opacity-75 mt-1 text-xs">Разделитель: точка с запятой (;) или запятая (,)</p>
            </div>

            <Card className="border-slate-200 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-white border-b border-slate-100 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium uppercase text-xs">Станция Отправления</th>
                    <th className="px-4 py-3 font-medium uppercase text-xs">Код Станции</th>
                    <th className="px-4 py-3 font-medium uppercase text-xs">Станция Назначения</th>
                    <th className="px-4 py-3 font-medium uppercase text-xs">Код Станции</th>
                    <th className="px-4 py-3 font-medium uppercase text-xs">Тариф (без НДС)</th>
                    <th className="px-4 py-3 font-medium uppercase text-xs">Дата Создания</th>
                    <th className="px-4 py-3 font-medium uppercase text-xs text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {railTariffs.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-medium text-slate-900">{t.departure}</td>
                      <td className="px-4 py-3 text-purple-600 bg-purple-50 w-fit px-2 rounded font-mono text-xs">{t.depCode}</td>
                      <td className="px-4 py-3 font-medium text-slate-900">{t.destination}</td>
                      <td className="px-4 py-3 text-purple-600 bg-purple-50 w-fit px-2 rounded font-mono text-xs">{t.destCode}</td>
                      <td className="px-4 py-3 text-[#E66400] font-bold">{t.tariff}</td>
                      <td className="px-4 py-3 text-slate-500">{t.date}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-400 hover:text-blue-600">
                            <PenLine className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-600">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>

          {/* Auto Tariffs Section */}
          <div className="space-y-4 pt-8 border-t border-slate-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Truck className="w-5 h-5 text-[#E66400]" />
                Тарифы Авто
              </h3>
              <Button className="bg-[#E66400] hover:bg-orange-700 text-white gap-2 h-8 text-sm">
                <Plus className="w-4 h-4" /> Добавить тариф
              </Button>
            </div>
            <p className="text-sm text-slate-500 -mt-3">Управление тарифами на автомобильные перевозки (каждые 50 км)</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-green-50/50 p-4 rounded-lg border border-green-100">
              <div>
                <div className="text-xs text-blue-700 font-medium">Всего тарифов</div>
                <div className="text-xl font-bold text-blue-900">{tariffStats.auto}</div>
              </div>
              <div>
                <div className="text-xs text-green-700 font-medium">Макс. расстояние</div>
                <div className="text-xl font-bold text-green-900">200 км</div>
              </div>
              <div>
                <div className="text-xs text-purple-700 font-medium">Найдено</div>
                <div className="text-xl font-bold text-purple-900">{tariffStats.auto}</div>
              </div>
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input placeholder="Поиск по расстоянию, коэффициенту или цене..." className="pl-9 bg-white" />
            </div>

            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg text-sm text-blue-800">
              <div className="font-bold mb-1 flex items-center gap-2">
                <Truck className="w-4 h-4" /> Правила расчета тарифов:
              </div>
              <p className="opacity-90">Тарифы устанавливаются для расстояний с шагом 50 км (50, 100, 150, 200 и т.д.). Коэффициент учитывает экономию на дальних расстояниях.</p>
              <p className="font-medium mt-1 text-xs">Итоговая цена = Базовая стоимость × Коэффициент</p>
            </div>

            <Card className="border-slate-200 overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-white border-b border-slate-100 text-slate-500">
                  <tr>
                    <th className="px-4 py-3 font-medium uppercase text-xs">Расстояние (км)</th>
                    <th className="px-4 py-3 font-medium uppercase text-xs">Коэффициент</th>
                    <th className="px-4 py-3 font-medium uppercase text-xs">Цена без НДС</th>
                    <th className="px-4 py-3 font-medium uppercase text-xs">Цена за км</th>
                    <th className="px-4 py-3 font-medium uppercase text-xs">Дата Создания</th>
                    <th className="px-4 py-3 font-medium uppercase text-xs text-right">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {autoTariffs.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-900">{t.distance}</td>
                      <td className="px-4 py-3">
                        <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200">
                          {t.coefficient}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-[#E66400] font-bold">{t.price}</td>
                      <td className="px-4 py-3 text-slate-500">{t.priceKm}</td>
                      <td className="px-4 py-3 text-slate-500">{t.date}</td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-400 hover:text-blue-600">
                            <PenLine className="w-3 h-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-600">
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
          </div>
        </TabsContent>

        {/* Registry Tab */}
        <TabsContent value="registry" className="space-y-6 mt-0">
          <Tabs defaultValue="import" className="w-full">
            <TabsList className="bg-transparent p-0 h-auto gap-6 border-b border-slate-200 w-full justify-start rounded-none mb-6">
              <TabsTrigger
                value="import"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#E66400] data-[state=active]:text-[#E66400] text-slate-500 rounded-none bg-transparent h-10 px-0 font-medium pb-2"
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Импорт данных
              </TabsTrigger>
              <TabsTrigger
                value="loading"
                className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#E66400] data-[state=active]:text-[#E66400] text-slate-500 rounded-none bg-transparent h-10 px-0 font-medium pb-2"
              >
                <Truck className="w-4 h-4 mr-2" />
                Реестр на погрузку
              </TabsTrigger>
            </TabsList>

            <TabsContent value="import" className="space-y-8">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Импорт данных из Excel</h2>
                  <p className="text-slate-500 text-sm">Автоматический учёт доставок и расчёт недогруза</p>
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleProcessData} className="bg-[#E66400] hover:bg-orange-700 text-white gap-2">
                    Обработать данные
                  </Button>
                  <Button onClick={handleClearRegistry} variant="secondary" className="bg-slate-500 hover:bg-slate-600 text-white gap-2">
                    Очистить
                  </Button>
                  <Button onClick={handleLoadDemo} className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                    Загрузить демо
                  </Button>
                </div>
              </div>

              {showRegistryStats && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="p-4 bg-blue-50 border-blue-100 shadow-sm">
                    <div className="text-xs text-blue-700 font-medium mb-1">Всего записей</div>
                    <div className="text-2xl font-bold text-blue-900">{totalRecords}</div>
                  </Card>
                  <Card className="p-4 bg-yellow-50 border-yellow-100 shadow-sm">
                    <div className="text-xs text-yellow-700 font-medium mb-1">Общий недогруз</div>
                    <div className="text-2xl font-bold text-yellow-900">{totalShortage} т</div>
                  </Card>
                  <Card className="p-4 bg-green-50 border-green-100 shadow-sm">
                    <div className="text-xs text-green-700 font-medium mb-1">Отгружено</div>
                    <div className="text-2xl font-bold text-green-900">{totalShipped} т</div>
                  </Card>
                  <Card className="p-4 bg-purple-50 border-purple-100 shadow-sm">
                    <div className="text-xs text-purple-700 font-medium mb-1">Принято</div>
                    <div className="text-2xl font-bold text-purple-900">{totalAccepted} т</div>
                  </Card>
                </div>
              )}

              <div className="space-y-2">
                <label className="flex items-center gap-2 font-medium text-slate-700">
                  <FileSpreadsheet className="w-4 h-4 text-[#E66400]" />
                  Вставьте данные из Excel:
                </label>
                <Textarea
                  value={registryInput}
                  onChange={(e) => setRegistryInput(e.target.value)}
                  placeholder={`Скопируйте данные из Excel и вставьте сюда\n\nФормат данных (разделитель: табуляция):\nНомер_авто | Накладная | Отправитель | Получатель | Отгруж_вес | Приемн_вес | Брутто | Тара | Нетто | Дата_отправки | Дата_приемки`}
                  className="min-h-[200px] font-mono text-sm bg-white"
                />
                <p className="text-xs text-slate-400">Данные должны быть разделены табуляцией. Скопируйте строки из Excel и вставьте в поле выше.</p>
              </div>

              {!showRegistryStats && (
                <div className="p-6 bg-yellow-50 border border-yellow-100 rounded-lg">
                  <h4 className="flex items-center gap-2 font-bold text-yellow-800 mb-4">
                    <FileText className="w-4 h-4" />
                    Инструкция по импорту:
                  </h4>
                  <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-800 opacity-90">
                    <li>Откройте Excel файл с данными о доставках</li>
                    <li>Выделите и скопируйте данные (Ctrl+C)</li>
                    <li>Вставьте данные в текстовое поле выше (Ctrl+V)</li>
                    <li>Нажмите кнопку "Обработать данные"</li>
                    <li>Система автоматически рассчитает недогруз и количество дней простоя</li>
                  </ol>
                </div>
              )}

              {showRegistryStats && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 font-bold text-slate-900">
                    Обработанные данные ({totalRecords} записей)
                  </div>
                  <Card className="border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs text-left">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase">
                          <tr>
                            <th className="px-4 py-3 font-medium">№</th>
                            <th className="px-4 py-3 font-medium">Номер Авто/Вагона</th>
                            <th className="px-4 py-3 font-medium">Накладная</th>
                            <th className="px-4 py-3 font-medium">Отправитель</th>
                            <th className="px-4 py-3 font-medium">Получатель</th>
                            <th className="px-4 py-3 font-medium">Отгружено (т)</th>
                            <th className="px-4 py-3 font-medium">Принято (т)</th>
                            <th className="px-4 py-3 font-medium">Недогруз (т)</th>
                            <th className="px-4 py-3 font-medium">Брутто</th>
                            <th className="px-4 py-3 font-medium">Тара</th>
                            <th className="px-4 py-3 font-medium">Нетто</th>
                            <th className="px-4 py-3 font-medium">Дата отправки</th>
                            <th className="px-4 py-3 font-medium">Дата приёмки</th>
                            <th className="px-4 py-3 font-medium text-center">Простой (дней)</th>
                            <th className="px-4 py-3 font-medium text-right">Действия</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {registryData.map((row) => (
                            <tr key={row.id} className="hover:bg-slate-50">
                              <td className="px-4 py-3 text-slate-500">{row.id}</td>
                              <td className="px-4 py-3 font-medium text-slate-900">{row.transport}</td>
                              <td className="px-4 py-3 text-slate-500">{row.invoice}</td>
                              <td className="px-4 py-3 text-slate-600">{row.sender}</td>
                              <td className="px-4 py-3 text-slate-600">{row.receiver}</td>
                              <td className="px-4 py-3 text-slate-900">{row.shipped}</td>
                              <td className="px-4 py-3 text-slate-900">{row.accepted}</td>
                              <td className="px-4 py-3">
                                <Badge variant="secondary" className={cn(
                                  "font-mono",
                                  parseFloat(row.shortage) > 0 ? "bg-red-100 text-red-700 hover:bg-red-200" : "bg-green-100 text-green-700 hover:bg-green-200"
                                )}>
                                  {row.shortage}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-slate-500">{row.brutto}</td>
                              <td className="px-4 py-3 text-slate-500">{row.tare}</td>
                              <td className="px-4 py-3 text-slate-500">{row.netto}</td>
                              <td className="px-4 py-3 text-slate-500">{row.dateSent}</td>
                              <td className="px-4 py-3 text-slate-500">{row.dateRecv}</td>
                              <td className="px-4 py-3 text-center">
                                <Badge variant="secondary" className={cn(
                                  "w-6 h-6 flex items-center justify-center p-0 mx-auto",
                                  row.downtime > 5 ? "bg-red-100 text-red-700" :
                                    row.downtime > 3 ? "bg-yellow-100 text-yellow-700" :
                                      "bg-green-100 text-green-700"
                                )}>
                                  {row.downtime}
                                </Badge>
                              </td>
                              <td className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                  <Button variant="ghost" size="icon" className="h-6 w-6 text-blue-400 hover:text-blue-600">
                                    <PenLine className="w-3 h-3" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 text-red-400 hover:text-red-600">
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
                      <h4 className="flex items-center gap-2 font-bold text-slate-900 mb-4 text-sm">
                        <RefreshCcw className="w-4 h-4 text-[#E66400]" />
                        Автоматические расчёты
                      </h4>
                      <div className="space-y-4 text-sm">
                        <div>
                          <div className="font-medium text-red-700 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" /> Недогруз
                          </div>
                          <p className="text-slate-500 text-xs ml-3.5 mt-1">Рассчитывается автоматически: Недогруз = Отгруженный вес - Принятый вес</p>
                        </div>
                        <div>
                          <div className="font-medium text-[#E66400] flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-[#E66400]" /> Нетто
                          </div>
                          <p className="text-slate-500 text-xs ml-3.5 mt-1">Нетто = Брутто - Тара (вес груза без упаковки)</p>
                        </div>
                        <div>
                          <div className="font-medium text-blue-700 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" /> Количество дней простоя
                          </div>
                          <p className="text-slate-500 text-xs ml-3.5 mt-1">Рассчитывается как разница между датой приёмки и датой отправки</p>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg border border-slate-100 shadow-sm">
                      <h4 className="flex items-center gap-2 font-bold text-slate-900 mb-4 text-sm">
                        <Info className="w-4 h-4 text-[#E66400]" />
                        Цветовые индикаторы
                      </h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-4 text-xs">
                          <Badge variant="secondary" className="bg-red-100 text-red-700 hover:bg-red-200 w-16 justify-center">Красный</Badge>
                          <span className="text-slate-500">Недогруз &gt; 0 или Простой &gt; 5 дней — требует внимания</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 w-16 justify-center">Жёлтый</Badge>
                          <span className="text-slate-500">Простой 3-5 дней — средний уровень</span>
                        </div>
                        <div className="flex items-center gap-4 text-xs">
                          <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-200 w-16 justify-center">Зелёный</Badge>
                          <span className="text-slate-500">Недогруз = 0 или Простой &lt;= 3 дней — нормальное состояние</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="loading" className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Реестр на погрузку</h2>
                  <p className="text-slate-500 text-sm">Формирование списка транспорта для отправки на хозяйство</p>
                </div>
                {loadingRegistry.length > 0 && (
                  <Button onClick={toggleRegistryModal} className="bg-[#E66400] hover:bg-orange-700 text-white gap-2">
                    <Plus className="w-4 h-4" /> Добавить запись
                  </Button>
                )}
              </div>

              {loadingRegistry.length === 0 ? (
                <Card className="py-20 flex flex-col items-center justify-center text-center border-slate-200 shadow-sm bg-white">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 mb-6">
                    <Truck className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Реестр пуст</h3>
                  <p className="text-slate-500 max-w-sm mx-auto mb-8">
                    Добавьте первую запись для создания реестра на погрузку
                  </p>
                  <Button onClick={toggleRegistryModal} className="bg-[#E66400] hover:bg-orange-700 text-white gap-2 h-11 px-6">
                    <Plus className="w-5 h-5" /> Добавить запись
                  </Button>
                </Card>
              ) : (
                <Card className="border-slate-200 overflow-hidden">
                  <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">Пункт погрузки</th>
                        <th className="px-4 py-3 font-medium">Номер авто</th>
                        <th className="px-4 py-3 font-medium">Водитель</th>
                        <th className="px-4 py-3 font-medium">Компания</th>
                        <th className="px-4 py-3 font-medium">Дата</th>
                        <th className="px-4 py-3 font-medium">Время</th>
                        <th className="px-4 py-3 font-medium text-right">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {loadingRegistry.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-slate-900">{item.point}</td>
                          <td className="px-4 py-3 font-medium text-slate-900">{item.auto}</td>
                          <td className="px-4 py-3 text-slate-600">{item.driver}</td>
                          <td className="px-4 py-3 text-slate-600">{item.company}</td>
                          <td className="px-4 py-3 text-slate-600">{item.date}</td>
                          <td className="px-4 py-3 text-slate-600">{item.time}</td>
                          <td className="px-4 py-3 text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-400 hover:text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </Card>
              )}

              {/* Modal Overlay */}
              {isRegistryModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                  <Card className="w-full max-w-lg bg-white shadow-xl animate-in fade-in zoom-in duration-200">
                    <div className="flex justify-between items-center p-6 border-b border-slate-100">
                      <h3 className="text-xl font-bold text-slate-900">Добавить запись в реестр</h3>
                      <Button variant="ghost" size="icon" onClick={toggleRegistryModal} className="text-slate-400 hover:text-slate-600 -mr-2">
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                    <form onSubmit={handleAddLoadingRecord}>
                      <div className="p-6 space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Пункт погрузки</label>
                          <Input placeholder="Например: Склад №1 (Воронеж)" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Номер авто/вагона</label>
                            <Input placeholder="A123BC36" required />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Фамилия водителя</label>
                            <Input placeholder="Иванов И.И." required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-slate-700">Транспортная компания</label>
                          <Input placeholder='ООО "ТрансЛогистик"' required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Дата погрузки</label>
                            <Input placeholder="дд.мм.гггг" type="date" required />
                          </div>
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-700">Время погрузки</label>
                            <Input placeholder="--:--" type="time" required />
                          </div>
                        </div>
                      </div>
                      <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3 rounded-b-lg">
                        <Button type="button" variant="outline" onClick={toggleRegistryModal} className="bg-white">
                          Отмена
                        </Button>
                        <Button type="submit" className="bg-[#E66400] hover:bg-orange-700 text-white">
                          Добавить
                        </Button>
                      </div>
                    </form>
                  </Card>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </TabsContent>

        {/* Payment Tab */}
        <TabsContent value="payment" className="space-y-6 mt-0">
          <LogisticsPaymentTab />
        </TabsContent>
      </Tabs>
    </div>
  )
}
