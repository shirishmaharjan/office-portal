'use client'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'

export default function Login() {
  const [email, setEmail] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) alert(error.message)
    else alert('Check your email for the login link!')
  }

  return (
    <div className="p-10 max-w-sm mx-auto">
      <h1 className="text-xl font-bold mb-4">Staff Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input className="w-full p-2 border" type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Send Login Link</button>
      </form>
    </div>
  )
}