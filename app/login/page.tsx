'use client'

import { useState } from 'react'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'

export default function LoginPage() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')

  const enterByCode = () => {
    if (code.trim().toLowerCase() === (process.env.NEXT_PUBLIC_VIKA_CODE || 'vika').toLowerCase()) {
      localStorage.setItem('vika-parking-auth', 'true')
      window.location.href = '/dashboard'
    } else {
      setError('Код не подошёл. Попробуй ещё раз 💛')
    }
  }

  return (
    <main className="min-h-screen bg-radialsoft px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-md items-center justify-center">
        <Card className="w-full">
          <h1 className="text-4xl font-semibold leading-tight">Вход только для Вики 💛</h1>
          <p className="mt-3 text-soft">Введи секретный код, чтобы открыть приложение.</p>

          <div className="mt-7 space-y-4">
            <input
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="Секретный код"
              className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-4 text-lg outline-none transition focus:border-pink"
              onKeyDown={(e) => {
                if (e.key === 'Enter') enterByCode()
              }}
            />

            <Button onClick={enterByCode} className="w-full">
              Открыть приложение
            </Button>
          </div>

          {error && (
            <p className="mt-4 rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
              {error}
            </p>
          )}
        </Card>
      </div>
    </main>
  )
}
