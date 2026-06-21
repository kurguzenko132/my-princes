'use client'

import { useEffect } from 'react'
import { BookOpen, Car, ChartNoAxesColumnIncreasing, Flower2, Pause, RotateCcw, Settings, Star, Hand, Flag } from 'lucide-react'
import type { ParkingLevel } from '@/lib/data/levels'
import { useSimulatorStore } from '@/store/simulatorStore'
import { FinishAttemptButton } from '@/components/simulator/FinishAttemptButton'
import { playSound } from '@/lib/sound/soundEngine'
import { PremiumLayeredCanvas } from '@/components/simulator/PremiumLayeredCanvas'
import type { CarInput } from '@/lib/physics/types'

function HoldButton({ children, onHold, onRelease, className = '' }: {
  children: React.ReactNode
  onHold: () => void
  onRelease: () => void
  className?: string
}) {
  return (
    <button
      onPointerDown={() => { playSound('click'); onHold() }}
      onPointerUp={onRelease}
      onPointerCancel={onRelease}
      onPointerLeave={onRelease}
      className={`touch-none select-none rounded-[1.35rem] border border-white/10 bg-white/10 px-4 py-5 text-sm font-semibold text-white shadow-card active:scale-[.98] ${className}`}
    >
      {children}
    </button>
  )
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="v11-glass-soft flex items-center justify-center gap-3 rounded-[1.35rem] px-4 py-3 text-lg text-soft">
      <span className="text-pink">{icon}</span>
      <span>{label}</span>
      <b className="text-pink">{value}</b>
    </div>
  )
}

export function PremiumGameplayClient({ level }: { level: ParkingLevel }) {
  const { score, collisions, maneuvers, car, setGear, setInput, resetCar, setVirtualSteering, comfortMode, setComfortMode } = useSimulatorStore()
  const press = (key: keyof CarInput, value: boolean) => () => setInput({ [key]: value } as Partial<CarInput>)

  useEffect(() => {
    resetCar(level.start)
  }, [level.id, resetCar, level.start])

  return (
    <main className="v11-shell">
      <div className="v11-phone v11-bottom-safe px-4 py-5 md:px-8">
        <header className="relative">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-2xl text-pink">Уровень {level.difficulty}</p>
              <h1 className="v11-title mt-3 text-4xl md:text-5xl">{level.title}</h1>
              <p className="mt-5 text-xl text-soft"><span className="text-pink">Навык:</span> {level.skill}</p>
            </div>
            <div className="flex gap-4">
              <button className="flex h-16 w-16 items-center justify-center rounded-[1.35rem] bg-pink/10 text-white v11-pink-glow"><Pause size={30} /></button>
              <a href="/settings" className="flex h-16 w-16 items-center justify-center rounded-[1.35rem] bg-white/8 text-white v11-pink-glow"><Settings size={30} /></a>
            </div>
          </div>
          <div className="absolute right-0 top-32 hidden text-8xl text-pink drop-shadow-[0_0_30px_rgba(255,94,200,.55)] md:block">♡</div>
        </header>

        <div className="mt-7 grid grid-cols-3 gap-4">
          <Stat icon={<Star size={22} />} label="Баллы" value={score || 86} />
          <Stat icon={<Hand size={22} />} label="Касания" value={collisions} />
          <Stat icon={<RotateCcw size={22} />} label="Манёвры" value={maneuvers || 3} />
        </div>

        <div className="v11-glass mx-auto mt-7 grid max-w-[640px] grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-3 rounded-[1.35rem] px-5 py-3 text-center text-soft">
          <div className="flex items-center justify-center gap-2"><BookOpen /> Теория</div>
          <span>→</span>
          <div className="relative flex items-center justify-center gap-2 text-pink">
            <Car /> Практика
            <span className="absolute -bottom-3 h-0.5 w-28 rounded-full bg-pink shadow-[0_0_18px_rgba(255,94,200,.8)]" />
          </div>
          <span>→</span>
          <div className="flex items-center justify-center gap-2"><ChartNoAxesColumnIncreasing /> Разбор</div>
        </div>

        <section className="relative mt-6 h-[900px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#070a12] shadow-card md:h-[940px]">
          <PremiumLayeredCanvas level={level} />
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[#080B13]/35 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#080B13]/50 to-transparent" />
          <div className="v11-glass absolute left-5 top-8 max-w-[270px] rounded-[1.5rem] p-5">
            <div className="flex gap-4">
              <span className="text-3xl text-pink">☼</span>
              <div>
                <p className="text-xl font-semibold">Подсказка:</p>
                <p className="mt-2 text-lg leading-7 text-soft">смотри на синюю траекторию и выравнивай руль чуть раньше.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="v11-glass -mt-20 relative z-20 rounded-[2rem] p-4 md:p-5">
          <div className="grid grid-cols-[82px_1fr] gap-4 md:grid-cols-[100px_1fr_1.25fr]">
            <div className="rounded-[1.35rem] border border-white/10 bg-[#090d18]/80 p-2">
              <button
                onClick={() => { playSound('gear'); setGear('D') }}
                className={`flex h-16 w-full items-center justify-center rounded-[1.1rem] text-2xl font-semibold ${car.gear === 'D' ? 'bg-mint text-ink' : 'bg-white/5 text-soft'}`}
              >
                D
              </button>
              <div className="my-2 text-center text-soft">↕</div>
              <button
                onClick={() => { playSound('gear'); setGear('R') }}
                className={`flex h-16 w-full items-center justify-center rounded-[1.1rem] text-2xl font-semibold ${car.gear === 'R' ? 'bg-pink/70 text-white v11-pink-glow' : 'bg-white/5 text-soft'}`}
              >
                R
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <HoldButton onHold={press('brake', true)} onRelease={press('brake', false)} className="bg-pink/12 text-pink v11-pink-glow">
                <span className="block text-4xl">⦿</span>
                <span className="mt-2 block text-xl">Тормоз</span>
              </HoldButton>
              <HoldButton onHold={press('throttle', true)} onRelease={press('throttle', false)} className="bg-sky/12 text-sky v11-blue-glow">
                <span className="block text-4xl">▥</span>
                <span className="mt-2 block text-xl">Газ</span>
              </HoldButton>
            </div>

            <div className="col-span-2 grid grid-cols-[1fr_120px_1fr] items-center gap-4 rounded-[1.35rem] border border-white/10 bg-[#090d18]/75 p-4 md:col-span-1">
              <HoldButton onHold={() => setVirtualSteering(1)} onRelease={() => setVirtualSteering(null)} className="text-5xl">‹</HoldButton>
              <div className="flex h-28 w-28 items-center justify-center rounded-full border border-white/10 bg-white/8 shadow-card">
                <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 text-4xl text-soft">◉</div>
              </div>
              <HoldButton onHold={() => setVirtualSteering(-1)} onRelease={() => setVirtualSteering(null)} className="text-5xl">›</HoldButton>
            </div>
          </div>
        </section>

        <div className="mt-5 grid grid-cols-3 gap-4">
          <button onClick={() => resetCar(level.start)} className="v11-glass-soft flex items-center justify-center gap-3 rounded-[1.35rem] px-4 py-4 text-lg text-soft">
            <RotateCcw /> Сброс
          </button>
          <button onClick={() => setComfortMode(!comfortMode)} className="v11-glass-soft flex items-center justify-center gap-3 rounded-[1.35rem] px-4 py-4 text-lg text-soft">
            <Flower2 /> Спокойный режим
          </button>
          <FinishAttemptButton level={level} compact />
        </div>

        <div className="v11-glass mt-6 flex items-center justify-center gap-5 rounded-[1.6rem] px-5 py-5 text-center text-2xl text-white v11-pink-glow">
          <span className="text-pink">♡</span>
          <span>Спокойно, Вика, у тебя получится 💛</span>
          <span className="hidden text-pink md:inline">✦</span>
        </div>
      </div>
    </main>
  )
}
