import type { Order } from './types'

const STORAGE_KEY = 'inventory_orders'

const sampleItems = [
  { name: 'Paracetamol 500mg', quantity: 10, price: 12.50 },
  { name: 'Amoxicillin 250mg', quantity: 5, price: 25.00 },
  { name: 'Vitamin C 1000mg', quantity: 8, price: 8.75 },
  { name: 'Antibiotic Cream', quantity: 3, price: 45.00 },
  { name: 'Fish Oil Omega-3', quantity: 6, price: 22.50 },
]

function delay(ms = 400): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function generateItems() {
  const count = Math.floor(Math.random() * 3) + 1
  const picked = sampleItems.sort(() => Math.random() - 0.5).slice(0, count)
  return picked.map(item => ({ ...item }))
}

function getAll(): Order[] {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) {
    const customers = ['Green Fields Veterinary', 'Happy Pets Clinic', 'Farm Fresh Supplies']
    const agents = ['Maria Santos', 'Juan Dela Cruz', 'Ana Gonzales']
    const statuses: ('Pending' | 'Completed' | 'Cancelled')[] = ['Pending', 'Completed', 'Cancelled']
    const defaults: Order[] = Array.from({ length: 12 }).map((_, i) => {
      const items = generateItems()
      const totalAmount = items.reduce((sum, item) => sum + item.quantity * item.price, 0)
      return {
        id: `ORD-${String(i + 1).padStart(4, '0')}`,
        customerName: customers[i % customers.length],
        agentName: agents[i % agents.length],
        date: new Date(2026, 4, 15 + i).toISOString().split('T')[0],
        totalAmount: Math.round(totalAmount * 100) / 100,
        status: statuses[i % statuses.length],
        items,
      }
    })
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
    return defaults
  }
  const parsed: Order[] = JSON.parse(data)
  const needsMigration = parsed.some(o => !o.items)
  if (needsMigration) {
    const migrated = parsed.map(o => ({ ...o, items: o.items || [] }))
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated))
    return migrated
  }
  return parsed
}

export async function fetchOrders(): Promise<Order[]> {
  await delay()
  return getAll()
}

export async function fetchOrderById(id: string): Promise<Order | undefined> {
  await delay()
  return getAll().find(o => o.id === id)
}
