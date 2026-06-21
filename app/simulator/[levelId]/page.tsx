import { AppShell } from '@/components/shared/AppShell'
import { Card } from '@/components/shared/Card'
import { getLevel } from '@/lib/data/levels'
import { SimulatorCanvas, TouchControls } from '@/components/simulator/SimulatorCanvas'
import { SimulatorHud } from '@/components/simulator/SimulatorHud'

export default function SimulatorPage({ params }: { params: { levelId: string } }) {
  const level = getLevel(params.levelId)

  return (
    <AppShell>
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-sky">Уровень · сложность {level.difficulty}/5</p>
              <h1 className="text-2xl font-semibold">{level.title}</h1>
              <p className="mt-1 text-sm text-soft">{level.goal}</p>
            </div>
            <SimulatorHud />
          </div>
        </Card>

        <div className="h-[58vh] min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#111827] md:h-[70vh]">
          <SimulatorCanvas level={level} />
        </div>

        <Card className="p-4">
          <TouchControls />
          <div className="hidden text-sm text-soft md:block">Управление: W/↑ — газ, S/↓ — тормоз, A/D — руль, Q — R, E — D, R — сброс.</div>
        </Card>
      </div>
    </AppShell>
  )
}
