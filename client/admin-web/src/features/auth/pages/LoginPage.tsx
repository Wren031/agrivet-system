import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Mail, Lock } from 'lucide-react'
import { login } from '../services/authService'
import { useApp } from '../../../context/AppContext'

const REMEMBER_KEY = 'remembered_email'

export default function LoginPage() {
  const { setUser, addNotification } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(REMEMBER_KEY)
    if (saved) {
      try {
        const { email: savedEmail } = JSON.parse(saved)
        setEmail(savedEmail || '')
        setRemember(true)
      } catch { /* ignore */ }
    }
  }, [])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const u = await login(email, password)
      if (remember) {
        localStorage.setItem(REMEMBER_KEY, JSON.stringify({ email }))
      } else {
        localStorage.removeItem(REMEMBER_KEY)
      }
      setUser(u)
      addNotification({ message: `Welcome back, ${u.name}!`, type: 'success' })
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 flex">
      {/* Left: Branding */}
      <div className="hidden lg:flex w-1/2 bg-surface-900 dark:bg-black items-center justify-center p-12">
        <div className="text-center max-w-sm">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-white/10 mb-8">
            <Package size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Agrivet</h1>
          <p className="text-surface-400 mt-3 text-sm leading-relaxed">
            Streamline your agricultural supply chain. Manage inventory, orders, and deliveries with ease.
          </p>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <div className="mb-10">
            <h1 className="text-xl font-bold text-surface-900 dark:text-white">Welcome back</h1>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1.5">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">{error}</div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-900/20 dark:focus:ring-white/20 focus:border-surface-900 dark:focus:border-surface-500 transition-all duration-150 placeholder:text-surface-400" placeholder="admin@agrivet.com" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-900/20 dark:focus:ring-white/20 focus:border-surface-900 dark:focus:border-surface-500 transition-all duration-150 placeholder:text-surface-400" placeholder="Enter your password" required />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-200 focus:ring-surface-900/20 dark:focus:ring-white/20 cursor-pointer" />
                <span className="text-sm text-surface-600 dark:text-surface-400">Remember me</span>
              </label>
              <button type="button"
                className="text-sm font-medium text-surface-900 dark:text-surface-200 hover:underline transition-colors">
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-2.5 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-lg hover:bg-surface-800 dark:hover:bg-surface-200 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
