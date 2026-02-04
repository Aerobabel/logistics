'use client'

import { useState, useActionState, useEffect, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select as RadixSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import {
  Star,
  Phone,
  Mail,
  Plus,
  FileText,
  MapPin,
  Search,
  Download,
  Building2,
  Briefcase,
  File,
  Trash2,
  User,
  CreditCard,
  CheckSquare,
  Calendar,
  Paperclip,
  Truck,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import Link from 'next/link'
import { createContragent } from './actions'
import { cn } from '@/lib/utils'

// Types matching Prisma
type Contragent = {
  id: number
  name: string
  type: string
  status: string
  inn: string | null
  kpp: string | null
  trustRating: number
  phone: string | null
  email: string | null
  address: string | null
  contactPerson: string | null
  contracts: any[]
}

export default function ContragentsClient({ initialContragents }: { initialContragents: any[] }) {
  const [contragents, setContragents] = useState<Contragent[]>(initialContragents)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('basic');
  const [state, formAction] = useActionState(createContragent, null)

  // State for simple fields not in inputs
  const [selectedType, setSelectedType] = useState('Client')
  const [status, setStatus] = useState('active')
  const [trustRating, setTrustRating] = useState('3')
  const [phones, setPhones] = useState<string[]>([])
  const [emails, setEmails] = useState<string[]>([])
  const [filter, setFilter] = useState('all')

  const stats = useMemo(() => {
    return {
      clients: contragents.filter(c => c.type === 'Client').length,
      suppliers: contragents.filter(c => c.type === 'Supplier').length,
      contracts: contragents.reduce((acc, c) => acc + (c.contracts?.length || 0), 0)
    }
  }, [contragents])

  const filteredContragents = useMemo(() => {
    if (filter === 'all') return contragents
    if (filter === 'active') return contragents.filter(c => c.status === 'active')
    return contragents.filter(c => c.type === filter)
  }, [contragents, filter])


  useEffect(() => {
    if (state?.success) {
      setIsAddModalOpen(false)
    }
  }, [state])

  useEffect(() => {
    setContragents(initialContragents)
  }, [initialContragents])


  // State for Addresses tab
  const [addresses, setAddresses] = useState<any[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
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
  });

  const handleAddAddress = () => {
    // Basic validation or just allow add for demo
    setAddresses([...addresses, { ...newAddress, id: Date.now() }]);
    setNewAddress({
      type: 'legal', country: '', zip: '', region: '', city: '', street: '', house: '', apartment: '', comment: ''
    });
    setIsAddingAddress(false);
  };

  const handleRemoveAddress = (id: number) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  // State for Bank Accounts tab
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [isAddingBank, setIsAddingBank] = useState(false);
  const [newBankDetail, setNewBankDetail] = useState({
    bankName: '',
    bik: '',
    correspondentAccount: '',
    checkingAccount: '',
    comment: ''
  });

  const handleAddBankDetail = () => {
    setBankAccounts([...bankAccounts, { ...newBankDetail, id: Date.now() }]);
    setNewBankDetail({
      bankName: '', bik: '', correspondentAccount: '', checkingAccount: '', comment: ''
    });
    setIsAddingBank(false);
  };

  const handleRemoveBankDetail = (id: number) => {
    setBankAccounts(bankAccounts.filter(bank => bank.id !== id));
  };

  // State for Employees tab
  const [employees, setEmployees] = useState<any[]>([]);
  const [isAddingEmployee, setIsAddingEmployee] = useState(false);
  const [newEmployee, setNewEmployee] = useState({
    fioNom: '',
    fioGen: '',
    postNom: '',
    postGen: '',
    dob: '',
    phone: '',
    email: '',
    docName: '',
    roles: {
      driver: false,
      accountant: false,
      receiver: false
    },
    passport: '',
    poaDate: '',
    dlExpiry: '',
    contractFrom: '',
    contractTo: ''
  });

  const handleAddEmployee = () => {
    setEmployees([...employees, { ...newEmployee, id: Date.now() }]);
    setIsAddingEmployee(false);
    setNewEmployee({
      fioNom: '', fioGen: '', postNom: '', postGen: '', dob: '', phone: '', email: '', docName: '',
      roles: { driver: false, accountant: false, receiver: false },
      passport: '', poaDate: '', dlExpiry: '', contractFrom: '', contractTo: ''
    });
  };

  const handleRemoveEmployee = (id: number) => {
    setEmployees(employees.filter(emp => emp.id !== id));
  };

  // State for Transport tab
  const [transport, setTransport] = useState<any[]>([]);
  const [isAddingTransport, setIsAddingTransport] = useState(false);
  const [newTransport, setNewTransport] = useState({
    type: 'truck',
    brand: '',
    model: '',
    plate: '',
    capacity: '',
    driverName: '',
    driverPhone: ''
  });

  const handleAddTransport = () => {
    setTransport([...transport, { ...newTransport, id: Date.now() }]);
    setIsAddingTransport(false);
    setNewTransport({
      type: 'truck', brand: '', model: '', plate: '', capacity: '', driverName: '', driverPhone: ''
    });
  };

  const handleRemoveTransport = (id: number) => {
    setTransport(transport.filter(t => t.id !== id));
  };

  // State for Declarations tab
  const [declarations, setDeclarations] = useState<any[]>([]);
  const [isAddingDeclaration, setIsAddingDeclaration] = useState(false);
  const [newDeclaration, setNewDeclaration] = useState({
    number: '',
    date: '',
    product: '',
    weight: '',
    expiry: '',
    status: 'active'
  });

  const handleAddDeclaration = () => {
    setDeclarations([...declarations, { ...newDeclaration, id: Date.now() }]);
    setIsAddingDeclaration(false);
    setNewDeclaration({
      number: '', date: '', product: '', weight: '', expiry: '', status: 'active'
    });
  };

  const handleRemoveDeclaration = (id: number) => {
    setDeclarations(declarations.filter(d => d.id !== id));
  };

  // State for Scans tab
  const [standardDocs] = useState([
    { id: 'ustav', name: 'Устав' },
    { id: 'svid', name: 'Свидетельство о регистрации' },
    { id: 'inn', name: 'ИНН' },
    { id: 'ogrn', name: 'ОГРН' },
    { id: 'prikaz', name: 'Приказ о назначении' },
    { id: 'reshenie', name: 'Решение учредителей' }
  ]);
  const [customDocs, setCustomDocs] = useState<any[]>([]);

  // Stats calculation
  const uploadedCount = 0; // standardDocs.filter... + customDocs.length
  const notUploadedCount = standardDocs.length + 10; // Mock total 15?
  const customCount = customDocs.length;

  return (
    <div className="p-6 space-y-6 bg-slate-50 min-h-screen font-sans text-slate-900">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Контрагенты</h1>
          <p className="text-slate-500 text-sm mt-1">Управление клиентами и поставщиками</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="text-orange-600 border-orange-200 hover:bg-orange-50 gap-2 font-medium">
            <Download className="w-4 h-4" /> Экспорт
          </Button>

          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="bg-[#E66400] hover:bg-orange-700 text-white gap-2 font-medium shadow-sm">
                <Plus className="w-4 h-4" /> Добавить
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-[1000px] p-0 gap-0 bg-[#F8FAFC]">
              <DialogHeader className="p-6 pb-4 bg-white border-b border-slate-200">
                <DialogTitle className="text-xl font-bold">Добавить контрагента</DialogTitle>
              </DialogHeader>

              <form action={formAction} className="p-0">
                {state?.error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 p-4 mb-4 rounded-lg flex items-center gap-2 m-6">
                    <XCircle className="w-5 h-5 flex-shrink-0" />
                    <p className="text-sm font-medium">{state.error}</p>
                  </div>
                )}
                <input type="hidden" name="type" value={selectedType} />
                <input type="hidden" name="status" value={status} />
                <input type="hidden" name="trustRating" value={trustRating} />
                <input type="hidden" name="addresses" value={JSON.stringify(addresses)} />
                <input type="hidden" name="bankAccounts" value={JSON.stringify(bankAccounts)} />
                <input type="hidden" name="employees" value={JSON.stringify(employees)} />
                <input type="hidden" name="transport" value={JSON.stringify(transport)} />
                <input type="hidden" name="declarations" value={JSON.stringify(declarations)} />
                <input type="hidden" name="phone" value={JSON.stringify(phones)} />
                <input type="hidden" name="email" value={JSON.stringify(emails)} />

                <Tabs defaultValue="basic" className="w-full" onValueChange={setActiveTab}>
                  <div className="px-6 py-4 bg-white border-b border-slate-200">
                    <TabsList className="bg-slate-100 p-1 justify-start h-auto flex-wrap gap-1">
                      <TabsTrigger value="basic" className="data-[state=active]:bg-[#E66400] data-[state=active]:text-white px-4 py-2">Основное</TabsTrigger>
                      <TabsTrigger value="addresses" className="data-[state=active]:bg-[#E66400] data-[state=active]:text-white px-4 py-2">Адреса ({addresses.length})</TabsTrigger>
                      <TabsTrigger value="bank" className="data-[state=active]:bg-[#E66400] data-[state=active]:text-white px-4 py-2">Банк. реквизиты ({bankAccounts.length})</TabsTrigger>
                      <TabsTrigger value="employees" className="data-[state=active]:bg-[#E66400] data-[state=active]:text-white px-4 py-2">Сотрудники ({employees.length})</TabsTrigger>
                      <TabsTrigger value="transport" className="data-[state=active]:bg-[#E66400] data-[state=active]:text-white px-4 py-2">Транспорт ({transport.length})</TabsTrigger>
                      <TabsTrigger value="declarations" className="data-[state=active]:bg-[#E66400] data-[state=active]:text-white px-4 py-2">Декларации ({declarations.length})</TabsTrigger>
                      <TabsTrigger value="scans" className="data-[state=active]:bg-[#E66400] data-[state=active]:text-white px-4 py-2">Сканы (0/15)</TabsTrigger>
                    </TabsList>
                  </div>

                  <div className="p-6 max-h-[600px] overflow-y-auto bg-white">
                    <TabsContent value="basic" className="space-y-6 mt-0">
                      {/* Name */}
                      <div className="space-y-2">
                        <Label className="text-slate-500 font-medium text-xs uppercase">Наименование <span className="text-red-500">*</span></Label>
                        <Input name="name" placeholder='ООО "Название компании"' className="bg-white" required />
                      </div>

                      {/* Types */}
                      <div className="space-y-2">
                        <Label className="text-slate-500 font-medium text-xs uppercase">Типы контрагента <span className="text-red-500">*</span></Label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {['Client', 'Supplier', 'Carrier', 'Forwarder', 'Surveyor', 'Buyer'].map(type => (
                            <Badge
                              key={type}
                              variant={selectedType === type ? 'default' : 'secondary'}
                              className={`cursor-pointer ${selectedType === type ? 'bg-[#E66400] text-white hover:bg-orange-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                              onClick={() => setSelectedType(type)}
                            >
                              {type === 'Client' ? 'Клиент' :
                                type === 'Supplier' ? 'Поставщик' :
                                  type === 'Carrier' ? 'Перевозчик' :
                                    type === 'Forwarder' ? 'Экспедитор' :
                                      type === 'Surveyor' ? 'Сюрвейер' : 'Покупатель'}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <Input placeholder="Добавить свой тип..." className="bg-white" />
                          <Button size="icon" className="bg-green-500 hover:bg-green-600 text-white shrink-0 w-10 h-10">
                            <Plus className="w-5 h-5" />
                          </Button>
                        </div>
                        {/* Hidden input removed as it is handled at the top of the form */}
                      </div>

                      {/* Status & Rating */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-slate-500 font-medium text-xs uppercase">Статус <span className="text-red-500">*</span></Label>
                          <Select
                            options={[{ label: 'Активный', value: 'active' }, { label: 'Неактивный', value: 'inactive' }, { label: 'На проверке', value: 'checking' }, { label: 'Заблокирован', value: 'blocked' }]}
                            value={status}
                            onValueChange={setStatus}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-500 font-medium text-xs uppercase">Рейтинг</Label>
                          <Select
                            options={[
                              { label: '★ 1 звезда', value: '1' },
                              { label: '★★ 2 звезды', value: '2' },
                              { label: '★★★ 3 звезды', value: '3' },
                              { label: '★★★★ 4 звезды', value: '4' },
                              { label: '★★★★★ 5 звезд', value: '5' }
                            ]}
                            value={trustRating}
                            onValueChange={setTrustRating}
                          />
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-slate-500 font-medium text-xs uppercase">ИНН <span className="text-red-500">*</span></Label>
                          <Input name="inn" placeholder="1234567890" className="bg-white" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-500 font-medium text-xs uppercase">КПП</Label>
                          <Input name="kpp" placeholder="123456789" className="bg-white" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-500 font-medium text-xs uppercase">Код по ОКПО</Label>
                          <Input name="okpo" placeholder="12345678" className="bg-white" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-500 font-medium text-xs uppercase">ОГРН</Label>
                          <Input name="ogrn" placeholder="1234567890123" className="bg-white" />
                        </div>
                      </div>

                      {/* Reg Number */}
                      <div className="space-y-2">
                        <Label className="text-slate-500 font-medium text-xs uppercase">REG NUMBER</Label>
                        <Input name="regNumber" placeholder="REG-123456" className="bg-white" />
                      </div>

                      {/* Phones */}
                      <div className="space-y-2 pt-2">
                        <Label className="text-slate-500 font-medium text-xs uppercase">Телефоны <span className="text-red-500">*</span></Label>
                        {phones.length > 0 ? (
                          <div className="space-y-2">
                            {phones.map((p, i) => (
                              <div key={i} className="flex gap-2">
                                <Input value={p} readOnly className="bg-slate-50" />
                                <Button size="icon" variant="ghost" type="button" onClick={() => setPhones(phones.filter((_, idx) => idx !== i))}>
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            ))}
                            <Button type="button" size="sm" onClick={() => {
                              const p = prompt('Введите номер телефона');
                              if (p) setPhones([...phones, p]);
                            }} className="text-green-600 hover:text-green-700 p-0 h-auto font-normal bg-transparent hover:bg-transparent">
                              + Добавить еще
                            </Button>
                          </div>
                        ) : (
                          <div className="p-4 border border-dashed border-slate-200 rounded-lg bg-slate-50/50 text-center">
                            <p className="text-sm text-slate-400 mb-3">Добавьте хотя бы один телефон</p>
                            <Button type="button" size="sm" onClick={() => {
                              const p = prompt('Введите номер телефона');
                              if (p) setPhones([...phones, p]);
                            }} className="bg-green-500 hover:bg-green-600 text-white gap-2 h-8">
                              <Plus className="w-4 h-4" /> Добавить
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* Email Addresses */}
                      <div className="space-y-2">
                        <Label className="text-slate-500 font-medium text-xs uppercase">E-mail адреса <span className="text-red-500">*</span></Label>
                        {emails.length > 0 ? (
                          <div className="space-y-2">
                            {emails.map((e, i) => (
                              <div key={i} className="flex gap-2">
                                <Input value={e} readOnly className="bg-slate-50" />
                                <Button size="icon" variant="ghost" type="button" onClick={() => setEmails(emails.filter((_, idx) => idx !== i))}>
                                  <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                              </div>
                            ))}
                            <Button type="button" size="sm" onClick={() => {
                              const e = prompt('Введите email');
                              if (e) setEmails([...emails, e]);
                            }} className="text-green-600 hover:text-green-700 p-0 h-auto font-normal bg-transparent hover:bg-transparent">
                              + Добавить еще
                            </Button>
                          </div>
                        ) : (
                          <div className="p-4 border border-dashed border-slate-200 rounded-lg bg-slate-50/50 text-center">
                            <p className="text-sm text-slate-400 mb-3">Добавьте хотя бы один email</p>
                            <Button type="button" size="sm" onClick={() => {
                              const e = prompt('Введите email');
                              if (e) setEmails([...emails, e]);
                            }} className="bg-green-500 hover:bg-green-600 text-white gap-2 h-8">
                              <Plus className="w-4 h-4" /> Добавить
                            </Button>
                          </div>
                        )}
                      </div>

                      {/* EDO & Manager */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-slate-500 font-medium text-xs uppercase">ЭДО</Label>
                          <Input name="edo" placeholder="Диадок, СБИС и т.д." className="bg-white" />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-slate-500 font-medium text-xs uppercase">Ответственный менеджер</Label>
                          <Input name="manager" placeholder="Петров П.П. (ответственный за внесение данных)" className="bg-white" />
                        </div>
                      </div>

                      {/* Comments */}
                      <div className="space-y-2">
                        <Label className="text-slate-500 font-medium text-xs uppercase">Комментарии</Label>
                        <Textarea name="comment" placeholder="Дополнительная информация о контрагенте..." className="bg-white min-h-[100px]" />
                      </div>
                    </TabsContent>

                    <TabsContent value="addresses" className="mt-0">
                      <div className="space-y-4">
                        {!isAddingAddress ? (
                          <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                              <h3 className="font-semibold text-lg">Адреса</h3>
                              <Button onClick={() => setIsAddingAddress(true)} className="bg-green-600 hover:bg-green-700 text-white gap-2">
                                <Plus className="w-4 h-4" /> Добавить адрес
                              </Button>
                            </div>
                            {addresses.length === 0 ? (
                              <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                                <p className="text-slate-400 mb-1">Нет адресов</p>
                                <p className="text-xs text-slate-400">Нажмите "Добавить адрес"</p>
                              </div>
                            ) : (
                              <div className="mt-8 space-y-4">
                                {addresses.map((addr, index) => (
                                  <Card key={index} className="p-4 border border-slate-200 shadow-sm flex justify-between items-start">
                                    <div>
                                      <p className="font-medium text-slate-900">Адрес {index + 1}</p>
                                      {/* Display address details here if available in 'addr' object */}
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => setAddresses(addresses.filter((_, i) => i !== index))} className="text-red-500 hover:bg-red-50">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </Card>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="space-y-6">
                              <div className="space-y-4">
                                <Label className="text-xs font-medium text-slate-500 uppercase">Тип адреса</Label>
                                <Select options={[{ label: 'Юридический адрес', value: 'legal' }, { label: 'Фактический адрес', value: 'actual' }, { label: 'Почтовый адрес', value: 'postal' }]} value="legal" />
                              </div>

                              <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-6 space-y-6">
                                <div className="flex items-center gap-2 text-blue-700 font-semibold mb-2">
                                  <MapPin className="w-4 h-4" /> Адрес контрагента
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Страна</Label>
                                    <Input defaultValue="Россия" className="bg-white" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Регион</Label>
                                    <Input defaultValue="Московская область" className="bg-white" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Округ</Label>
                                    <Input defaultValue="Центральный" className="bg-white" />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Район</Label>
                                    <Input defaultValue="Ленинский" className="bg-white" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Населенный пункт</Label>
                                    <Input defaultValue="пос. Новый" className="bg-white" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Город</Label>
                                    <Input defaultValue="Москва" className="bg-white" />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Улица</Label>
                                    <Input defaultValue="ул. Ленина" className="bg-white" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Дом</Label>
                                    <Input defaultValue="15" className="bg-white" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Офис</Label>
                                    <Input defaultValue="201" className="bg-white" />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Квартира</Label>
                                    <Input defaultValue="45" className="bg-white" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Почтовый индекс</Label>
                                    <Input defaultValue="123456" className="bg-white" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Широта</Label>
                                    <Input defaultValue="55.755826" className="bg-white" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Долгота</Label>
                                    <Input defaultValue="37.617300" className="bg-white" />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-slate-500">Полный адрес (сформирован автоматически)</Label>
                                  <Textarea readOnly className="bg-slate-50" />
                                </div>
                              </div>

                              {/* Logistics */}
                              <div className="bg-green-50/50 border border-green-100 rounded-lg p-6 space-y-6">
                                <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-green-500" /> Весы и логистика
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Длина весов (метров)</Label>
                                    <Input defaultValue="18" className="bg-white" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Грузоподъемность весов (тонн)</Label>
                                    <Input defaultValue="60" className="bg-white" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Мощность погрузки (тонн/час)</Label>
                                    <Input defaultValue="100" className="bg-white" />
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Способ погрузки</Label>
                                    <Select options={[{ label: 'Фронтальный', value: 'front' }, { label: 'Боковой', value: 'side' }]} placeholder="Выберите способ" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Тип т/с</Label>
                                    <Select options={[{ label: 'Зерновоз', value: 'grain' }, { label: 'Самосвал', value: 'dump' }]} placeholder="Выберите тип" />
                                  </div>
                                </div>
                              </div>

                              {/* Railway */}
                              <div className="bg-yellow-50/50 border border-yellow-100 rounded-lg p-6 space-y-6">
                                <div className="flex items-center gap-2 text-yellow-700 font-semibold mb-2">
                                  <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> ЖД станция
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Наименование станции</Label>
                                    <Input defaultValue="Москва-Товарная" className="bg-white" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Код станции</Label>
                                    <Input defaultValue="2000000" className="bg-white" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Дорога ЖД</Label>
                                    <Select options={[{ label: 'Московская ЖД', value: 'mzd' }]} placeholder="Выберите дорогу" />
                                  </div>
                                </div>
                              </div>

                              <div className="pt-2">
                                <Button
                                  variant="destructive"
                                  onClick={() => {
                                    setIsAddingAddress(false)
                                    setAddresses([...addresses, { id: Date.now() }]) // Simple mock add
                                  }}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" /> Удалить адрес
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="bank" className="mt-0">
                      <div className="space-y-4">
                        {!isAddingBank ? (
                          <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                              <h3 className="font-semibold text-lg">Банковские реквизиты</h3>
                              <Button onClick={() => setIsAddingBank(true)} className="bg-green-600 hover:bg-green-700 text-white gap-2">
                                <Plus className="w-4 h-4" /> Добавить счет
                              </Button>
                            </div>
                            {bankAccounts.length === 0 ? (
                              <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                                <p className="text-slate-400 mb-1">Нет банковских реквизитов</p>
                                <p className="text-xs text-slate-400">Нажмите "Добавить счет"</p>
                              </div>
                            ) : (
                              <div className="mt-8 space-y-4">
                                {bankAccounts.map((bank, index) => (
                                  <Card key={index} className="p-4 border border-slate-200 shadow-sm flex justify-between items-start">
                                    <div>
                                      <p className="font-medium text-slate-900">Счет {index + 1}</p>
                                      {/* Display bank details here if available in 'bank' object */}
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => setBankAccounts(bankAccounts.filter((_, i) => i !== index))} className="text-red-500 hover:bg-red-50">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </Card>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="space-y-6">
                              <div className="flex justify-between items-center">
                                <h3 className="font-semibold">Банковские реквизиты</h3>
                                <Button onClick={() => setIsAddingBank(true)} className="bg-green-600 hover:bg-green-700 text-white gap-2">
                                  <Plus className="w-4 h-4" /> Добавить счет
                                </Button>
                              </div>

                              <div className="border border-slate-200 rounded-lg p-6 bg-white space-y-6">
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-slate-500">Название банка <span className="text-red-500">*</span></Label>
                                  <Input placeholder="ПАО Сбербанк" className="bg-white" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">БИК <span className="text-red-500">*</span></Label>
                                    <Input placeholder="044525225" className="bg-white" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Корр. счет <span className="text-red-500">*</span></Label>
                                    <Input placeholder="30101810400000000225" className="bg-white" />
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">Расчетный счет <span className="text-red-500">*</span></Label>
                                    <Input placeholder="40702810400000000000" className="bg-white" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500">SWIFT</Label>
                                    <Input placeholder="SABRRUMM" className="bg-white" />
                                  </div>
                                </div>

                                <div className="flex items-center gap-2">
                                  <input type="checkbox" id="main_account" className="w-4 h-4 text-[#E66400] focus:ring-[#E66400] border-gray-300 rounded" defaultChecked />
                                  <label htmlFor="main_account" className="text-sm font-medium text-slate-700">Основной счет</label>
                                </div>

                                <div className="pt-2">
                                  <Button
                                    variant="destructive"
                                    onClick={() => {
                                      setIsAddingBank(false)
                                      setBankAccounts([...bankAccounts, { id: Date.now() }])
                                    }}
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" /> Удалить счет
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    {/* Placeholder for other tabs */}
                    <TabsContent value="employees" className="mt-0">
                      <div className="space-y-4">
                        {!isAddingEmployee ? (
                          <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                              <h3 className="font-semibold text-lg">Сотрудники</h3>
                              <Button onClick={() => setIsAddingEmployee(true)} className="bg-green-600 hover:bg-green-700 text-white gap-2">
                                <Plus className="w-4 h-4" /> Добавить сотрудника
                              </Button>
                            </div>
                            {employees.length === 0 ? (
                              <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                                <p className="text-slate-400 mb-1">Нет сотрудников</p>
                                <p className="text-xs text-slate-400">Нажмите "Добавить сотрудника"</p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {employees.map((emp) => (
                                  <Card key={emp.id} className="p-4 border border-slate-200 shadow-sm flex justify-between items-start">
                                    <div className="flex gap-4">
                                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
                                        {emp.fioNom ? emp.fioNom.charAt(0) : <User className="w-5 h-5" />}
                                      </div>
                                      <div>
                                        <p className="font-medium text-slate-900">{emp.fioNom || 'Без имени'}</p>
                                        <p className="text-sm text-slate-500">{emp.postNom || 'Должность не указана'}</p>
                                        <div className="flex gap-2 mt-2">
                                          {emp.roles.driver && <Badge variant="secondary" className="bg-green-100 text-green-700 text-xs">Водитель</Badge>}
                                          {emp.roles.accountant && <Badge variant="secondary" className="bg-blue-100 text-blue-700 text-xs">Бухгалтер</Badge>}
                                          {emp.roles.receiver && <Badge variant="secondary" className="bg-orange-100 text-orange-700 text-xs">Приемосдатчик</Badge>}
                                        </div>
                                      </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveEmployee(emp.id)} className="text-red-500 hover:bg-red-50">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </Card>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="font-semibold">Новый сотрудник</h3>
                              <Button onClick={() => setIsAddingEmployee(true)} className="bg-green-600 hover:bg-green-700 text-white gap-2">
                                <Plus className="w-4 h-4" /> Добавить сотрудника
                              </Button>
                            </div>

                            <div className="space-y-6">
                              {/* Basic Info - Blue */}
                              <div className="bg-blue-50/30 border border-blue-100 rounded-lg p-6 space-y-4">
                                <div className="flex items-center gap-2 text-blue-700 font-semibold border-b border-blue-100 pb-2 mb-2">
                                  <User className="w-4 h-4" /> Основная информация
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500 uppercase">ФИО (именительный) <span className="text-red-500">*</span></Label>
                                    <Input placeholder="Иванов Иван Иванович" value={newEmployee.fioNom} onChange={(e) => setNewEmployee({ ...newEmployee, fioNom: e.target.value })} className="bg-white" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500 uppercase">ФИО (родительный) <span className="text-red-500">*</span></Label>
                                    <Input placeholder="Иванова Ивана Ивановича" value={newEmployee.fioGen} onChange={(e) => setNewEmployee({ ...newEmployee, fioGen: e.target.value })} className="bg-white" />
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500 uppercase">Должность (именительный) <span className="text-red-500">*</span></Label>
                                    <Input placeholder="Водитель" value={newEmployee.postNom} onChange={(e) => setNewEmployee({ ...newEmployee, postNom: e.target.value })} className="bg-white" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500 uppercase">Должность (родительный)</Label>
                                    <Input placeholder="Водителя" value={newEmployee.postGen} onChange={(e) => setNewEmployee({ ...newEmployee, postGen: e.target.value })} className="bg-white" />
                                  </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500 uppercase">Дата рождения</Label>
                                    <Input placeholder="ДД.ММ.ГГГГ" value={newEmployee.dob} onChange={(e) => setNewEmployee({ ...newEmployee, dob: e.target.value })} className="bg-white" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500 uppercase">Телефон <span className="text-red-500">*</span></Label>
                                    <Input placeholder="+7 (999) 123-45-67" value={newEmployee.phone} onChange={(e) => setNewEmployee({ ...newEmployee, phone: e.target.value })} className="bg-white" />
                                  </div>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-slate-500 uppercase">Email</Label>
                                  <Input placeholder="email@company.ru" value={newEmployee.email} onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })} className="bg-white" />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-slate-500 uppercase">Наименование правоустанавливающего (родительный падеж)</Label>
                                  <Input placeholder="Устава, Доверенности №123 от 01.01.2025" value={newEmployee.docName} onChange={(e) => setNewEmployee({ ...newEmployee, docName: e.target.value })} className="bg-white" />
                                </div>
                              </div>

                              {/* Roles - Green */}
                              <div className="bg-green-50/30 border border-green-100 rounded-lg p-6 space-y-4">
                                <div className="flex items-center gap-2 text-green-700 font-semibold border-b border-green-100 pb-2 mb-2">
                                  <CheckSquare className="w-4 h-4" /> Роли сотрудника
                                </div>
                                <div className="flex flex-wrap gap-8">
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={newEmployee.roles.driver} onChange={(e) => setNewEmployee({ ...newEmployee, roles: { ...newEmployee.roles, driver: e.target.checked } })} className="w-5 h-5 rounded border-slate-300 text-green-600 focus:ring-green-500" />
                                    <span className="text-sm font-medium text-slate-700">Водитель</span>
                                  </label>
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={newEmployee.roles.accountant} onChange={(e) => setNewEmployee({ ...newEmployee, roles: { ...newEmployee.roles, accountant: e.target.checked } })} className="w-5 h-5 rounded border-slate-300 text-green-600 focus:ring-green-500" />
                                    <span className="text-sm font-medium text-slate-700">Бухгалтер</span>
                                  </label>
                                  <label className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" checked={newEmployee.roles.receiver} onChange={(e) => setNewEmployee({ ...newEmployee, roles: { ...newEmployee.roles, receiver: e.target.checked } })} className="w-5 h-5 rounded border-slate-300 text-green-600 focus:ring-green-500" />
                                    <span className="text-sm font-medium text-slate-700">Приемосдатчик</span>
                                  </label>
                                </div>

                                {newEmployee.roles.driver && (
                                  <div className="pt-4 mt-2 border-t border-green-100 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="space-y-2">
                                      <Label className="text-xs font-medium text-slate-500 uppercase">ВУ действует до</Label>
                                      <Input placeholder="ДД.ММ.ГГГГ" value={newEmployee.dlExpiry} onChange={(e) => setNewEmployee({ ...newEmployee, dlExpiry: e.target.value })} className="bg-white" />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs font-medium text-slate-500 uppercase">Договор с перевозчиком от</Label>
                                      <Input placeholder="ДД.ММ.ГГГГ" value={newEmployee.contractFrom} onChange={(e) => setNewEmployee({ ...newEmployee, contractFrom: e.target.value })} className="bg-white" />
                                    </div>
                                    <div className="space-y-2">
                                      <Label className="text-xs font-medium text-slate-500 uppercase">Договор с перевозчиком до</Label>
                                      <Input placeholder="ДД.ММ.ГГГГ" value={newEmployee.contractTo} onChange={(e) => setNewEmployee({ ...newEmployee, contractTo: e.target.value })} className="bg-white" />
                                    </div>
                                  </div>
                                )}
                              </div>

                              {/* Documents - Yellow */}
                              <div className="bg-yellow-50/30 border border-yellow-100 rounded-lg p-6 space-y-4">
                                <div className="flex items-center gap-2 text-yellow-700 font-semibold border-b border-yellow-100 pb-2 mb-2">
                                  <FileText className="w-4 h-4" /> Документы
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500 uppercase">Паспортные данные</Label>
                                    <Input placeholder="1234 567890, выдан..." value={newEmployee.passport} onChange={(e) => setNewEmployee({ ...newEmployee, passport: e.target.value })} className="bg-white" />
                                  </div>
                                  <div className="space-y-2">
                                    <Label className="text-xs font-medium text-slate-500 uppercase">Доверенность/Решение действительно до</Label>
                                    <Input placeholder="ДД.ММ.ГГГГ" value={newEmployee.poaDate} onChange={(e) => setNewEmployee({ ...newEmployee, poaDate: e.target.value })} className="bg-white" />
                                  </div>
                                </div>
                                <div className="space-y-2 border-2 border-dashed border-yellow-200 rounded-lg p-4 bg-yellow-50/50 flex flex-col items-center justify-center">
                                  <div className="flex items-center gap-2 text-yellow-600 font-medium mb-1">
                                    <FileText className="w-4 h-4" /> Прикрепленные сканы
                                  </div>
                                  <p className="text-xs text-slate-400 mb-3">Нет прикрепленных документов</p>
                                  <Button size="sm" className="bg-[#E66400] hover:bg-orange-700 text-white gap-2 font-medium">
                                    <Paperclip className="w-3 h-3" /> Прикрепить скан
                                  </Button>
                                </div>
                              </div>

                              <div className="pt-2">
                                <Button
                                  variant="destructive"
                                  onClick={() => {
                                    setIsAddingEmployee(false)
                                  }}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" /> Удалить сотрудника
                                </Button>
                              </div>

                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="transport" className="mt-0">
                      <div className="space-y-4">
                        {!isAddingTransport ? (
                          <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                              <h3 className="font-semibold text-lg">Транспорт</h3>
                              <Button onClick={() => setIsAddingTransport(true)} className="bg-green-600 hover:bg-green-700 text-white gap-2">
                                <Plus className="w-4 h-4" /> Добавить транспорт
                              </Button>
                            </div>
                            {transport.length === 0 ? (
                              <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                                <p className="text-slate-400 mb-1">Нет транспорта</p>
                                <p className="text-xs text-slate-400">Нажмите "Добавить транспорт"</p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {transport.map((t) => (
                                  <Card key={t.id} className="p-4 border border-slate-200 shadow-sm flex justify-between items-start">
                                    <div className="flex gap-4">
                                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
                                        <Truck className="w-5 h-5" />
                                      </div>
                                      <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                                        <div>
                                          <p className="text-xs text-slate-500">Марка / Модель</p>
                                          <p className="font-medium text-slate-900">{t.brand} {t.model}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-slate-500">Гос. номер</p>
                                          <p className="font-medium text-slate-900">{t.plate}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-slate-500">Грузоподъемность</p>
                                          <p className="font-medium text-slate-900">{t.capacity} т</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-slate-500">Водитель</p>
                                          <p className="font-medium text-slate-900">{t.driverName}</p>
                                        </div>
                                      </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveTransport(t.id)} className="text-red-500 hover:bg-red-50">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </Card>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="font-semibold">Новый транспорт</h3>
                              <Button onClick={() => setIsAddingTransport(true)} className="bg-green-600 hover:bg-green-700 text-white gap-2">
                                <Plus className="w-4 h-4" /> Добавить транспорт
                              </Button>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-slate-500 uppercase">Тип <span className="text-red-500">*</span></Label>
                                  <Select value={newTransport.type} onValueChange={(val) => setNewTransport({ ...newTransport, type: val })}>
                                    <SelectTrigger className="bg-white">
                                      <SelectValue placeholder="Выберите тип">
                                        {newTransport.type === 'truck' ? 'Грузовик' :
                                          newTransport.type === 'trailer' ? 'Прицеп' :
                                            newTransport.type === 'semitrailer' ? 'Полуприцеп' : null}
                                      </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="truck">Грузовик</SelectItem>
                                      <SelectItem value="trailer">Прицеп</SelectItem>
                                      <SelectItem value="semitrailer">Полуприцеп</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-slate-500 uppercase">Марка <span className="text-red-500">*</span></Label>
                                  <Input placeholder="KAMAZ" value={newTransport.brand} onChange={(e) => setNewTransport({ ...newTransport, brand: e.target.value })} className="bg-white" />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-slate-500 uppercase">Модель <span className="text-red-500">*</span></Label>
                                  <Input placeholder="65115" value={newTransport.model} onChange={(e) => setNewTransport({ ...newTransport, model: e.target.value })} className="bg-white" />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-slate-500 uppercase">Гос. номер <span className="text-red-500">*</span></Label>
                                  <Input placeholder="A123BB77" value={newTransport.plate} onChange={(e) => setNewTransport({ ...newTransport, plate: e.target.value })} className="bg-white" />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-slate-500 uppercase">Грузоподъемность (тонн) <span className="text-red-500">*</span></Label>
                                  <Input placeholder="0" type="number" value={newTransport.capacity} onChange={(e) => setNewTransport({ ...newTransport, capacity: e.target.value })} className="bg-white" />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-slate-500 uppercase">Водитель</Label>
                                  <Input placeholder="Иванов И.И." value={newTransport.driverName} onChange={(e) => setNewTransport({ ...newTransport, driverName: e.target.value })} className="bg-white" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label className="text-xs font-medium text-slate-500 uppercase">Телефон водителя</Label>
                                <Input placeholder="+7 (999) 123-45-67" value={newTransport.driverPhone} onChange={(e) => setNewTransport({ ...newTransport, driverPhone: e.target.value })} className="bg-white" />
                              </div>

                              <div className="space-y-2">
                                <Label className="text-xs font-medium text-slate-500 uppercase">Документы</Label>
                                <div className="border border-slate-200 rounded-md p-4 bg-slate-50 flex justify-between items-center">
                                  <span className="text-xs text-slate-400">Нет документов</span>
                                  <Button size="sm" className="bg-[#3872F5] hover:bg-blue-700 text-white gap-2 font-medium">
                                    <Paperclip className="w-3 h-3" /> Прикрепить
                                  </Button>
                                </div>
                              </div>

                              <div className="pt-2">
                                <Button
                                  variant="destructive"
                                  onClick={() => {
                                    handleAddTransport() // For demo purposes we save on 'delete' click in the screenshot? No, usually save button is explicit. The user screenshot has "Create Counterparty" at bottom which saves everything. 
                                    // But inside the tab there is "Delete Transport" button in the red color.
                                    // Wait, the screenshot shows "Delete Transport" button when adding? That's weird. 
                                    // Ah, usually "Delete" is for editing mode. 
                                    // I'll stick to a "Save" button pattern or "Cancel" which goes back to list.
                                    // The user screenshot for adding transport shows "Delete Transport". This implies we might be in 'edit' mode or the 'add' form is actually a 'card' that is added and then filled?
                                    // I'll implement "Delete" that cancels the add form for now to match visual, but logically "Cancel" is better.
                                    setIsAddingTransport(false)
                                  }}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" /> Удалить транспорт
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="declarations" className="mt-0">
                      <div className="space-y-4">
                        {!isAddingDeclaration ? (
                          <div className="flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                              <h3 className="font-semibold text-lg">Декларации</h3>
                              <Button onClick={() => setIsAddingDeclaration(true)} className="bg-green-600 hover:bg-green-700 text-white gap-2">
                                <Plus className="w-4 h-4" /> Добавить декларацию
                              </Button>
                            </div>
                            {declarations.length === 0 ? (
                              <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                                <p className="text-slate-400 mb-1">Нет деклараций</p>
                                <p className="text-xs text-slate-400">Нажмите "Добавить декларацию"</p>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                {declarations.map((d) => (
                                  <Card key={d.id} className="p-4 border border-slate-200 shadow-sm flex justify-between items-start">
                                    <div className="flex gap-4">
                                      <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold">
                                        <FileText className="w-5 h-5" />
                                      </div>
                                      <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                                        <div>
                                          <p className="text-xs text-slate-500">Номер / Дата</p>
                                          <p className="font-medium text-slate-900">{d.number} от {d.date}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-slate-500">Товар</p>
                                          <p className="font-medium text-slate-900">{d.product}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-slate-500">Вес (тонн)</p>
                                          <p className="font-medium text-slate-900">{d.weight}</p>
                                        </div>
                                        <div>
                                          <p className="text-xs text-slate-500">Статус</p>
                                          <Badge variant={d.status === 'active' ? 'default' : 'secondary'} className={d.status === 'active' ? 'bg-green-100 text-green-700 hover:bg-green-200' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}>
                                            {d.status === 'active' ? 'Действует' : 'Истекла'}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => handleRemoveDeclaration(d.id)} className="text-red-500 hover:bg-red-50">
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </Card>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div className="flex justify-between items-center mb-4">
                              <h3 className="font-semibold">Новая декларация</h3>
                              <Button onClick={() => setIsAddingDeclaration(true)} className="bg-green-600 hover:bg-green-700 text-white gap-2">
                                <Plus className="w-4 h-4" /> Добавить декларацию
                              </Button>
                            </div>

                            <div className="bg-white border border-slate-200 rounded-lg p-6 space-y-6">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-slate-500 uppercase">Номер <span className="text-red-500">*</span></Label>
                                  <Input placeholder="10702000/..." value={newDeclaration.number} onChange={(e) => setNewDeclaration({ ...newDeclaration, number: e.target.value })} className="bg-white" />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-slate-500 uppercase">Дата <span className="text-red-500">*</span></Label>
                                  <Input placeholder="ДД.ММ.ГГГГ" value={newDeclaration.date} onChange={(e) => setNewDeclaration({ ...newDeclaration, date: e.target.value })} className="bg-white" />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-slate-500 uppercase">Товар <span className="text-red-500">*</span></Label>
                                  <Input placeholder="Пшеница 3 класс" value={newDeclaration.product} onChange={(e) => setNewDeclaration({ ...newDeclaration, product: e.target.value })} className="bg-white" />
                                </div>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-slate-500 uppercase">Вес (тонн) <span className="text-red-500">*</span></Label>
                                  <Input placeholder="0" type="number" value={newDeclaration.weight} onChange={(e) => setNewDeclaration({ ...newDeclaration, weight: e.target.value })} className="bg-white" />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-slate-500 uppercase">Срок действия <span className="text-red-500">*</span></Label>
                                  <Input placeholder="ДД.ММ.ГГГГ" value={newDeclaration.expiry} onChange={(e) => setNewDeclaration({ ...newDeclaration, expiry: e.target.value })} className="bg-white" />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-xs font-medium text-slate-500 uppercase">Статус <span className="text-red-500">*</span></Label>
                                  <Select value={newDeclaration.status} onValueChange={(val) => setNewDeclaration({ ...newDeclaration, status: val })}>
                                    <SelectTrigger className="bg-white">
                                      <SelectValue placeholder="Выберите статус">
                                        {newDeclaration.status === 'active' ? 'Действует' :
                                          newDeclaration.status === 'expired' ? 'Истекла' : null}
                                      </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="active">Действует</SelectItem>
                                      <SelectItem value="expired">Истекла</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <Label className="text-xs font-medium text-slate-500 uppercase">Документы и справки</Label>
                                <div className="border border-slate-200 rounded-md p-4 bg-slate-50 flex justify-between items-center">
                                  <span className="text-xs text-slate-400">Нет документов</span>
                                  <Button size="sm" className="bg-[#3872F5] hover:bg-blue-700 text-white gap-2 font-medium">
                                    <Paperclip className="w-3 h-3" /> Прикрепить
                                  </Button>
                                </div>
                              </div>

                              <div className="pt-2">
                                <Button
                                  variant="destructive"
                                  onClick={() => setIsAddingDeclaration(false)}
                                >
                                  <Trash2 className="w-4 h-4 mr-2" /> Удалить декларацию
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </TabsContent>
                    <TabsContent value="scans" className="mt-0">
                      <div className="space-y-6">
                        {/* Header & Stats */}
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg">Сканы юридических документов</h3>
                              <p className="text-sm text-slate-500">Прикрепите необходимые документы. Загруженные документы отмечены зеленой галочкой.</p>
                            </div>
                            <Button className="bg-[#3872F5] hover:bg-blue-600 text-white gap-2">
                              <Plus className="w-4 h-4" /> Добавить свой документ
                            </Button>
                          </div>

                          <div className="flex gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                <CheckCircle2 className="w-3 h-3" />
                              </div>
                              <span className="text-slate-600">Загружено: <span className="font-medium text-slate-900">{uploadedCount}</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                                <File className="w-3 h-3" />
                              </div>
                              <span className="text-slate-600">Не загружено: <span className="font-medium text-slate-900">{notUploadedCount}</span></span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                <Plus className="w-3 h-3" />
                              </div>
                              <span className="text-slate-600">Пользовательских: <span className="font-medium text-slate-900">{customCount}</span></span>
                            </div>
                          </div>
                        </div>

                        {/* Standard Docs List */}
                        <div className="space-y-4">
                          <h4 className="font-medium text-slate-700">Стандартные документы</h4>
                          <div className="grid gap-3">
                            {standardDocs.map((doc) => (
                              <div key={doc.id} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-slate-300 transition-colors">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                                    <FileText className="w-4 h-4" />
                                  </div>
                                  <span className="font-medium text-slate-700">{doc.name}</span>
                                </div>
                                <Button className="bg-[#E66400] hover:bg-orange-700 text-white gap-2 h-9 text-sm">
                                  <Paperclip className="w-3 h-3" /> Прикрепить
                                </Button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TabsContent>
                  </div>

                  <div className="flex justify-end gap-3 p-4 bg-slate-50 border-t border-slate-200">
                    <Button type="submit" className="flex-1 bg-[#E66400] hover:bg-orange-700 text-white text-base h-12 rounded-lg font-medium">Создать контрагента</Button>
                    <Button variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-base h-12 px-8 rounded-lg font-medium" onClick={() => setIsAddModalOpen(false)}>Отмена</Button>
                  </div>
                </Tabs>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-4 border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded text-orange-600">
              <UsersIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium uppercase">Клиенты</div>
              <div className="text-2xl font-bold text-slate-900">{stats.clients}</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded text-orange-600">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium uppercase">Поставщики</div>
              <div className="text-2xl font-bold text-slate-900">{stats.suppliers}</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-100 rounded text-orange-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-slate-500 font-medium uppercase">Контрактов</div>
              <div className="text-2xl font-bold text-slate-900">{stats.contracts}</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-4 items-center bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <Input
            placeholder="Поиск по названию, ИНН, контакту или email..."
            className="border-none shadow-none pl-9 h-10 text-base"
          />
        </div>
        <div className="flex gap-1 pr-2 flex-wrap">
          <Button variant="ghost" onClick={() => setFilter('all')} className={cn("h-8 text-sm px-4", filter === 'all' ? "bg-[#E66400] text-white hover:bg-orange-700" : "text-slate-600 hover:text-slate-900")}>Все</Button>
          <Button variant="ghost" onClick={() => setFilter('Client')} className={cn("h-8 text-sm px-4", filter === 'Client' ? "bg-[#E66400] text-white hover:bg-orange-700" : "text-slate-600 hover:text-slate-900")}>Клиенты</Button>
          <Button variant="ghost" onClick={() => setFilter('Supplier')} className={cn("h-8 text-sm px-4", filter === 'Supplier' ? "bg-[#E66400] text-white hover:bg-orange-700" : "text-slate-600 hover:text-slate-900")}>Поставщики</Button>
          <Button variant="ghost" onClick={() => setFilter('active')} className={cn("h-8 text-sm px-4", filter === 'active' ? "bg-[#E66400] text-white hover:bg-orange-700" : "text-slate-600 hover:text-slate-900")}>Активные</Button>
        </div>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredContragents.map((agent) => (
          <Link href={`/contragents/${agent.id}`} key={agent.id} className="block transition-transform hover:-translate-y-1">
            <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer overflow-hidden group">
              <div className="p-6">
                {/* Top Row */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded flex items-center justify-center text-[#E66400] shrink-0 font-bold text-xl">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-[#E66400] transition-colors">{agent.name}</h3>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none font-normal">
                          {agent.type}
                        </Badge>
                        <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50 font-normal">
                          {agent.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500">
                        {agent.inn && <span>ИНН: <span className="font-mono text-slate-700">{agent.inn}</span></span>}
                        {agent.inn && <span>•</span>}
                        {agent.kpp && <span>КПП: <span className="font-mono text-slate-700">{agent.kpp}</span></span>}
                        {agent.kpp && <span>•</span>}
                        <div className="flex items-center gap-1">
                          Рейтинг:
                          <div className="flex gap-0.5 text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(agent.trustRating / 20) ? 'fill-current' : 'text-slate-200'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-6">
                  <div className="flex items-start gap-3">
                    <div className="mt-1"><UsersIcon className="w-4 h-4 text-slate-400" /></div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium mb-0.5">Контакт</div>
                      <div className="text-sm font-medium text-slate-900">{agent.contactPerson || '-'}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1"><Phone className="w-4 h-4 text-slate-400" /></div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium mb-0.5">Телефон</div>
                      <div className="text-sm font-medium text-slate-900">{agent.phone || '-'}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1"><Mail className="w-4 h-4 text-slate-400" /></div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium mb-0.5">Email</div>
                      <div className="text-sm font-medium text-slate-900">{agent.email || '-'}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="mt-1"><MapPin className="w-4 h-4 text-slate-400" /></div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium mb-0.5">Адрес</div>
                      <div className="text-sm text-slate-600 line-clamp-2">{agent.address || '-'}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Metrics Bar */}
              <div className="bg-slate-50 border-t border-slate-100 px-6 py-4 grid grid-cols-3 gap-6">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Контрактов</div>
                  <div className="font-bold text-orange-600 text-lg">{agent.contracts?.length || 0}</div>
                </div>
                <div className="border-l border-slate-200 pl-6">
                  <div className="text-xs text-slate-500 mb-1">Объем (т)</div>
                  <div className="font-bold text-blue-600 text-lg">0</div>
                </div>
                <div className="border-l border-slate-200 pl-6">
                  <div className="text-xs text-slate-500 mb-1">Стоимость</div>
                  <div className="font-bold text-green-600 text-lg">0 ₽</div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

function UsersIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

// Helper to match the 'options' prop pattern used in the original mocks
function Select({ options, value, onValueChange, placeholder, className }: any) {
  return (
    <RadixSelect value={value} onValueChange={onValueChange}>
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt: any) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </RadixSelect>
  )
}
