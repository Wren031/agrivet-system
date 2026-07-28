import { apiFetch } from '../../../config/apiClient'

export interface AuthUser {
  id: string
  email: string
  name: string
  role: string
}

export interface LoginResult {
  accessToken: string
  refreshToken: string
  user: AuthUser
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const data = await apiFetch<{
    accessToken: string
    refreshToken: string
    user: { id: string; email: string; fullName: string; role: string }
  }>('/auth/admin/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

  const user: AuthUser = {
    id: data.user.id,
    email: data.user.email,
    name: data.user.fullName,
    role: data.user.role,
  }

  return {
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
    user,
  }
}

export async function logout(): Promise<void> {
  try {
    await apiFetch('/auth/logout', { method: 'POST' })
  } catch {

  }
}
