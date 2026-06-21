import type { CarConfig, CarState, RectObstacle, TargetZone } from '@/lib/physics/types'
import { getCarCorners, getRectCorners, pointInsideRotatedRect, polygonsIntersect } from '@/lib/physics/geometry'

export function detectCollision(car: CarState, cfg: CarConfig, obstacles: RectObstacle[]) {
  const carPoly = getCarCorners(car, cfg)
  return obstacles.find(obs => polygonsIntersect(carPoly, getRectCorners(obs)))
}

export function isParked(car: CarState, cfg: CarConfig, target: TargetZone) {
  const corners = getCarCorners(car, cfg)
  const inside = corners.every(p => pointInsideRotatedRect(p, target))
  const targetAngle = target.angle ?? 0
  const angleError = Math.abs(Math.atan2(Math.sin(car.angle - targetAngle), Math.cos(car.angle - targetAngle)))
  return inside && Math.abs(car.speed) < 0.12 && angleError < 0.22
}

export function getSoftHint(car: CarState, target: TargetZone) {
  const dist = Math.hypot(car.x - target.x, car.y - target.y)
  if (dist < 2.2 && Math.abs(car.speed) > 1.2) return 'Чуть медленнее — ты уже рядом с парковочным местом.'
  if (Math.abs(car.steeringAngle) > 0.45) return 'Руль сильно выкручен. Смотри, куда уходит синяя траектория.'
  if (dist < 1.5) return 'Отлично, машина почти в зоне. Теперь выровняй колёса.'
  return 'Смотри на синюю линию: она показывает реальный путь машины.'
}
