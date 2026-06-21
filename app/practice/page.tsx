import { AppShell } from '@/components/shared/AppShell'
import { Card } from '@/components/shared/Card'
import { levels } from '@/lib/data/levels'

const categoryNames: Record<string, string> = {
  basic: 'Габариты Octavia',
  shop: 'Парковка у магазина',
  yard: 'Двор',
  parallel: 'Параллельная парковка',
  hard: 'Сложные ситуации'
}

export default function PracticePage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <Card>
          <h1 className="text-4xl font-semibold">Практика парковки</h1>
          <p className="mt-3 max-w-2xl text-soft">Реальные ситуации: магазин, двор, бордюр, тесное место и выезд между машинами. Тренировка идёт на машине с габаритами Skoda Octavia.</p>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {levels.map(level => (
            <a key={level.id} href={`/simulator/${level.id}`} className="glass rounded-3xl p-5 transition hover:scale-[1.01] hover:bg-white/10">
              <p className="text-sm text-sky">{categoryNames[level.category]} · сложность {level.difficulty}/5</p>
              <h2 className="mt-2 text-xl font-semibold">{level.title}</h2>
              <p className="mt-2 text-sm leading-6 text-soft">{level.intro}</p>
              <p className="mt-4 rounded-2xl bg-white/8 px-4 py-3 text-sm text-soft">{level.goal}</p>
            </a>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
