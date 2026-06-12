import { apiFetch, setToken, clearToken } from '../../../config/apiClient'

export interface AuthUser {
  email: string
  name: string
}

const AUTH_KEY = 'auth_user'
const TOKEN_KEY = 'auth_token'

function storeUser(user: AuthUser) {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user))
}

function removeUser() {
  localStorage.removeItem(AUTH_KEY)
}

export async function login(email: string, password: string): Promise<AuthUser> {
  const data = await apiFetch<{ accessToken: string; user: AuthUser }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  setToken(data.accessToken)
  storeUser(data.user)
  return data.user
}

export async function logout(): Promise<void> {
  try {
    await apiFetch('/auth/logout', { method: 'POST' })
  } catch {
    // ignore logout errors
  }
  clearToken()
  removeUser()
}

export function getStoredUser(): AuthUser | null {
  const data = localStorage.getItem(AUTH_KEY)
  return data ? JSON.parse(data) : null
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem(TOKEN_KEY)
}
