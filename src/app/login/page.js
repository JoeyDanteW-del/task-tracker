'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setErrorMsg(error.message)
    } else {
      router.push('/tasks')
    }
    setLoading(false)
  }

  async function handleSignUp(e) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setErrorMsg(error.message)
    } else {
      setErrorMsg('Success! Check your email to confirm your account, then log in.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F1C2E] px-4">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold text-[#0F1C2E] mb-6 text-center">
          Task Tracker
        </h1>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F6E56]"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#0F6E56]"
              required
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-red-600">{errorMsg}</p>
          )}

          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="bg-[#0F6E56] text-white rounded-md py-2 font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Please wait...' : 'Log In'}
            </button>

            <button
              onClick={handleSignUp}
              disabled={loading}
              className="bg-[#F5A623] text-[#0F1C2E] rounded-md py-2 font-medium hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? 'Please wait...' : 'Sign Up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}