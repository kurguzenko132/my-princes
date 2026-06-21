'use client'

import { buildAttemptResult } from '@/lib/simulator/result'
import { saveAttempt } from '@/lib/progress/storage'
import type { ParkingLevel } from '@/lib/data/levels'
import { useSimulatorStore } from '@/store/simulatorStore'

export function FinishAttemptButton({ level, compact = false }: { level: ParkingLevel; compact?: boolean }) {
  const finish = () => {
    const state = useSimulatorStore.getState()
    const result = buildAttemptResult({
      level,
      car: state.car,
      config: state.config,
      collisions: state.collisions,
      maneuvers: state.maneuvers,
      startedAt: state.startedAt,
      maxSpeed: state.maxSpeed,
      completed: false
    })
    saveAttempt(result)
    window.location.href = `/results/${result.id}`
  }

  return (
    <button
      onClick={finish}
      className={compact
        ? "game-chip flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-semibold text-pink active:scale-[.98]"
        : "w-full rounded-2xl bg-gradient-to-r from-pink to-violet px-4 py-3 text-sm font-semibold shadow-glow active:scale-[.98]"
      }
    >
      <span>{compact ? '⚑' : ''}</span>
      {compact ? 'Завершить' : 'Завершить попытку и посмотреть разбор'}
    </button>
  )
}
