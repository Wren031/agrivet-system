import { useState, useEffect, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package, Mail, Lock, Loader2, ArrowRight, ShieldCheck, TrendingUp, Store } from 'lucide-react'
import { login } from '../services/authService'
import { useAuth } from '../context/AuthContext'
import { useApp } from '../../../context/AppContext'

const REMEMBER_KEY = 'remembered_email'

const highlights = [
  { icon: Store, label: 'Multi-branch inventory control' },
  { icon: TrendingUp, label: 'Real-time sales analytics' },
  { icon: ShieldCheck, label: 'Verified agent network' },
]

export default function LoginPage() {
  const { signIn } = useAuth()
  const { addNotification } = useApp()
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
      const result = await login(email, password)
      if (remember) {
        localStorage.setItem(REMEMBER_KEY, JSON.stringify({ email }))
      } else {
        localStorage.removeItem(REMEMBER_KEY)
      }
      signIn(result.user)
      addNotification({ message: `Welcome back, ${result.user.name}!`, type: 'success' })
      navigate('/')
    } catch (err: any) {
      setError(err.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full pl-10 pr-3.5 py-2.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-900/10 dark:focus:ring-white/10 focus:border-surface-400 dark:focus:border-surface-500 transition-all duration-150 placeholder:text-surface-400"

  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 flex">
      {/* Left: Branding */}
      <div className="hidden lg:flex w-1/2 bg-surface-900 dark:bg-black relative overflow-hidden">
        {/* Subtle grid texture (no shadows) */}
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
        <div className="relative flex flex-col justify-between p-12 w-full">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center">
              <Package size={18} className="text-surface-900" />
            </div>
            <span className="text-sm font-semibold text-white tracking-tight">Agrivet Supply</span>
          </div>

          <div className="max-w-md">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-surface-500 mb-4">Admin Console</p>
            <h1 className="text-3xl font-bold text-white tracking-tight leading-tight">
              Run your agricultural supply chain with confidence.
            </h1>
            <p className="text-surface-400 mt-4 text-sm leading-relaxed">
              Manage inventory, orders, branches, and field agents from one unified dashboard.
            </p>

            <ul className="mt-10 space-y-3.5">
              {highlights.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-md bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                    <Icon size={13} className="text-surface-300" />
                  </span>
                  <span className="text-[13px] text-surface-300">{label}</span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-[11px] text-surface-600">© {new Date().getFullYear()} Agrivet Supply. All rights reserved.</p>
        </div>
      </div>

      {/* Right: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 bg-white dark:bg-surface-950">
        <div className="w-full max-w-sm animate-fade-in-up">
          {/* Mobile brand */}
          <div className="flex lg:hidden items-center gap-2.5 mb-10">
            <div className="w-9 h-9 rounded-lg bg-surface-900 dark:bg-white flex items-center justify-center">
              <Package size={18} className="text-white dark:text-surface-900" />
            </div>
            <span className="text-sm font-semibold text-surface-900 dark:text-white tracking-tight">Agrivet Supply</span>
          </div>

          <div className="mb-8">
            <h1 className="text-xl font-semibold text-surface-900 dark:text-white tracking-tight">Welcome back</h1>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1.5">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3 animate-fade-in">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-surface-700 dark:text-surface-300">Email</label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                  className={inputClass} placeholder="admin@agrivet.com" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[13px] font-medium text-surface-700 dark:text-surface-300">Password</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  className={inputClass} placeholder="Enter your password" required />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" checked={remember} onChange={e => setRemember(e.target.checked)}
                  className="w-4 h-4 rounded border-surface-300 dark:border-surface-600 bg-white dark:bg-surface-800 text-surface-900 dark:text-surface-200 focus:ring-surface-900/20 dark:focus:ring-white/20 cursor-pointer" />
                <span className="text-[13px] text-surface-600 dark:text-surface-400">Remember me</span>
              </label>
              <button type="button"
                className="text-[13px] font-medium text-surface-900 dark:text-surface-200 hover:underline underline-offset-2 transition-colors">
                Forgot password?
              </button>
            </div>

            <button type="submit" disabled={loading}
              className="group w-full inline-flex items-center justify-center gap-2 py-2.5 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-lg hover:bg-surface-700 dark:hover:bg-surface-200 active:bg-surface-800 dark:active:bg-surface-300 transition-colors text-sm font-medium disabled:opacity-60 disabled:cursor-not-allowed">
              {loading ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
