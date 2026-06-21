'use client'
import { create } from 'zustand'
import { OCTAVIA_CONFIG } from '@/lib/physics/carPhysics'
import type { CarConfig, CarInput, CarState } from '@/lib/physics/types'

type SimulatorState = {
  car: CarState
  input: CarInput
  config: CarConfig
  score: number
  collisions: number
  currentHint: string
  setCar: (car: CarState) => void
  setInput: (input: Partial<CarInput>) => void
  setGear: (gear: 'D' | 'R') => void
  resetCar: (car: CarState) => void
  setHint: (hint: string) => void
  addCollision: () => void
}

const defaultCar: CarState = { x: -7, y: 0, angle: 0, speed: 0, steeringAngle: 0, gear: 'D' }

export const useSimulatorStore = create<SimulatorState>((set) => ({
  car: defaultCar,
  input: { throttle: false, brake: false, steerLeft: false, steerRight: false },
  config: OCTAVIA_CONFIG,
  score: 100,
  collisions: 0,
  currentHint: 'Не спеши. Смотри на синюю траекторию.',
  setCar: (car) => set({ car }),
  setInput: (input) => set((s) => ({ input: { ...s.input, ...input } })),
  setGear: (gear) => set((s) => ({ car: { ...s.car, gear, speed: 0 } })),
  resetCar: (car) => set({ car, score: 100, collisions: 0, currentHint: 'Начнём спокойно. Ошибаться здесь можно.' }),
  setHint: (currentHint) => set({ currentHint }),
  addCollision: () => set((s) => ({ collisions: s.collisions + 1, score: Math.max(0, s.score - 12) }))
}))
