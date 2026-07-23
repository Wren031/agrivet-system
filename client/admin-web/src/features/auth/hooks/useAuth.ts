import { useState, useCallback } from 'react'
import { login, type AuthUser } from '../services/authService'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [loading, setLoading] = useState(false)

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const result = await login(email, password)
      setUser(result.user)
      setAuthenticated(true)
      setLoading(false)
      return result.user
    } catch (err) {
      setLoading(false)
      throw err
    }
  }, [])

  const signOut = useCallback(async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' })
    } catch {}
    setUser(null)
    setAuthenticated(false)
  }, [])

  return { user, authenticated, loading, signIn, signOut }
}
