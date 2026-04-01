'use client'

import { usePathname, useRouter } from 'next/navigation'
import logo from '../../public/logo.png'
import Link from 'next/link'

export default function SideBar() {
    const pathname = usePathname()
    const router = useRouter()

    if (pathname === '/login') return null

    const navItems = [
        { name: 'Saldos', href: '/saldos', icon: 'account_balance' },
        { name: 'Edit', href: '/saldos/edit', icon: 'edit' },
        { name: 'Leads', href: '/leads', icon: 'visibility' },
    ]

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/login')
    }

    return (
        <aside className="h-screen w-64 fixed left-0 top-0 z-50 bg-surface-container-low dark:bg-slate-950 flex flex-col p-4 gap-2 shadow-[4px_0_24px_-4px_rgba(44,52,55,0.06)]">
            <div className="mb-8 px-2 flex items-center gap-3">
                <img src={logo.src} alt="logo" className='w-10 h-10' />
                <div>
                    <h1 className="font-black text-on-surface dark:text-white uppercase tracking-widest text-sm">RD System</h1>
                    <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Painel de relatórios</p>
                </div>
            </div>
            <nav className="flex-1 flex flex-col gap-1">
                {navItems.map((item) => (
                    <Link
                        key={item.href + item.name}
                        href={item.href}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${pathname === item.href
                            ? 'bg-white dark:bg-slate-800 text-primary dark:text-white shadow-sm'
                            : 'text-on-surface-variant dark:text-slate-400 hover:bg-surface-container-high dark:hover:bg-slate-800'
                            }`}
                    >
                        <span className="material-symbols-outlined" data-icon={item.icon}>{item.icon}</span>
                        <span className="font-medium text-sm tracking-wide">{item.name}</span>
                    </Link>
                ))}
            </nav>
            <div className="mt-auto pt-4 border-t border-outline-variant/10">
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-on-surface-variant dark:text-slate-400 hover:bg-surface-container-high dark:hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
                >
                    <span className="material-symbols-outlined" data-icon="logout">logout</span>
                    <span className="font-medium text-sm tracking-wide">Logout</span>
                </button>
            </div>
        </aside>
    )
}
