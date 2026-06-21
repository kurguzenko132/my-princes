'use client'

import { Flag, RotateCcw, Flower2 } from 'lucide-react'
import { FinishAttemptButton } from '@/components/simulator/FinishAttemptButton'
import { useSimulatorStore } from '@/store/simulatorStore'
import type { ParkingLevel } from '@/lib/data/levels'
import type { CarInput } from '@/lib/physics/types'

function HoldButton({ children, onHold, onRelease, className = '' }: {
  children: React.ReactNode
  onHold: () => void
  onRelease: () => void
  className?: string
}) {
  return (
    <button
      onPointerDown={onHold}
      onPointerUp={onRelease}
      onPointerCancel={onRelease}
      onPointerLeave={onRelease}
      className={`touch-none select-none rounded-3xl border border-white/10 bg-white/10 px-4 py-5 text-sm font-semibold text-white shadow-card active:scale-[.98] ${className}`}
    >
      {children}
    </button>
  )
}

export function GameControlDock({ level }: { level: ParkingLevel }) {
  const { setInput, car, setGear, resetCar, comfortMode, setComfortMode } = useSimulatorStore()
  const press = (key: keyof CarInput, value: boolean) => () => setInput({ [key]: value } as Partial<CarInput>)

  return (
    <section className="space-y-3">
      <div className="game-glass rounded-[2rem] p-3 md:p-5">
        <div className="grid grid-cols-[72px_1fr] gap-3 md:grid-cols-[92px_1fr_1.45fr] md:gap-5">
          <div className="rounded-3xl border border-white/10 bg-[#0B0E17]/80 p-2">
            <button
              onClick={() => setGear('D')}
              className={`mb-2 flex h-14 w-full items-center justify-center rounded-2xl text-xl font-semibold ${car.gear === 'D' ? 'bg-mint text-ink' : 'bg-white/7 text-soft'}`}
            >
              D
            </button>
            <div className="text-center text-xs text-soft">↕</div>
            <button
              onClick={() => setGear('R')}
              className={`mt-2 flex h-14 w-full items-center justify-center rounded-2xl text-xl font-semibold ${car.gear === 'R' ? 'bg-pink text-white neon-border-pink' : 'bg-white/7 text-soft'}`}
            >
              R
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <HoldButton onHold={press('brake', true)} onRelease={press('brake', false)} className="bg-pink/18 text-pink neon-border-pink">
              <span className="block text-2xl">⦿</span>
              <span>Тормоз</span>
            </HoldButton>
            <HoldButton onHold={press('throttle', true)} onRelease={press('throttle', false)} className="bg-sky/15 text-sky neon-border-blue">
              <span className="block text-2xl">▥</span>
              <span>Газ</span>
            </HoldButton>
          </div>

          <div className="col-span-2 grid grid-cols-[1fr_92px_1fr] items-center gap-3 rounded-3xl border border-white/10 bg-[#0B0E17]/65 p-3 md:col-span-1">
            <HoldButton onHold={press('steerLeft', true)} onRelease={press('steerLeft', false)} className="text-3xl">‹</HoldButton>
            <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-white/8 shadow-card">
              <div className="flex h-16 w-16 items-center justify-center rounded-full border border-white/20 text-3xl text-soft">◉</div>
            </div>
            <HoldButton onHold={press('steerRight', true)} onRelease={press('steerRight', false)} className="text-3xl">›</HoldButton>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => resetCar(level.start)}
          className="game-chip flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm text-soft active:scale-[.98]"
        >
          <RotateCcw size={17} />
          <span className="hidden sm:inline">Сброс</span>
        </button>

        <button
          onClick={() => setComfortMode(!comfortMode)}
          className="game-chip flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm text-soft active:scale-[.98]"
        >
          <Flower2 size={17} />
          <span className="hidden sm:inline">Спокойный режим</span>
        </button>

        <div className="contents">
          <FinishAttemptButton level={level} compact />
        </div>
      </div>
    </section>
  )
}
