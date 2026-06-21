import { AppShell } from '@/components/shared/AppShell'
import { Card } from '@/components/shared/Card'
import { ProgressBar } from '@/components/shared/ProgressBar'

export default function ProgressPage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <Card>
          <h1 className="text-4xl font-semibold">Твой прогресс, Вика</h1>
          <p className="mt-3 text-soft">Пока данные демонстрационные. После подключения Supabase сюда будут сохраняться реальные попытки.</p>
        </Card>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            ['Габариты', 32],
            ['Парковка передом', 18],
            ['Парковка задом', 12],
            ['Параллельная', 5]
          ].map(([name, value]) => (
            <Card key={name as string}>
              <h2 className="font-semibold">{name}</h2>
              <div className="mt-4"><ProgressBar value={value as number} /></div>
              <p className="mt-2 text-sm text-soft">{value}%</p>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
