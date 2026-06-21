import type { CarState, RectObstacle, TargetZone } from '@/lib/physics/types'

export type ParkingLevel = {
  id: string
  title: string
  category: 'basic' | 'shop' | 'yard' | 'parallel' | 'hard'
  difficulty: number
  intro: string
  goal: string
  start: CarState
  target: TargetZone
  obstacles: RectObstacle[]
  ideal: { x: number; y: number }[]
  tips: string[]
}

const start: CarState = { x: -7, y: 0, angle: 0, speed: 0, steeringAngle: 0, gear: 'D' }

export const levels: ParkingLevel[] = [
  {
    id: 'basic-octavia-gabarits',
    title: 'Почувствовать габариты Octavia',
    category: 'basic',
    difficulty: 1,
    intro: 'Спокойный первый заезд. Просто почувствуй длину и ширину машины.',
    goal: 'Проедь между конусами и остановись в зелёной зоне.',
    start,
    target: { x: 6.4, y: 0, width: 3.8, height: 2.6, angle: 0 },
    obstacles: [
      { id: 'cone-1', type: 'cone', x: -1, y: -1.65, width: .35, height: .35 },
      { id: 'cone-2', type: 'cone', x: -1, y: 1.65, width: .35, height: .35 },
      { id: 'cone-3', type: 'cone', x: 2.2, y: -1.65, width: .35, height: .35 },
      { id: 'cone-4', type: 'cone', x: 2.2, y: 1.65, width: .35, height: .35 }
    ],
    ideal: [{x:-7,y:0},{x:-4,y:0},{x:-1,y:0},{x:2.2,y:0},{x:6.4,y:0}],
    tips: ['Не спеши. Сейчас важно почувствовать габариты.', 'Смотри на синюю траекторию — она показывает реальный путь.']
  },
  {
    id: 'shop-front-parking',
    title: 'Парковка передом у магазина',
    category: 'shop',
    difficulty: 2,
    intro: 'Реальная ситуация: обычная парковка у магазина, машины рядом, место свободно.',
    goal: 'Заедь передом между линиями и остановись ровно.',
    start: { x: -5.5, y: -4, angle: Math.PI / 2, speed: 0, steeringAngle: 0, gear: 'D' },
    target: { x: 1.8, y: 2.1, width: 2.8, height: 5.2, angle: Math.PI / 2 },
    obstacles: [
      { id: 'car-left', type: 'car', x: -1.4, y: 2.1, width: 2.1, height: 4.7, angle: Math.PI/2 },
      { id: 'car-right', type: 'car', x: 5.0, y: 2.1, width: 2.1, height: 4.7, angle: Math.PI/2 }
    ],
    ideal: [{x:-5.5,y:-4},{x:-3.8,y:-1.6},{x:-1.3,y:.5},{x:1.8,y:2.1}],
    tips: ['Начинай поворот плавно, не в последний момент.', 'Синяя дуга должна заходить внутрь зелёной зоны.']
  },
  {
    id: 'shop-reverse-lines',
    title: 'Парковка задом между линиями',
    category: 'shop',
    difficulty: 3,
    intro: 'Теперь задний ход. Тут важнее всего не скорость, а момент поворота.',
    goal: 'Заедь задом в место между линиями.',
    start: { x: -4.5, y: -3.7, angle: 0, speed: 0, steeringAngle: 0, gear: 'R' },
    target: { x: 2.2, y: 2.4, width: 2.8, height: 5.2, angle: Math.PI / 2 },
    obstacles: [
      { id: 'car-a', type: 'car', x: -1.1, y: 2.4, width: 2.1, height: 4.7, angle: Math.PI/2 },
      { id: 'car-b', type: 'car', x: 5.4, y: 2.4, width: 2.1, height: 4.7, angle: Math.PI/2 }
    ],
    ideal: [{x:-4.5,y:-3.7},{x:-2.0,y:-2.8},{x:.8,y:-.5},{x:2.2,y:2.4}],
    tips: ['На заднем ходу руль особенно сильно меняет траекторию.', 'Если синяя линия уходит к машине — выровняй колёса.']
  },
  {
    id: 'parallel-curb-easy',
    title: 'Параллельная парковка у бордюра',
    category: 'parallel',
    difficulty: 4,
    intro: 'Классическая ситуация у бордюра. Сначала большое место, без давления.',
    goal: 'Встань между двумя машинами рядом с бордюром.',
    start: { x: -5.8, y: -2.1, angle: 0, speed: 0, steeringAngle: 0, gear: 'R' },
    target: { x: 1.4, y: 1.7, width: 5.3, height: 2.45, angle: 0 },
    obstacles: [
      { id: 'front-car', type: 'car', x: 5.2, y: 1.7, width: 4.7, height: 2.0, angle: 0 },
      { id: 'back-car', type: 'car', x: -3.9, y: 1.7, width: 4.7, height: 2.0, angle: 0 },
      { id: 'curb', type: 'curb', x: 1.0, y: 3.25, width: 12.0, height: .28, angle: 0 }
    ],
    ideal: [{x:-5.8,y:-2.1},{x:-3.7,y:-1.4},{x:-1.5,y:.1},{x:.2,y:1.2},{x:1.4,y:1.7}],
    tips: ['Смотри, чтобы синяя траектория не уходила в бордюр.', 'Лучше ехать медленно и корректировать руль маленькими движениями.']
  }
]

export function getLevel(id: string) {
  return levels.find(level => level.id === id) ?? levels[0]
}
