import SimulatorCanvas from '@/components/simulator/SimulatorCanvas'

export default function Simulator({ params }: { params: { levelId: string } }) {
  return (
    <div className="min-h-screen p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">Симулятор — {params.levelId}</h1>
      <div className="flex-1 border border-gray-700 rounded-lg overflow-hidden">
        <SimulatorCanvas />
      </div>
    </div>
  )
}
