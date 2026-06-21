'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { predictTrajectory, updateCarPhysics } from '@/lib/physics/carPhysics'
import { getCarCorners, getRectCorners } from '@/lib/physics/geometry'
import { detectCollision, getSoftHint, isParked } from '@/lib/simulator/scoring'
import { buildAttemptResult } from '@/lib/simulator/result'
import { saveAttempt } from '@/lib/progress/storage'
import { playSound } from '@/lib/sound/soundEngine'
import { useSettingsStore } from '@/store/settingsStore'
import { useSimulatorStore } from '@/store/simulatorStore'
import { getVisualScene, type VisualScene, type VisualSprite } from '@/lib/data/visualScenes'
import type { ParkingLevel } from '@/lib/data/levels'
import type { CarInput, Point } from '@/lib/physics/types'

const SCALE = 72

type AssetMap = Record<string, HTMLImageElement>

const assetSources: Record<string, string> = {
  player: '/assets/v12/octavia-top.svg',
  'sedan-dark': '/assets/v12/parked-sedan-dark.svg',
  'sedan-white': '/assets/v12/parked-sedan-white.svg',
  'suv-gray': '/assets/v12/parked-suv-gray.svg',
  cone: '/assets/v12/cone.svg',
  bollard: '/assets/v12/bollard.svg',
  cart: '/assets/v12/shopping-cart.svg',
  bench: '/assets/v12/bench.svg',
  asphalt: '/assets/v12/asphalt-texture.png',
  storefront: '/assets/v12/sidewalk-storefront.png'
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => resolve(img)
    img.src = src
  })
}

function w2s(p: Point, canvasW: number, canvasH: number, camera: Point) {
  return {
    x: canvasW / 2 + (p.x - camera.x) * SCALE,
    y: canvasH / 2 - (p.y - camera.y) * SCALE
  }
}

function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  const rr = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + rr, y)
  ctx.arcTo(x + w, y, x + w, y + h, rr)
  ctx.arcTo(x + w, y + h, x, y + h, rr)
  ctx.arcTo(x, y + h, x, y, rr)
  ctx.arcTo(x, y, x + w, y, rr)
  ctx.closePath()
}

function drawWorldImage(
  ctx: CanvasRenderingContext2D,
  img: HTMLImageElement | undefined,
  p: Point,
  widthM: number,
  heightM: number,
  angle: number,
  w: number,
  h: number,
  camera: Point,
  opacity = 1
) {
  const s = w2s(p, w, h, camera)
  ctx.save()
  ctx.globalAlpha = opacity
  ctx.translate(s.x, s.y)
  ctx.rotate(-angle)
  const pxW = widthM * SCALE
  const pxH = heightM * SCALE
  if (img && img.complete && img.naturalWidth > 0) {
    ctx.drawImage(img, -pxW / 2, -pxH / 2, pxW, pxH)
  } else {
    ctx.fillStyle = 'rgba(255,255,255,.18)'
    drawRoundedRect(ctx, -pxW/2, -pxH/2, pxW, pxH, 18)
    ctx.fill()
  }
  ctx.restore()
}

function drawPath(ctx: CanvasRenderingContext2D, pts: Point[], w: number, h: number, camera: Point, color: string, width = 5, dash?: number[]) {
  if (!pts || pts.length < 2) return
  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = width
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  ctx.setLineDash(dash || [])
  ctx.shadowColor = color
  ctx.shadowBlur = 18
  ctx.beginPath()
  pts.forEach((p, i) => {
    const s = w2s(p, w, h, camera)
    if (i === 0) ctx.moveTo(s.x, s.y)
    else ctx.lineTo(s.x, s.y)
  })
  ctx.stroke()
  ctx.restore()
}

function drawPoly(ctx: CanvasRenderingContext2D, pts: Point[], w: number, h: number, camera: Point, fill: string, stroke?: string) {
  ctx.beginPath()
  pts.forEach((p, i) => {
    const s = w2s(p, w, h, camera)
    if (i === 0) ctx.moveTo(s.x, s.y)
    else ctx.lineTo(s.x, s.y)
  })
  ctx.closePath()
  ctx.fillStyle = fill
  ctx.fill()
  if (stroke) {
    ctx.strokeStyle = stroke
    ctx.lineWidth = 2
    ctx.stroke()
  }
}

function drawBackground(ctx: CanvasRenderingContext2D, w: number, h: number, camera: Point, assets: AssetMap, scene: VisualScene) {
  ctx.fillStyle = '#080B13'
  ctx.fillRect(0, 0, w, h)

  const asphalt = assets.asphalt
  if (asphalt && asphalt.complete) {
    const pattern = ctx.createPattern(asphalt, 'repeat')
    if (pattern) {
      ctx.save()
      ctx.translate((-camera.x * SCALE) % 1024, (camera.y * SCALE) % 1024)
      ctx.fillStyle = pattern
      ctx.fillRect(-1024, -1024, w + 2048, h + 2048)
      ctx.restore()
    }
  }

  // night vignette
  const grd = ctx.createRadialGradient(w*.52, h*.45, 80, w*.52, h*.45, Math.max(w,h)*.72)
  grd.addColorStop(0, 'rgba(255,255,255,.04)')
  grd.addColorStop(1, 'rgba(0,0,0,.55)')
  ctx.fillStyle = grd
  ctx.fillRect(0,0,w,h)

  // subtle parking grid lines
  ctx.strokeStyle = 'rgba(255,255,255,.045)'
  ctx.lineWidth = 1
  const grid = 72
  const ox = ((w/2 - camera.x*SCALE) % grid + grid) % grid
  const oy = ((h/2 + camera.y*SCALE) % grid + grid) % grid
  for (let x = ox; x < w; x += grid) {
    ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,h); ctx.stroke()
  }
  for (let y = oy; y < h; y += grid) {
    ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(w,y); ctx.stroke()
  }
}

function drawShopSidewalk(ctx: CanvasRenderingContext2D, w: number, h: number, camera: Point, assets: AssetMap) {
  const xWorld = 8.35
  const top = w2s({x:xWorld, y:8}, w, h, camera)
  const bottom = w2s({x:xWorld, y:-8}, w, h, camera)
  const sw = 3.2 * SCALE
  const x = top.x
  const y = top.y
  const height = bottom.y - top.y
  const img = assets.storefront
  ctx.save()
  if (img && img.complete) ctx.drawImage(img, x, y, sw, height)
  else {
    ctx.fillStyle = 'rgba(29,34,49,.95)'
    ctx.fillRect(x, y, sw, height)
  }
  // edge curb shadow
  ctx.fillStyle = 'rgba(255,255,255,.16)'
  ctx.fillRect(x - 6, y, 6, height)
  ctx.fillStyle = 'rgba(255,200,87,.32)'
  ctx.fillRect(x - 16, y, 8, height)
  ctx.restore()
}

function drawParkingSlot(ctx: CanvasRenderingContext2D, slot: VisualScene['parkingSlots'][number], w: number, h: number, camera: Point) {
  const s = w2s({x:slot.x, y:slot.y}, w, h, camera)
  const pxW = slot.width * SCALE
  const pxH = slot.height * SCALE
  ctx.save()
  ctx.translate(s.x, s.y)
  ctx.rotate(-(slot.angle || 0))
  if (slot.active) {
    ctx.fillStyle = 'rgba(34,230,165,.13)'
    ctx.strokeStyle = 'rgba(34,230,165,.92)'
    ctx.shadowColor = 'rgba(34,230,165,.45)'
    ctx.shadowBlur = 26
  } else {
    ctx.fillStyle = 'rgba(255,255,255,.015)'
    ctx.strokeStyle = 'rgba(255,255,255,.20)'
    ctx.shadowBlur = 0
  }
  drawRoundedRect(ctx, -pxW/2, -pxH/2, pxW, pxH, 8)
  ctx.fill()
  ctx.stroke()
  if (slot.active) {
    ctx.fillStyle = 'rgba(34,230,165,.62)'
    ctx.font = '700 54px system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('P', 0, 0)
  }
  ctx.restore()
}

function drawLaneLines(ctx: CanvasRenderingContext2D, w: number, h: number, camera: Point, scene: VisualScene) {
  if (scene.kind === 'shop-night') {
    drawPath(ctx, [{x:-8.5,y:-.2},{x:8.2,y:-.2}], w, h, camera, 'rgba(255,255,255,.26)', 3, [26,26])
    // parking line separators near lower row
    for (const x of [-7.9, -4.8, -1.6, 1.6, 4.8]) {
      drawPath(ctx, [{x,y:-5.2},{x,y:-1.4}], w, h, camera, 'rgba(255,255,255,.48)', 5)
    }
  }
  if (scene.decor.curb) {
    drawPath(ctx, [{x:-9,y:5.55},{x:9,y:5.55}], w, h, camera, 'rgba(255,200,87,.55)', 8)
  }
}

function drawSprite(ctx: CanvasRenderingContext2D, sprite: VisualSprite, assets: AssetMap, w: number, h: number, camera: Point) {
  drawWorldImage(ctx, assets[sprite.asset], {x:sprite.x, y:sprite.y}, sprite.width, sprite.height, sprite.angle || 0, w, h, camera, sprite.opacity ?? 1)
}

function drawCheckpoints(ctx: CanvasRenderingContext2D, level: ParkingLevel, w: number, h: number, camera: Point) {
  if (!level.ideal?.length) return
  level.ideal.forEach((p, i) => {
    if (i === 0) return
    const s = w2s(p, w, h, camera)
    ctx.save()
    ctx.fillStyle = 'rgba(255,94,200,.12)'
    ctx.strokeStyle = 'rgba(255,94,200,.72)'
    ctx.shadowColor = 'rgba(255,94,200,.55)'
    ctx.shadowBlur = 18
    ctx.lineWidth = 2
    ctx.beginPath(); ctx.arc(s.x, s.y, 16, 0, Math.PI*2); ctx.fill(); ctx.stroke()
    ctx.fillStyle = '#FF5EC8'
    ctx.font = '700 12px system-ui'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(String(i), s.x, s.y)
    ctx.restore()
  })
}

function drawRiskDot(ctx: CanvasRenderingContext2D, level: ParkingLevel, predicted: {x:number;y:number;angle:number}[], cfg: any, w: number, h: number, camera: Point) {
  for (let i = 0; i < predicted.length; i += 8) {
    const ghostCar = { x: predicted[i].x, y: predicted[i].y, angle: predicted[i].angle, speed: 0, steeringAngle: 0, gear: 'D' as const }
    const hit = detectCollision(ghostCar, cfg, level.obstacles)
    if (hit) {
      const s = w2s(predicted[i], w, h, camera)
      ctx.save()
      ctx.fillStyle = 'rgba(255,94,130,.95)'
      ctx.shadowColor = 'rgba(255,94,130,.7)'
      ctx.shadowBlur = 26
      ctx.beginPath(); ctx.arc(s.x, s.y, 12, 0, Math.PI*2); ctx.fill()
      ctx.restore()
      return
    }
  }
}

export function PremiumLayeredCanvas({ level }: { level: ParkingLevel }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const cameraRef = useRef<Point>({ x: level.start.x, y: level.start.y })
  const savedRef = useRef(false)
  const [finished, setFinished] = useState(false)
  const [assets, setAssets] = useState<AssetMap>({})
  const scene = useMemo(() => getVisualScene(level), [level])
  const settings = useSettingsStore()
  const { setCar, setInput, resetCar, setHint, addCollision } = useSimulatorStore()

  useEffect(() => {
    let mounted = true
    Promise.all(Object.entries(assetSources).map(async ([key, src]) => [key, await loadImage(src)] as const))
      .then((entries) => {
        if (mounted) setAssets(Object.fromEntries(entries))
      })
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    resetCar(level.start)
    setFinished(false)
    savedRef.current = false
    cameraRef.current = { x: level.start.x, y: level.start.y }
  }, [level.id, level.start, resetCar])

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
  }, [level.start, resetCar, setInput])

  useEffect(() => {
    let raf = 0
    let last = performance.now()
    let cooldown = 0

    const tick = (now: number) => {
      const dtRaw = Math.min(0.033, (now - last) / 1000)
      last = now
      const state = useSimulatorStore.getState()
      const dt = state.comfortMode ? dtRaw * 0.72 : dtRaw

      if (!finished) {
        const next = updateCarPhysics(state.car, state.input, state.config, dt)
        const hit = detectCollision(next, state.config, level.obstacles)
        if (hit && cooldown <= 0) {
          addCollision()
          playSound('warning')
          cooldown = .8
          setHint(hit.type === 'curb' ? 'Бордюр близко — выровняй траекторию.' : 'Корпус машины близко к препятствию.')
        } else {
          setHint(getSoftHint(next, level.target))
        }

        cooldown -= dt
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
          setTimeout(() => { window.location.href = `/results/${result.id}` }, 900)
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
      const cssW = parent?.clientWidth || 940
      const cssH = parent?.clientHeight || 900
      if (canvas.width !== cssW * dpr || canvas.height !== cssH * dpr) {
        canvas.width = cssW * dpr
        canvas.height = cssH * dpr
        canvas.style.width = `${cssW}px`
        canvas.style.height = `${cssH}px`
      }

      const ctx = canvas.getContext('2d')
      if (!ctx) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const state = useSimulatorStore.getState()
      cameraRef.current = {
        x: cameraRef.current.x + (state.car.x - cameraRef.current.x) * .055,
        y: cameraRef.current.y + (state.car.y - cameraRef.current.y) * .055
      }
      const camera = cameraRef.current

      drawBackground(ctx, cssW, cssH, camera, assets, scene)
      if (scene.decor.storefront || scene.decor.sidewalk) drawShopSidewalk(ctx, cssW, cssH, camera, assets)
      drawLaneLines(ctx, cssW, cssH, camera, scene)
      scene.parkingSlots.forEach(slot => drawParkingSlot(ctx, slot, cssW, cssH, camera))
      scene.sprites.forEach(sprite => drawSprite(ctx, sprite, assets, cssW, cssH, camera))

      if (settings.ideal) {
        drawPath(ctx, level.ideal, cssW, cssH, camera, 'rgba(34,230,165,.88)', 5, [14, 14])
        drawCheckpoints(ctx, level, cssW, cssH, camera)
      }

      const predicted = predictTrajectory(state.car, state.input, state.config, 2.8, 34)

      if (settings.corridor) {
        ctx.save()
        ctx.globalAlpha = .08
        for (let i=0; i<predicted.length; i+=7) {
          const ghost = { ...state.car, x: predicted[i].x, y: predicted[i].y, angle: predicted[i].angle }
          drawPoly(ctx, getCarCorners(ghost, state.config), cssW, cssH, camera, '#3EA6FF')
        }
        ctx.restore()
      }

      if (settings.trajectory) {
        drawPath(ctx, predicted, cssW, cssH, camera, 'rgba(62,166,255,.96)', 6)
        drawRiskDot(ctx, level, predicted, state.config, cssW, cssH, camera)
      }

      if (settings.ghost) {
        for (let i=16; i<predicted.length; i+=28) {
          drawWorldImage(
            ctx,
            assets.player,
            { x: predicted[i].x, y: predicted[i].y },
            state.config.length,
            state.config.width,
            predicted[i].angle,
            cssW,
            cssH,
            camera,
            .20
          )
        }
      }

      drawWorldImage(ctx, assets.player, {x: state.car.x, y: state.car.y}, state.config.length, state.config.width, state.car.angle, cssW, cssH, camera, 1)

      // soft foreground gradient
      const fg = ctx.createLinearGradient(0, 0, 0, cssH)
      fg.addColorStop(0, 'rgba(8,11,19,.18)')
      fg.addColorStop(.58, 'rgba(8,11,19,0)')
      fg.addColorStop(1, 'rgba(8,11,19,.34)')
      ctx.fillStyle = fg
      ctx.fillRect(0,0,cssW,cssH)

      if (finished) {
        ctx.fillStyle = 'rgba(0,0,0,.50)'
        ctx.fillRect(0,0,cssW,cssH)
        ctx.fillStyle = '#fff'
        ctx.font = '700 32px system-ui'
        ctx.textAlign = 'center'
        ctx.fillText('Вика, получилось красиво 💛', cssW/2, cssH/2)
      }
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [assets, scene, level, settings, setCar, setHint, addCollision, finished])

  return <canvas ref={canvasRef} className="block h-full w-full" />
}
