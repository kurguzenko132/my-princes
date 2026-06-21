'use client'

import { Pause, Settings, Heart } from 'lucide-react'
import { useSimulatorStore } from '@/store/simulatorStore'

export function GameTopBar({ title, skill, difficulty }: { title: string; skill: string; difficulty: number }) {
  return (
    <header className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-pink">Уровень {difficulty}</p>
          <h1 className="mt-1 max-w-[760px] text-3xl font-semibold leading-tight tracking-tight text-white md:text-5xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-soft md:text-base">
            <span className="font-semibold text-pink">Навык:</span> {skill}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <button className="flex h-12 w-12 items-center justify-center rounded-2xl border border-pink/25 bg-pink/10 text-white shadow-glow md:h-14 md:w-14">
            <Pause size={22} />
          </button>
          <a href="/settings" className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/8 text-white md:h-14 md:w-14">
            <Settings size={22} />
          </a>
        </div>
      </div>

      <div className="hidden justify-end md:flex">
        <Heart className="text-pink drop-shadow-[0_0_18px_rgba(255,91,200,.65)]" size={54} strokeWidth={1.4} />
      </div>
    </header>
  )
}

export function GameStats() {
  const { score, collisions, maneuvers } = useSimulatorStore()

  const items = [
    { label: 'Баллы', value: score, icon: '☆' },
    { label: 'Касания', value: collisions, icon: '☝' },
    { label: 'Манёвры', value: maneuvers, icon: '↩' }
  ]

  return (
    <div className="grid grid-cols-3 gap-2 md:max-w-3xl md:gap-4">
      {items.map(item => (
        <div key={item.label} className="game-chip flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm text-soft md:rounded-3xl md:px-6 md:py-4 md:text-base">
          <span className="text-lg text-pink">{item.icon}</span>
          <span className="hidden sm:inline">{item.label}</span>
          <span className="font-semibold text-pink">{item.value}</span>
        </div>
      ))}
    </div>
  )
}
