import { API_BASE_URL } from './api.config'

const TOKEN_KEY = 'auth_token'

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY)
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

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  if (!res.ok) {
    if (res.status === 401) {
      clearToken()
      localStorage.removeItem('auth_user')
      window.location.href = '/login'
      return undefined as T
    }
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
