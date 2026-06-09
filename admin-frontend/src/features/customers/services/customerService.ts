import type { Customer } from './types'

const STORAGE_KEY = 'inventory_customers'

function delay(ms = 400): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getAll(): Customer[] {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) {
    const defaults: Customer[] = [
      { id: crypto.randomUUID(), name: 'Green Fields Veterinary', contactPerson: 'Dr. Reyes', email: 'greenfields@email.com', phone: '02-1234-5678', totalOrders: 15, status: 'Active' },
      { id: crypto.randomUUID(), name: 'Happy Pets Clinic', contactPerson: 'Dr. Tan', email: 'happypets@email.com', phone: '02-2345-6789', totalOrders: 8, status: 'Active' },
      { id: crypto.randomUUID(), name: 'Farm Fresh Supplies', contactPerson: 'Mr. Cruz', email: 'farmfresh@email.com', phone: '02-3456-7890', totalOrders: 23, status: 'Active' },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
    return defaults
  }
  return JSON.parse(data)
}

export async function fetchCustomers(): Promise<Customer[]> {
  await delay()
  return getAll()
}

export async function createCustomer(customer: Omit<Customer, 'id'>): Promise<Customer> {
  await delay()
  const items = getAll()
  const newCustomer: Customer = { ...customer, id: crypto.randomUUID() }
  items.push(newCustomer)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  return newCustomer
}

export async function updateCustomer(id: string, updates: Partial<Customer>): Promise<Customer> {
  await delay()
  const items = getAll()
  const index = items.findIndex(c => c.id === id)
  if (index === -1) throw new Error('Customer not found')
  items[index] = { ...items[index], ...updates }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  return items[index]
}

export async function deleteCustomer(id: string): Promise<void> {
  await delay()
  const items = getAll().filter(c => c.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}
