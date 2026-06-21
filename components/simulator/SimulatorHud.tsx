'use client'
import { useSimulatorStore } from '@/store/simulatorStore'

export function SimulatorHud() {
  const { car, score, collisions, maneuvers, currentHint, comfortMode, setGear, setComfortMode } = useSimulatorStore()

  return (
    <div className="flex flex-col gap-2 text-sm md:items-end">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setGear('D')} className={`rounded-full px-4 py-2 ${car.gear === 'D' ? 'bg-mint text-ink' : 'bg-white/10 text-soft'}`}>D</button>
        <button onClick={() => setGear('R')} className={`rounded-full px-4 py-2 ${car.gear === 'R' ? 'bg-pink text-white' : 'bg-white/10 text-soft'}`}>R</button>
        <button onClick={() => setComfortMode(!comfortMode)} className={`rounded-full px-4 py-2 ${comfortMode ? 'bg-sky text-ink' : 'bg-white/10 text-soft'}`}>
          {comfortMode ? 'Спокойно' : 'Обычно'}
        </button>
        <span className="rounded-full bg-white/10 px-4 py-2">Баллы: {score}</span>
        <span className="rounded-full bg-white/10 px-4 py-2">Касания: {collisions}</span>
        <span className="rounded-full bg-white/10 px-4 py-2">Манёвры: {maneuvers}</span>
      </div>
      <p className="max-w-xl text-soft md:text-right">{currentHint}</p>
    </div>
  )
}
