'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, Users, FileText, Truck, BarChart3, Briefcase, FileSpreadsheet, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/login/actions'
import { cn } from '@/lib/utils'

const navigation = [
    { name: 'Контрагенты', href: '/contragents', icon: Users },
    { name: 'Договоры', href: '/contracts', icon: FileText },
    { name: 'Заявки на закупку', href: '/offers', icon: Briefcase },
    { name: 'Заявки', href: '/requests', icon: Truck },
    { name: 'Аналитика', href: '/analytics', icon: BarChart3 },
    { name: 'Менеджеры', href: '/managers', icon: Users },
    { name: 'Отчеты', href: '/reports', icon: FileSpreadsheet },
    { name: 'Бухгалтерия', href: '/accounting', icon: FileText },
]

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    if (pathname === '/login') return null

    return (
        <div className="md:hidden flex items-center justify-between p-4 bg-[#E66400] text-white">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center bg-white rounded-lg">
                    <span className="text-[#E66400] font-bold text-lg">Z</span>
                </div>
                <span className="font-bold text-lg">ZernoLab</span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)} className="text-white hover:bg-white/10">
                <Menu className="h-6 w-6" />
            </Button>

            {/* Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setIsOpen(false)}>
                    <div
                        className="absolute left-0 top-0 bottom-0 w-64 bg-[#E66400] p-4 shadow-xl flex flex-col"
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <span className="font-bold text-xl text-white">Меню</span>
                            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="text-white hover:bg-white/10">
                                <X className="h-6 w-6" />
                            </Button>
                        </div>

                        <nav className="flex-1 space-y-1 overflow-y-auto">
                            {navigation.map((item) => {
                                const isActive = pathname.startsWith(item.href)
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={cn(
                                            'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-sm font-medium',
                                            isActive
                                                ? 'bg-white text-[#E66400] shadow-sm'
                                                : 'text-white/90 hover:bg-white/10 hover:text-white'
                                        )}
                                    >
                                        <item.icon className={cn('w-5 h-5', isActive ? 'text-[#E66400]' : 'text-white/80')} />
                                        <span>{item.name}</span>
                                    </Link>
                                )
                            })}
                        </nav>

                        <div className="pt-4 mt-4 border-t border-white/10">
                            <button
                                onClick={() => logout()}
                                className="flex items-center gap-3 px-4 py-3 w-full text-white/90 hover:bg-white/10 hover:text-white rounded-lg text-sm font-medium"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Выйти</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
