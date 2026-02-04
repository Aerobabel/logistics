import { getAnalyticsData } from './actions'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Package, FileText, Truck, TrendingUp, Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AnalyticsPage() {
  const {
    requestsCount,
    contractsCount,
    offersCount,
    vehiclesCount,
    topCounterparties,
    recentRequests
  } = await getAnalyticsData()

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen font-sans text-slate-900">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Аналитика</h1>
        <p className="text-slate-500 mt-1">Ключевые показатели и последние операции.</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <Card className="p-6 border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Заявки</div>
              <div className="text-3xl font-bold text-slate-900 mt-1">{requestsCount}</div>
            </div>
            <Package className="w-8 h-8 text-orange-500" />
          </div>
        </Card>
        <Card className="p-6 border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Договоры</div>
              <div className="text-3xl font-bold text-slate-900 mt-1">{contractsCount}</div>
            </div>
            <FileText className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-6 border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Заявки на закупку</div>
              <div className="text-3xl font-bold text-slate-900 mt-1">{offersCount}</div>
            </div>
            <TrendingUp className="w-8 h-8 text-green-500" />
          </div>
        </Card>
        <Card className="p-6 border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-500">Техника</div>
              <div className="text-3xl font-bold text-slate-900 mt-1">{vehiclesCount}</div>
            </div>
            <Truck className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6 border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5 text-orange-500" />
            Топ контрагенты
          </h3>
          <div className="space-y-3">
            {topCounterparties.map(cp => (
              <div key={cp.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
                <div>
                  <div className="font-medium text-slate-900">{cp.name}</div>
                  <div className="text-xs text-slate-500">Договоров: {cp.contracts.length}</div>
                </div>
                <Badge variant="secondary" className="bg-slate-100 text-slate-700">{cp.status}</Badge>
              </div>
            ))}
            {topCounterparties.length === 0 && (
              <p className="text-sm text-slate-500">Нет данных по контрагентам.</p>
            )}
          </div>
        </Card>

        <Card className="p-6 border-slate-200 shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Последние заявки</h3>
          <div className="space-y-3">
            {recentRequests.map(req => (
              <div key={req.id} className="flex items-center justify-between p-3 border border-slate-100 rounded-lg">
                <div>
                  <div className="font-medium text-slate-900">{req.cargo}</div>
                  <div className="text-xs text-slate-500">{req.routeFrom} → {req.routeTo}</div>
                </div>
                <Badge variant="secondary" className="bg-slate-100 text-slate-700">{req.status}</Badge>
              </div>
            ))}
            {recentRequests.length === 0 && (
              <p className="text-sm text-slate-500">Заявок пока нет.</p>
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
