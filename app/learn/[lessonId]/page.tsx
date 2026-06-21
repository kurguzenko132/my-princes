import { AppShell } from '@/components/shared/AppShell'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'
import { getLesson, lessons } from '@/lib/data/lessons'
import { CheckCircle2 } from 'lucide-react'

type LessonPageProps = {
  params: Promise<{
    lessonId: string
  }>
}

export function generateStaticParams() {
  return lessons.map((lesson) => ({
    lessonId: lesson.id
  }))
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { lessonId } = await params
  const lesson = getLesson(lessonId)

  return (
    <AppShell>
      <div className="space-y-5">
        <Card>
          <p className="text-sm text-pink">Урок · {lesson.duration}</p>
          <h1 className="mt-2 text-4xl font-semibold">{lesson.title}</h1>
          <p className="mt-3 max-w-2xl text-soft">{lesson.subtitle}</p>
        </Card>

        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <div className="space-y-4">
            {lesson.blocks.map((block, index) => (
              <Card key={block.title}>
                <p className="text-sm text-sky">Шаг {index + 1}</p>
                <h2 className="mt-2 text-2xl font-semibold">{block.title}</h2>
                <p className="mt-3 leading-8 text-soft">{block.text}</p>

                {block.bullets && (
                  <ul className="mt-5 space-y-3">
                    {block.bullets.map((item) => (
                      <li key={item} className="flex gap-3 text-soft">
                        <CheckCircle2 className="mt-1 shrink-0 text-mint" size={18} />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </Card>
            ))}
          </div>

          <div className="space-y-4">
            <Card>
              <h3 className="font-semibold">Главное запомнить</h3>
              <p className="mt-3 leading-7 text-soft">{lesson.takeaway}</p>
            </Card>

            <Card>
              <h3 className="font-semibold">Закрепить на практике</h3>
              <p className="mt-3 text-sm leading-6 text-soft">После этого урока лучше сразу пройти упражнение, чтобы связать теорию с движением машины.</p>
              <div className="mt-5">
                <Button href={`/simulator/${lesson.practiceLevelId}`} className="w-full">Перейти к упражнению</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppShell>
  )
}
