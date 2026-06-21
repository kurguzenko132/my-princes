import { BarChart3, BookOpen, Car } from 'lucide-react'

export function TrainingStepper() {
  return (
    <div className="mx-auto flex w-full max-w-3xl items-center justify-between rounded-3xl border border-white/10 bg-[#0B0E17]/80 px-4 py-3 text-sm text-soft shadow-card backdrop-blur-xl md:px-8">
      <div className="flex items-center gap-2">
        <BookOpen size={18} />
        <span>Теория</span>
      </div>
      <span className="text-white/35">→</span>
      <div className="relative flex items-center gap-2 text-pink">
        <Car size={19} />
        <span className="font-semibold">Практика</span>
        <span className="absolute -bottom-3 left-0 h-0.5 w-full rounded-full bg-pink shadow-[0_0_16px_rgba(255,91,200,.8)]" />
      </div>
      <span className="text-white/35">→</span>
      <div className="flex items-center gap-2">
        <BarChart3 size={18} />
        <span>Разбор</span>
      </div>
    </div>
  )
}
