import { CarConfig, CarInput, CarState, TrajectoryPoint } from './types'

export const OCTAVIA_CONFIG: CarConfig = {
  length: 4.698,
  width: 1.829,
  wheelBase: 2.686,
  maxSteeringAngle: Math.PI / 5.2,
  maxForwardSpeed: 3.2,
  maxReverseSpeed: 2.1,
  acceleration: 1.65,
  brakePower: 3.4,
  steeringReturn: 1.7
}

export function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v))
}

export function normalizeAngle(a: number) {
  while (a > Math.PI) a -= Math.PI * 2
  while (a < -Math.PI) a += Math.PI * 2
  return a
}

export function updateCarPhysics(state: CarState, input: CarInput, cfg: CarConfig, dt: number): CarState {
  let steering = state.steeringAngle
  const steerRate = cfg.maxSteeringAngle * 2.15

  if (input.steerLeft) steering += steerRate * dt
  if (input.steerRight) steering -= steerRate * dt
  if (!input.steerLeft && !input.steerRight) {
    const ret = cfg.steeringReturn * dt
    if (Math.abs(steering) <= ret) steering = 0
    else steering -= Math.sign(steering) * ret
  }
  steering = clamp(steering, -cfg.maxSteeringAngle, cfg.maxSteeringAngle)

  let speed = state.speed
  if (input.throttle) {
    const direction = state.gear === 'D' ? 1 : -1
    speed += direction * cfg.acceleration * dt
  }

  if (input.brake) {
    const friction = cfg.brakePower * dt
    if (Math.abs(speed) <= friction) speed = 0
    else speed -= Math.sign(speed) * friction
  }

  if (!input.throttle && !input.brake) {
    const rolling = 0.42 * dt
    if (Math.abs(speed) <= rolling) speed = 0
    else speed -= Math.sign(speed) * rolling
  }

  speed = clamp(speed, -cfg.maxReverseSpeed, cfg.maxForwardSpeed)

  const turn = Math.tan(steering)
  const dAngle = (speed / cfg.wheelBase) * turn * dt
  const angle = normalizeAngle(state.angle + dAngle)
  const x = state.x + speed * Math.cos(angle) * dt
  const y = state.y + speed * Math.sin(angle) * dt

  return { ...state, x, y, angle, speed, steeringAngle: steering }
}

export function predictTrajectory(state: CarState, input: CarInput, cfg: CarConfig, seconds = 2.6, fps = 40): TrajectoryPoint[] {
  const ghost: CarState = { ...state }
  const points: TrajectoryPoint[] = []
  const dt = 1 / fps
  for (let i = 0; i < seconds * fps; i++) {
    const next = updateCarPhysics(ghost, input, cfg, dt)
    points.push({ x: next.x, y: next.y, angle: next.angle })
    Object.assign(ghost, next)
  }
  return points
}
