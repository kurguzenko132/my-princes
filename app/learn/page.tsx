import { AppShell } from '@/components/shared/AppShell'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import { lessons } from '@/lib/data/lessons'
import { BookOpen, Clock, Sparkles } from 'lucide-react'

export default function LearnPage() {
  return (
    <AppShell>
      <div className="space-y-5">
        <Card>
          <p className="text-sm text-pink">Теория без занудства</p>
          <h1 className="mt-2 text-4xl font-semibold">Понять парковку до практики</h1>
          <p className="mt-3 max-w-2xl text-soft">
            Короткие уроки объясняют, почему машина едет именно так: поворот, задний ход, габариты, параллельная парковка. После каждого урока есть упражнение.
          </p>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {lessons.map((lesson, index) => (
            <Card key={lesson.id} className="flex flex-col">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
                  <BookOpen className="text-sky" size={20} />
                </div>
                <span className="rounded-full bg-white/8 px-3 py-1 text-xs text-soft">Урок {index + 1}</span>
              </div>

              <h2 className="text-xl font-semibold">{lesson.title}</h2>
              <p className="mt-2 flex-1 text-sm leading-6 text-soft">{lesson.subtitle}</p>

              <div className="mt-5 flex flex-wrap gap-2 text-xs text-soft">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/8 px-3 py-1"><Clock size={13} /> {lesson.duration}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/8 px-3 py-1"><Sparkles size={13} /> {lesson.level}</span>
              </div>

              <div className="mt-5">
                <Button href={`/learn/${lesson.id}`} className="w-full">Открыть урок</Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppShell>
  )
}
