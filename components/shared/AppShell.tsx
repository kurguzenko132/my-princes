import Link from 'next/link'
import { BookOpen, Car, Gauge, Home, Settings, Trophy } from 'lucide-react'

const nav = [
  { href: '/dashboard', label: 'Главная', icon: Home },
  { href: '/learn', label: 'Теория', icon: BookOpen },
  { href: '/practice', label: 'Практика', icon: Car },
  { href: '/progress', label: 'Прогресс', icon: Gauge },
  { href: '/achievements', label: 'Награды', icon: Trophy },
  { href: '/settings', label: 'Настройки', icon: Settings }
]

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-radialsoft">
      <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-4 md:flex-row md:gap-5 md:px-6">
        <aside className="glass mb-4 flex items-center justify-between rounded-3xl px-4 py-3 md:sticky md:top-6 md:mb-0 md:h-[calc(100vh-48px)] md:w-64 md:flex-col md:items-stretch md:p-5">
          <Link href="/dashboard" className="font-semibold tracking-tight">
            Vika Parking
            <span className="block text-xs font-normal text-soft">только для Вики</span>
          </Link>
          <nav className="hidden gap-2 md:flex md:flex-col">
            {nav.map(item => {
              const Icon = item.icon
              return (
                <Link key={item.href} href={item.href} className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-soft hover:bg-white/10 hover:text-white">
                  <Icon size={18} />
                  {item.label}
                </Link>
              )
            })}
          </nav>
          <div className="text-xs text-soft">Skoda Octavia</div>
        </aside>
        <section className="flex-1 pb-24 md:pb-0">
          {children}
        </section>
        <nav className="fixed inset-x-2 bottom-3 z-50 grid grid-cols-6 rounded-3xl border border-white/10 bg-[#10131F]/90 p-1.5 backdrop-blur-xl md:hidden">
          {nav.map(item => {
            const Icon = item.icon
            return (
              <Link key={item.href} href={item.href} className="flex flex-col items-center gap-1 rounded-2xl px-1 py-2 text-[9px] text-soft">
                <Icon size={17} />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </main>
  )
}
