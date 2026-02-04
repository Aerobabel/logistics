import Link from 'next/link'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Users, Truck, FileText, ArrowUpRight } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Панель управления</h1>

      <div className="grid gap-6 md:grid-cols-3">
        <Link href="/contragents">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Контрагенты</CardTitle>
              <Users className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">7 активных</div>
              <p className="text-xs text-muted-foreground">+2 за месяц</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/requests">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Активные заявки</CardTitle>
              <Truck className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">12 в работе</div>
              <p className="text-xs text-muted-foreground">+5 сегодня</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/contracts">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-slate-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-slate-500">Договоры</CardTitle>
              <FileText className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-slate-900">45 подписано</div>
              <p className="text-xs text-muted-foreground">1 скоро истекает</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-slate-200">
          <CardHeader>
            <CardTitle>Быстрые действия</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Link href="/contragents/new" className="flex items-center justify-between p-3 bg-orange-50 rounded-lg group hover:bg-orange-100 transition-colors">
              <span className="font-medium text-orange-900">Добавить контрагента</span>
              <ArrowUpRight className="w-4 h-4 text-orange-600 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/requests" className="flex items-center justify-between p-3 bg-slate-50 rounded-lg group hover:bg-slate-100 transition-colors">
              <span className="font-medium text-slate-700">Создать заявку</span>
              <ArrowUpRight className="w-4 h-4 text-slate-500 transition-transform group-hover:translate-x-1" />
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
