import type { ParkingLevel } from './levels'

export type SpriteAssetType =
  | 'player'
  | 'sedan-dark'
  | 'sedan-white'
  | 'suv-gray'
  | 'cone'
  | 'bollard'
  | 'cart'
  | 'bench'

export type VisualSprite = {
  id: string
  asset: SpriteAssetType
  x: number
  y: number
  width: number
  height: number
  angle?: number
  opacity?: number
}

export type VisualScene = {
  id: string
  kind: 'shop-night' | 'yard-night' | 'street-night' | 'training-night'
  cameraStart: { x: number; y: number }
  bounds: { width: number; height: number }
  sprites: VisualSprite[]
  parkingSlots: Array<{
    x: number
    y: number
    width: number
    height: number
    angle?: number
    active?: boolean
  }>
  decor: {
    storefront?: boolean
    sidewalk?: boolean
    curb?: boolean
    laneLine?: boolean
  }
}

export function getVisualScene(level: ParkingLevel): VisualScene {
  if (level.category === 'shop') return shopNightScene(level.id)
  if (level.category === 'parallel' || level.category === 'hard') return streetNightScene(level.id)
  if (level.category === 'yard') return yardNightScene(level.id)
  return trainingNightScene(level.id)
}

function shopNightScene(id: string): VisualScene {
  return {
    id,
    kind: 'shop-night',
    cameraStart: { x: 0, y: 0 },
    bounds: { width: 20, height: 24 },
    decor: { storefront: true, sidewalk: true, curb: true, laneLine: true },
    parkingSlots: [
      { x: -6.4, y: 3.2, width: 2.65, height: 5.3, angle: Math.PI / 2 },
      { x: -3.2, y: 3.2, width: 2.65, height: 5.3, angle: Math.PI / 2 },
      { x: 0.0, y: 3.2, width: 2.65, height: 5.3, angle: Math.PI / 2 },
      { x: 3.2, y: 3.2, width: 2.65, height: 5.3, angle: Math.PI / 2, active: true },
      { x: 6.4, y: 3.2, width: 2.65, height: 5.3, angle: Math.PI / 2 }
    ],
    sprites: [
      { id: 'left-dark', asset: 'sedan-dark', x: -6.4, y: -2.1, width: 4.7, height: 2.0, angle: 0 },
      { id: 'left-white', asset: 'sedan-white', x: -3.1, y: -2.1, width: 4.7, height: 2.0, angle: 0 },
      { id: 'right-suv', asset: 'suv-gray', x: 6.4, y: -1.2, width: 4.9, height: 2.2, angle: Math.PI / 2 },
      { id: 'cone-target', asset: 'cone', x: 5.2, y: 2.0, width: 0.65, height: 0.8, angle: 0 },
      { id: 'cart', asset: 'cart', x: 8.4, y: -2.1, width: 1.4, height: 1.1, angle: -0.15 },
      { id: 'bench', asset: 'bench', x: 8.3, y: -4.0, width: 1.9, height: 0.85, angle: 0 },
      { id: 'bollard-1', asset: 'bollard', x: 7.7, y: 4.7, width: .45, height: .85 },
      { id: 'bollard-2', asset: 'bollard', x: 7.7, y: 2.7, width: .45, height: .85 },
      { id: 'bollard-3', asset: 'bollard', x: 7.7, y: .7, width: .45, height: .85 }
    ]
  }
}

function streetNightScene(id: string): VisualScene {
  return {
    id,
    kind: 'street-night',
    cameraStart: { x: 0, y: 0 },
    bounds: { width: 20, height: 22 },
    decor: { sidewalk: true, curb: true, laneLine: true },
    parkingSlots: [
      { x: -3.6, y: 2.1, width: 5.2, height: 2.45, angle: 0 },
      { x: 1.4, y: 2.1, width: 5.2, height: 2.45, angle: 0, active: true },
      { x: 6.3, y: 2.1, width: 5.2, height: 2.45, angle: 0 }
    ],
    sprites: [
      { id: 'front-car', asset: 'suv-gray', x: 6.1, y: 2.1, width: 4.8, height: 2.1, angle: 0 },
      { id: 'back-car', asset: 'sedan-dark', x: -4.2, y: 2.1, width: 4.7, height: 2.0, angle: 0 },
      { id: 'bollard-a', asset: 'bollard', x: 8.2, y: 4.4, width: .45, height: .85 },
      { id: 'bollard-b', asset: 'bollard', x: 5.5, y: 4.4, width: .45, height: .85 },
      { id: 'cone', asset: 'cone', x: 3.8, y: -.5, width: .65, height: .8 }
    ]
  }
}

function yardNightScene(id: string): VisualScene {
  return {
    id,
    kind: 'yard-night',
    cameraStart: { x: 0, y: 0 },
    bounds: { width: 20, height: 22 },
    decor: { curb: true, laneLine: true },
    parkingSlots: [
      { x: 5.6, y: 2.35, width: 3.2, height: 2.6, angle: 0.15, active: true }
    ],
    sprites: [
      { id: 'yard-car-1', asset: 'sedan-white', x: -1.9, y: -2.1, width: 4.7, height: 2.0, angle: 0.08 },
      { id: 'yard-car-2', asset: 'suv-gray', x: 2.4, y: 1.4, width: 4.9, height: 2.2, angle: -0.08 },
      { id: 'cart', asset: 'cart', x: 3.9, y: -2.4, width: 1.4, height: 1.1, angle: 0.1 },
      { id: 'bench', asset: 'bench', x: -6.5, y: 3.4, width: 1.9, height: .85, angle: .1 }
    ]
  }
}

function trainingNightScene(id: string): VisualScene {
  return {
    id,
    kind: 'training-night',
    cameraStart: { x: 0, y: 0 },
    bounds: { width: 18, height: 20 },
    decor: { laneLine: true },
    parkingSlots: [
      { x: 6.4, y: 0, width: 3.8, height: 2.6, angle: 0, active: true }
    ],
    sprites: [
      { id: 'cone-1', asset: 'cone', x: -1, y: -1.65, width: .65, height: .8 },
      { id: 'cone-2', asset: 'cone', x: -1, y: 1.65, width: .65, height: .8 },
      { id: 'cone-3', asset: 'cone', x: 2.2, y: -1.65, width: .65, height: .8 },
      { id: 'cone-4', asset: 'cone', x: 2.2, y: 1.65, width: .65, height: .8 }
    ]
  }
}
