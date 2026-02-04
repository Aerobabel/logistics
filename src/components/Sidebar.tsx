'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Users,
  FileText,
  Truck,
  BarChart3,
  Briefcase,
  FileSpreadsheet,
  LogOut,
} from 'lucide-react'
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

export function Sidebar() {
  const pathname = usePathname()

  if (pathname === '/login') return null

  return (
    <div className="flex flex-col h-full w-64 bg-[#E66400] shrink-0">
      <div className="px-6 py-8">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-[#E66400]">
              <path d="M12 3C12 3 8 7 8 12C8 17 12 21 12 21C12 21 16 17 16 12C16 7 12 3 12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 8L12 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M12 10L14.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M12 12L9.5 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M12 14L14.5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight text-white leading-none font-sans">
              Zerno<span className="font-extralight text-white/90">Lab</span>
            </h1>
            <span className="text-[10px] font-medium text-white/60 uppercase tracking-[0.2em] mt-1 ml-0.5">
              Logistics
            </span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              href={item.href}
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

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-4 py-2">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
            A
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium text-white truncate">Администратор</p>
            <p className="text-xs text-white/70 truncate">admin@zernolab.com</p>
          </div>
          <button
            onClick={() => logout()}
            className="text-white/70 hover:text-white transition-colors"
            title="Выйти"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
