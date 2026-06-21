import type { CarState, RectObstacle, TargetZone } from '@/lib/physics/types'

export type ParkingLevel = {
  id: string
  title: string
  category: 'basic' | 'shop' | 'yard' | 'parallel' | 'hard'
  difficulty: number
  intro: string
  goal: string
  skill: string
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
    skill: 'габариты и спокойная скорость',
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
    id: 'basic-reverse-straight',
    title: 'Задний ход по прямой',
    category: 'basic',
    difficulty: 1,
    skill: 'задний ход без паники',
    intro: 'Простое упражнение, чтобы не путаться при движении назад.',
    goal: 'Сдай назад между линиями и остановись в зоне.',
    start: { x: 5.8, y: 0, angle: 0, speed: 0, steeringAngle: 0, gear: 'R' },
    target: { x: -5.8, y: 0, width: 3.4, height: 2.4, angle: 0 },
    obstacles: [
      { id: 'line-top', type: 'curb', x: 0, y: 1.55, width: 12, height: .12, angle: 0 },
      { id: 'line-bottom', type: 'curb', x: 0, y: -1.55, width: 12, height: .12, angle: 0 }
    ],
    ideal: [{x:5.8,y:0},{x:3,y:0},{x:0,y:0},{x:-3,y:0},{x:-5.8,y:0}],
    tips: ['Едь медленно. На заднем ходу важна плавность.', 'Если синяя линия уходит в сторону — выровняй руль.']
  },
  {
    id: 'shop-front-parking',
    title: 'Парковка передом у магазина',
    category: 'shop',
    difficulty: 2,
    skill: 'поворот передом',
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
    skill: 'задний ход и момент поворота',
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
    id: 'shop-reverse-crooked-car',
    title: 'Задом между машинами, одна стоит криво',
    category: 'shop',
    difficulty: 4,
    skill: 'реальная парковка у магазина',
    intro: 'В жизни машины редко стоят идеально. Здесь одна соседняя машина стоит чуть криво.',
    goal: 'Заедь задом, не задев соседние машины.',
    start: { x: -5.0, y: -3.6, angle: 0.05, speed: 0, steeringAngle: 0, gear: 'R' },
    target: { x: 2.1, y: 2.35, width: 2.75, height: 5.2, angle: Math.PI / 2 },
    obstacles: [
      { id: 'car-crooked', type: 'car', x: -1.0, y: 2.3, width: 2.1, height: 4.7, angle: Math.PI/2 + 0.14 },
      { id: 'car-normal', type: 'car', x: 5.35, y: 2.4, width: 2.1, height: 4.7, angle: Math.PI/2 }
    ],
    ideal: [{x:-5,y:-3.6},{x:-2.1,y:-2.7},{x:.5,y:-.3},{x:2.1,y:2.35}],
    tips: ['Ориентируйся не только по линиям, но и по реальным машинам.', 'Следи за габаритным коридором около кривой машины.']
  },
  {
    id: 'parallel-curb-easy',
    title: 'Параллельная парковка у бордюра',
    category: 'parallel',
    difficulty: 4,
    skill: 'параллельная парковка',
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
  },
  {
    id: 'yard-tight-turn',
    title: 'Узкий двор и припаркованные машины',
    category: 'yard',
    difficulty: 4,
    skill: 'дворовые манёвры',
    intro: 'Дворовая ситуация: места мало, по бокам машины и бордюр.',
    goal: 'Аккуратно проедь двор и остановись в безопасной зоне.',
    start: { x: -6.2, y: -2.8, angle: 0.25, speed: 0, steeringAngle: 0, gear: 'D' },
    target: { x: 5.6, y: 2.35, width: 3.2, height: 2.6, angle: 0.15 },
    obstacles: [
      { id: 'yard-car-1', type: 'car', x: -1.9, y: -2.1, width: 4.7, height: 2.0, angle: 0.08 },
      { id: 'yard-car-2', type: 'car', x: 2.4, y: 1.4, width: 4.7, height: 2.0, angle: -0.08 },
      { id: 'trash', type: 'trash', x: 3.7, y: -2.3, width: 1.1, height: 1.1, angle: 0 }
    ],
    ideal: [{x:-6.2,y:-2.8},{x:-3.5,y:-1.2},{x:-.2,y:.2},{x:2.9,y:1.4},{x:5.6,y:2.35}],
    tips: ['Во дворе не надо быстро. Держи маленькую скорость.', 'Смотри на передний угол: при повороте его может вынести наружу.']
  },
  {
    id: 'hard-exit-tight-place',
    title: 'Выезд из тесного места',
    category: 'hard',
    difficulty: 5,
    skill: 'выезд вперёд-назад',
    intro: 'Ситуация: спереди и сзади машины. Нужно выехать несколькими спокойными движениями.',
    goal: 'Выехать из места, не задев машины и бордюр.',
    start: { x: 0, y: 1.6, angle: 0, speed: 0, steeringAngle: 0, gear: 'D' },
    target: { x: -5.7, y: -2.2, width: 3.5, height: 2.8, angle: -0.35 },
    obstacles: [
      { id: 'front-close', type: 'car', x: 3.7, y: 1.6, width: 4.7, height: 2.0, angle: 0 },
      { id: 'back-close', type: 'car', x: -3.7, y: 1.6, width: 4.7, height: 2.0, angle: 0 },
      { id: 'curb-tight', type: 'curb', x: 0, y: 3.05, width: 12, height: .28, angle: 0 }
    ],
    ideal: [{x:0,y:1.6},{x:.7,y:.4},{x:-.9,y:-.9},{x:-3.1,y:-1.8},{x:-5.7,y:-2.2}],
    tips: ['Если места мало, это нормально делать в несколько движений.', 'Не выкручивай руль резко на скорости. Лучше короткими манёврами.']
  }
]

export function getLevel(id: string) {
  return levels.find(level => level.id === id) ?? levels[0]
}
