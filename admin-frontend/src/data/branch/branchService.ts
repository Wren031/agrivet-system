import type { Branch } from './types'

const STORAGE_KEY = 'agrivet_branches'

function delay(ms = 400) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getAll(): Branch[] {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) {
    const today = new Date()
    const defaults: Branch[] = [
      { id: crypto.randomUUID(), name: 'Main Branch', email: 'main@agrivet.com', address: '123 Main St, City', contactNumber: '09171234567', status: 'Active', date: today.toISOString().split('T')[0] },
      { id: crypto.randomUUID(), name: 'North Branch', email: 'north@agrivet.com', address: '456 North Ave, Town', contactNumber: '09179876543', status: 'Active', date: new Date(today.getTime() - 1 * 86400000).toISOString().split('T')[0] },
      { id: crypto.randomUUID(), name: 'South Branch', email: 'south@agrivet.com', address: '789 South Rd, Province', contactNumber: '09175678901', status: 'Inactive', date: new Date(today.getTime() - 3 * 86400000).toISOString().split('T')[0] },
      { id: crypto.randomUUID(), name: 'East Branch', email: 'east@agrivet.com', address: '321 East St, City', contactNumber: '09173456789', status: 'Active', date: new Date(today.getTime() - 7 * 86400000).toISOString().split('T')[0] },
      { id: crypto.randomUUID(), name: 'West Branch', email: 'west@agrivet.com', address: '654 West Blvd, Town', contactNumber: '09171230987', status: 'Inactive', date: new Date(today.getTime() - 14 * 86400000).toISOString().split('T')[0] },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
    return defaults
  }
  const parsed: Branch[] = JSON.parse(data)
  const needsMigration = parsed.some(b => !b.date)
  if (needsMigration) {
    const today = new Date()
    const migrated = parsed.map((b, i) => ({
      ...b,
      date: b.date || new Date(today.getTime() - i * 86400000).toISOString().split('T')[0]
    }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated))
    return migrated
  }
  return parsed
}

export async function fetchBranches(): Promise<Branch[]> {
  await delay()
  return getAll()
}

export async function createBranch(branch: Omit<Branch, 'id'>): Promise<Branch> {
  await delay()
  const items = getAll()
  const newBranch: Branch = { ...branch, id: crypto.randomUUID(), date: branch.date || new Date().toISOString().split('T')[0] }
  items.push(newBranch)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  return newBranch
}

export async function updateBranch(id: string, updates: Partial<Branch>): Promise<Branch> {
  await delay(300)
  const items = getAll()
  const index = items.findIndex(b => b.id === id)
  if (index === -1) throw new Error('Branch not found')
  items[index] = { ...items[index], ...updates }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  return items[index]
}

export async function deleteBranch(id: string): Promise<void> {
  await delay()
  const items = getAll().filter(b => b.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}
