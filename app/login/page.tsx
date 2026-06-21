'use client'

import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@/components/shared/Button'
import { Card } from '@/components/shared/Card'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export default function LoginPage() {
  const [mode, setMode] = useState<'code' | 'email'>('code')
  const [code, setCode] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const enterByCode = () => {
    if (code.trim().toLowerCase() === (process.env.NEXT_PUBLIC_VIKA_CODE || 'vika').toLowerCase()) {
      localStorage.setItem('vika-parking-auth', 'true')
      window.location.href = '/dashboard'
    } else {
      setError('Код не подошёл. Проверь ещё раз 💛')
    }
  }

  const enterByEmail = async () => {
    if (!supabaseUrl || !supabaseKey) {
      setError('Supabase переменные пока не добавлены. Используй вход по коду.')
      return
    }
    const supabase = createClient(supabaseUrl, supabaseKey)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message)
    else window.location.href = '/dashboard'
  }

  return (
    <main className="min-h-screen bg-radialsoft px-4 py-8">
      <div className="mx-auto flex min-h-[calc(100vh-64px)] max-w-md items-center justify-center">
        <Card className="w-full">
          <h1 className="text-3xl font-semibold">Вход только для Вики 💛</h1>
          <p className="mt-3 text-soft">Это приложение сделано специально для тебя.</p>

          <div className="mt-6 grid grid-cols-2 rounded-2xl bg-white/8 p-1">
            <button onClick={() => setMode('code')} className={`rounded-xl py-2 text-sm ${mode === 'code' ? 'bg-white/15' : 'text-soft'}`}>Секретный код</button>
            <button onClick={() => setMode('email')} className={`rounded-xl py-2 text-sm ${mode === 'email' ? 'bg-white/15' : 'text-soft'}`}>Email</button>
          </div>

          {mode === 'code' ? (
            <div className="mt-5 space-y-3">
              <input value={code} onChange={e => setCode(e.target.value)} placeholder="Секретный код" className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 outline-none focus:border-pink" />
              <Button onClick={enterByCode} className="w-full">Открыть приложение</Button>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 outline-none focus:border-pink" />
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Пароль" className="w-full rounded-2xl border border-white/10 bg-white/8 px-4 py-3 outline-none focus:border-pink" />
              <Button onClick={enterByEmail} className="w-full">Войти</Button>
            </div>
          )}

          {error && <p className="mt-4 rounded-2xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</p>}
          <p className="mt-5 text-xs text-soft">По умолчанию код: <b>vika</b>. Потом можно поменять через `NEXT_PUBLIC_VIKA_CODE`.</p>
        </Card>
      </div>
    </main>
  )
}
