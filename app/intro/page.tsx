'use client'
import { motion } from 'framer-motion'
import { Button } from '@/components/shared/Button'

const screens = [
  {
    title: 'Привет, Вика 💛',
    text: 'Я сделал для тебя кое-что особенное. Маленькое приложение, чтобы парковка стала спокойнее.'
  },
  {
    title: 'Здесь можно ошибаться',
    text: 'Без давления, без нервов и без фраз “ну что ты не понимаешь”. Только практика, траектория и спокойствие.'
  },
  {
    title: 'Парковка — это не талант',
    text: 'Это траектория, габариты и немного спокойной практики. Я хочу, чтобы тебе было увереннее за рулём.'
  }
]

export default function IntroPage() {
  return (
    <main className="parking-grid min-h-screen bg-radialsoft px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-5xl flex-col items-center justify-center gap-8 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass max-w-2xl rounded-[2rem] p-7 md:p-10">
          <div className="mx-auto mb-7 h-28 w-56 rounded-[2rem] border border-white/10 bg-white/5 p-4">
            <div className="relative h-full rounded-2xl border border-dashed border-sky/50">
              <div className="absolute left-1/2 top-1/2 h-10 w-20 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-violet shadow-glow" />
              <div className="absolute inset-x-5 bottom-3 h-1 rounded-full bg-gradient-to-r from-sky via-mint to-pink" />
            </div>
          </div>
          {screens.map((screen, index) => (
            <motion.section
              key={screen.title}
              initial={{ opacity: 0 }}
              animate={{ opacity: index === 0 ? 1 : .68 }}
              transition={{ delay: index * .15 }}
              className={index > 0 ? 'mt-7 border-t border-white/10 pt-7' : ''}
            >
              <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">{screen.title}</h1>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-soft md:text-lg">{screen.text}</p>
            </motion.section>
          ))}
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href="/login">Начать</Button>
            <Button href="/dashboard" variant="secondary">Сначала посмотреть</Button>
          </div>
          <p className="mt-5 text-xs text-soft">Только для тебя.</p>
        </motion.div>
      </div>
    </main>
  )
}
