import type { Agent } from './types'

const STORAGE_KEY = 'inventory_agents'

function delay(ms = 400): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getAll(): Agent[] {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) {
    const defaults: Agent[] = [
      { id: crypto.randomUUID(), name: 'Maria Santos', email: 'maria@agrivet.com', phone: '0917-123-4567', region: 'NCR', status: 'Active' },
      { id: crypto.randomUUID(), name: 'Juan Dela Cruz', email: 'juan@agrivet.com', phone: '0918-234-5678', region: 'Region III', status: 'Active' },
      { id: crypto.randomUUID(), name: 'Ana Gonzales', email: 'ana@agrivet.com', phone: '0919-345-6789', region: 'Region IV-A', status: 'Inactive' },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
    return defaults
  }
  return JSON.parse(data)
}

export async function fetchAgents(): Promise<Agent[]> {
  await delay()
  return getAll()
}

export async function createAgent(agent: Omit<Agent, 'id'>): Promise<Agent> {
  await delay()
  const items = getAll()
  const newAgent: Agent = { ...agent, id: crypto.randomUUID() }
  items.push(newAgent)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  return newAgent
}

export async function updateAgent(id: string, updates: Partial<Agent>): Promise<Agent> {
  await delay()
  const items = getAll()
  const index = items.findIndex(a => a.id === id)
  if (index === -1) throw new Error('Agent not found')
  items[index] = { ...items[index], ...updates }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  return items[index]
}

export async function deleteAgent(id: string): Promise<void> {
  await delay()
  const items = getAll().filter(a => a.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}
