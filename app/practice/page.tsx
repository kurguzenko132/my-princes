import { AppShell } from '@/components/shared/AppShell'
import { Card } from '@/components/shared/Card'
import { levels } from '@/lib/data/levels'
import { Car, MapPin, Target } from 'lucide-react'

const categoryNames: Record<string, string> = {
  basic: 'Габариты и база',
  shop: 'Парковка у магазина',
  yard: 'Двор',
  parallel: 'Параллельная парковка',
  hard: 'Сложные ситуации'
}

export default function PracticePage() {
  const grouped = Object.entries(
    levels.reduce<Record<string, typeof levels>>((acc, level) => {
      acc[level.category] = acc[level.category] || []
      acc[level.category].push(level)
      return acc
    }, {})
  )

  return (
    <AppShell>
      <div className="space-y-5">
        <Card>
          <p className="text-sm text-pink">Практика без стресса</p>
          <h1 className="mt-2 text-4xl font-semibold">Упражнения, которые реально учат парковаться</h1>
          <p className="mt-3 max-w-2xl text-soft">
            Не просто “попади в прямоугольник”, а жизненные ситуации: движение назад, кривые соседние машины, узкий двор, бордюр, выезд из тесного места.
          </p>
        </Card>

        {grouped.map(([category, items]) => (
          <section key={category} className="space-y-3">
            <h2 className="text-2xl font-semibold">{categoryNames[category]}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {items.map(level => (
                <a key={level.id} href={`/simulator/${level.id}`} className="glass rounded-3xl p-5 transition hover:scale-[1.01] hover:bg-white/10">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                      <Car className="text-sky" size={20} />
                    </div>
                    <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-soft">Сложность {level.difficulty}/5</span>
                  </div>

                  <h3 className="text-xl font-semibold">{level.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-soft">{level.intro}</p>

                  <div className="mt-4 grid gap-2 text-sm text-soft">
                    <div className="flex gap-2 rounded-2xl bg-white/7 px-3 py-2">
                      <Target size={16} className="mt-0.5 shrink-0 text-mint" />
                      <span>{level.goal}</span>
                    </div>
                    <div className="flex gap-2 rounded-2xl bg-white/7 px-3 py-2">
                      <MapPin size={16} className="mt-0.5 shrink-0 text-pink" />
                      <span>Навык: {level.skill}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>
    </AppShell>
  )
}
