import { AppShell } from '@/components/shared/AppShell'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'

export default function ResultsPage() {
  return (
    <AppShell>
      <Card>
        <p className="text-sm text-pink">Разбор попытки</p>
        <h1 className="mt-2 text-4xl font-semibold">Вика, получилось хорошо 💛</h1>
        <p className="mt-4 text-6xl font-semibold text-mint">82/100</p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl bg-white/8 p-5">
            <h2 className="font-semibold">Что получилось</h2>
            <ul className="mt-3 space-y-2 text-soft">
              <li>— аккуратная скорость;</li>
              <li>— хороший момент поворота;</li>
              <li>— машина почти ровно встала в зоне.</li>
            </ul>
          </div>
          <div className="rounded-3xl bg-white/8 p-5">
            <h2 className="font-semibold">Что улучшить</h2>
            <ul className="mt-3 space-y-2 text-soft">
              <li>— чуть позже выровнять руль;</li>
              <li>— смотреть на габаритный коридор;</li>
              <li>— не ускоряться в конце манёвра.</li>
            </ul>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <Button href="/practice">Повторить</Button>
          <Button href="/dashboard" variant="secondary">На главную</Button>
        </div>
      </Card>
    </AppShell>
  )
}
