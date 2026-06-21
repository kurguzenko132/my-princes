import { AppShell } from '@/components/shared/AppShell'
import { Card } from '@/components/shared/Card'
import { getLevel, levels } from '@/lib/data/levels'
import { SimulatorCanvas, TouchControls } from '@/components/simulator/SimulatorCanvas'
import { SimulatorHud } from '@/components/simulator/SimulatorHud'

type SimulatorPageProps = {
  params: Promise<{
    levelId: string
  }>
}

export function generateStaticParams() {
  return levels.map((level) => ({
    levelId: level.id
  }))
}

export default async function SimulatorPage({ params }: SimulatorPageProps) {
  const { levelId } = await params
  const level = getLevel(levelId)

  return (
    <AppShell>
      <div className="space-y-4">
        <Card className="p-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-sky">Уровень · сложность {level.difficulty}/5 · навык: {level.skill}</p>
              <h1 className="text-2xl font-semibold">{level.title}</h1>
              <p className="mt-1 text-sm text-soft">{level.goal}</p>
            </div>
            <SimulatorHud />
          </div>
        </Card>

        <div className="grid gap-4 lg:grid-cols-[1fr_280px]">
          <div className="h-[58vh] min-h-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#111827] md:h-[70vh]">
            <SimulatorCanvas level={level} />
          </div>

          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold">Подсказки уровня</h3>
              <ul className="mt-3 space-y-2 text-sm text-soft">
                {level.tips.map((tip) => <li key={tip}>— {tip}</li>)}
              </ul>
            </Card>

            <Card className="p-4">
              <h3 className="font-semibold">Что значит линия</h3>
              <div className="mt-3 space-y-2 text-sm text-soft">
                <p><span className="text-sky">Синяя</span> — куда машина реально поедет.</p>
                <p><span className="text-mint">Зелёная</span> — идеальная учебная траектория.</p>
                <p>Прозрачные машины — будущие положения корпуса.</p>
              </div>
            </Card>
          </div>
        </div>

        <Card className="p-4">
          <TouchControls />
          <div className="hidden text-sm text-soft md:block">
            Управление: W/↑ — газ, S/↓ — тормоз, A/D — руль, Q — R, E — D, R — сброс. Для спокойной тренировки включён режим замедления.
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
