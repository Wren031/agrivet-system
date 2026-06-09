import type { Product } from './types'

const STORAGE_KEY = 'inventory_products'

function delay(ms = 400): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getAll(): Product[] {
  const data = localStorage.getItem(STORAGE_KEY)
  if (!data) {
    const defaults: Product[] = [
      { id: crypto.randomUUID(), name: 'Paracetamol 500mg', sku: 'MED-001', category: 'Medicines', price: 12.50, stock: 150, image: 'https://placehold.co/100x100/eee/999?text=MED', createdAt: new Date().toISOString() },
      { id: crypto.randomUUID(), name: 'Amoxicillin 250mg', sku: 'MED-002', category: 'Medicines', price: 25.00, stock: 80, image: 'https://placehold.co/100x100/eee/999?text=MED', createdAt: new Date().toISOString() },
      { id: crypto.randomUUID(), name: 'Vitamin C 1000mg', sku: 'SUP-001', category: 'Supplements', price: 8.75, stock: 200, image: 'https://placehold.co/100x100/eee/999?text=SUP', createdAt: new Date().toISOString() },
      { id: crypto.randomUUID(), name: 'Multivitamins', sku: 'SUP-002', category: 'Supplements', price: 15.00, stock: 5, image: 'https://placehold.co/100x100/eee/999?text=SUP', createdAt: new Date().toISOString() },
      { id: crypto.randomUUID(), name: 'Antibiotic Cream', sku: 'TOP-001', category: 'Topicals', price: 45.00, stock: 30, image: 'https://placehold.co/100x100/eee/999?text=TOP', createdAt: new Date().toISOString() },
      { id: crypto.randomUUID(), name: 'Cough Syrup', sku: 'MED-003', category: 'Medicines', price: 35.00, stock: 3, image: 'https://placehold.co/100x100/eee/999?text=MED', createdAt: new Date().toISOString() },
      { id: crypto.randomUUID(), name: 'Ibuprofen 200mg', sku: 'MED-004', category: 'Medicines', price: 18.00, stock: 120, image: 'https://placehold.co/100x100/eee/999?text=MED', createdAt: new Date().toISOString() },
      { id: crypto.randomUUID(), name: 'Fish Oil Omega-3', sku: 'SUP-003', category: 'Supplements', price: 22.50, stock: 45, image: 'https://placehold.co/100x100/eee/999?text=SUP', createdAt: new Date().toISOString() },
    ]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults))
    return defaults
  }
  return JSON.parse(data)
}

export async function fetchProducts(): Promise<Product[]> {
  await delay()
  return getAll()
}

export async function createProduct(product: Omit<Product, 'id' | 'createdAt'>): Promise<Product> {
  await delay()
  const items = getAll()
  const newProduct: Product = { ...product, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
  items.push(newProduct)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  return newProduct
}

export async function updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
  await delay()
  const items = getAll()
  const index = items.findIndex(p => p.id === id)
  if (index === -1) throw new Error('Product not found')
  items[index] = { ...items[index], ...updates }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  return items[index]
}

export async function deleteProduct(id: string): Promise<void> {
  await delay()
  const items = getAll().filter(p => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}
