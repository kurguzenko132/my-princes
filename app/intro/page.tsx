import Link from 'next/link'

export default function Intro() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6 text-center px-4">
      <h1 className="text-4xl font-semibold">Привет, Вика 💛</h1>
      <p className="max-w-md text-lg text-gray-300">
        Я сделал для тебя кое-что особенное. Здесь можно спокойно ошибаться и учиться парковаться без давления.
      </p>
      <Link
        className="rounded-full bg-accent-pink px-8 py-3 text-lg font-medium shadow-lg hover:opacity-90 transition"
        href="/login"
      >
        Дальше
      </Link>
    </div>
  )
}
