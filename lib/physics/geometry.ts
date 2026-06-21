import { CarConfig } from './types'
import type { CarState, Point, RectObstacle, TargetZone } from './types'

export function rotate(p: Point, angle: number): Point {
  const c = Math.cos(angle)
  const s = Math.sin(angle)
  return { x: p.x * c - p.y * s, y: p.x * s + p.y * c }
}

export function translate(p: Point, x: number, y: number): Point {
  return { x: p.x + x, y: p.y + y }
}

export function getCarCorners(car: CarState, cfg: CarConfig): Point[] {
  const hw = cfg.width / 2
  const hl = cfg.length / 2
  const local = [
    { x: hl, y: -hw },
    { x: hl, y: hw },
    { x: -hl, y: hw },
    { x: -hl, y: -hw }
  ]
  return local.map(p => translate(rotate(p, car.angle), car.x, car.y))
}

export function getRectCorners(rect: RectObstacle | TargetZone): Point[] {
  const hw = rect.width / 2
  const hh = rect.height / 2
  const a = rect.angle ?? 0
  const local = [
    { x: -hw, y: -hh },
    { x: hw, y: -hh },
    { x: hw, y: hh },
    { x: -hw, y: hh }
  ]
  return local.map(p => translate(rotate(p, a), rect.x, rect.y))
}

function project(poly: Point[], axis: Point) {
  let min = Infinity
  let max = -Infinity
  for (const p of poly) {
    const dot = p.x * axis.x + p.y * axis.y
    min = Math.min(min, dot)
    max = Math.max(max, dot)
  }
  return { min, max }
}

function axes(poly: Point[]) {
  const result: Point[] = []
  for (let i = 0; i < poly.length; i++) {
    const p1 = poly[i]
    const p2 = poly[(i + 1) % poly.length]
    const edge = { x: p2.x - p1.x, y: p2.y - p1.y }
    const normal = { x: -edge.y, y: edge.x }
    const len = Math.hypot(normal.x, normal.y) || 1
    result.push({ x: normal.x / len, y: normal.y / len })
  }
  return result
}

export function polygonsIntersect(a: Point[], b: Point[]) {
  for (const axis of [...axes(a), ...axes(b)]) {
    const pa = project(a, axis)
    const pb = project(b, axis)
    if (pa.max < pb.min || pb.max < pa.min) return false
  }
  return true
}

export function pointInsideRotatedRect(point: Point, rect: TargetZone) {
  const a = -(rect.angle ?? 0)
  const translated = { x: point.x - rect.x, y: point.y - rect.y }
  const p = rotate(translated, a)
  return Math.abs(p.x) <= rect.width / 2 && Math.abs(p.y) <= rect.height / 2
}
