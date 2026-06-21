'use client'

import { useEffect, useRef, useState } from 'react'
import { updateCarPhysics, predictTrajectory } from '@/lib/physics/carPhysics'
import { getCarCorners, getRectCorners } from '@/lib/physics/geometry'
import { detectCollision, getSoftHint, isParked } from '@/lib/simulator/scoring'
import { useSettingsStore } from '@/store/settingsStore'
import { useSimulatorStore } from '@/store/simulatorStore'
import type { ParkingLevel } from '@/lib/data/levels'
import type { CarInput, Point } from '@/lib/physics/types'

const SCALE = 38

function worldToScreen(p: Point, w: number, h: number) {
  return { x: w / 2 + p.x * SCALE, y: h / 2 - p.y * SCALE }
}

function drawPoly(ctx: CanvasRenderingContext2D, points: Point[], w: number, h: number, fill: string, stroke?: string) {
  ctx.beginPath()
  points.forEach((p, i) => {
    const s = worldToScreen(p, w, h)
    if (i === 0) ctx.moveTo(s.x, s.y)
    else ctx.lineTo(s.x, s.y)
  })
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
  if (stroke) {
    ctx.strokeStyle = stroke
    ctx.lineWidth = 1.5
    ctx.stroke()
  }
}

function drawPath(ctx: CanvasRenderingContext2D, pts: Point[], w: number, h: number, color: string, width = 3, dash?: number[]) {
  if (pts.length < 2) return
  ctx.save()
  ctx.setLineDash(dash ?? [])
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.beginPath()
  pts.forEach((p, i) => {
    const s = worldToScreen(p, w, h)
    if (i === 0) ctx.moveTo(s.x, s.y)
    else ctx.lineTo(s.x, s.y)
  })
  ctx.stroke()
  ctx.restore()
}

export function SimulatorCanvas({ level }: { level: ParkingLevel }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [finished, setFinished] = useState(false)
  const { setCar, setInput, resetCar, setHint, addCollision } = useSimulatorStore()
  const settings = useSettingsStore()

  useEffect(() => {
    resetCar(level.start)
    setFinished(false)
  }, [level.id, resetCar, level.start])

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') setInput({ throttle: true })
      if (e.code === 'KeyS' || e.code === 'ArrowDown') setInput({ brake: true })
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') setInput({ steerLeft: true })
      if (e.code === 'KeyD' || e.code === 'ArrowRight') setInput({ steerRight: true })
      if (e.code === 'KeyR') resetCar(level.start)
      if (e.code === 'KeyQ') useSimulatorStore.getState().setGear('R')
      if (e.code === 'KeyE') useSimulatorStore.getState().setGear('D')
    }
    const up = (e: KeyboardEvent) => {
      if (e.code === 'KeyW' || e.code === 'ArrowUp') setInput({ throttle: false })
      if (e.code === 'KeyS' || e.code === 'ArrowDown') setInput({ brake: false })
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') setInput({ steerLeft: false })
      if (e.code === 'KeyD' || e.code === 'ArrowRight') setInput({ steerRight: false })
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [setInput, resetCar, level.start])

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    let collisionCooldown = 0

    const tick = (now: number) => {
      const dtRaw = Math.min(0.033, (now - last) / 1000)
      last = now
      const state = useSimulatorStore.getState()
      const dt = state.comfortMode ? dtRaw * 0.72 : dtRaw

      if (!finished) {
        const next = updateCarPhysics(state.car, state.input, state.config, dt)
        const hit = detectCollision(next, state.config, level.obstacles)

        if (hit && collisionCooldown <= 0) {
          addCollision()
          collisionCooldown = 0.8
          setHint(hit.type === 'curb'
            ? 'Бордюр близко. Ничего страшного — теперь видно, где траектория слишком близкая.'
            : 'Касание. Посмотри на габаритный коридор: корпус машины не проходил безопасно.'
          )
        } else {
          setHint(getSoftHint(next, level.target))
        }

        collisionCooldown -= dt
        setCar(hit ? { ...next, speed: 0 } : next)

        if (isParked(next, state.config, level.target)) {
          setFinished(true)
          setHint('Красиво получилось. Машина встала в зоне.')
        }
      }

      draw()
      raf = requestAnimationFrame(tick)
    }

    const draw = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const parent = canvas.parentElement
      const dpr = window.devicePixelRatio || 1
      const cssW = parent?.clientWidth || 900
      const cssH = parent?.clientHeight || 620

      if (canvas.width !== cssW * dpr || canvas.height !== cssH * dpr) {
        canvas.width = cssW * dpr
        canvas.height = cssH * dpr
        canvas.style.width = `${cssW}px`
        canvas.style.height = `${cssH}px`
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const w = cssW
      const h = cssH

      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = '#111827'
      ctx.fillRect(0, 0, w, h)

      ctx.strokeStyle = 'rgba(255,255,255,.055)'
      ctx.lineWidth = 1
      for (let x = (w/2) % 38; x < w; x += 38) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke()
      }
      for (let y = (h/2) % 38; y < h; y += 38) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke()
      }

      drawPoly(ctx, getRectCorners(level.target), w, h, 'rgba(52, 211, 153, .14)', 'rgba(52, 211, 153, .95)')

      if (settings.ideal) drawPath(ctx, level.ideal, w, h, 'rgba(52, 211, 153, .92)', 4, [10, 10])

      const state = useSimulatorStore.getState()
      const predicted = predictTrajectory(state.car, state.input, state.config, 2.8, 34)

      if (settings.corridor && predicted.length > 3) {
        ctx.save()
        ctx.globalAlpha = .08
        for (let i = 0; i < predicted.length; i += 8) {
          const shadowCar = { ...state.car, x: predicted[i].x, y: predicted[i].y, angle: predicted[i].angle }
          drawPoly(ctx, getCarCorners(shadowCar, state.config), w, h, '#38BDF8')
        }
        ctx.restore()
      }

      if (settings.trajectory) drawPath(ctx, predicted, w, h, 'rgba(56, 189, 248, .96)', 4)

      if (settings.ghost) {
        ctx.save()
        ctx.globalAlpha = .22
        for (let i = 12; i < predicted.length; i += 28) {
          const ghost = { ...state.car, x: predicted[i].x, y: predicted[i].y, angle: predicted[i].angle }
          drawPoly(ctx, getCarCorners(ghost, state.config), w, h, 'rgba(56, 189, 248, .55)', 'rgba(56, 189, 248, .85)')
        }
        ctx.restore()
      }

      for (const obs of level.obstacles) {
        const color = obs.type === 'car' ? 'rgba(148, 163, 184, .92)' : obs.type === 'curb' ? 'rgba(251, 191, 36, .82)' : obs.type === 'trash' ? 'rgba(168,85,247,.75)' : 'rgba(251, 113, 133, .9)'
        drawPoly(ctx, getRectCorners(obs), w, h, color, 'rgba(255,255,255,.34)')
      }

      const carPoly = getCarCorners(state.car, state.config)
      drawPoly(ctx, carPoly, w, h, 'rgba(139, 92, 246, .96)', 'rgba(255,255,255,.8)')

      const front = worldToScreen({ x: state.car.x + Math.cos(state.car.angle) * 2.15, y: state.car.y + Math.sin(state.car.angle) * 2.15 }, w, h)
      ctx.fillStyle = '#FF79B0'
      ctx.beginPath()
      ctx.arc(front.x, front.y, 5, 0, Math.PI * 2)
      ctx.fill()

      // steering indicator
      ctx.fillStyle = 'rgba(255,255,255,.75)'
      ctx.font = '12px system-ui'
      ctx.textAlign = 'left'
      ctx.fillText(`Руль: ${(state.car.steeringAngle * 180 / Math.PI).toFixed(0)}°`, 16, 24)
      ctx.fillText(`Скорость: ${Math.abs(state.car.speed).toFixed(1)} м/с`, 16, 44)
      ctx.fillText(`Передача: ${state.car.gear}`, 16, 64)

      if (finished) {
        ctx.fillStyle = 'rgba(0,0,0,.45)'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#fff'
        ctx.font = '700 30px system-ui'
        ctx.textAlign = 'center'
        ctx.fillText('Вика, получилось красиво 💛', w / 2, h / 2 - 12)
        ctx.font = '16px system-ui'
        ctx.fillStyle = '#B8C0D9'
        ctx.fillText('Машина встала в зоне. Можно повторить или выбрать другой уровень.', w / 2, h / 2 + 22)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [level, setCar, setHint, addCollision, finished, settings])

  return <canvas ref={canvasRef} className="block h-full w-full rounded-3xl" />
}

function HoldButton({ children, onHold, onRelease, className = '' }: {
  children: React.ReactNode
  onHold: () => void
  onRelease: () => void
  className?: string
}) {
  return (
    <button
      onPointerDown={onHold}
      onPointerUp={onRelease}
      onPointerCancel={onRelease}
      onPointerLeave={onRelease}
      className={`select-none rounded-3xl border border-white/10 bg-white/10 px-4 py-5 text-sm font-semibold text-white shadow-card active:scale-[.98] ${className}`}
    >
      {children}
    </button>
  )
}

export function TouchControls() {
  const { setInput, car, setGear, resetCar, comfortMode, setComfortMode } = useSimulatorStore()
  const press = (key: keyof CarInput, value: boolean) => () => setInput({ [key]: value } as Partial<CarInput>)

  return (
    <div className="space-y-3 md:hidden">
      <div className="grid grid-cols-[1fr_1fr_1fr] gap-3">
        <HoldButton onHold={press('steerLeft', true)} onRelease={press('steerLeft', false)} className="text-2xl">←</HoldButton>
        <button onClick={() => setGear(car.gear === 'D' ? 'R' : 'D')} className="rounded-3xl border border-white/10 bg-violet/80 px-4 py-5 text-lg font-bold shadow-card active:scale-[.98]">
          {car.gear}
        </button>
        <HoldButton onHold={press('steerRight', true)} onRelease={press('steerRight', false)} className="text-2xl">→</HoldButton>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <HoldButton onHold={press('brake', true)} onRelease={press('brake', false)} className="bg-danger/65">Тормоз</HoldButton>
        <HoldButton onHold={press('throttle', true)} onRelease={press('throttle', false)} className="bg-mint/65 text-ink">Газ</HoldButton>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={() => setComfortMode(!comfortMode)} className="rounded-3xl border border-white/10 bg-white/10 px-4 py-4 text-sm text-soft">
          {comfortMode ? 'Спокойный режим: вкл' : 'Спокойный режим: выкл'}
        </button>
        <button onClick={() => resetCar({ x: -7, y: 0, angle: 0, speed: 0, steeringAngle: 0, gear: 'D' })} className="rounded-3xl border border-white/10 bg-white/10 px-4 py-4 text-sm text-soft">
          Сброс
        </button>
      </div>
    </div>
  )
}
