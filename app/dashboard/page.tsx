import { AppShell } from '@/components/shared/AppShell'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { levels } from '@/lib/data/levels'

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <Card className="relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-pink/20 blur-3xl" />
          <p className="text-sm text-pink">Личный тренажёр</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-6xl">Вика, рада видеть тебя снова 🚗</h1>
          <p className="mt-4 max-w-2xl text-soft">Сегодня можно просто 5 минут спокойно потренироваться. Без спешки. Без давления. Только практика.</p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href={`/simulator/${levels[0].id}`}>Продолжить обучение</Button>
            <Button href="/practice" variant="secondary">Свободная практика</Button>
          </div>
        </Card>

        <div className="grid gap-5 lg:grid-cols-3">
          <Card>
            <h3 className="font-semibold">Цель сегодня</h3>
            <p className="mt-2 text-soft">Почувствовать габариты Skoda Octavia и аккуратно пройти первый уровень.</p>
          </Card>
          <Card>
            <h3 className="font-semibold">Прогресс</h3>
            <div className="mt-4"><ProgressBar value={18} /></div>
            <p className="mt-3 text-sm text-soft">18% базового курса</p>
          </Card>
          <Card>
            <h3 className="font-semibold">Сообщение от Дани 💛</h3>
            <p className="mt-2 text-soft">Я сделал это не для того, чтобы ты идеально парковалась с первого раза. А чтобы тебе было спокойнее.</p>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-semibold">Следующая практика</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {levels.slice(0, 2).map(level => (
              <a key={level.id} href={`/simulator/${level.id}`} className="rounded-3xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
                <p className="text-sm text-sky">Сложность {level.difficulty}/5</p>
                <h3 className="mt-1 font-semibold">{level.title}</h3>
                <p className="mt-2 text-sm text-soft">{level.intro}</p>
              </a>
            ))}
          </div>
        </Card>
      </div>
    </AppShell>
  )
}
