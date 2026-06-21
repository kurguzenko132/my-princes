'use client'

import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Button } from '@/components/shared/Button'
import { ArrowRight, Car, Heart, Sparkles } from 'lucide-react'

const introSteps = [
  {
    eyebrow: 'Только для тебя',
    title: 'Привет, Вика 💛',
    text: 'Я сделал для тебя кое-что маленькое, личное и очень полезное.',
    note: 'Пока без правил, упражнений и сложных слов. Просто начнём с приятного.',
    button: 'Дальше',
    icon: Heart
  },
  {
    eyebrow: 'Без давления',
    title: 'Здесь можно ошибаться',
    text: 'Можно задеть конус, начать заново, повторить манёвр и спокойно разобраться, почему машина поехала именно так.',
    note: 'Никто не торопит. Никто не ругает. Тут можно тренироваться спокойно.',
    button: 'Дальше',
    icon: Sparkles
  },
  {
    eyebrow: 'Главная мысль',
    title: 'Парковка — это не талант',
    text: 'Это траектория, габариты и немного практики. Если видеть, куда реально поедет машина, всё становится понятнее.',
    note: 'Я хочу, чтобы тебе было спокойнее и увереннее за рулём.',
    button: 'Показать, что внутри',
    icon: Car
  },
  {
    eyebrow: 'Vika Parking',
    title: 'Это твой личный тренажёр парковки 🚗',
    text: 'С видом сверху, Skoda Octavia по габаритам, точной синей траекторией, машиной-призраком, подсказками и реальными ситуациями.',
    note: 'Сначала поймём движение машины. Потом — парковка передом, задом, параллельная и выезд из тесных мест.',
    button: 'Начать обучение',
    icon: Car
  }
]

export default function IntroPage() {
  const [step, setStep] = useState(0)
  const current = introSteps[step]
  const Icon = current.icon
  const isLast = step === introSteps.length - 1

  const progress = useMemo(() => ((step + 1) / introSteps.length) * 100, [step])

  const next = () => {
    if (isLast) {
      window.location.href = '/login'
      return
    }
    setStep((value) => value + 1)
  }

  const back = () => {
    if (step > 0) setStep((value) => value - 1)
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-radialsoft px-4 py-5">
      <div className="pointer-events-none absolute inset-0 parking-grid opacity-70" />
      <div className="pointer-events-none absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full bg-pink/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 right-0 h-80 w-80 rounded-full bg-sky/15 blur-3xl" />

      <div className="relative mx-auto flex min-h-[calc(100vh-40px)] max-w-6xl flex-col">
        <header className="flex items-center justify-between py-3">
          <div>
            <p className="text-sm font-semibold text-white">Vika Parking</p>
            <p className="text-xs text-soft">личное приложение</p>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            {introSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => setStep(index)}
                aria-label={`Перейти к экрану ${index + 1}`}
                className={`h-2.5 rounded-full transition-all ${
                  index === step ? 'w-9 bg-pink' : 'w-2.5 bg-white/20 hover:bg-white/35'
                }`}
              />
            ))}
          </div>
        </header>

        <section className="grid flex-1 items-center gap-8 py-8 lg:grid-cols-[1.02fr_.98fr]">
          <div className="order-2 lg:order-1">
            <div className="glass relative overflow-hidden rounded-[2rem] p-6 sm:p-8 md:p-10">
              <div className="absolute inset-x-0 top-0 h-1 bg-white/10">
                <div
                  className="h-full rounded-r-full bg-gradient-to-r from-pink via-violet to-sky transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -18, filter: 'blur(8px)' }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/8 px-3 py-2 text-xs font-medium text-soft">
                    <Icon size={16} className="text-pink" />
                    {current.eyebrow}
                  </div>

                  <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
                    {current.title}
                  </h1>

                  <p className="mt-5 max-w-2xl text-lg leading-8 text-soft">
                    {current.text}
                  </p>

                  <div className="mt-7 rounded-3xl border border-white/10 bg-white/7 p-5 text-left">
                    <p className="text-sm leading-7 text-soft">{current.note}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button
                  onClick={next}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink to-violet px-7 py-3 text-sm font-semibold shadow-glow transition active:scale-[.98]"
                >
                  {current.button}
                  <ArrowRight size={18} />
                </button>

                {step > 0 && (
                  <button
                    onClick={back}
                    className="rounded-full border border-white/10 bg-white/8 px-6 py-3 text-sm font-semibold text-soft transition hover:bg-white/12 hover:text-white"
                  >
                    Назад
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="glass relative mx-auto aspect-square max-w-[520px] overflow-hidden rounded-[2.25rem] p-5 sm:p-7">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,121,176,.18),transparent_35%),radial-gradient(circle_at_70%_70%,rgba(56,189,248,.16),transparent_35%)]" />

              <div className="relative h-full rounded-[1.75rem] border border-white/10 bg-[#111827]/85 p-5">
                <div className="absolute inset-0 parking-grid opacity-60" />

                <motion.div
                  className="absolute left-[18%] top-[31%] h-[16%] w-[46%] rounded-[1.4rem] border border-white/30 bg-slate-400/80 shadow-card"
                  animate={{ x: step * 14, y: step * 6, rotate: step === 3 ? -8 : 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                />
                <motion.div
                  className="absolute right-[12%] top-[56%] h-[16%] w-[46%] rounded-[1.4rem] border border-white/30 bg-slate-500/70 shadow-card"
                  animate={{ x: step * -8, y: step * -2, rotate: step === 2 ? 5 : 0 }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                />

                <motion.div
                  className="absolute left-[20%] top-[47%] h-[15%] w-[42%] rounded-[1.2rem] border border-white/60 bg-violet shadow-glow"
                  animate={{ x: step * 22, y: step === 0 ? 0 : step * -8, rotate: step === 0 ? 0 : step === 1 ? -8 : step === 2 ? 12 : 0 }}
                  transition={{ duration: 0.7, ease: 'easeInOut' }}
                >
                  <div className="absolute right-3 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-pink" />
                  <div className="absolute left-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-sky" />
                </motion.div>

                <svg className="absolute inset-0 h-full w-full" viewBox="0 0 500 500" fill="none">
                  <motion.path
                    d="M90 305 C150 260, 170 230, 235 230 C315 230, 350 280, 420 205"
                    stroke="rgba(56,189,248,.95)"
                    strokeWidth="7"
                    strokeLinecap="round"
                    strokeDasharray="12 12"
                    initial={{ pathLength: 0, opacity: 0.2 }}
                    animate={{ pathLength: step >= 1 ? 1 : 0.45, opacity: step >= 1 ? 1 : 0.45 }}
                    transition={{ duration: 0.8 }}
                  />
                  <motion.path
                    d="M115 350 C190 315, 215 285, 270 275 C330 265, 370 245, 430 190"
                    stroke="rgba(52,211,153,.8)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="8 10"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: step >= 2 ? 1 : 0, opacity: step >= 2 ? 1 : 0 }}
                    transition={{ duration: 0.8 }}
                  />
                </svg>

                <div className="absolute bottom-5 left-5 right-5 rounded-3xl border border-white/10 bg-black/25 p-4 backdrop-blur">
                  <p className="text-xs text-soft">
                    {step === 0 && 'Сначала — просто приятное начало.'}
                    {step === 1 && 'Ошибки здесь безопасны.'}
                    {step === 2 && 'Траектория показывает, куда машина реально поедет.'}
                    {step === 3 && 'А дальше — полноценная практика парковки.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <footer className="pb-3 text-center text-xs text-soft">
          Сделано специально для Вики.
        </footer>
      </div>
    </main>
  )
}
