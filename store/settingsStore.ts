'use client'
import { create } from 'zustand'

type SettingsState = {
  sound: boolean
  trajectory: boolean
  ideal: boolean
  ghost: boolean
  corridor: boolean
  set: (key: keyof Omit<SettingsState, 'set'>, value: boolean) => void
}

export const useSettingsStore = create<SettingsState>((set) => ({
  sound: true,
  trajectory: true,
  ideal: true,
  ghost: true,
  corridor: true,
  set: (key, value) => set({ [key]: value } as any)
}))
