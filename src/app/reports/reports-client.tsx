'use client'

import { useActionState, useEffect, useMemo, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  Search,
  FileText,
  DollarSign,
  TrendingUp,
  PieChart,
  Truck,
  Package,
  ShoppingCart,
  Users,
  Wallet,
  BarChart3,
  Map
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { createReport } from './actions'

type Report = {
  id: number
  title: string
  description: string
  category: string
  icon: string | null
  color: string | null
}

const iconMap: Record<string, any> = {
  DollarSign,
  TrendingUp,
  Wallet,
  FileText,
  BarChart3,
  PieChart,
  Truck,
  Map,
  Package,
  ShoppingCart,
  Users,
}

const categories = [
  { id: 'All', label: 'Все отчеты' },
  { id: 'Financial', label: 'Финансы' },
  { id: 'Accounting', label: 'Бухгалтерия' },
  { id: 'Logistics', label: 'Логистика' },
  { id: 'Warehouse', label: 'Склад' },
  { id: 'Sales', label: 'Продажи' },
]

export default function ReportsClient({ initialReports }: { initialReports: Report[] }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [state, formAction] = useActionState(createReport, null)

  useEffect(() => {
    if (state?.success) {
      const closeButton = document.getElementById('close-report-form')
      if (closeButton) closeButton.click()
    }
  }, [state])

  const filteredReports = useMemo(() => {
    return initialReports.filter(report => {
      const matchesSearch = report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory = selectedCategory === 'All' || report.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [initialReports, searchQuery, selectedCategory])

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen font-sans text-slate-900">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Отчеты</h1>
          <p className="text-slate-500 mt-1">Управляйте шаблонами отчетов и выгрузками.</p>
        </div>
        <form action={formAction} className="bg-white p-4 rounded-lg border border-slate-200 w-[420px]">
          <div className="text-sm font-medium text-slate-700 mb-3">Новый отчет</div>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label>Название</Label>
              <Input name="title" required />
            </div>
            <div className="space-y-1">
              <Label>Описание</Label>
              <Input name="description" required />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label>Категория</Label>
                <Input name="category" placeholder="Financial" required />
              </div>
              <div className="space-y-1">
                <Label>Иконка</Label>
                <Input name="icon" placeholder="DollarSign" />
              </div>
            </div>
            <div className="space-y-1">
              <Label>Цвет (class)</Label>
              <Input name="color" placeholder="bg-orange-500" />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="bg-[#E66400] hover:bg-orange-700 text-white">Сохранить</Button>
              <Button id="close-report-form" type="button" variant="secondary">Очистить</Button>
            </div>
            {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
          </div>
        </form>
      </div>

      <div className="flex justify-between items-center gap-6 bg-white p-2 rounded-xl shadow-sm border border-slate-100">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Поиск по отчетам..."
            className="pl-9 bg-slate-50 border-slate-200 focus-visible:ring-orange-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
          {categories.map(cat => (
            <Button
              key={cat.id}
              variant={selectedCategory === cat.id ? 'default' : 'ghost'}
              onClick={() => setSelectedCategory(cat.id)}
              className={cn(
                "rounded-lg text-sm font-medium transition-all h-9 px-4",
                selectedCategory === cat.id
                  ? "bg-[#E66400] hover:bg-orange-700 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              {cat.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredReports.map(report => {
          const Icon = report.icon && iconMap[report.icon] ? iconMap[report.icon] : FileText
          return (
            <Card key={report.id} className="p-6 border-slate-200 shadow-sm hover:shadow-md transition-all cursor-pointer group flex items-start gap-4">
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-white transition-transform group-hover:scale-105", report.color || 'bg-orange-500')}>
                <Icon className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 group-hover:text-[#E66400] transition-colors">{report.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{report.description}</p>
              </div>
            </Card>
          )
        })}
      </div>

      {filteredReports.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Search className="w-12 h-12 mb-4 opacity-20" />
          <p>Отчеты не найдены</p>
        </div>
      )}
    </div>
  )
}
