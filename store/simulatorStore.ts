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
  maneuvers: number
  maxSpeed: number
  startedAt: number
  currentHint: string
  comfortMode: boolean
  setCar: (car: CarState) => void
  setInput: (input: Partial<CarInput>) => void
  setGear: (gear: 'D' | 'R') => void
  setVirtualSteering: (value: number | null) => void
  resetCar: (car: CarState) => void
  setHint: (hint: string) => void
  addCollision: () => void
  addManeuver: () => void
  setComfortMode: (value: boolean) => void
}

const defaultCar: CarState = { x: -7, y: 0, angle: 0, speed: 0, steeringAngle: 0, gear: 'D' }

export const useSimulatorStore = create<SimulatorState>((set) => ({
  car: defaultCar,
  input: { throttle: false, brake: false, steerLeft: false, steerRight: false, virtualSteering: null },
  config: OCTAVIA_CONFIG,
  score: 100,
  collisions: 0,
  maneuvers: 0,
  maxSpeed: 0,
  startedAt: Date.now(),
  currentHint: 'Не спеши. Смотри на синюю траекторию.',
  comfortMode: true,
  setCar: (car) => set((s) => ({ car, maxSpeed: Math.max(s.maxSpeed, Math.abs(car.speed)) })),
  setInput: (input) => set((s) => ({ input: { ...s.input, ...input } })),
  setGear: (gear) => set((s) => ({ car: { ...s.car, gear, speed: 0 }, maneuvers: s.maneuvers + 1 })),
  setVirtualSteering: (value) => set((s) => ({ input: { ...s.input, virtualSteering: value } })),
  resetCar: (car) => set({
    car,
    score: 100,
    collisions: 0,
    maneuvers: 0,
    maxSpeed: 0,
    startedAt: Date.now(),
    currentHint: 'Начнём спокойно. Ошибаться здесь можно.'
  }),
  setHint: (currentHint) => set({ currentHint }),
  addCollision: () => set((s) => ({ collisions: s.collisions + 1, score: Math.max(0, s.score - 12) })),
  addManeuver: () => set((s) => ({ maneuvers: s.maneuvers + 1 })),
  setComfortMode: (comfortMode) => set({ comfortMode })
}))
