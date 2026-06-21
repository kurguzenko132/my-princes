import { getLevel, levels } from '@/lib/data/levels'
import { SimulatorCanvas } from '@/components/simulator/SimulatorCanvas'
import { GameTopBar, GameStats } from '@/components/simulator/GameTopBar'
import { TrainingStepper } from '@/components/simulator/TrainingStepper'
import { GameHintCard } from '@/components/simulator/GameHintCard'
import { GameControlDock } from '@/components/simulator/GameControlDock'
import { GameMotivation } from '@/components/simulator/GameMotivation'
import { AuthGuard } from '@/components/auth/AuthGuard'

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
    <main className="game-shell min-h-screen px-3 py-4 text-white md:px-8 md:py-7">
      <AuthGuard>
        <div className="mx-auto flex min-h-[calc(100vh-32px)] max-w-[1180px] flex-col gap-4">
          <GameTopBar title={level.title} skill={level.skill} difficulty={level.difficulty} />
          <GameStats />
          <TrainingStepper />

          <section className="relative min-h-[420px] flex-1 overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#101827] shadow-card md:min-h-[580px]">
            <GameHintCard />
            <SimulatorCanvas level={level} />
          </section>

          <GameControlDock level={level} />
          <GameMotivation />
        </div>
      </AuthGuard>
    </main>
  )
}
