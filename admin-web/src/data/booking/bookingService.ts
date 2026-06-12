import type { Booking, BookingItem } from './types'

const STORAGE_KEY = 'agrivet_bookings'

const sampleItems: BookingItem[] = [
  { name: 'Paracetamol 500mg', quantity: 10, price: 12.50 },
  { name: 'Amoxicillin 250mg', quantity: 5, price: 25.00 },
  { name: 'Vitamin C 1000mg', quantity: 8, price: 8.75 },
  { name: 'Antibiotic Cream', quantity: 3, price: 45.00 },
  { name: 'Fish Oil Omega-3', quantity: 6, price: 22.50 },
  { name: 'Multivitamin Syrup', quantity: 4, price: 35.00 },
  { name: 'Probiotic Powder', quantity: 7, price: 18.00 },
]

function delay(ms = 400) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function pickItems(): BookingItem[] {
  const count = Math.floor(Math.random() * 3) + 1
  const picked = [...sampleItems].sort(() => Math.random() - 0.5).slice(0, count)
  return picked.map(item => ({ ...item }))
}

function getAll(): Booking[] {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) {
    const today = new Date()
    const defaults: Booking[] = [
      {
        id: crypto.randomUUID(), customer: 'Juan Dela Cruz', agent: 'Maria Santos',
        date: today.toISOString().split('T')[0], amount: 15000, status: 'Completed',
        items: pickItems(),
      },
      {
        id: crypto.randomUUID(), customer: 'Pedro Reyes', agent: 'Jose Garcia',
        date: new Date(today.getTime() - 1 * 86400000).toISOString().split('T')[0],
        amount: 8200, status: 'Pending', items: pickItems(),
      },
      {
        id: crypto.randomUUID(), customer: 'Ana Gonzales', agent: 'Maria Santos',
        date: new Date(today.getTime() - 2 * 86400000).toISOString().split('T')[0],
        amount: 23400, status: 'Completed', items: pickItems(),
      },
      {
        id: crypto.randomUUID(), customer: 'Carlos Lopez', agent: 'Ana Martinez',
        date: new Date(today.getTime() - 4 * 86400000).toISOString().split('T')[0],
        amount: 5600, status: 'Cancelled', items: pickItems(),
      },
      {
        id: crypto.randomUUID(), customer: 'Rosa Villanueva', agent: 'Jose Garcia',
        date: new Date(today.getTime() - 7 * 86400000).toISOString().split('T')[0],
        amount: 12400, status: 'Pending', items: pickItems(),
      },
      {
        id: crypto.randomUUID(), customer: 'Miguel Tan', agent: 'Maria Santos',
        date: new Date(today.getTime() - 14 * 86400000).toISOString().split('T')[0],
        amount: 31000, status: 'Completed', items: pickItems(),
      },
      {
        id: crypto.randomUUID(), customer: 'Sofia Reyes', agent: 'Ana Martinez',
        date: new Date(today.getTime() - 20 * 86400000).toISOString().split('T')[0],
        amount: 9800, status: 'Completed', items: pickItems(),
      },
      {
        id: crypto.randomUUID(), customer: 'Ben Torres', agent: 'Maria Santos',
        date: new Date(today.getTime() - 30 * 86400000).toISOString().split('T')[0],
        amount: 17500, status: 'Cancelled', items: pickItems(),
      },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
    return defaults
  }
  return JSON.parse(data)
}

export async function fetchBookings(): Promise<Booking[]> {
  await delay()
  return getAll()
}

export async function fetchBookingById(id: string): Promise<Booking | undefined> {
  await delay(300)
  return getAll().find(b => b.id === id)
}

export async function createBooking(booking: Omit<Booking, 'id' | 'items'> & { items?: BookingItem[] }): Promise<Booking> {
  await delay()
  const items = getAll()
  const newBooking: Booking = {
    ...booking,
    id: crypto.randomUUID(),
    items: booking.items || [],
  }
  items.push(newBooking)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  return newBooking
}

export async function updateBooking(id: string, updates: Partial<Booking>): Promise<Booking> {
  await delay()
  const items = getAll()
  const index = items.findIndex(b => b.id === id)
  if (index === -1) throw new Error('Booking not found')
  items[index] = { ...items[index], ...updates }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  return items[index]
}

export async function deleteBooking(id: string): Promise<void> {
  await delay()
  const items = getAll().filter(b => b.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}
