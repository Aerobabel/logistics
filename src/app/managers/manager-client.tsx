'use client'

import { useState, useActionState, useEffect, useMemo } from 'react'
import { createManager } from './actions'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Users,
    Trophy,
    UserPlus,
    ArrowLeft,
    Star,
    Medal,
    TrendingUp,
    Briefcase,
    DollarSign,
    Truck,
    Droplets,
    CheckCircle2,
    CalendarDays
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Data structure matches Prisma Model
export type Manager = {
    id: number
    name: string
    role: string
    avatar: string | null
    avatarColor: string | null
    status: string
    contractsCount: number
    tonnage: number
    farmsCount: number
    shipmentsTotal: number
    shipmentsActive: number
    efficiency: number
    rating: number
    planExecution: number
    sum: string | null
    avgPrice: string | null
}



export default function ManagersClient({ initialManagers }: { initialManagers: Manager[] }) {
    const [view, setView] = useState<'list' | 'ratings'>('list')
    const [ratingCriteria, setRatingCriteria] = useState<string>('plan')
    const [isAddModalOpen, setIsAddModalOpen] = useState(false)
    const [state, formAction] = useActionState(createManager, null)

    useEffect(() => {
        if (state?.success) {
            setIsAddModalOpen(false)
        }
    }, [state])

    const stats = useMemo(() => {
        const total = initialManagers.length
        const active = initialManagers.filter(m => m.status === 'Active').length
        const contracts = initialManagers.reduce((acc, m) => acc + m.contractsCount, 0)
        const totalSum = initialManagers.reduce((acc, m) => acc + parseFloat((m.sum || '0').replace(/\D/g, '') || '0'), 0)
        const farms = initialManagers.reduce((acc, m) => acc + m.farmsCount, 0)
        const shipments = initialManagers.reduce((acc, m) => acc + m.shipmentsTotal, 0)

        const formatSum = (val: number) => {
            if (val >= 1000000) return (val / 1000000).toFixed(1) + 'M ₽'
            if (val >= 1000) return (val / 1000).toFixed(1) + 'K ₽'
            return val + ' ₽'
        }

        return [
            { label: 'Всего', value: total.toString(), color: 'bg-blue-50 text-blue-600' },
            { label: 'Активных', value: active.toString(), color: 'bg-green-50 text-green-600' },
            { label: 'Договоров', value: contracts.toString(), color: 'bg-purple-50 text-purple-600' },
            { label: 'Сумма', value: formatSum(totalSum), color: 'bg-yellow-50 text-yellow-600' },
            { label: 'Хозяйств', value: farms.toString(), color: 'bg-cyan-50 text-cyan-600' },
            { label: 'Отгрузок', value: shipments.toString(), color: 'bg-indigo-50 text-indigo-600' },
            { label: 'ГСМ (л)', value: '0', color: 'bg-orange-50 text-orange-700' }, // Not implemented
            { label: 'Пробег', value: '0 км', color: 'bg-red-50 text-red-600' }, // Not implemented
        ]
    }, [initialManagers])

    // Sorting Logic for Ratings
    const sortedManagers = [...initialManagers].sort((a, b) => {
        switch (ratingCriteria) {
            case 'plan': return b.planExecution - a.planExecution
            case 'contracts': return b.contractsCount - a.contractsCount
            case 'sum': return parseFloat((b.sum || '0').replace(/\D/g, '')) - parseFloat((a.sum || '0').replace(/\D/g, ''))
            case 'shipments': return b.shipmentsTotal - a.shipmentsTotal
            case 'volume': return b.tonnage - a.tonnage
            case 'price': return parseFloat((b.avgPrice || '0').replace(/\D/g, '')) - parseFloat((a.avgPrice || '0').replace(/\D/g, ''))
            default: return 0
        }
    })

    const getCriteriaValue = (manager: Manager) => {
        switch (ratingCriteria) {
            case 'plan': return `${manager.planExecution}%`
            case 'contracts': return manager.contractsCount
            case 'sum': return manager.sum
            case 'shipments': return manager.shipmentsTotal
            case 'volume': return `${manager.tonnage.toLocaleString()} т`
            case 'price': return manager.avgPrice
            default: return ''
        }
    }

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen font-sans text-slate-900">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-3 mb-1">
                        <div className="p-2 bg-[#E66400] rounded-lg text-white">
                            <Users className="w-6 h-6" />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Менеджеры</h1>
                    </div>
                    <p className="text-slate-500 text-sm ml-12">Аналитика работы менеджеров отдела продаж</p>
                </div>

                {view === 'list' && (
                    <div className="flex gap-3">
                        <Button
                            onClick={() => setView('ratings')}
                            className="bg-purple-600 hover:bg-purple-700 text-white gap-2 font-medium"
                        >
                            <Trophy className="w-4 h-4" /> Рейтинг менеджеров
                        </Button>
                        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-[#E66400] hover:bg-orange-700 text-white gap-2 font-medium">
                                    <UserPlus className="w-4 h-4" /> Добавить менеджера
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Добавить менеджера</DialogTitle>
                                </DialogHeader>
                                <form action={formAction} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">ФИО</Label>
                                        <Input id="name" name="name" placeholder="Иванов Иван Иванович" required />
                                    </div>
                                    <Button type="submit" className="w-full bg-[#E66400] hover:bg-orange-700">Создать</Button>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                )}
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                {stats.map((stat, i) => (
                    <Card key={i} className={cn("p-4 border-none shadow-sm flex flex-col justify-center", stat.color)}>
                        <div className="text-xs opacity-70 font-medium mb-1">{stat.label}</div>
                        <div className="text-xl font-bold">{stat.value}</div>
                    </Card>
                ))}
            </div>

            {/* View Switch */}
            {view === 'ratings' && (
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        onClick={() => setView('list')}
                        className="text-slate-500 hover:text-slate-900 gap-2 pl-0 hover:bg-transparent"
                    >
                        <ArrowLeft className="w-4 h-4" /> Вернуться к списку
                    </Button>
                </div>
            )}

            {/* Content */}
            {view === 'list' ? (
                <Card className="border-slate-200 overflow-hidden shadow-sm overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[800px]">
                        <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                            <tr>
                                <th className="px-6 py-4 font-medium w-[30%]">Менеджер</th>
                                <th className="px-6 py-4 font-medium">Статус</th>
                                <th className="px-6 py-4 font-medium">Договоров</th>
                                <th className="px-6 py-4 font-medium">Количество тонн</th>
                                <th className="px-6 py-4 font-medium">Хозяйства</th>
                                <th className="px-6 py-4 font-medium">Отгрузки</th>
                                <th className="px-6 py-4 font-medium">Эффективность</th>
                                <th className="px-6 py-4 font-medium text-right">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {initialManagers.map((m) => (
                                <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold", m.avatarColor || 'bg-slate-400')}>
                                                {m.avatar}
                                            </div>
                                            <div>
                                                <div className="font-bold text-slate-900">{m.name}</div>
                                                <div className="text-xs text-slate-500">{m.role}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge
                                            variant="secondary"
                                            className={cn(
                                                "gap-1 font-normal",
                                                m.status === 'Active'
                                                    ? "bg-green-50 text-green-700 hover:bg-green-100"
                                                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                                            )}
                                        >
                                            {m.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <CalendarDays className="w-3 h-3" />}
                                            {m.status === 'Active' ? 'Активен' : 'В отпуске'}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4 font-bold text-slate-900">{m.contractsCount}</td>
                                    <td className="px-6 py-4 font-bold text-slate-900">{m.tonnage.toLocaleString()} т</td>
                                    <td className="px-6 py-4 font-bold text-slate-900">{m.farmsCount}</td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900">{m.shipmentsTotal}</div>
                                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                            <span className="flex items-center gap-1"><Truck className="w-3 h-3 text-green-500" /> {m.shipmentsTotal - m.shipmentsActive}</span>
                                            <span className="flex items-center gap-1"><Truck className="w-3 h-3 text-orange-500" /> {m.shipmentsActive}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className={cn("font-bold", m.efficiency >= 100 ? "text-green-600" : m.efficiency >= 90 ? "text-orange-500" : "text-red-500")}>
                                            {m.efficiency}%
                                        </div>
                                        <div className="flex text-slate-300 text-[10px] gap-0.5 mt-1">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star
                                                    key={star}
                                                    className={cn("w-3 h-3 fill-current", star <= Math.round(m.rating) ? "text-orange-400" : "")}
                                                />
                                            ))}
                                            <span className="ml-1 text-slate-400">{m.rating}/5</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button className="bg-[#E66400] hover:bg-orange-700 text-white h-8 text-xs font-medium rounded-full px-4">
                                            @ Детали
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
            ) : (
                <div className="space-y-6">
                    <div className="space-y-3">
                        <h3 className="font-bold text-slate-900 ml-1">Выберите критерий оценки</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <CriteriaButton
                                active={ratingCriteria === 'plan'}
                                onClick={() => setRatingCriteria('plan')}
                                icon={TrendingUp} label="Выполнение плана" color="bg-cyan-50 text-cyan-700 border-cyan-200"
                            />
                            <CriteriaButton
                                active={ratingCriteria === 'contracts'}
                                onClick={() => setRatingCriteria('contracts')}
                                icon={Briefcase} label="Договоров" color="bg-purple-50 text-purple-700 border-purple-200"
                            />
                            <CriteriaButton
                                active={ratingCriteria === 'sum'}
                                onClick={() => setRatingCriteria('sum')}
                                icon={DollarSign} label="Сумма договоров" color="bg-yellow-50 text-yellow-700 border-yellow-200"
                            />
                            <CriteriaButton
                                active={ratingCriteria === 'shipments'}
                                onClick={() => setRatingCriteria('shipments')}
                                icon={Truck} label="Отгрузок" color="bg-blue-50 text-blue-700 border-blue-200"
                            />
                            <CriteriaButton
                                active={ratingCriteria === 'volume'}
                                onClick={() => setRatingCriteria('volume')}
                                icon={Droplets} label="Объем товара (тн)" color="bg-green-50 text-green-700 border-green-200"
                            />
                            <CriteriaButton
                                active={ratingCriteria === 'price'}
                                onClick={() => setRatingCriteria('price')}
                                icon={DollarSign} label="Средняя цена (₽/тн)" color="bg-red-50 text-red-700 border-red-200"
                            />
                        </div>
                    </div>

                    <Card className="border-slate-200 overflow-hidden shadow-sm overflow-x-auto">
                        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 font-bold text-slate-700">
                            Рейтинг менеджеров по критерию: <span className="text-slate-900">{
                                ratingCriteria === 'plan' ? 'Выполнение плана' :
                                    ratingCriteria === 'contracts' ? 'Количество договоров' :
                                        ratingCriteria === 'sum' ? 'Сумма договоров' :
                                            ratingCriteria === 'shipments' ? 'Количество отгрузок' :
                                                ratingCriteria === 'volume' ? 'Объем товара' : 'Средняя цена'
                            }</span>
                        </div>
                        <table className="w-full text-sm text-left min-w-[600px]">
                            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500">
                                <tr>
                                    <th className="px-6 py-4 font-medium w-[40%]">Менеджер</th>
                                    <th className="px-6 py-4 font-medium text-center">Позиция</th>
                                    <th className="px-6 py-4 font-medium">Статус</th>
                                    <th className="px-6 py-4 font-medium text-right">Критерий оценки</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white">
                                {sortedManagers.map((m, index) => (
                                    <tr key={m.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold", m.avatarColor || 'bg-slate-400')}>
                                                    {m.avatar}
                                                </div>
                                                <div>
                                                    <div className="font-bold text-slate-900">{m.name}</div>
                                                    <div className="text-xs text-slate-500">{m.role}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <div className="flex justify-center">
                                                {index === 0 && <Medal className="w-6 h-6 text-yellow-500 fill-yellow-100" />}
                                                {index === 1 && <Medal className="w-6 h-6 text-slate-400 fill-slate-100" />}
                                                {index === 2 && <Medal className="w-6 h-6 text-orange-700 fill-orange-100" />}
                                                {index > 2 && <span className="font-bold text-slate-400 text-lg">{index + 1}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge
                                                variant="secondary"
                                                className={cn(
                                                    "gap-1 font-normal w-fit",
                                                    m.status === 'Active'
                                                        ? "bg-green-50 text-green-700"
                                                        : "bg-blue-50 text-blue-700"
                                                )}
                                            >
                                                {m.status === 'Active' ? <CheckCircle2 className="w-3 h-3" /> : <CalendarDays className="w-3 h-3" />}
                                                {m.status === 'Active' ? 'Активен' : 'В отпуске'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-xl font-bold text-slate-800">{getCriteriaValue(m)}</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Card>
                </div>
            )}
        </div>
    )
}

function CriteriaButton({ active, onClick, icon: Icon, label, color }: any) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-center gap-3 p-4 rounded-lg border transition-all text-left",
                active ? color + " ring-1 ring-offset-1 ring-slate-300" : "bg-white border-slate-200 text-slate-500 hover:bg-slate-50"
            )}
        >
            <div className={cn("p-2 rounded-md bg-white/50")}>
                <Icon className="w-4 h-4" />
            </div>
            <span className="font-medium text-sm">{label}</span>
        </button>
    )
}
