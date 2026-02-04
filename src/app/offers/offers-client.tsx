'use client'

import { useMemo, useState, useActionState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Plus,
  Search,
  FileText,
  CheckCircle2,
  XCircle,
  Clock,
  X,
  Archive,
  MessageSquare,
  MapPin,
  Calendar,
  User,
  Trash2
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createOffer, deleteOffer, toggleOfferArchive, updateOfferStatus } from './actions'

type Offer = {
  id: number
  farmer: string
  status: string
  date: string
  manager: string | null
  product: string | null
  quantity: string | null
  price: string | null
  loadingAddress: string | null
  deliveryAddress: string | null
  quality: string | null
  note: string | null
  isArchived: boolean
}

export default function OffersClient({ initialOffers }: { initialOffers: Offer[] }) {
  const [isAddFormOpen, setIsAddFormOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const [state, formAction] = useActionState(createOffer, null)

  useEffect(() => {
    if (state?.success) {
      setIsAddFormOpen(false)
    }
  }, [state])

  const stats = useMemo(() => {
    const total = initialOffers.length
    const pending = initialOffers.filter(o => o.status === 'pending').length
    const approved = initialOffers.filter(o => o.status === 'approved').length
    const rejected = initialOffers.filter(o => o.status === 'rejected').length
    return { total, pending, approved, rejected }
  }, [initialOffers])

  const filteredOffers = useMemo(() => {
    if (filter === 'all') return initialOffers
    return initialOffers.filter(o => o.status === filter)
  }, [filter, initialOffers])

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen font-sans text-slate-900">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <FileText className="w-6 h-6 text-[#E66400]" />
          Заявки на закупку
        </h1>
        <p className="text-slate-500 mt-1">Управляйте заявками фермеров и согласованием условий.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 flex items-center justify-between border-slate-200 shadow-sm">
          <div>
            <div className="text-sm text-slate-500 font-medium">Всего заявок</div>
            <div className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</div>
          </div>
          <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
            <FileText className="w-5 h-5" />
          </div>
        </Card>
        <Card className="p-4 flex items-center justify-between border-yellow-200 bg-yellow-50/50 shadow-sm">
          <div>
            <div className="text-sm text-yellow-700 font-medium">На согласовании</div>
            <div className="text-2xl font-bold text-yellow-900 mt-1">{stats.pending}</div>
          </div>
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
            <Clock className="w-5 h-5" />
          </div>
        </Card>
        <Card className="p-4 flex items-center justify-between border-green-200 bg-green-50/50 shadow-sm">
          <div>
            <div className="text-sm text-green-700 font-medium">Одобрено</div>
            <div className="text-2xl font-bold text-green-900 mt-1">{stats.approved}</div>
          </div>
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </Card>
        <Card className="p-4 flex items-center justify-between border-red-200 bg-red-50/50 shadow-sm">
          <div>
            <div className="text-sm text-red-700 font-medium">Отклонено</div>
            <div className="text-2xl font-bold text-red-900 mt-1">{stats.rejected}</div>
          </div>
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center text-red-600">
            <XCircle className="w-5 h-5" />
          </div>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Поиск по фермеру, продукту, адресу..."
            className="pl-9 bg-white border-slate-200 w-full"
          />
        </div>
        <div className="flex bg-white rounded-lg border border-slate-200 p-1">
          <button
            onClick={() => setFilter('all')}
            className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-colors", filter === 'all' ? "bg-[#E66400] text-white" : "text-slate-600 hover:bg-slate-50")}
          >
            Все
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-colors", filter === 'pending' ? "bg-yellow-500 text-white" : "text-slate-600 hover:bg-slate-50")}
          >
            На согласовании
          </button>
          <button
            onClick={() => setFilter('approved')}
            className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-colors", filter === 'approved' ? "bg-green-600 text-white" : "text-slate-600 hover:bg-slate-50")}
          >
            Одобрено
          </button>
          <button
            onClick={() => setFilter('rejected')}
            className={cn("px-4 py-1.5 rounded-md text-sm font-medium transition-colors", filter === 'rejected' ? "bg-red-600 text-white" : "text-slate-600 hover:bg-slate-50")}
          >
            Отклонено
          </button>
        </div>
        {!isAddFormOpen && (
          <Button onClick={() => setIsAddFormOpen(true)} className="bg-[#E66400] hover:bg-orange-700 text-white gap-2 font-medium">
            <Plus className="w-4 h-4" /> Новая заявка
          </Button>
        )}
      </div>

      {isAddFormOpen && (
        <Card className="p-6 border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-5 h-5 text-[#E66400]" />
              Создание заявки
            </h2>
            <Button variant="ghost" size="sm" onClick={() => setIsAddFormOpen(false)} className="bg-[#E66400] text-white hover:bg-orange-700 gap-2">
              <X className="w-4 h-4" /> Закрыть
            </Button>
          </div>

          <form action={formAction} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Фермер (контрагент) *</Label>
                <Input name="farmer" placeholder="Название контрагента" required />
              </div>
              <div className="space-y-2">
                <Label>Дата заявки *</Label>
                <Input name="date" type="date" required />
              </div>
              <div className="space-y-2">
                <Label>Продукт *</Label>
                <Input name="product" placeholder="Пшеница 3 класс" required />
              </div>
              <div className="space-y-2">
                <Label>Количество (т)</Label>
                <Input name="quantity" placeholder="500" />
              </div>
              <div className="space-y-2">
                <Label>Цена (₽/т)</Label>
                <Input name="price" placeholder="12500" />
              </div>
              <div className="space-y-2">
                <Label>Менеджер</Label>
                <Input name="manager" placeholder="ФИО менеджера" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Адрес погрузки</Label>
                <Input name="loadingAddress" placeholder="Адрес погрузки" />
              </div>
              <div className="space-y-2">
                <Label>Адрес выгрузки</Label>
                <Input name="deliveryAddress" placeholder="Адрес выгрузки" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Качество</Label>
              <Input name="quality" placeholder="Протеин, влажность, сорность..." />
            </div>
            <div className="space-y-2">
              <Label>Комментарий</Label>
              <Textarea name="note" placeholder="Примечание к заявке" className="min-h-[80px]" />
            </div>
            <input type="hidden" name="status" value="pending" />

            <div className="flex gap-3">
              <Button className="bg-[#E66400] hover:bg-orange-700 text-white font-medium" type="submit">
                Сохранить заявку
              </Button>
              <Button variant="secondary" onClick={() => setIsAddFormOpen(false)} type="button">
                Отмена
              </Button>
            </div>
            {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
          </form>
        </Card>
      )}

      <div className="space-y-4">
        {filteredOffers.map((offer) => (
          <Card key={offer.id} className="p-0 border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white rounded-t-lg">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-slate-900">{offer.farmer}</h3>
                {offer.isArchived ? (
                  <Badge variant="secondary" className="bg-slate-100 text-slate-500 hover:bg-slate-200 gap-1 font-normal">
                    <Archive className="w-3 h-3" /> В архиве
                  </Badge>
                ) : (
                  <Badge className={cn(
                    "font-normal gap-1",
                    offer.status === 'approved' ? "bg-green-100 text-green-700 hover:bg-green-200" :
                      offer.status === 'pending' ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200" :
                        "bg-red-100 text-red-700 hover:bg-red-200"
                  )}>
                    {offer.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                    {offer.status === 'pending' && <Clock className="w-3 h-3" />}
                    {offer.status === 'rejected' && <XCircle className="w-3 h-3" />}
                    {offer.status === 'approved' ? 'Одобрено' : offer.status === 'pending' ? 'На согласовании' : 'Отклонено'}
                  </Badge>
                )}
              </div>
              <div className="flex flex-col items-end">
                <div className="text-xs text-slate-400">Цена закупки</div>
                <div className="text-lg font-bold text-slate-900">{offer.price || '-'}</div>
              </div>
            </div>

            <div className="p-4 space-y-4">
              <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                <User className="w-3 h-3" /> {offer.manager || '-'} - <Calendar className="w-3 h-3" /> {new Date(offer.date).toLocaleDateString()}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-4">
                <div className="md:col-span-3 p-3 bg-orange-50/50 rounded-lg border border-orange-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                    <span className="text-xs font-bold text-orange-800 uppercase">Продукт</span>
                  </div>
                  <div className="font-medium text-slate-900">{offer.product || '-'}</div>
                </div>
                <div className="md:col-span-2 p-3 bg-blue-50/50 rounded-lg border border-blue-100">
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                    <span className="text-xs font-bold text-blue-800 uppercase">Объем</span>
                  </div>
                  <div className="font-medium text-slate-900">{offer.quantity || '-'}</div>
                </div>
                <div className="md:col-span-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 uppercase">Погрузка</span>
                  </div>
                  <div className="text-sm text-slate-700">{offer.loadingAddress || '-'}</div>
                </div>
                <div className="md:col-span-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin className="w-3 h-3 text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 uppercase">Выгрузка</span>
                  </div>
                  <div className="text-sm text-slate-700">{offer.deliveryAddress || '-'}</div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4">
                <div className="grid grid-cols-1 gap-2">
                  <div className="text-sm">
                    <span className="text-slate-500">Качество:</span> <span className="text-slate-900">{offer.quality || '-'}</span>
                  </div>
                  {offer.note && (
                    <div className="text-sm p-2 bg-blue-50 text-blue-800 rounded border border-blue-100">
                      <span className="font-medium">Комментарий:</span> {offer.note}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-lg flex flex-wrap gap-3 items-center">
              <form action={updateOfferStatus.bind(null, offer.id, 'approved')}>
                <Button className="bg-[#22C55E] hover:bg-green-600 text-white gap-2 h-9" type="submit">
                  <CheckCircle2 className="w-4 h-4" /> Одобрить
                </Button>
              </form>
              <form action={updateOfferStatus.bind(null, offer.id, 'rejected')}>
                <Button className="bg-[#EF4444] hover:bg-red-600 text-white gap-2 h-9" type="submit">
                  <XCircle className="w-4 h-4" /> Отклонить
                </Button>
              </form>
              <Button variant="outline" className="bg-blue-500 hover:bg-blue-600 text-white border-transparent gap-2 h-9">
                <MessageSquare className="w-4 h-4" /> Написать
              </Button>
              <form action={toggleOfferArchive.bind(null, offer.id, offer.isArchived)}>
                <Button variant="outline" className="bg-slate-600 hover:bg-slate-700 text-white border-transparent gap-2 h-9" type="submit">
                  <Archive className="w-4 h-4" /> {offer.isArchived ? 'Вернуть' : 'В архив'}
                </Button>
              </form>
              <form action={deleteOffer.bind(null, offer.id)} className="ml-auto">
                <Button variant="ghost" size="icon" className="h-9 w-9 text-red-500 hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
