'use client'

import { useEffect, useState } from 'react'

const compliments = [
  "Илья, ты сегодня выглядишь подозрительно хорошо.",
  "Илья, у тебя вайб человека, который может зайти в комнату и сразу стать главным мемом вечера.",
  "Илья, ты редкий экземпляр: вроде обычный человек, а настроение поднимаешь как отдельный праздник.",
  "Илья, с тобой даже самая тупая идея почему-то начинает казаться гениальной.",
  "secret-envelope"
]

const icons = ['😎', '✨', '🫡', '🔥', '✉️']

export default function HomePage() {
  const [index, setIndex] = useState(0)
  const [opened, setOpened] = useState<number[]>([])
  const [envelopeOpen, setEnvelopeOpen] = useState(false)

  const isEnvelope = index === compliments.length - 1
  const compliment = compliments[index]
  const progress = ((index + 1) / compliments.length) * 100
  const animationClass = `anim${index % 5}`

  useEffect(() => {
    const saved = localStorage.getItem('ilya-compliment-index')
    if (saved) {
      const value = Number(saved)
      if (!Number.isNaN(value) && value >= 0 && value < compliments.length) {
        setIndex(value)
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('ilya-compliment-index', String(index))
    setOpened((items) => Array.from(new Set([...items, index])))
    setEnvelopeOpen(false)
  }, [index])

  const next = () => setIndex((value) => (value + 1) % compliments.length)

  const random = () => {
    let nextIndex = Math.floor(Math.random() * compliments.length)
    if (nextIndex === index) nextIndex = (nextIndex + 1) % compliments.length
    setIndex(nextIndex)
  }

  const restart = () => {
    setIndex(0)
    setOpened([])
    setEnvelopeOpen(false)
    localStorage.removeItem('ilya-compliment-index')
  }

  return (
    <main className="app">
      <div className="decor" aria-hidden="true">
        <span>😎</span>
        <span>✦</span>
        <span>🔥</span>
        <span>✉️</span>
        <span>🫡</span>
        <span>✧</span>
      </div>

      <div className="wrap">
        <header className="top">
          <div className="brand">
            <strong>5 комплиментов для Ильи</strong>
            <span>маленькое промо с финальным сюрпризом</span>
          </div>
          <div className="counter">{opened.length} открыто</div>
        </header>

        <section className="center">
          <div className="content">
            <article key={index} className={`card ${animationClass}`}>
              {isEnvelope ? (
                <div className="envelopeStage">
                  <p className="kicker">последний комплимент / 5</p>
                  <div className="envelopeScene">
                    <div
                      className={`envelope ${envelopeOpen ? 'open' : ''}`}
                      onClick={() => setEnvelopeOpen(true)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter' || event.key === ' ') setEnvelopeOpen(true)
                      }}
                    >
                      <div className="letter">{envelopeOpen ? 'иди нахуй' : 'Открой'}</div>
                      <div className="envelopeBack" />
                      <div className="flap" />
                      <div className="envelopeFront" />
                    </div>
                  </div>
                  <div className="tapHint">
                    {envelopeOpen ? 'ну вот, теперь видно нормально' : 'нажми на конверт'}
                  </div>
                </div>
              ) : (
                <>
                  <div className="icon">{icons[index % icons.length]}</div>
                  <p className="kicker">комплимент {index + 1} / {compliments.length}</p>
                  <h1 className="text">{compliment}</h1>
                </>
              )}
            </article>

            <div className="progressWrap">
              <div className="progress">
                <div className="progressInner" style={{ width: `${progress}%` }} />
              </div>

              <div className="actions">
                <button className="btn btnPrimary" onClick={next}>
                  {index === compliments.length - 1 ? 'Начать заново' : 'Дальше'} →
                </button>
                <button className="btn btnGhost" onClick={random}>Случайный</button>
                <button className="btn btnGhost" onClick={restart}>Сначала</button>
              </div>
            </div>
          </div>
        </section>

        <footer className="footer">
          <span>✉️ сделано специально для Ильи</span>
        </footer>
      </div>
    </main>
  )
}
