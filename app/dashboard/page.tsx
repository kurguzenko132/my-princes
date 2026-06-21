import { AppShell } from '@/components/shared/AppShell'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import { ProgressBar } from '@/components/shared/ProgressBar'
import { lessons } from '@/lib/data/lessons'
import { levels } from '@/lib/data/levels'
import { BookOpen, Car, Heart, Route } from 'lucide-react'

export default function DashboardPage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <Card className="relative overflow-hidden">
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-pink/20 blur-3xl" />
          <p className="text-sm text-pink">Личный тренажёр</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight md:text-6xl">Вика, рада видеть тебя снова 🚗</h1>
          <p className="mt-4 max-w-2xl text-soft">
            Сегодня можно спокойно пройти короткую теорию и сразу закрепить её на упражнении. Без спешки. Без давления.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button href={`/learn/${lessons[0].id}`}>Начать с теории</Button>
            <Button href={`/simulator/${levels[0].id}`} variant="secondary">Сразу практика</Button>
          </div>
        </Card>

        <div className="grid gap-5 lg:grid-cols-4">
          <Card>
            <BookOpen className="text-sky" />
            <h3 className="mt-3 font-semibold">Теория</h3>
            <p className="mt-2 text-sm text-soft">Короткие уроки без занудства.</p>
          </Card>
          <Card>
            <Route className="text-mint" />
            <h3 className="mt-3 font-semibold">Траектория</h3>
            <p className="mt-2 text-sm text-soft">Синяя линия показывает реальный путь.</p>
          </Card>
          <Card>
            <Car className="text-pink" />
            <h3 className="mt-3 font-semibold">Octavia</h3>
            <p className="mt-2 text-sm text-soft">Габариты похожи на твою машину.</p>
          </Card>
          <Card>
            <Heart className="text-pink" />
            <h3 className="mt-3 font-semibold">Без давления</h3>
            <p className="mt-2 text-sm text-soft">Ошибки объясняются спокойно.</p>
          </Card>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <Card>
            <h2 className="text-xl font-semibold">План на сегодня</h2>
            <div className="mt-4 space-y-3">
              <a href={`/learn/${lessons[0].id}`} className="block rounded-3xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
                <p className="text-sm text-sky">1. Теория</p>
                <h3 className="mt-1 font-semibold">{lessons[0].title}</h3>
                <p className="mt-2 text-sm text-soft">{lessons[0].subtitle}</p>
              </a>
              <a href={`/simulator/${levels[0].id}`} className="block rounded-3xl border border-white/10 bg-white/5 p-4 hover:bg-white/10">
                <p className="text-sm text-mint">2. Практика</p>
                <h3 className="mt-1 font-semibold">{levels[0].title}</h3>
                <p className="mt-2 text-sm text-soft">{levels[0].goal}</p>
              </a>
            </div>
          </Card>

          <Card>
            <h3 className="font-semibold">Прогресс</h3>
            <div className="mt-4"><ProgressBar value={22} /></div>
            <p className="mt-3 text-sm text-soft">22% стартового курса</p>
            <div className="mt-5 rounded-3xl bg-white/8 p-4">
              <h3 className="font-semibold">Сообщение от Дани 💛</h3>
              <p className="mt-2 text-sm leading-6 text-soft">
                Я сделал это не для того, чтобы ты идеально парковалась с первого раза. А чтобы тебе было спокойнее.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </AppShell>
  )
}
