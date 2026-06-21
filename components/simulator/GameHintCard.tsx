'use client'

import { Lightbulb } from 'lucide-react'
import { useSimulatorStore } from '@/store/simulatorStore'

export function GameHintCard() {
  const { currentHint } = useSimulatorStore()

  return (
    <div className="game-glass pointer-events-none absolute left-4 top-4 z-20 max-w-[230px] rounded-3xl p-4 md:left-6 md:top-6">
      <div className="flex gap-3">
        <Lightbulb className="mt-1 shrink-0 text-pink" size={22} />
        <div>
          <p className="font-semibold text-white">Подсказка:</p>
          <p className="mt-1 text-sm leading-6 text-soft">{currentHint}</p>
        </div>
      </div>
    </div>
  )
}
