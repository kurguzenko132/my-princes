export interface CarState {
  x: number
  y: number
  angle: number
  speed: number
  steeringAngle: number
  gear: 'D' | 'R'
}
export interface CarConfig {
  length: number
  width: number
  wheelBase: number
  maxSteeringAngle: number
  maxForwardSpeed: number
  maxReverseSpeed: number
  acceleration: number
  brakePower: number
}
export interface CarInput {
  throttle: boolean
  brake: boolean
  steerLeft: boolean
  steerRight: boolean
}
export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

export function updateCarPhysics(
  state: CarState,
  input: CarInput,
  cfg: CarConfig,
  dt: number
): CarState {
  let steering = state.steeringAngle
  const steerRate = cfg.maxSteeringAngle * 2
  if (input.steerLeft) steering += steerRate * dt
  if (input.steerRight) steering -= steerRate * dt
  steering = clamp(steering, -cfg.maxSteeringAngle, cfg.maxSteeringAngle)

  let speed = state.speed
  if (input.throttle) {
    const dir = state.gear === 'D' ? 1 : -1
    speed += dir * cfg.acceleration * dt
  }
  if (input.brake) {
    const dec = cfg.brakePower * dt * Math.sign(speed)
    if (Math.abs(speed) < Math.abs(dec)) speed = 0
    else speed -= dec
  }
  speed = clamp(speed, -cfg.maxReverseSpeed, cfg.maxForwardSpeed)

  const beta = Math.atan((cfg.wheelBase / 2) * Math.tan(steering) / cfg.wheelBase)
  const dx = speed * Math.cos(state.angle + beta) * dt
  const dy = speed * Math.sin(state.angle + beta) * dt
  const dAngle = (speed / cfg.wheelBase) * Math.tan(steering) * dt

  return { ...state, x: state.x + dx, y: state.y + dy, angle: state.angle + dAngle, speed, steeringAngle: steering }
}
