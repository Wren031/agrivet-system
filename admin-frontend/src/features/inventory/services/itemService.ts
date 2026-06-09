import type { Item } from './types'

const STORAGE_KEY = 'inventory_products'

function delay(ms = 400): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getDefaults(): Item[] {
  return [

    ]
}

function getAll(): Item[] {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) {
    const defaults = getDefaults()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
    return defaults
  }
  try {
    return JSON.parse(data) as Item[]
  } catch {
    const defaults = getDefaults()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
    return defaults
  }
}

export async function fetchItems(): Promise<Item[]> {
  await delay()
  return getAll()
}

export async function createItem(item: Omit<Item, 'id' | 'createdAt'>): Promise<Item> {
  await delay()
  const items = getAll()
  const newItem: Item = { ...item, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
  items.push(newItem)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  return newItem
}

export async function updateItem(id: string, updates: Partial<Item>): Promise<Item> {
  await delay()
  const items = getAll()
  const index = items.findIndex(p => p.id === id)
  if (index === -1) throw new Error('Item not found')
  items[index] = { ...items[index], ...updates }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  return items[index]
}

export async function deleteItem(id: string): Promise<void> {
  await delay()
  const items = getAll().filter(p => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}
