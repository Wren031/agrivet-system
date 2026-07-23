import { API_BASE_URL } from './api.config'

const REQUEST_MARKER = '_retry'
const MAX_RETRIES = 1

async function tryRefreshViaCookie(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
    return res.ok
  } catch {
    return false
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  let res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  if (res.status === 401 && !(options as any)[REQUEST_MARKER]) {
    const refreshed = await tryRefreshViaCookie()
    if (refreshed) {
      res = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        headers,
        credentials: 'include',
        [REQUEST_MARKER]: true,
      } as unknown as RequestInit & { [key: string]: boolean })
    } else {
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
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch(`${API_BASE_URL}/upload`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  })

  if (!res.ok) {
    const body = await res.json().catch(() => null)
    throw new Error(body?.message || 'Upload failed')
  }

  const data = await res.json()
  return data.url
}
