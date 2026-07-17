import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import { apiFetch } from '../../../config/apiClient'

const TOKEN_KEY = 'auth_token'
const REFRESH_KEY = 'refresh_token'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
}

interface AuthContextType {
  user: AuthUser | null
  loading: boolean
  signIn: (token: string, refreshToken: string, user: AuthUser) => void
  signOut: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem('auth_user')
}

export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY)
}

export async function fetchProfile(): Promise<AuthUser | null> {
  try {
    const data = await apiFetch<AuthUser>('/auth/profile')
    return data
  } catch {
    return null
  }
}

export async function refreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken()
  if (!refresh) return null

  try {
    const res = await fetch('http://localhost:3000/api/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: refresh }),
    })

    if (!res.ok) return null

    const data = await res.json()
    setToken(data.accessToken)
    return data.accessToken
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function init() {
      const token = getToken()
      if (!token) {
        setLoading(false)
        return
      }

      const profile = await fetchProfile()
      if (profile) {
        setUser(profile)
      } else {
        const newToken = await refreshAccessToken()
        if (newToken) {
          const profile = await fetchProfile()
          if (profile) {
            setUser(profile)
            setLoading(false)
            return
          }
        }
        clearToken()
      }
      setLoading(false)
    }

    init()
  }, [])

  const signIn = useCallback((token: string, refreshToken: string, userData: AuthUser) => {
    setToken(token)
    localStorage.setItem(REFRESH_KEY, refreshToken)
    localStorage.setItem('auth_user', JSON.stringify(userData))
    setUser(userData)
  }, [])

  const signOut = useCallback(() => {
    clearToken()
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
