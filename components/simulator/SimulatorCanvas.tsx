'use client'

import { useEffect, useRef, useState } from 'react'
import { updateCarPhysics, predictTrajectory } from '@/lib/physics/carPhysics'
import { getCarCorners, getRectCorners } from '@/lib/physics/geometry'
import { detectCollision, getSoftHint, isParked } from '@/lib/simulator/scoring'
import { buildAttemptResult } from '@/lib/simulator/result'
import { saveAttempt } from '@/lib/progress/storage'
import { sceneTheme, getSceneLabel } from '@/lib/simulator/visualTheme'
import { playSound } from '@/lib/sound/soundEngine'
import { useSettingsStore } from '@/store/settingsStore'
import { useSimulatorStore } from '@/store/simulatorStore'
import type { ParkingLevel } from '@/lib/data/levels'
import type { CarConfig, CarInput, CarState, Point, RectObstacle, TargetZone } from '@/lib/physics/types'

const SCALE = 40
let activeCamera: Point = { x: 0, y: 0 }

function worldToScreen(p: Point, w: number, h: number) {
  return { x: w / 2 + (p.x - activeCamera.x) * SCALE, y: h / 2 - (p.y - activeCamera.y) * SCALE }
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

function drawPoly(ctx: CanvasRenderingContext2D, points: Point[], w: number, h: number, fill: string, stroke?: string, lineWidth = 1.5) {
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
    ctx.lineWidth = lineWidth
    ctx.stroke()
  }
}

function drawWorldRoundedRect(
  ctx: CanvasRenderingContext2D,
  center: Point,
  widthM: number,
  heightM: number,
  angle: number,
  canvasW: number,
  canvasH: number,
  fill: string,
  stroke?: string,
  radiusPx = 12
) {
  const s = worldToScreen(center, canvasW, canvasH)
  ctx.save()
  ctx.translate(s.x, s.y)
  ctx.rotate(-angle)
  ctx.fillStyle = fill
  if (stroke) {
    ctx.strokeStyle = stroke
    ctx.lineWidth = 1.4
  }
  const w = widthM * SCALE
  const h = heightM * SCALE
  const x = -w / 2
  const y = -h / 2
  roundRect(ctx, x, y, w, h, radiusPx)
  ctx.fill()
  if (stroke) ctx.stroke()
  ctx.restore()
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

function drawAsphalt(ctx: CanvasRenderingContext2D, w: number, h: number, level: ParkingLevel) {
  const gradient = ctx.createLinearGradient(0, 0, w, h)
  gradient.addColorStop(0, sceneTheme.asphalt)
  gradient.addColorStop(1, sceneTheme.asphalt2)
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, w, h)

  ctx.strokeStyle = sceneTheme.grid
  ctx.lineWidth = 1
  for (let x = (w / 2) % 38; x < w; x += 38) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, h)
    ctx.stroke()
  }
  for (let y = (h / 2) % 38; y < h; y += 38) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(w, y)
    ctx.stroke()
  }

  // Scene label
  ctx.save()
  ctx.fillStyle = 'rgba(255,255,255,.06)'
  roundRect(ctx, 18, 18, 190, 34, 16)
  ctx.fill()
  ctx.fillStyle = 'rgba(184,192,217,.88)'
  ctx.font = '600 13px system-ui'
  ctx.textAlign = 'left'
  ctx.fillText(getSceneLabel(level), 34, 40)
  ctx.restore()
}

function drawParkingSlot(ctx: CanvasRenderingContext2D, target: TargetZone, w: number, h: number) {
  const c = worldToScreen({ x: target.x, y: target.y }, w, h)
  ctx.save()
  ctx.translate(c.x, c.y)
  ctx.rotate(-(target.angle ?? 0))

  const slotW = target.width * SCALE
  const slotH = target.height * SCALE

  ctx.fillStyle = 'rgba(52,211,153,.10)'
  ctx.strokeStyle = 'rgba(52,211,153,.95)'
  ctx.lineWidth = 2
  roundRect(ctx, -slotW / 2, -slotH / 2, slotW, slotH, 12)
  ctx.fill()
  ctx.stroke()

  ctx.strokeStyle = 'rgba(255,255,255,.52)'
  ctx.lineWidth = 2
  ctx.setLineDash([18, 12])
  ctx.beginPath()
  ctx.moveTo(-slotW / 2, -slotH / 2)
  ctx.lineTo(-slotW / 2, slotH / 2)
  ctx.moveTo(slotW / 2, -slotH / 2)
  ctx.lineTo(slotW / 2, slotH / 2)
  ctx.stroke()
  ctx.setLineDash([])

  ctx.fillStyle = 'rgba(52,211,153,.95)'
  ctx.font = '700 11px system-ui'
  ctx.textAlign = 'center'
  ctx.fillText('ЦЕЛЬ', 0, -slotH / 2 - 8)
  ctx.restore()
}

function drawSceneDecor(ctx: CanvasRenderingContext2D, w: number, h: number, level: ParkingLevel) {
  ctx.save()
  if (level.category === 'shop') {
    // row of parking markings
    for (let i = -3; i <= 3; i++) {
      const x = i * 3.15
      drawWorldRoundedRect(ctx, { x, y: 2.35 }, 2.7, 5.4, Math.PI / 2, w, h, 'rgba(255,255,255,.015)', 'rgba(255,255,255,.22)', 8)
    }
    drawPath(ctx, [{ x: -8, y: -1.2 }, { x: 8, y: -1.2 }], w, h, 'rgba(255,255,255,.22)', 2, [14, 16])
  }

  if (level.category === 'parallel' || level.category === 'hard') {
    drawWorldRoundedRect(ctx, { x: 0, y: 3.45 }, 15, .35, 0, w, h, 'rgba(251,191,36,.78)', 'rgba(255,255,255,.25)', 3)
    drawPath(ctx, [{ x: -8, y: -.2 }, { x: 8, y: -.2 }], w, h, 'rgba(255,255,255,.16)', 2, [20, 24])
  }

  if (level.category === 'yard') {
    drawWorldRoundedRect(ctx, { x: -6.8, y: 2.6 }, 1.5, 1.5, .2, w, h, 'rgba(34,197,94,.12)', 'rgba(34,197,94,.25)', 12)
    drawWorldRoundedRect(ctx, { x: 6.8, y: -2.6 }, 1.5, 1.5, -.2, w, h, 'rgba(34,197,94,.12)', 'rgba(34,197,94,.25)', 12)
    drawPath(ctx, [{ x: -8, y: -3.15 }, { x: 8, y: -3.15 }], w, h, 'rgba(251,191,36,.6)', 4)
  }

  if (level.category === 'basic') {
    drawPath(ctx, [{ x: -8, y: 1.45 }, { x: 8, y: 1.45 }], w, h, 'rgba(255,255,255,.24)', 2, [12, 12])
    drawPath(ctx, [{ x: -8, y: -1.45 }, { x: 8, y: -1.45 }], w, h, 'rgba(255,255,255,.24)', 2, [12, 12])
  }
  ctx.restore()
}

function drawParkedCar(ctx: CanvasRenderingContext2D, obs: RectObstacle, w: number, h: number) {
  const angle = obs.angle ?? 0
  const c = worldToScreen({ x: obs.x, y: obs.y }, w, h)
  ctx.save()
  ctx.translate(c.x, c.y)
  ctx.rotate(-angle)

  const bodyW = obs.width * SCALE
  const bodyH = obs.height * SCALE

  ctx.shadowColor = 'rgba(0,0,0,.36)'
  ctx.shadowBlur = 20
  ctx.shadowOffsetY = 8

  ctx.fillStyle = 'rgba(148,163,184,.92)'
  roundRect(ctx, -bodyW / 2, -bodyH / 2, bodyW, bodyH, 16)
  ctx.fill()

  ctx.shadowColor = 'transparent'
  ctx.fillStyle = 'rgba(15,23,42,.78)'
  roundRect(ctx, -bodyW * .18, -bodyH * .34, bodyW * .36, bodyH * .68, 9)
  ctx.fill()

  ctx.fillStyle = 'rgba(255,255,255,.18)'
  roundRect(ctx, bodyW * .12, -bodyH * .26, bodyW * .20, bodyH * .52, 7)
  ctx.fill()

  ctx.fillStyle = 'rgba(255,121,176,.55)'
  ctx.fillRect(bodyW / 2 - 5, -bodyH * .30, 3, bodyH * .18)
  ctx.fillRect(bodyW / 2 - 5, bodyH * .12, 3, bodyH * .18)

  ctx.fillStyle = 'rgba(56,189,248,.55)'
  ctx.fillRect(-bodyW / 2 + 2, -bodyH * .30, 3, bodyH * .18)
  ctx.fillRect(-bodyW / 2 + 2, bodyH * .12, 3, bodyH * .18)

  ctx.restore()
}

function drawCone(ctx: CanvasRenderingContext2D, obs: RectObstacle, w: number, h: number) {
  const c = worldToScreen({ x: obs.x, y: obs.y }, w, h)
  ctx.save()
  ctx.translate(c.x, c.y)
  ctx.fillStyle = 'rgba(251,113,133,.95)'
  ctx.beginPath()
  ctx.moveTo(0, -10)
  ctx.lineTo(10, 10)
  ctx.lineTo(-10, 10)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = 'rgba(255,255,255,.65)'
  ctx.fillRect(-6, 2, 12, 3)
  ctx.restore()
}

function drawTrash(ctx: CanvasRenderingContext2D, obs: RectObstacle, w: number, h: number) {
  drawWorldRoundedRect(ctx, { x: obs.x, y: obs.y }, obs.width, obs.height, obs.angle ?? 0, w, h, 'rgba(168,85,247,.75)', 'rgba(255,255,255,.25)', 8)
}

function drawObstacle(ctx: CanvasRenderingContext2D, obs: RectObstacle, w: number, h: number) {
  if (obs.type === 'car') return drawParkedCar(ctx, obs, w, h)
  if (obs.type === 'cone') return drawCone(ctx, obs, w, h)
  if (obs.type === 'trash') return drawTrash(ctx, obs, w, h)
  const fill = obs.type === 'curb' ? 'rgba(251,191,36,.82)' : 'rgba(251,113,133,.85)'
  drawWorldRoundedRect(ctx, { x: obs.x, y: obs.y }, obs.width, obs.height, obs.angle ?? 0, w, h, fill, 'rgba(255,255,255,.25)', 4)
}

function drawOctavia(ctx: CanvasRenderingContext2D, car: CarState, cfg: CarConfig, w: number, h: number, alpha = 1) {
  const c = worldToScreen({ x: car.x, y: car.y }, w, h)
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.translate(c.x, c.y)
  ctx.rotate(-car.angle)

  const bodyW = cfg.length * SCALE
  const bodyH = cfg.width * SCALE

  ctx.shadowColor = 'rgba(0,0,0,.45)'
  ctx.shadowBlur = 22
  ctx.shadowOffsetY = 10

  const bodyGradient = ctx.createLinearGradient(-bodyW / 2, 0, bodyW / 2, 0)
  bodyGradient.addColorStop(0, 'rgba(91,33,182,.96)')
  bodyGradient.addColorStop(.55, 'rgba(139,92,246,.98)')
  bodyGradient.addColorStop(1, 'rgba(168,85,247,.96)')

  ctx.fillStyle = bodyGradient
  roundRect(ctx, -bodyW / 2, -bodyH / 2, bodyW, bodyH, 18)
  ctx.fill()

  ctx.shadowColor = 'transparent'

  // cabin and glass
  ctx.fillStyle = 'rgba(15,23,42,.88)'
  roundRect(ctx, -bodyW * .20, -bodyH * .35, bodyW * .42, bodyH * .70, 10)
  ctx.fill()

  ctx.fillStyle = 'rgba(56,189,248,.18)'
  roundRect(ctx, -bodyW * .14, -bodyH * .28, bodyW * .16, bodyH * .56, 7)
  ctx.fill()
  roundRect(ctx, bodyW * .04, -bodyH * .28, bodyW * .14, bodyH * .56, 7)
  ctx.fill()

  // hood/trunk highlights
  ctx.strokeStyle = 'rgba(255,255,255,.20)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(-bodyW * .34, -bodyH * .36)
  ctx.lineTo(-bodyW * .34, bodyH * .36)
  ctx.moveTo(bodyW * .36, -bodyH * .36)
  ctx.lineTo(bodyW * .36, bodyH * .36)
  ctx.stroke()

  // lights: front on right, rear on left
  ctx.fillStyle = 'rgba(56,189,248,.85)'
  ctx.fillRect(bodyW / 2 - 7, -bodyH * .30, 4, bodyH * .20)
  ctx.fillRect(bodyW / 2 - 7, bodyH * .10, 4, bodyH * .20)

  ctx.fillStyle = car.gear === 'R' ? 'rgba(255,255,255,.90)' : 'rgba(255,121,176,.85)'
  ctx.fillRect(-bodyW / 2 + 3, -bodyH * .30, 4, bodyH * .20)
  ctx.fillRect(-bodyW / 2 + 3, bodyH * .10, 4, bodyH * .20)

  // wheels
  ctx.fillStyle = 'rgba(2,6,23,.95)'
  const wheelW = 8
  const wheelH = bodyH * .24
  const wheelPositions = [
    { x: -bodyW * .28, y: -bodyH * .52 },
    { x: -bodyW * .28, y: bodyH * .52 },
    { x: bodyW * .28, y: -bodyH * .52, steering: true },
    { x: bodyW * .28, y: bodyH * .52, steering: true }
  ]

  for (const wheel of wheelPositions) {
    ctx.save()
    ctx.translate(wheel.x, wheel.y)
    if (wheel.steering) ctx.rotate(-car.steeringAngle)
    roundRect(ctx, -wheelW / 2, -wheelH / 2, wheelW, wheelH, 4)
    ctx.fill()
    ctx.restore()
  }

  // front dot
  ctx.fillStyle = 'rgba(255,255,255,.92)'
  ctx.beginPath()
  ctx.arc(bodyW / 2 - 16, 0, 4, 0, Math.PI * 2)
  ctx.fill()

  ctx.restore()
}


function drawInstructorCheckpoints(ctx: CanvasRenderingContext2D, level: ParkingLevel, w: number, h: number) {
  if (!level.ideal || level.ideal.length === 0) return

  ctx.save()
  level.ideal.forEach((point, index) => {
    if (index === 0) return
    const p = worldToScreen(point, w, h)
    ctx.fillStyle = 'rgba(255, 91, 200, .16)'
    ctx.beginPath()
    ctx.arc(p.x, p.y, 15, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = 'rgba(255, 91, 200, .65)'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(p.x, p.y, 15, 0, Math.PI * 2)
    ctx.stroke()

    ctx.fillStyle = '#FF5BC8'
    ctx.font = '700 11px system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(index), p.x, p.y)
  })
  ctx.restore()
}

function drawTrajectoryRisk(ctx: CanvasRenderingContext2D, level: ParkingLevel, predicted: { x: number; y: number; angle: number }[], cfg: CarConfig, w: number, h: number) {
  // lightweight visual risk: mark future ghost positions that intersect obstacles
  for (let i = 0; i < predicted.length; i += 10) {
    const ghostCar = { x: predicted[i].x, y: predicted[i].y, angle: predicted[i].angle, speed: 0, steeringAngle: 0, gear: 'D' as const }
    const hit = detectCollision(ghostCar, cfg, level.obstacles)
    if (hit) {
      const p = worldToScreen(predicted[i], w, h)
      ctx.save()
      ctx.fillStyle = 'rgba(251,113,133,.90)'
      ctx.beginPath()
      ctx.arc(p.x, p.y, 9, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()
      return
    }
  }
}

export function SimulatorCanvas({ level }: { level: ParkingLevel }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [finished, setFinished] = useState(false)
  const savedRef = useRef(false)
  const cameraRef = useRef<Point>({ x: level.start.x, y: level.start.y })
  const { setCar, setInput, resetCar, setHint, addCollision } = useSimulatorStore()
  const settings = useSettingsStore()

  useEffect(() => {
    resetCar(level.start)
    setFinished(false)
    savedRef.current = false
    cameraRef.current = { x: level.start.x, y: level.start.y }
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
          playSound('warning')
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

        if (isParked(next, state.config, level.target) && !savedRef.current) {
          savedRef.current = true
          const result = buildAttemptResult({
            level,
            car: next,
            config: state.config,
            collisions: state.collisions,
            maneuvers: state.maneuvers,
            startedAt: state.startedAt,
            maxSpeed: state.maxSpeed,
            completed: true
          })
          saveAttempt(result)
          playSound('success')
          setFinished(true)
          setHint('Красиво получилось. Машина встала в зоне.')
          setTimeout(() => {
            window.location.href = `/results/${result.id}`
          }, 900)
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

      const stateForCamera = useSimulatorStore.getState()
      cameraRef.current = {
        x: cameraRef.current.x + (stateForCamera.car.x - cameraRef.current.x) * 0.055,
        y: cameraRef.current.y + (stateForCamera.car.y - cameraRef.current.y) * 0.055
      }
      activeCamera = cameraRef.current

      drawAsphalt(ctx, w, h, level)
      drawSceneDecor(ctx, w, h, level)
      drawParkingSlot(ctx, level.target, w, h)

      if (settings.ideal) {
        drawPath(ctx, level.ideal, w, h, 'rgba(52,211,153,.92)', 4, [10, 10])
        drawInstructorCheckpoints(ctx, level, w, h)
      }

      const state = useSimulatorStore.getState()
      const predicted = predictTrajectory(state.car, state.input, state.config, 2.8, 34)

      if (settings.corridor && predicted.length > 3) {
        ctx.save()
        ctx.globalAlpha = .07
        for (let i = 0; i < predicted.length; i += 7) {
          const shadowCar = { ...state.car, x: predicted[i].x, y: predicted[i].y, angle: predicted[i].angle }
          drawPoly(ctx, getCarCorners(shadowCar, state.config), w, h, '#38BDF8')
        }
        ctx.restore()
      }

      if (settings.trajectory) {
        drawPath(ctx, predicted, w, h, 'rgba(56,189,248,.96)', 4)
        drawTrajectoryRisk(ctx, level, predicted, state.config, w, h)
      }

      if (settings.ghost) {
        for (let i = 12; i < predicted.length; i += 28) {
          const ghost = { ...state.car, x: predicted[i].x, y: predicted[i].y, angle: predicted[i].angle }
          drawOctavia(ctx, ghost, state.config, w, h, .18)
        }
      }

      for (const obs of level.obstacles) {
        drawObstacle(ctx, obs, w, h)
      }

      drawOctavia(ctx, state.car, state.config, w, h, 1)

      // minimal dashboard overlay
      ctx.save()
      ctx.fillStyle = 'rgba(0,0,0,.28)'
      roundRect(ctx, 16, 60, 184, 82, 18)
      ctx.fill()
      ctx.fillStyle = 'rgba(255,255,255,.82)'
      ctx.font = '12px system-ui'
      ctx.textAlign = 'left'
      ctx.fillText(`Руль: ${(state.car.steeringAngle * 180 / Math.PI).toFixed(0)}°`, 32, 86)
      ctx.fillText(`Скорость: ${Math.abs(state.car.speed).toFixed(1)} м/с`, 32, 108)
      ctx.fillText(`Передача: ${state.car.gear}`, 32, 130)
      ctx.restore()

      if (finished) {
        ctx.fillStyle = 'rgba(0,0,0,.45)'
        ctx.fillRect(0, 0, w, h)
        ctx.fillStyle = '#fff'
        ctx.font = '700 30px system-ui'
        ctx.textAlign = 'center'
        ctx.fillText('Вика, получилось красиво 💛', w / 2, h / 2 - 12)
        ctx.font = '16px system-ui'
        ctx.fillStyle = '#B8C0D9'
        ctx.fillText('Открываю разбор попытки...', w / 2, h / 2 + 22)
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
