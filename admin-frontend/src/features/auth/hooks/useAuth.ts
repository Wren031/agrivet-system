import { useState, useCallback } from 'react'
import { login, logout, getStoredUser, isAuthenticated, type AuthUser } from '../services/authService'

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(getStoredUser)
  const [authenticated, setAuthenticated] = useState(isAuthenticated())
  const [loading, setLoading] = useState(false)

  const signIn = useCallback(async (email: string, password: string) => {
    setLoading(true)
    try {
      const u = await login(email, password)
      setUser(u)
      setAuthenticated(true)
      setLoading(false)
      return u
    } catch (err) {
      setLoading(false)
      throw err
    }
  }, [])

  const signOut = useCallback(async () => {
    await logout()
    setUser(null)
    setAuthenticated(false)
  }, [])

  return { user, authenticated, loading, signIn, signOut }
}
