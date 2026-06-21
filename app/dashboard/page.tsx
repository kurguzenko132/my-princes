import Link from 'next/link'

export default function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-semibold">Вика, рада видеть тебя снова 🚗</h1>
        <p className="text-gray-300 max-w-lg mt-2">
          Сегодня можно просто 5 минут спокойно потренироваться. Без спешки. Без давления. Только практика.
        </p>
      </div>

      <div className="flex gap-4">
        <Link href="/practice" className="bg-accent-blue px-6 py-3 rounded-full shadow hover:opacity-90">
          Продолжить обучение
        </Link>
        <Link href="/practice" className="bg-gray-700 px-6 py-3 rounded-full shadow hover:opacity-75">
          Свободная практика
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
        <div className="bg-gray-800/60 backdrop-blur rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2">Цель сегодня</h3>
          <p>Парковка задом между линиями</p>
        </div>
        <div className="bg-gray-800/60 backdrop-blur rounded-lg p-4">
          <h3 className="text-lg font-medium mb-2">Прогресс</h3>
          <p>12% завершено</p>
        </div>
      </div>

      <div className="max-w-lg bg-gray-800/60 backdrop-blur rounded-lg p-4">
        <h3 className="text-lg font-medium mb-2">Сообщение от Дани 💛</h3>
        <p className="text-gray-300">Я сделал это не для того, чтобы ты идеально парковалась с первого раза. А чтобы тебе было спокойнее.</p>
      </div>
    </div>
  )
}
