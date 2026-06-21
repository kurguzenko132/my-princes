'use client'
import { AppShell } from '@/components/shared/AppShell'
import { Card } from '@/components/shared/Card'
import { useSettingsStore } from '@/store/settingsStore'
import { SettingsActions } from '@/components/settings/SettingsActions'
import { setSoundDisabled } from '@/lib/sound/soundEngine'

function Toggle({ label, description, value, onChange }: { label: string; description: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button onClick={() => onChange(!value)} className="flex w-full items-center justify-between gap-4 rounded-2xl bg-white/8 px-4 py-3 text-left">
      <span>
        <span className="block font-medium">{label}</span>
        <span className="mt-1 block text-xs text-soft">{description}</span>
      </span>
      <span className={`shrink-0 rounded-full px-3 py-1 text-xs ${value ? 'bg-mint text-ink' : 'bg-white/10 text-soft'}`}>{value ? 'вкл' : 'выкл'}</span>
    </button>
  )
}

export default function SettingsPage() {
  const settings = useSettingsStore()
  return (
    <AppShell>
      <Card>
        <h1 className="text-4xl font-semibold">Настройки</h1>
        <p className="mt-3 text-soft">Можно сделать тренажёр спокойнее: оставить подсказки, включить/выключить траектории и убрать лишний визуальный шум.</p>
        <div className="mt-6 grid gap-3">
          <Toggle
            label="Звуки"
            description="Мягкие звуки кнопок, передачи, предупреждения и успеха."
            value={settings.sound}
            onChange={v => {
              settings.set('sound', v)
              setSoundDisabled(!v)
            }}
          />
          <Toggle label="Точная синяя траектория" description="Показывает путь, куда машина реально поедет." value={settings.trajectory} onChange={v => settings.set('trajectory', v)} />
          <Toggle label="Идеальная зелёная линия" description="Учебная траектория для сравнения." value={settings.ideal} onChange={v => settings.set('ideal', v)} />
          <Toggle label="Машина-призрак" description="Показывает будущие положения машины." value={settings.ghost} onChange={v => settings.set('ghost', v)} />
          <Toggle label="Габаритный коридор" description="Показывает место, которое займёт весь корпус." value={settings.corridor} onChange={v => settings.set('corridor', v)} />
        </div>
      <SettingsActions />
      </Card>
    </AppShell>
  )
}
