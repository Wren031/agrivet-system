const AUTH_KEY = 'auth_user'

export interface AuthUser {
  email: string
  name: string
}

const VALID_CREDENTIALS = {
  email: 'admin@agrivet.com',
  password: 'admin123',
}

function delay(ms = 500): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function login(email: string, password: string): Promise<AuthUser> {
  await delay()
  if (email === VALID_CREDENTIALS.email && password === VALID_CREDENTIALS.password) {
    const user: AuthUser = { email, name: 'Admin' }
    localStorage.setItem(AUTH_KEY, JSON.stringify(user))
    return user
  }
  throw new Error('Invalid email or password')
}

export async function logout(): Promise<void> {
  await delay(200)
  localStorage.removeItem(AUTH_KEY)
}

export function getStoredUser(): AuthUser | null {
  const data = localStorage.getItem(AUTH_KEY)
  return data ? JSON.parse(data) : null
}

export function isAuthenticated(): boolean {
  return !!localStorage.getItem(AUTH_KEY)
}
