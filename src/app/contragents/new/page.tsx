'use client'

import { useState, useActionState, useEffect } from 'react'
import { createContragent } from '../actions'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Trash, Paperclip, Plus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function NewContragentPage() {
    const [state, formAction] = useActionState(createContragent, null)
    // State for controlled inputs that need to be passed as hidden fields or just needed for UI logic
    const [type, setType] = useState('company')
    const router = useRouter()

    useEffect(() => {
        if (state?.success) {
            router.push('/contragents')
        }
    }, [state, router])

    return (
        <form action={formAction} className="p-6 bg-slate-50 min-h-screen flex justify-center">
            <Card className="w-full max-w-5xl shadow-lg border-slate-200">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white rounded-t-lg">
                    <div className="flex items-center gap-4">
                        <Link href="/contragents">
                            <Button variant="ghost" size="icon">
                                <ArrowLeft className="w-5 h-5 text-slate-500" />
                            </Button>
                        </Link>
                        <h2 className="text-xl font-bold text-slate-800">Add Counterparty (Добавить контрагента)</h2>
                    </div>
                </div>

                <div className="p-6 bg-white min-h-[600px]">
                    <Tabs defaultValue="basic" className="w-full">
                        <TabsList className="bg-slate-100 p-1 w-full justify-start h-auto flex-wrap gap-1 mb-6">
                            <TabsTrigger value="basic" className="data-[state=active]:bg-[#E66400] data-[state=active]:text-white">Basic Info (Основное)</TabsTrigger>
                            <TabsTrigger value="addresses" className="data-[state=active]:bg-[#E66400] data-[state=active]:text-white">Addresses</TabsTrigger>
                            <TabsTrigger value="bank" className="data-[state=active]:bg-[#E66400] data-[state=active]:text-white">Bank Details</TabsTrigger>
                        </TabsList>

                        <TabsContent value="basic" className="space-y-6">
                            <div className="border border-slate-200 rounded-lg p-6 bg-slate-50/50">
                                <div className="grid grid-cols-2 gap-6 mb-4">
                                    <div className="space-y-2">
                                        <Label>Type <span className="text-red-500">*</span></Label>
                                        <Select value={type} onValueChange={setType}>
                                            <SelectTrigger className="bg-white">
                                                <SelectValue placeholder="Select type" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="company">Legal Entity (Юр. Лицо)</SelectItem>
                                                <SelectItem value="individual">Individual (ИП)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <input type="hidden" name="type" value={type} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Short Name <span className="text-red-500">*</span></Label>
                                        <Input name="name" placeholder='e.g. OOO "TransLogic"' className="bg-white" required />
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-6 mb-4">
                                    <div className="space-y-2">
                                        <Label>INN <span className="text-red-500">*</span></Label>
                                        <Input name="inn" placeholder="1234567890" className="bg-white" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>KPP</Label>
                                        <Input name="kpp" placeholder="123456789" className="bg-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone</Label>
                                        <Input name="phone" placeholder="+7 (999) ..." className="bg-white" />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Manager / Contact Person</Label>
                                        <Input name="contactPerson" placeholder="Ivanov Ivan" className="bg-white" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input name="email" type="email" placeholder="mail@example.com" className="bg-white" />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="addresses" className="space-y-6">
                            <div className="border border-slate-200 rounded-lg p-6 bg-slate-50/50">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Legal Address <span className="text-red-500">*</span></Label>
                                        <Input name="address" placeholder="123456, City, Street..." className="bg-white" required />
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="bank" className="space-y-6">
                            <div className="text-center p-8 border border-dashed border-slate-300 rounded-lg text-slate-500">
                                Bank details can be added after creation.
                            </div>
                        </TabsContent>

                    </Tabs>
                </div>

                {/* Footer Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-200 rounded-b-lg flex justify-between items-center">
                    <Link href="/contragents">
                        <Button variant="outline" type="button" className="bg-white">Cancel</Button>
                    </Link>
                    <div className="flex items-center gap-4">
                        {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}
                        <Button type="submit" className="bg-[#E66400] hover:bg-orange-600 text-white px-8">Create Counterparty</Button>
                    </div>
                </div>
            </Card>
        </form>
    )
}
