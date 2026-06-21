import { create } from 'zustand'
import { CarState, CarConfig } from '@/lib/physics/carPhysics'

interface SimulatorStore {
  car: CarState
  config: CarConfig
  setCar: (c: CarState) => void
  reset: () => void
}

const defaultConfig: CarConfig = {
  length: 4.698,
  width: 1.829,
  wheelBase: 2.686,
  maxSteeringAngle: Math.PI / 6,
  maxForwardSpeed: 3,
  maxReverseSpeed: 2,
  acceleration: 1.6,
  brakePower: 3
}

const defaultCar: CarState = {
  x: 0,
  y: 0,
  angle: 0,
  speed: 0,
  steeringAngle: 0,
  gear: 'D'
}

export const useSimulatorStore = create<SimulatorStore>((set) => ({
  car: defaultCar,
  config: defaultConfig,
  setCar: (car) => set({ car }),
  reset: () => set({ car: defaultCar })
}))
