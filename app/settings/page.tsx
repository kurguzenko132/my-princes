'use client'
import { AppShell } from '@/components/shared/AppShell'
import { Card } from '@/components/shared/Card'
import { useSettingsStore } from '@/store/settingsStore'

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className="flex w-full items-center justify-between rounded-2xl bg-white/8 px-4 py-3 text-left">
      <span>{label}</span>
      <span className={`rounded-full px-3 py-1 text-xs ${value ? 'bg-mint text-ink' : 'bg-white/10 text-soft'}`}>{value ? 'вкл' : 'выкл'}</span>
    </button>
  )
}

export default function SettingsPage() {
  const settings = useSettingsStore()
  return (
    <AppShell>
      <Card>
        <h1 className="text-4xl font-semibold">Настройки</h1>
        <p className="mt-3 text-soft">Можно сделать приложение спокойнее или наоборот включить больше подсказок.</p>
        <div className="mt-6 grid gap-3">
          <Toggle label="Звуки" value={settings.sound} onChange={v => settings.set('sound', v)} />
          <Toggle label="Точная синяя траектория" value={settings.trajectory} onChange={v => settings.set('trajectory', v)} />
          <Toggle label="Идеальная зелёная линия" value={settings.ideal} onChange={v => settings.set('ideal', v)} />
          <Toggle label="Машина-призрак" value={settings.ghost} onChange={v => settings.set('ghost', v)} />
          <Toggle label="Габаритный коридор" value={settings.corridor} onChange={v => settings.set('corridor', v)} />
        </div>
      </Card>
    </AppShell>
  )
}
