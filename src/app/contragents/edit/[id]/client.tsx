'use client'

import { useState, useActionState, useEffect } from 'react'
import { updateContragent } from '../../actions'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import {
    Star,
    Phone,
    Mail,
    Plus,
    Trash2,
    CheckCircle2
} from 'lucide-react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// Helper for truststars
function TrustStars({ rating, setRating, readonly }: any) {
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => !readonly && setRating(star.toString())}
                    className={`focus:outline-none ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
                >
                    <Star
                        className={`w-4 h-4 ${parseInt(rating) >= star
                            ? 'fill-orange-500 text-orange-500'
                            : 'fill-slate-200 text-slate-200'
                            }`}
                    />
                </button>
            ))}
        </div>
    )
}

export default function EditContragentClient({ contragent, managers }: { contragent: any, managers: any[] }) {
    const bindUpdate = updateContragent.bind(null, contragent.id)
    const [state, formAction] = useActionState(bindUpdate, null)

    // State management matching Create form logic
    const [selectedType, setSelectedType] = useState(contragent.type || 'Client')
    const [trustRating, setTrustRating] = useState(contragent.trustRating?.toString() || '3')
    const [status, setStatus] = useState(contragent.status || 'ACTIVE')
    const [manager, setManager] = useState(contragent.manager || (managers.length > 0 ? managers[0].name : ''))
    const [edo, setEdo] = useState(contragent.edo || 'active')
    const [activeTab, setActiveTab] = useState('basic')

    // Handling complex JSON fields - Assuming they come parsed from the server for the page
    // Note: Mock DB stores them as arrays. If they are strings, we'd need to parse. 
    // Since prisma.findUnique returns the object as stored, and we stored them as arrays in Mock DB (modified create action), 
    // we can use them directly. If they were real DB JSON types, they'd be objects too.

    // BUT: The original Edit page relied on simple inputs. We want to support the complex ones.
    const [phones, setPhones] = useState<string[]>(
        typeof contragent.phone === 'string' && contragent.phone.startsWith('[')
            ? JSON.parse(contragent.phone)
            : (contragent.phone ? [contragent.phone] : [])
    )
    const [emails, setEmails] = useState<string[]>(
        typeof contragent.email === 'string' && contragent.email.startsWith('[')
            ? JSON.parse(contragent.email)
            : (contragent.email ? [contragent.email] : [])
    )

    // Address state management
    const [addresses, setAddresses] = useState<any[]>(contragent.addresses || [])
    const [isAddingAddress, setIsAddingAddress] = useState(false)
    const [newAddress, setNewAddress] = useState({
        type: 'legal',
        country: '',
        zip: '',
        region: '',
        city: '',
        street: '',
        house: '',
        apartment: '',
        comment: ''
    })

    // Bank Accounts state
    const [bankAccounts, setBankAccounts] = useState<any[]>(contragent.bankAccounts || [])
    const [isAddingBank, setIsAddingBank] = useState(false)
    const [newBank, setNewBank] = useState({
        bic: '',
        bankName: '',
        accountNumber: '',
        corrAccount: '',
        currency: 'RUB',
        comment: '',
        isMain: false
    })

    // Employees state
    const [employees, setEmployees] = useState<any[]>(contragent.employees || [])
    const [isAddingEmployee, setIsAddingEmployee] = useState(false)
    const [newEmployee, setNewEmployee] = useState({
        lastName: '',
        firstName: '',
        middleName: '',
        position: '',
        phone: '',
        email: '',
        comment: ''
    })

    const router = useRouter()

    useEffect(() => {
        if (state?.success) {
            router.push('/contragents')
        }
    }, [state, router])

    const handleAddPhone = () => {
        const phone = prompt('Enter phone number:')
        if (phone) setPhones([...phones, phone])
    }
    const handleDeletePhone = (idx: number) => {
        setPhones(phones.filter((_, i) => i !== idx))
    }

    const handleAddEmail = () => {
        const email = prompt('Enter email:')
        if (email) setEmails([...emails, email])
    }
    const handleDeleteEmail = (idx: number) => {
        setEmails(emails.filter((_, i) => i !== idx))
    }

    // Address Handlers
    const handleAddAddress = () => {
        setAddresses([...addresses, { ...newAddress, id: Date.now() }])
        setNewAddress({
            type: 'legal',
            country: '',
            zip: '',
            region: '',
            city: '',
            street: '',
            house: '',
            apartment: '',
            comment: ''
        })
        setIsAddingAddress(false)
    }
    const handleDeleteAddress = (id: number) => {
        setAddresses(addresses.filter(a => a.id !== id))
    }

    // Bank Handlers
    const handleAddBank = () => {
        setBankAccounts([...bankAccounts, { ...newBank, id: Date.now() }])
        setNewBank({
            bic: '',
            bankName: '',
            accountNumber: '',
            corrAccount: '',
            currency: 'RUB',
            comment: '',
            isMain: false
        })
        setIsAddingBank(false)
    }
    const handleDeleteBank = (id: number) => {
        setBankAccounts(bankAccounts.filter(b => b.id !== id))
    }

    // Employee Handlers
    const handleAddEmployee = () => {
        setEmployees([...employees, { ...newEmployee, id: Date.now() }])
        setNewEmployee({
            lastName: '',
            firstName: '',
            middleName: '',
            position: '',
            phone: '',
            email: '',
            comment: ''
        })
        setIsAddingEmployee(false)
    }
    const handleDeleteEmployee = (id: number) => {
        setEmployees(employees.filter(e => e.id !== id))
    }

    return (
        <div className="min-h-screen bg-slate-50 p-6 flex justify-center items-start">

            <form action={formAction} className="w-full max-w-[1200px] bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                {/* Hidden inputs to pass complex state */}
                <input type="hidden" name="type" value={selectedType} />
                <input type="hidden" name="status" value={status} />
                <input type="hidden" name="trustRating" value={trustRating} />
                <input type="hidden" name="phone" value={JSON.stringify(phones)} />
                <input type="hidden" name="email" value={JSON.stringify(emails)} />
                <input type="hidden" name="addresses" value={JSON.stringify(addresses)} />
                <input type="hidden" name="bankAccounts" value={JSON.stringify(bankAccounts)} />
                <input type="hidden" name="employees" value={JSON.stringify(employees)} />

                {/* Header */}
                <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-white">
                    <div className="flex items-center gap-4">
                        <Link href="/contragents">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-5 h-5 text-slate-500" />
                            </Button>
                        </Link>
                        <div>
                            <h2 className="text-xl font-bold text-slate-800">Редактирование контрагента</h2>
                            <p className="text-sm text-slate-500">Измените необходимые данные и сохраните</p>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <Link href="/contragents">
                            <Button variant="outline" type="button">Отмена</Button>
                        </Link>
                        <Button type="submit" className="bg-[#E66400] hover:bg-orange-700 text-white gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Сохранить изменения
                        </Button>
                    </div>
                </div>

                <div className="flex min-h-[600px]">
                    {/* Sidebar Tabs */}
                    <div className="w-64 bg-slate-50 border-r border-slate-200 p-4 shrink-0">
                        <div className="space-y-1">
                            <button
                                type="button"
                                onClick={() => setActiveTab('basic')}
                                className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'basic' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                Основное
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('addresses')}
                                className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'addresses' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                Адреса
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('bank')}
                                className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'bank' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                Банковские счета
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('employees')}
                                className={`w-full text-left px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'employees' ? 'bg-white shadow text-slate-900' : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                Сотрудники
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-8">
                        {state?.error && (
                            <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
                                {state.error}
                            </div>
                        )}

                        {/* BASIC TAB */}
                        <div className={activeTab === 'basic' ? 'block' : 'hidden'}>
                            <div className="max-w-3xl space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold text-slate-900">Тип контрагента</h3>
                                    <div className="flex gap-2">
                                        {['Client', 'Carrier', 'Supplier'].map(type => (
                                            <Badge
                                                key={type}
                                                variant={selectedType === type ? 'default' : 'outline'}
                                                className={`cursor-pointer px-4 py-2 text-sm ${selectedType === type
                                                    ? 'bg-[#E66400] hover:bg-orange-700 border-transparent text-white'
                                                    : 'hover:bg-slate-50 text-slate-600'
                                                    }`}
                                                onClick={() => setSelectedType(type)}
                                            >
                                                {type === 'Client' ? 'Клиент' : type === 'Carrier' ? 'Перевозчик' : 'Поставщик'}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Название <span className="text-red-500">*</span></Label>
                                            <Input name="name" defaultValue={contragent.name} className="bg-slate-50 border-slate-200 focus:bg-white" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>ИНН <span className="text-red-500">*</span></Label>
                                            <Input name="inn" defaultValue={contragent.inn || ''} className="bg-slate-50 border-slate-200 focus:bg-white" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>КПП</Label>
                                            <Input name="kpp" defaultValue={contragent.kpp || ''} className="bg-slate-50 border-slate-200 focus:bg-white" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>ОГРН</Label>
                                            <Input name="ogrn" defaultValue={contragent.ogrn || ''} className="bg-slate-50 border-slate-200 focus:bg-white" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>Рейтинг доверия</Label>
                                            <div className="flex items-center gap-4 h-10 px-3 border border-slate-200 rounded-md bg-slate-50">
                                                <TrustStars rating={trustRating} setRating={setTrustRating} />
                                                <span className="text-sm text-slate-500 ml-auto">
                                                    {trustRating}/5
                                                </span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Менеджер</Label>
                                            <Select value={manager} onValueChange={setManager}>
                                                <SelectTrigger className="bg-slate-50">
                                                    <SelectValue placeholder="Выберите менеджера" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {managers.map((m) => (
                                                        <SelectItem key={m.id} value={m.name}>{m.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <input type="hidden" name="manager" value={manager} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Статус</Label>
                                            <Select value={status} onValueChange={setStatus}>
                                                <SelectTrigger className="bg-slate-50">
                                                    <SelectValue placeholder="Выберите статус" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="ACTIVE">Активный</SelectItem>
                                                    <SelectItem value="INACTIVE">Неактивный</SelectItem>
                                                    <SelectItem value="CHECKING">На проверке</SelectItem>
                                                    <SelectItem value="BLOCKED">Заблокирован</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>ЭДО</Label>
                                            <Select value={edo} onValueChange={setEdo}>
                                                <SelectTrigger className="bg-slate-50">
                                                    <SelectValue placeholder="Статус ЭДО" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="active">Подключен</SelectItem>
                                                    <SelectItem value="invited">Приглашен</SelectItem>
                                                    <SelectItem value="none">Не используется</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Телефоны</Label>
                                    <div className="space-y-2">
                                        {phones.map((phone, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <Input value={phone} readOnly className="bg-slate-50" />
                                                <Button type="button" variant="ghost" onClick={() => handleDeletePhone(idx)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                            </div>
                                        ))}
                                        <Button type="button" variant="outline" size="sm" onClick={handleAddPhone} className="text-[#E66400] border-orange-200 bg-orange-50">
                                            <Plus className="w-4 h-4 mr-2" /> Добавить телефон
                                        </Button>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Email адреса</Label>
                                    <div className="space-y-2">
                                        {emails.map((email, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <Input value={email} readOnly className="bg-slate-50" />
                                                <Button type="button" variant="ghost" onClick={() => handleDeleteEmail(idx)}><Trash2 className="w-4 h-4 text-red-500" /></Button>
                                            </div>
                                        ))}
                                        <Button type="button" variant="outline" size="sm" onClick={handleAddEmail} className="text-[#E66400] border-orange-200 bg-orange-50">
                                            <Plus className="w-4 h-4 mr-2" /> Добавить email
                                        </Button>
                                    </div>
                                </div>


                                <div className="space-y-2">
                                    <Label>Комментарий</Label>
                                    <Textarea name="comment" defaultValue={contragent.comment || ''} className="min-h-[100px] bg-slate-50 border-slate-200 focus:bg-white" />
                                </div>
                            </div>
                        </div>

                        {/* ADDRESSES TAB */}
                        <div className={activeTab === 'addresses' ? 'block' : 'hidden'}>
                            <div className="max-w-3xl space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">Адреса компании</h3>
                                    <Button type="button" onClick={() => setIsAddingAddress(true)} size="sm" className="bg-[#E66400] text-white">
                                        <Plus className="w-4 h-4 mr-2" /> Добавить адрес
                                    </Button>
                                </div>

                                {isAddingAddress && (
                                    <Card className="p-4 border-orange-200 bg-orange-50/50 mb-4">
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <select
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                                value={newAddress.type}
                                                onChange={e => setNewAddress({ ...newAddress, type: e.target.value })}
                                            >
                                                <option value="legal">Юридический</option>
                                                <option value="actual">Фактический</option>
                                                <option value="postal">Почтовый</option>
                                            </select>
                                            <Input placeholder="Индекс" value={newAddress.zip} onChange={e => setNewAddress({ ...newAddress, zip: e.target.value })} />
                                            <Input placeholder="Страна" value={newAddress.country} onChange={e => setNewAddress({ ...newAddress, country: e.target.value })} />
                                            <Input placeholder="Регион" value={newAddress.region} onChange={e => setNewAddress({ ...newAddress, region: e.target.value })} />
                                            <Input placeholder="Город" value={newAddress.city} onChange={e => setNewAddress({ ...newAddress, city: e.target.value })} />
                                            <Input placeholder="Улица" value={newAddress.street} onChange={e => setNewAddress({ ...newAddress, street: e.target.value })} />
                                            <Input placeholder="Дом" value={newAddress.house} onChange={e => setNewAddress({ ...newAddress, house: e.target.value })} />
                                            <Input placeholder="Офис/Кв" value={newAddress.apartment} onChange={e => setNewAddress({ ...newAddress, apartment: e.target.value })} />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button type="button" variant="ghost" onClick={() => setIsAddingAddress(false)}>Отмена</Button>
                                            <Button type="button" onClick={handleAddAddress}>Добавить</Button>
                                        </div>
                                    </Card>
                                )}

                                <div className="space-y-3">
                                    {addresses.map((addr) => (
                                        <div key={addr.id} className="flex items-start justify-between p-4 border border-slate-200 rounded-lg bg-white">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <Badge variant="secondary" className="text-xs">
                                                        {addr.type === 'legal' ? 'Юридический' : addr.type === 'actual' ? 'Фактический' : 'Почтовый'}
                                                    </Badge>
                                                    <span className="text-sm font-medium text-slate-900">
                                                        {addr.zip}, {addr.country}, {addr.city}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-slate-500">
                                                    {addr.street}, {addr.house} {addr.apartment ? `, оф. ${addr.apartment}` : ''}
                                                </p>
                                            </div>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => handleDeleteAddress(addr.id)} className="text-slate-400 hover:text-red-500">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                    {addresses.length === 0 && !isAddingAddress && (
                                        <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
                                            Нет добавленных адресов
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* BANK TAB */}
                        <div className={activeTab === 'bank' ? 'block' : 'hidden'}>
                            <div className="max-w-3xl space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">Банковские реквизиты</h3>
                                    <Button type="button" onClick={() => setIsAddingBank(true)} size="sm" className="bg-[#E66400] text-white">
                                        <Plus className="w-4 h-4 mr-2" /> Добавить счет
                                    </Button>
                                </div>
                                {isAddingBank && (
                                    <Card className="p-4 border-orange-200 bg-orange-50/50 mb-4">
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <Input placeholder="БИК" value={newBank.bic} onChange={e => setNewBank({ ...newBank, bic: e.target.value })} />
                                            <Input placeholder="Название банка" value={newBank.bankName} onChange={e => setNewBank({ ...newBank, bankName: e.target.value })} />
                                            <Input placeholder="Расчетный счет" value={newBank.accountNumber} onChange={e => setNewBank({ ...newBank, accountNumber: e.target.value })} />
                                            <Input placeholder="Корр. счет" value={newBank.corrAccount} onChange={e => setNewBank({ ...newBank, corrAccount: e.target.value })} />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button type="button" variant="ghost" onClick={() => setIsAddingBank(false)}>Отмена</Button>
                                            <Button type="button" onClick={handleAddBank}>Добавить</Button>
                                        </div>
                                    </Card>
                                )}
                                <div className="space-y-3">
                                    {bankAccounts.map((acc) => (
                                        <div key={acc.id} className="p-4 border border-slate-200 rounded-lg bg-white">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <div className="font-medium text-slate-900">{acc.bankName}</div>
                                                    <div className="text-sm text-slate-500">БИК: {acc.bic}</div>
                                                </div>
                                                <Button type="button" variant="ghost" size="icon" onClick={() => handleDeleteBank(acc.id)} className="text-slate-400 hover:text-red-500">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <span className="text-slate-500">Р/с:</span> {acc.accountNumber}
                                                </div>
                                                <div>
                                                    <span className="text-slate-500">К/с:</span> {acc.corrAccount}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    {bankAccounts.length === 0 && !isAddingBank && (
                                        <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
                                            Нет банковских реквизитов
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* EMPLOYEES TAB */}
                        <div className={activeTab === 'employees' ? 'block' : 'hidden'}>
                            <div className="max-w-3xl space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-lg font-semibold">Сотрудники</h3>
                                    <Button type="button" onClick={() => setIsAddingEmployee(true)} size="sm" className="bg-[#E66400] text-white">
                                        <Plus className="w-4 h-4 mr-2" /> Добавить сотрудника
                                    </Button>
                                </div>
                                {isAddingEmployee && (
                                    <Card className="p-4 border-orange-200 bg-orange-50/50 mb-4">
                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <Input placeholder="Фамилия" value={newEmployee.lastName} onChange={e => setNewEmployee({ ...newEmployee, lastName: e.target.value })} />
                                            <Input placeholder="Имя" value={newEmployee.firstName} onChange={e => setNewEmployee({ ...newEmployee, firstName: e.target.value })} />
                                            <Input placeholder="Отчество" value={newEmployee.middleName} onChange={e => setNewEmployee({ ...newEmployee, middleName: e.target.value })} />
                                            <Input placeholder="Должность" value={newEmployee.position} onChange={e => setNewEmployee({ ...newEmployee, position: e.target.value })} />
                                            <Input placeholder="Телефон" value={newEmployee.phone} onChange={e => setNewEmployee({ ...newEmployee, phone: e.target.value })} />
                                            <Input placeholder="Email" value={newEmployee.email} onChange={e => setNewEmployee({ ...newEmployee, email: e.target.value })} />
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <Button type="button" variant="ghost" onClick={() => setIsAddingEmployee(false)}>Отмена</Button>
                                            <Button type="button" onClick={handleAddEmployee}>Добавить</Button>
                                        </div>
                                    </Card>
                                )}
                                <div className="space-y-3">
                                    {employees.map((emp) => (
                                        <div key={emp.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg bg-white">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-medium">
                                                    {emp.lastName?.[0]}{emp.firstName?.[0]}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">
                                                        {emp.lastName} {emp.firstName} {emp.middleName}
                                                    </div>
                                                    <div className="text-sm text-slate-500">{emp.position}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="text-right text-sm text-slate-500">
                                                    <div>{emp.phone}</div>
                                                    <div>{emp.email}</div>
                                                </div>
                                                <Button type="button" variant="ghost" size="icon" onClick={() => handleDeleteEmployee(emp.id)} className="text-slate-400 hover:text-red-500">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {employees.length === 0 && !isAddingEmployee && (
                                        <div className="text-center py-8 text-slate-500 border-2 border-dashed border-slate-200 rounded-lg">
                                            Нет сотрудников
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </form>
        </div>
    )
}
