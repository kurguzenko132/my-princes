import Link from 'next/link'

const categories = [
  { id: 'basic', name: 'Габариты Octavia' },
  { id: 'shop', name: 'Парковка у магазина' },
  { id: 'yard', name: 'Парковка во дворе' },
  { id: 'parallel', name: 'Параллельная парковка' }
]

export default function Practice() {
  return (
    <div className="min-h-screen p-6 flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Практика парковки</h1>
      <p className="text-gray-300 max-w-xl">
        Реальные ситуации, которые встречаются у магазина, во дворе, у бордюра и на тесной парковке.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl">
        {categories.map(c => (
          <Link
            key={c.id}
            href={`/simulator/${c.id}`}
            className="bg-gray-800/60 backdrop-blur rounded-lg p-4 hover:opacity-90 transition"
          >
            <h3 className="text-lg font-medium mb-1">{c.name}</h3>
            <p className="text-sm text-gray-400">Попробовать →</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
