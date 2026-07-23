import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { apiFetch } from '../../../config/apiClient'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (user: AuthUser) => void
  signOut: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export async function fetchProfile(): Promise<AuthUser | null> {
  try {
    const data = await apiFetch<AuthUser>('/auth/profile')
    return data
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const profile = await fetchProfile()
      if (profile) {
        setUser(profile)
      }
      setLoading(false)
    }
    init()
  }, [])

  const signIn = useCallback((userData: AuthUser) => {
    setUser(userData)
  }, [])

  const signOut = useCallback(async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' })
    } catch {
      // ignore logout errors
    }
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      signIn,
      signOut,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
