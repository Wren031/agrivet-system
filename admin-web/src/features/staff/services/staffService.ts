import type { Staff } from './types'

const STORAGE_KEY = 'inventory_staff'

function delay(ms = 400): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getAll(): Staff[] {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) {
    const defaults: Staff[] = [
      { id: crypto.randomUUID(), fullName: 'Juan Dela Cruz', email: 'juan@agrivet.com', contactNo: '0917-123-4567', password: 'password123' },
      { id: crypto.randomUUID(), fullName: 'Maria Santos', email: 'maria@agrivet.com', contactNo: '0918-234-5678', password: 'password123' },
      { id: crypto.randomUUID(), fullName: 'Pedro Reyes', email: 'pedro@agrivet.com', contactNo: '0919-345-6789', password: 'password123' },
      { id: crypto.randomUUID(), fullName: 'Ana Gonzales', email: 'ana@agrivet.com', contactNo: '0920-456-7890', password: 'password123' },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
    return defaults
  }
  const parsed = JSON.parse(data)
  if (parsed.length > 0 && !('email' in parsed[0])) {
    const migrated = parsed.map((s: Record<string, string>) => ({
      id: s.id,
      fullName: s.fullName || s.name || '',
      email: s.email || s.username || s.name?.toLowerCase().replace(/\s/g, '') + '@agrivet.com' || '',
      contactNo: s.contactNo || s.phone || '',
      password: s.password || 'password123',
    }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated))
    return migrated
  }
  return parsed
}

export async function fetchStaff(): Promise<Staff[]> {
  await delay()
  return getAll()
}

export async function createStaff(staff: Omit<Staff, 'id'>): Promise<Staff> {
  await delay()
  const items = getAll()
  const newStaff: Staff = { ...staff, id: crypto.randomUUID() }
  items.push(newStaff)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  return newStaff
}

export async function updateStaff(id: string, updates: Partial<Staff>): Promise<Staff> {
  await delay()
  const items = getAll()
  const index = items.findIndex(s => s.id === id)
  if (index === -1) throw new Error('Staff not found')
  items[index] = { ...items[index], ...updates }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  return items[index]
}

export async function deleteStaff(id: string): Promise<void> {
  await delay()
  const items = getAll().filter(s => s.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}
