import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Package } from 'lucide-react'
import { login } from '../services/authService'
import { useApp } from '../../../context/AppContext'

export default function LoginPage() {
  const { setUser, addNotification } = useApp()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const u = await login(email, password)
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
    <div className="min-h-screen bg-white dark:bg-surface-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-surface-900 dark:bg-white mb-5">
            <Package size={24} className="text-white dark:text-surface-900" />
          </div>
          <h1 className="text-lg font-semibold text-surface-900 dark:text-white">Sign in to your account</h1>
          <p className="text-sm text-surface-400 dark:text-surface-500 mt-1.5">Enter your credentials to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 text-sm rounded-lg px-4 py-3">{error}</div>
          )}
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-400 dark:focus:ring-surface-500 focus:border-surface-400 dark:focus:border-surface-500 transition-all duration-150 placeholder:text-surface-400" placeholder="admin@agrivet.com" required />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-surface-700 dark:text-surface-300">Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-900 dark:text-surface-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-400 dark:focus:ring-surface-500 focus:border-surface-400 dark:focus:border-surface-500 transition-all duration-150 placeholder:text-surface-400" placeholder="Enter your password" required />
          </div>
          <button type="submit" disabled={loading}
            className="w-full py-2.5 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-lg hover:bg-surface-700 dark:hover:bg-surface-200 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
