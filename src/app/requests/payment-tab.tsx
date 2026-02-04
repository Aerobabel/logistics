'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
    FileText,
    Plus,
    Download,
    Trash2,
    CheckCircle2,
    Clock,
    Send,
    FileSpreadsheet,
    Building2,
    LayoutTemplate,
    CreditCard,
    Cloud,
    ArrowUpRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Mock Data
const mockDocuments = [
    {
        id: 'АКТ-2024/001',
        type: 'Акт',
        carrier: 'ООО "ТрансЛогистик"',
        route: 'Воронеж ? Москва',
        weight: '25.5',
        sum: '125 000 ₽',
        date: '15.01.2024',
        status: 'signed',
        edoStatus: 'Отправлен в 1С'
    },
    {
        id: 'ТОРГ-2024/045',
        type: 'ТОРГ-12',
        carrier: 'ИП Иванов А.А.',
        route: 'Курск ? Белгород',
        weight: '20.0',
        sum: '85 000 ₽',
        date: '18.01.2024',
        status: 'edo',
        edoStatus: 'Ожидает подписания'
    },
    {
        id: 'УПД-2024/012',
        type: 'УПД',
        carrier: 'ООО "АвтоТранс"',
        route: 'Воронеж ? Краснодар',
        weight: '30.0',
        sum: '195 000 ₽',
        date: '20.01.2024',
        status: 'draft',
        edoStatus: '—'
    }
]

export default function LogisticsPaymentTab() {
    // Create Act State
    const [actData, setActData] = useState({
        number: 'АКТ-2024/001',
        date: '04.01.2026',
        serviceType: 'Транспортные услуги',
        carrier: '',
        inn: '1234567890',
        kpp: '123456789',
        address: 'г. Москва, ул. Примерная, д. 1',
        auto: 'A123BC',
        driver: 'Иванов И.И.',
        route: 'Воронеж ? Москва',
        weight: '0',
        tariff: '0',
        sum: '0'
    })

    // Create TORG State
    const [torgData, setTorgData] = useState({
        number: 'ТОРГ-2024/001',
        date: '04.01.2026',
        product: 'Транспортные услуги',
        shipper: '',
        consignee: '',
        quantity: '0',
        price: '0',
        sum: '0'
    })

    return (
        <div className="space-y-6">
            <Tabs defaultValue="list" className="w-full">
                <TabsList className="bg-transparent p-0 h-auto gap-6 border-b border-slate-200 w-full justify-start rounded-none mb-6">
                    <TabsTrigger
                        value="list"
                        className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#E66400] data-[state=active]:text-[#E66400] text-slate-500 rounded-none bg-transparent h-10 px-0 font-medium pb-2"
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Список документов
                    </TabsTrigger>
                    <TabsTrigger
                        value="create-act"
                        className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#E66400] data-[state=active]:text-[#E66400] text-slate-500 rounded-none bg-transparent h-10 px-0 font-medium pb-2"
                    >
                        <FileText className="w-4 h-4 mr-2" />
                        Создать Акт
                    </TabsTrigger>
                    <TabsTrigger
                        value="create-torg"
                        className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#E66400] data-[state=active]:text-[#E66400] text-slate-500 rounded-none bg-transparent h-10 px-0 font-medium pb-2"
                    >
                        <LayoutTemplate className="w-4 h-4 mr-2" />
                        Создать ТОРГ-12
                    </TabsTrigger>
                    <TabsTrigger
                        value="templates"
                        className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-[#E66400] data-[state=active]:text-[#E66400] text-slate-500 rounded-none bg-transparent h-10 px-0 font-medium pb-2"
                    >
                        <FileSpreadsheet className="w-4 h-4 mr-2" />
                        Шаблоны Excel
                    </TabsTrigger>
                </TabsList>

                {/* DOCUMENT LIST */}
                <TabsContent value="list" className="space-y-6">
                    <div className="grid grid-cols-6 gap-4">
                        <Card className="p-4 border-slate-200 shadow-sm relative overflow-hidden">
                            <div className="text-sm text-slate-500 font-medium">Всего</div>
                            <div className="text-2xl font-bold text-slate-900 mt-1">3</div>
                            <div className="absolute right-0 top-0 h-full w-1 bg-slate-200" />
                        </Card>
                        <Card className="p-4 border-slate-200 shadow-sm bg-blue-50/30 relative overflow-hidden">
                            <div className="text-sm text-blue-600 font-medium">Черновики</div>
                            <div className="text-2xl font-bold text-blue-900 mt-1">1</div>
                            <div className="absolute right-0 top-0 h-full w-1 bg-blue-200" />
                        </Card>
                        <Card className="p-4 border-slate-200 shadow-sm bg-purple-50/30 relative overflow-hidden">
                            <div className="text-sm text-purple-600 font-medium">В ЭДО</div>
                            <div className="text-2xl font-bold text-purple-900 mt-1">1</div>
                            <div className="absolute right-0 top-0 h-full w-1 bg-purple-200" />
                        </Card>
                        <Card className="p-4 border-slate-200 shadow-sm bg-green-50/30 relative overflow-hidden">
                            <div className="text-sm text-green-600 font-medium">Подписано</div>
                            <div className="text-2xl font-bold text-green-900 mt-1">1</div>
                            <div className="absolute right-0 top-0 h-full w-1 bg-green-200" />
                        </Card>
                        <Card className="p-4 border-slate-200 shadow-sm bg-indigo-50/30 relative overflow-hidden">
                            <div className="text-sm text-indigo-600 font-medium">В 1С</div>
                            <div className="text-2xl font-bold text-indigo-900 mt-1">0</div>
                            <div className="absolute right-0 top-0 h-full w-1 bg-indigo-200" />
                        </Card>
                        <Card className="p-4 border-slate-200 shadow-sm bg-teal-50/30 relative overflow-hidden">
                            <div className="text-sm text-teal-600 font-medium">Оплачено</div>
                            <div className="text-2xl font-bold text-teal-900 mt-1">0</div>
                            <div className="absolute right-0 top-0 h-full w-1 bg-teal-200" />
                        </Card>
                    </div>

                    <Card className="border-slate-200 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="bg-[#FFF8F0] border-b border-orange-100 text-slate-500">
                                    <tr>
                                        <th className="px-4 py-3 font-medium">№ Документа</th>
                                        <th className="px-4 py-3 font-medium">Тип</th>
                                        <th className="px-4 py-3 font-medium">Перевозчик</th>
                                        <th className="px-4 py-3 font-medium">Маршрут</th>
                                        <th className="px-4 py-3 font-medium">Вес (т)</th>
                                        <th className="px-4 py-3 font-medium">Сумма</th>
                                        <th className="px-4 py-3 font-medium">Дата</th>
                                        <th className="px-4 py-3 font-medium">Статус</th>
                                        <th className="px-4 py-3 font-medium">ЭДО / 1С</th>
                                        <th className="px-4 py-3 font-medium text-right">Действия</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {mockDocuments.map((doc) => (
                                        <tr key={doc.id} className="hover:bg-slate-50">
                                            <td className="px-4 py-3 font-medium text-slate-900 flex items-center gap-2">
                                                <FileText className="w-4 h-4 text-orange-400" />
                                                {doc.id}
                                            </td>
                                            <td className="px-4 py-3">
                                                <Badge variant="secondary" className={cn(
                                                    "font-normal",
                                                    doc.type === 'Акт' ? "bg-blue-100 text-blue-700" :
                                                        doc.type === 'ТОРГ-12' ? "bg-cyan-100 text-cyan-700" :
                                                            "bg-slate-100 text-slate-700"
                                                )}>
                                                    {doc.type}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-slate-500">{doc.carrier}</td>
                                            <td className="px-4 py-3 text-slate-500">{doc.route}</td>
                                            <td className="px-4 py-3 text-slate-900">{doc.weight}</td>
                                            <td className="px-4 py-3 font-bold text-[#E66400]">{doc.sum}</td>
                                            <td className="px-4 py-3 text-slate-500">{doc.date}</td>
                                            <td className="px-4 py-3">
                                                <Badge variant="outline" className={cn(
                                                    "font-medium border-0",
                                                    doc.status === 'signed' ? "bg-green-50 text-green-700" :
                                                        doc.status === 'edo' ? "bg-purple-50 text-purple-700" :
                                                            "bg-slate-100 text-slate-600"
                                                )}>
                                                    {doc.status === 'signed' && <CheckCircle2 className="w-3 h-3 mr-1" />}
                                                    {doc.status === 'edo' && <Send className="w-3 h-3 mr-1" />}
                                                    {doc.status === 'draft' && <Clock className="w-3 h-3 mr-1" />}
                                                    {doc.status === 'signed' ? 'Подписан' :
                                                        doc.status === 'edo' ? 'Отправлен в ЭДО' : 'Черновик'}
                                                </Badge>
                                            </td>
                                            <td className="px-4 py-3 text-slate-500 text-xs">{doc.edoStatus}</td>
                                            <td className="px-4 py-3 text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-green-600 hover:bg-green-50">
                                                        <Download className="w-4 h-4" />
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

                {/* CREATE ACT */}
                <TabsContent value="create-act" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Создание Акта выполненных работ</h2>
                            <p className="text-slate-500 text-sm">Заполните данные для формирования акта</p>
                        </div>
                        <Button className="bg-[#22C55E] hover:bg-green-600 text-white gap-2">
                            <FileText className="w-4 h-4" /> Добавить акт
                        </Button>
                    </div>

                    <Card className="p-6 border-slate-200">
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">№ Акта *</label>
                                <Input value={actData.number} onChange={(e) => setActData({ ...actData, number: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Дата *</label>
                                <Input value={actData.date} onChange={(e) => setActData({ ...actData, date: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Вид услуги *</label>
                                <Input value={actData.serviceType} onChange={(e) => setActData({ ...actData, serviceType: e.target.value })} />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                                <h3 className="flex items-center gap-2 font-bold text-blue-800 mb-4">
                                    <Building2 className="w-4 h-4" /> Данные перевозчика
                                </h3>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Наименование *</label>
                                        <Input placeholder="Выберите перевозчика" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">ИНН</label>
                                            <Input value={actData.inn} readOnly className="bg-slate-50 text-slate-500" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-slate-700">КПП</label>
                                            <Input value={actData.kpp} readOnly className="bg-slate-50 text-slate-500" />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Адрес</label>
                                        <Input value={actData.address} readOnly className="bg-slate-50 text-slate-500" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-green-50/50 rounded-lg border border-green-100">
                                <h3 className="flex items-center gap-2 font-bold text-green-800 mb-4">
                                    <Truck className="w-4 h-4 icons-fix-truck" /> Данные перевозки
                                </h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Номер автомобиля *</label>
                                        <Input value={actData.auto} onChange={(e) => setActData({ ...actData, auto: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Водитель</label>
                                        <Input value={actData.driver} onChange={(e) => setActData({ ...actData, driver: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Маршрут *</label>
                                        <Input value={actData.route} onChange={(e) => setActData({ ...actData, route: e.target.value })} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Вес (тонн) *</label>
                                        <Input value={actData.weight} onChange={(e) => setActData({ ...actData, weight: e.target.value })} />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-yellow-50/50 rounded-lg border border-yellow-100">
                                <h3 className="flex items-center gap-2 font-bold text-yellow-800 mb-4">
                                    <DollarSign className="w-4 h-4 icons-fix-dollar" /> Финансовая информация
                                </h3>
                                <div className="flex gap-4 items-end">
                                    <div className="flex-1 space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Тариф (₽/тонна)</label>
                                        <Input value={actData.tariff} onChange={(e) => setActData({ ...actData, tariff: e.target.value })} />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <label className="text-sm font-medium text-slate-700">Сумма (₽) *</label>
                                        <Input value={actData.sum} onChange={(e) => setActData({ ...actData, sum: e.target.value })} />
                                    </div>
                                    <div className="flex items-center gap-2 pb-3 px-4">
                                        <input type="checkbox" id="vat" className="w-4 h-4 text-[#E66400] rounded focus:ring-orange-500 border-gray-300" defaultChecked />
                                        <label htmlFor="vat" className="text-sm font-medium text-slate-700">с НДС 20%</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
                            <Button variant="secondary" className="bg-slate-100 hover:bg-slate-200">Отменить</Button>
                            <Button className="bg-[#E66400] hover:bg-orange-700 text-white gap-2">
                                <Plus className="w-4 h-4" /> Создать Акт
                            </Button>
                        </div>
                    </Card>
                </TabsContent>

                {/* CREATE TORG-12 */}
                <TabsContent value="create-torg" className="space-y-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-xl font-bold text-slate-900">Создание ТОРГ-12</h2>
                            <p className="text-slate-500 text-sm">Товарная накладная на отпуск товаров</p>
                        </div>
                    </div>

                    <Card className="p-6 border-slate-200">
                        <div className="grid grid-cols-3 gap-6 mb-8">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">№ ТОРГ-12 *</label>
                                <Input value={torgData.number} onChange={(e) => setTorgData({ ...torgData, number: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Дата *</label>
                                <Input value={torgData.date} onChange={(e) => setTorgData({ ...torgData, date: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-700">Товар *</label>
                                <Input value={torgData.product} onChange={(e) => setTorgData({ ...torgData, product: e.target.value })} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 mb-6">
                            <div className="p-4 bg-blue-50/50 rounded-lg border border-blue-100 space-y-4">
                                <h3 className="font-bold text-slate-900">Грузоотправитель</h3>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Наименование *</label>
                                    <Input placeholder="Выберите организацию" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">ИНН</label>
                                    <Input disabled className="bg-slate-50" />
                                </div>
                            </div>
                            <div className="p-4 bg-green-50/50 rounded-lg border border-green-100 space-y-4">
                                <h3 className="font-bold text-slate-900">Грузополучатель</h3>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Наименование *</label>
                                    <Input placeholder='OOO "Компания"' />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-slate-700">ИНН</label>
                                    <Input disabled className="bg-slate-50" />
                                </div>
                            </div>
                        </div>

                        <div className="p-4 bg-yellow-50/50 rounded-lg border border-yellow-100 mb-8">
                            <h3 className="font-bold text-slate-900 mb-4">Товарные данные</h3>
                            <div className="flex gap-4 items-end">
                                <div className="flex-1 space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Количество (тонн)</label>
                                    <Input value={torgData.quantity} onChange={(e) => setTorgData({ ...torgData, quantity: e.target.value })} />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Цена за тонну (₽)</label>
                                    <Input value={torgData.price} onChange={(e) => setTorgData({ ...torgData, price: e.target.value })} />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <label className="text-sm font-medium text-slate-700">Сумма (₽)</label>
                                    <Input value={torgData.sum} onChange={(e) => setTorgData({ ...torgData, sum: e.target.value })} />
                                </div>
                                <div className="flex items-center gap-2 pb-3 px-4">
                                    <input type="checkbox" id="vat-torg" className="w-4 h-4 text-[#E66400] rounded focus:ring-orange-500 border-gray-300" defaultChecked />
                                    <label htmlFor="vat-torg" className="text-sm font-medium text-slate-700">с НДС 20%</label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-between border-t border-slate-100 pt-6">
                            <Button variant="secondary" className="bg-slate-100 hover:bg-slate-200">Отменить</Button>
                            <Button className="bg-[#E66400] hover:bg-orange-700 text-white gap-2">
                                <Plus className="w-4 h-4" /> Создать ТОРГ-12
                            </Button>
                        </div>
                    </Card>
                </TabsContent>

                {/* TEMPLATES */}
                <TabsContent value="templates" className="space-y-8">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900">Шаблоны Excel для оплаты</h2>
                        <p className="text-slate-500 text-sm">Готовые шаблоны для формирования документов</p>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                        {/* Act */}
                        <Card className="p-6 border-slate-200">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                    <FileText className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Акт выполненных работ</h3>
                                    <p className="text-xs text-slate-500 mt-1">Универсальный шаблон</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 mb-6 min-h-[40px]">
                                Шаблон для оформления актов на транспортные услуги с автоматическим расчетом НДС
                            </p>
                            <Button className="w-full bg-[#22C55E] hover:bg-green-600 text-white gap-2">
                                <Download className="w-4 h-4" /> Скачать шаблон
                            </Button>
                        </Card>

                        {/* TORG-12 */}
                        <Card className="p-6 border-slate-200">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                    <LayoutTemplate className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">ТОРГ-12</h3>
                                    <p className="text-xs text-slate-500 mt-1">Товарная накладная</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 mb-6 min-h-[40px]">
                                Унифицированная форма товарной накладной с полным расчетом стоимости и НДС
                            </p>
                            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white gap-2">
                                <Download className="w-4 h-4" /> Скачать шаблон
                            </Button>
                        </Card>

                        {/* UPD */}
                        <Card className="p-6 border-slate-200">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                                    <FileSpreadsheet className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">УПД</h3>
                                    <p className="text-xs text-slate-500 mt-1">Универсальный передаточный документ</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 mb-6 min-h-[40px]">
                                Универсальный документ, объединяющий функции счета-фактуры и первичного документа
                            </p>
                            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white gap-2">
                                <Download className="w-4 h-4" /> Скачать шаблон
                            </Button>
                        </Card>

                        {/* Registry */}
                        <Card className="p-6 border-slate-200">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-[#E66400]">
                                    <FileSpreadsheet className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Реестр на оплату</h3>
                                    <p className="text-xs text-slate-500 mt-1">Сводный документ</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 mb-6 min-h-[40px]">
                                Сводный реестр документов для формирования платежного поручения
                            </p>
                            <Button className="w-full bg-[#E66400] hover:bg-orange-700 text-white gap-2">
                                <Download className="w-4 h-4" /> Скачать шаблон
                            </Button>
                        </Card>

                        {/* Invoice */}
                        <Card className="p-6 border-slate-200">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600">
                                    <CreditCard className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Счет на оплату</h3>
                                    <p className="text-xs text-slate-500 mt-1">Форма счета</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 mb-6 min-h-[40px]">
                                Шаблон счета на оплату с реквизитами компании и расчетным счетом
                            </p>
                            <Button className="w-full bg-[#E66400] hover:bg-orange-700 text-white gap-2">
                                <Download className="w-4 h-4" /> Скачать шаблон
                            </Button>
                        </Card>

                        {/* Payment Order */}
                        <Card className="p-6 border-slate-200">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                                    <DollarSign className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">Платежное поручение</h3>
                                    <p className="text-xs text-slate-500 mt-1">Банковский документ</p>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 mb-6 min-h-[40px]">
                                Форма платежного поручения для перевода денежных средств
                            </p>
                            <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
                                <Download className="w-4 h-4" /> Скачать шаблон
                            </Button>
                        </Card>
                    </div>

                    <div className="space-y-4 pt-4">
                        <h3 className="text-lg font-bold text-slate-900">Интеграции</h3>
                        <div className="grid grid-cols-2 gap-6">
                            <Card className="p-6 border-slate-200">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600">
                                        <Cloud className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Интеграция с ЭДО</h3>
                                        <p className="text-sm text-slate-500">Электронный документооборот</p>
                                        <div className="space-y-2 mt-3 text-xs text-slate-600">
                                            <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Отправка документов в ЭДО</div>
                                            <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Электронная подпись документов</div>
                                            <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Отслеживание статуса подписания</div>
                                            <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Автоматическая синхронизация</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 bg-purple-50 rounded-lg p-3 text-xs font-medium text-purple-700 flex justify-between items-center">
                                    <div>
                                        <span className="text-purple-400 block mb-0.5">Статус подключения:</span>
                                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500" /> Активно (Mock)</div>
                                    </div>
                                </div>
                            </Card>

                            <Card className="p-6 border-slate-200">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                                        <ArrowUpRight className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900">Интеграция с 1С</h3>
                                        <p className="text-sm text-slate-500">1С:Бухгалтерия</p>
                                        <div className="space-y-2 mt-3 text-xs text-slate-600">
                                            <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Выгрузка документов в 1С</div>
                                            <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Автоматическое создание проводок</div>
                                            <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Синхронизация справочников</div>
                                            <div className="flex items-center gap-2"><CheckCircle2 className="w-3 h-3 text-green-500" /> Контроль оплаты документов</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-6 bg-blue-50 rounded-lg p-3 text-xs font-medium text-blue-700 flex justify-between items-center">
                                    <div>
                                        <span className="text-blue-400 block mb-0.5">Статус подключения:</span>
                                        <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-green-500" /> Активно (Mock)</div>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </div>
                </TabsContent>
            </Tabs>

            <style jsx global>{`
        .icons-fix-truck { color: #166534; }
        .icons-fix-dollar { color: #854d0e; }
      `}</style>
            {/* 
        Note: I added some inline styles or hacks for specific icon colors inside legacy headers if tailwind classes fight with Lucide props. 
        Actually, classes should work fine.
      */}
            <div className="hidden">
                <Truck className="text-green-800" />
                <DollarSign className="text-yellow-800" />
            </div>
        </div>
    )
}

function DollarSign(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="12" x2="12" y1="2" y2="22" />
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
    )
}

function Truck(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M5 18H3c?.6 0-1?.4-1-1V7c0?.6.4-1 1-1h10c.6 0 1 .4 1 1v11" />
            <path d="M14 9h4l4 4v4c0 .6?.4 1-1 1h-2" />
            <circle cx="7" cy="18" r="2" />
            <circle cx="17" cy="18" r="2" />
        </svg>
    )
}
