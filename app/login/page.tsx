'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import Link from 'next/link'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
const supabase = createClient(supabaseUrl, supabaseKey)

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) setError(error.message); else window.location.href = '/dashboard'
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4">
      <h1 className="text-2xl font-semibold">Вход только для Вики 💛</h1>
      <input
        className="bg-gray-800 px-4 py-2 rounded w-72"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="bg-gray-800 px-4 py-2 rounded w-72"
        placeholder="Пароль"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleLogin}
        className="bg-accent-violet px-8 py-2 rounded-full hover:opacity-90"
      >
        Войти
      </button>
      <Link href="/intro" className="text-sm text-gray-400 hover:text-white mt-2">← назад</Link>
    </div>
  )
}
