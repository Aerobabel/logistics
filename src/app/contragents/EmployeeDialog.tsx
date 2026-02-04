'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { FileText, Trash2, CheckCircle2, User, CreditCard, Shield, Download, Eye } from 'lucide-react'
import { createEmployeeDocument, deleteEmployeeDocument, updateEmployeeDetails } from '@/app/contragents/actions-employee'

interface EmployeeDialogProps {
    employee: any
    contragentId: number
    trigger?: React.ReactNode
    onUpdate?: () => void
}

export function EmployeeDialog({ employee, contragentId, trigger, onUpdate }: EmployeeDialogProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [activeTab, setActiveTab] = useState<'info' | 'passport' | 'roles' | 'documents'>('documents')

    const handleFileUpload = async (formData: FormData) => {
        await createEmployeeDocument(contragentId, employee.id, formData)
        onUpdate?.()
    }

    const handleDeleteDoc = async (docId: number) => {
        await deleteEmployeeDocument(contragentId, employee.id, docId)
        onUpdate?.()
    }

    const handleUpdateDetails = async (formData: FormData) => {
        await updateEmployeeDetails(contragentId, employee.id, formData)
        onUpdate?.()
    }

    const isComplete = (employee.documents?.length || 0) >= 4 // Mock logic for completeness

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                {trigger || <Button variant="outline" size="sm" className="text-blue-600 border-blue-200 hover:bg-blue-50">Открыть</Button>}
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-50 p-0 gap-0">
                <div className="p-6 border-b border-slate-200 bg-white">
                    <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                                <User className="w-6 h-6 text-slate-400" />
                            </div>
                            <div>
                                <DialogTitle className="text-xl font-bold text-slate-900">{employee.fullName}</DialogTitle>
                                <p className="text-slate-500">{employee.position}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex">
                    {/* Sidebar Navigation */}
                    <div className="w-64 bg-white border-r border-slate-200 min-h-[500px] p-4 space-y-2">
                        <button
                            onClick={() => setActiveTab('info')}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${activeTab === 'info' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <User className="w-4 h-4" /> Личная информация
                        </button>
                        <button
                            onClick={() => setActiveTab('passport')}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${activeTab === 'passport' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <CreditCard className="w-4 h-4" /> Паспортные данные
                        </button>
                        <button
                            onClick={() => setActiveTab('roles')}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${activeTab === 'roles' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <Shield className="w-4 h-4" /> Роли и доступы
                        </button>
                        <button
                            onClick={() => setActiveTab('documents')}
                            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 ${activeTab === 'documents' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'}`}
                        >
                            <FileText className="w-4 h-4" /> Документы сотрудника
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 p-6 space-y-6">
                        {/* Status Banner */}
                        <div className={`p-4 rounded-lg flex items-start gap-3 ${isComplete ? 'bg-green-50 border border-green-100' : 'bg-yellow-50 border border-yellow-100'}`}>
                            <div className={`mt-0.5 ${isComplete ? 'text-green-600' : 'text-yellow-600'}`}>
                                <CheckCircle2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h4 className={`font-medium ${isComplete ? 'text-green-900' : 'text-yellow-900'}`}>
                                    {isComplete ? 'Все необходимые документы загружены' : 'Не все документы загружены'}
                                </h4>
                                <p className={`text-sm ${isComplete ? 'text-green-700' : 'text-yellow-700'}`}>
                                    Сотрудник {isComplete ? 'полностью укомплектован документами' : 'требует загрузки недостающих документов'}
                                </p>
                            </div>
                        </div>

                        {activeTab === 'info' && (
                            <Card className="p-6 border-slate-200">
                                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <User className="w-4 h-4" /> Личная информация
                                </h3>
                                <form action={handleUpdateDetails} className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>ФИО</Label>
                                        <Input name="fullName" defaultValue={employee.fullName} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Должность</Label>
                                        <Input name="position" defaultValue={employee.position} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Дата рождения</Label>
                                        <Input type="date" name="birthDate" defaultValue={employee.birthDate} />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label>Адрес проживания</Label>
                                        <Input name="address" defaultValue={employee.address} placeholder="г. Москва, ..." />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <h3 className="font-semibold text-slate-900 mt-4 mb-2 flex items-center gap-2">
                                            Контактная информация
                                        </h3>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Телефон</Label>
                                        <Input name="phone" defaultValue={employee.phone} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input name="email" defaultValue={employee.email} />
                                    </div>
                                    <div className="col-span-2 pt-4">
                                        <Button type="submit" className="bg-[#E66400] text-white">Сохранить изменения</Button>
                                    </div>
                                </form>
                            </Card>
                        )}

                        {activeTab === 'passport' && (
                            <Card className="p-6 border-slate-200">
                                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" /> Паспортные данные
                                </h3>
                                <form action={handleUpdateDetails} className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Серия и номер паспорта</Label>
                                        <Input name="passportNumber" defaultValue={employee.passportNumber} placeholder="4711 555666" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Дата выдачи</Label>
                                        <Input type="date" name="passportDate" defaultValue={employee.passportDate} />
                                    </div>
                                    <div className="col-span-2 space-y-2">
                                        <Label>Кем выдан</Label>
                                        <Input name="passportIssuedBy" defaultValue={employee.passportIssuedBy} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>ИНН</Label>
                                        <Input name="inn" defaultValue={employee.inn} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>СНИЛС</Label>
                                        <Input name="snils" defaultValue={employee.snils} />
                                    </div>
                                    <div className="col-span-2 pt-4">
                                        <Button type="submit" className="bg-[#E66400] text-white">Сохранить изменения</Button>
                                    </div>
                                </form>
                            </Card>
                        )}

                        {activeTab === 'roles' && (
                            <Card className="p-6 border-slate-200">
                                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                    <Shield className="w-4 h-4" /> Роли и доступы
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {employee.roles ? (
                                        Array.isArray(employee.roles) ? employee.roles.map((role: string) => (
                                            <Badge key={role} variant="secondary" className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100">
                                                {role}
                                            </Badge>
                                        )) : (
                                            <Badge variant="secondary" className="px-3 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100">
                                                {employee.roles}
                                            </Badge>
                                        )
                                    ) : (
                                        <p className="text-sm text-slate-500">Роли не назначены</p>
                                    )}
                                </div>
                            </Card>
                        )}

                        {activeTab === 'documents' && (
                            <div className="space-y-4">
                                <Card className="p-4 border-slate-200 bg-slate-50">
                                    <h4 className="font-medium mb-3">Добавить документ</h4>
                                    <form action={handleFileUpload} className="flex gap-3">
                                        <Input name="title" placeholder="Название документа" className="bg-white" required />
                                        <Input name="date" type="date" className="bg-white w-40" />
                                        <Button type="submit" className="bg-[#E66400] text-white">Загрузить</Button>
                                    </form>
                                </Card>

                                <div className="space-y-2">
                                    {(employee.documents || []).map((doc: any) => (
                                        <div key={doc.id} className="flex items-center justify-between p-4 border border-green-200 bg-green-50/50 rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-white">
                                                    <FileText className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900">{doc.title}</div>
                                                    <div className="text-xs text-green-700 flex items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        Дата выдачи: {doc.date || 'Не указана'}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                                                    <Eye className="w-4 h-4" /> Просмотр
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                                                    onClick={() => handleDeleteDoc(doc.id)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                    {(employee.documents || []).length === 0 && (
                                        <div className="text-center py-8 text-slate-500">
                                            Нет загруженных документов
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
