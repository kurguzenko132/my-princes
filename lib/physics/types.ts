export type Gear = 'D' | 'R'

export type Point = { x: number; y: number }

export type CarState = {
  x: number
  y: number
  angle: number
  speed: number
  steeringAngle: number
  gear: Gear
}

export type CarInput = {
  throttle: boolean
  brake: boolean
  steerLeft: boolean
  steerRight: boolean
  /**
   * -1..1 from the virtual wheel.
   * Positive means steering left, negative means steering right.
   * null/undefined means keyboard/button steering is used.
   */
  virtualSteering?: number | null
}

export type CarConfig = {
  length: number
  width: number
  wheelBase: number
  maxSteeringAngle: number
  maxForwardSpeed: number
  maxReverseSpeed: number
  acceleration: number
  brakePower: number
  steeringReturn: number
}

export type RectObstacle = {
  id: string
  type: 'car' | 'curb' | 'cone' | 'wall' | 'trash'
  x: number
  y: number
  width: number
  height: number
  angle?: number
  label?: string
}

export type TargetZone = {
  x: number
  y: number
  width: number
  height: number
  angle?: number
}

export type TrajectoryPoint = Point & {
  angle: number
  collision?: boolean
  near?: boolean
}
