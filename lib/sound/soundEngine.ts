'use client'

type SoundKind = 'click' | 'gear' | 'success' | 'warning' | 'soft'

function getAudioContext() {
  const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
  if (!AudioCtx) return null
  return new AudioCtx()
}

const presets: Record<SoundKind, { frequency: number; duration: number; gain: number; type?: OscillatorType }> = {
  click: { frequency: 520, duration: 0.045, gain: 0.025, type: 'sine' },
  gear: { frequency: 220, duration: 0.075, gain: 0.035, type: 'triangle' },
  success: { frequency: 720, duration: 0.16, gain: 0.04, type: 'sine' },
  warning: { frequency: 180, duration: 0.12, gain: 0.035, type: 'sawtooth' },
  soft: { frequency: 420, duration: 0.08, gain: 0.022, type: 'sine' }
}

export function playSound(kind: SoundKind) {
  if (typeof window === 'undefined') return
  try {
    const disabled = localStorage.getItem('vika-parking-sound-disabled') === 'true'
    if (disabled) return

    const ctx = getAudioContext()
    if (!ctx) return

    const preset = presets[kind]
    const oscillator = ctx.createOscillator()
    const gain = ctx.createGain()

    oscillator.type = preset.type || 'sine'
    oscillator.frequency.value = preset.frequency
    gain.gain.setValueAtTime(0.0001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(preset.gain, ctx.currentTime + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + preset.duration)

    oscillator.connect(gain)
    gain.connect(ctx.destination)
    oscillator.start()
    oscillator.stop(ctx.currentTime + preset.duration + 0.02)
  } catch {
    // sound is optional
  }
}

export function setSoundDisabled(value: boolean) {
  if (typeof window === 'undefined') return
  localStorage.setItem('vika-parking-sound-disabled', value ? 'true' : 'false')
}

export function isSoundDisabled() {
  if (typeof window === 'undefined') return false
  return localStorage.getItem('vika-parking-sound-disabled') === 'true'
}
