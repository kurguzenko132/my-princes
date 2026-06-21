import { AppShell } from '@/components/shared/AppShell'
import { Card } from '@/components/shared/Card'

const items = [
  ['🚗', 'Первый заезд', 'Пройти первую тренировку.'],
  ['🅿️', 'Без касаний', 'Запарковаться без столкновений.'],
  ['🎯', 'Ровно в линиях', 'Встать почти идеально.'],
  ['💛', 'Без паники', 'Повторить сложный уровень и улучшить результат.'],
  ['🏁', 'Экзамен сдан', 'Пройти итоговую парковку на 80+.']
]

export default function AchievementsPage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <Card>
          <h1 className="text-4xl font-semibold">Достижения</h1>
          <p className="mt-3 text-soft">Мягкая мотивация без давления.</p>
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map(([icon, title, desc]) => (
            <Card key={title}>
              <div className="text-4xl">{icon}</div>
              <h2 className="mt-3 text-xl font-semibold">{title}</h2>
              <p className="mt-2 text-soft">{desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
