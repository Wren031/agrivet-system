import { API_BASE_URL } from './api.config'

const TOKEN_KEY = 'auth_token'
const REFRESH_KEY = 'refresh_token'

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_KEY)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem('auth_user')
}

async function tryRefreshToken(): Promise<string | null> {
  const refresh = getRefreshToken()
  if (!refresh) return null

  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
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

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const token = getToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  let res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (res.status === 401) {
    const newToken = await tryRefreshToken()
    if (newToken) {
      headers['Authorization'] = `Bearer ${newToken}`
      res = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
      })
    } else {
      clearToken()
      window.location.href = '/login'
      return undefined as T
    }
  }

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.message || `Request failed (${res.status})`)
  }

  if (res.status === 204) return undefined as T
  return res.json()
}

export async function uploadFile(file: File): Promise<string> {
  const token = getToken()
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.message || 'Upload failed')
  }

  const data = await res.json()
  return data.url
}
