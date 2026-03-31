'use client'

import { usePathname } from 'next/navigation'

export default function TopBar() {
  const pathname = usePathname()

  if (pathname === '/login') return null

  return (
    <header className="sticky top-0 z-40 flex items-center px-8 py-4 w-full bg-surface-bright dark:bg-slate-900 border-b border-outline-variant/10">
      <h2 className="text-xl font-bold tracking-tight text-on-surface dark:text-white">RD System</h2>
    </header>
  )
}
