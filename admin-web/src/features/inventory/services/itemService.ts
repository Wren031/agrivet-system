import type { Item } from './types'

const STORAGE_KEY = 'inventory_products'

function delay(ms = 400): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getDefaults(): Item[] {
  return [
    { id: crypto.randomUUID(), name: 'B-Meg Chick Booster 50kg', sku: 'FED-001', category: 'Feeds & Nutrition', subcategory: 'Poultry', packagingUnit: '50kg Bag', expiryDate: null, reorderLevel: 10, price: 1450.00, stock: 40, image: 'https://placehold.co/100x100/eee/999?text=FEED', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Hog Finisher Pellets 50kg', sku: 'FED-002', category: 'Feeds & Nutrition', subcategory: 'Swine/Hog', packagingUnit: '50kg Bag', expiryDate: null, reorderLevel: 8, price: 1520.00, stock: 25, image: 'https://placehold.co/100x100/eee/999?text=FEED', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Poultry Layer Pellets 50kg', sku: 'FED-003', category: 'Feeds & Nutrition', subcategory: 'Poultry', packagingUnit: '50kg Bag', expiryDate: null, reorderLevel: 15, price: 1420.00, stock: 30, image: 'https://placehold.co/100x100/eee/999?text=FEED', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Gamefowl Starter Crumble 25kg', sku: 'FED-004', category: 'Feeds & Nutrition', subcategory: 'Gamefowl', packagingUnit: '25kg Bag', expiryDate: null, reorderLevel: 5, price: 980.00, stock: 12, image: 'https://placehold.co/100x100/eee/999?text=FEED', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Dog Adult Maintenance 20kg', sku: 'FED-005', category: 'Feeds & Nutrition', subcategory: 'Pet/Specialty', packagingUnit: '20kg Bag', expiryDate: null, reorderLevel: 5, price: 2200.00, stock: 8, image: 'https://placehold.co/100x100/eee/999?text=FEED', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Fish Floating Pellets 25kg', sku: 'FED-006', category: 'Feeds & Nutrition', subcategory: 'Aqua', packagingUnit: '25kg Bag', expiryDate: null, reorderLevel: 10, price: 1100.00, stock: 18, image: 'https://placehold.co/100x100/eee/999?text=FEED', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Amoxicillin Soluble Powder 1kg', sku: 'VET-001', category: 'Veterinary Drugs & Biologics', subcategory: 'Antibiotics', packagingUnit: '1kg Retail Pack', expiryDate: '2026-08-15', reorderLevel: 5, price: 1200.00, stock: 8, image: 'https://placehold.co/100x100/eee/999?text=VET', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Enrofloxacin Injection 100ml', sku: 'VET-002', category: 'Veterinary Drugs & Biologics', subcategory: 'Antibiotics', packagingUnit: '100ml Vial', expiryDate: '2026-07-01', reorderLevel: 5, price: 680.00, stock: 3, image: 'https://placehold.co/100x100/eee/999?text=VET', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Multivitamin Soluble Powder 500g', sku: 'VET-003', category: 'Veterinary Drugs & Biologics', subcategory: 'Vitamins/Supplements', packagingUnit: '500g Sachet', expiryDate: '2026-12-20', reorderLevel: 10, price: 175.00, stock: 60, image: 'https://placehold.co/100x100/eee/999?text=VET', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Vitamin AD3E Injectable 100ml', sku: 'VET-004', category: 'Veterinary Drugs & Biologics', subcategory: 'Vitamins/Supplements', packagingUnit: '100ml Vial', expiryDate: '2026-09-10', reorderLevel: 5, price: 320.00, stock: 12, image: 'https://placehold.co/100x100/eee/999?text=VET', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Fenbendazole Dewormer 100g', sku: 'VET-005', category: 'Veterinary Drugs & Biologics', subcategory: 'Dewormers', packagingUnit: '100g Sachet', expiryDate: '2026-06-01', reorderLevel: 8, price: 250.00, stock: 20, image: 'https://placehold.co/100x100/eee/999?text=VET', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Ivermectin 1% Injection 100ml', sku: 'VET-006', category: 'Veterinary Drugs & Biologics', subcategory: 'Ectoparasiticides', packagingUnit: '100ml Vial', expiryDate: '2026-05-15', reorderLevel: 5, price: 850.00, stock: 4, image: 'https://placehold.co/100x100/eee/999?text=VET', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Complete Fertilizer 14-14-14 50kg', sku: 'AGR-001', category: 'Agricultural Inputs', subcategory: 'Fertilizers', packagingUnit: '50kg Bag', expiryDate: null, reorderLevel: 10, price: 1800.00, stock: 22, image: 'https://placehold.co/100x100/eee/999?text=AGR', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Urea Fertilizer 46-0-0 50kg', sku: 'AGR-002', category: 'Agricultural Inputs', subcategory: 'Fertilizers', packagingUnit: '50kg Bag', expiryDate: null, reorderLevel: 10, price: 1600.00, stock: 15, image: 'https://placehold.co/100x100/eee/999?text=AGR', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Glyphosate Herbicide 1L', sku: 'AGR-003', category: 'Agricultural Inputs', subcategory: 'Crop Protection/Chemicals', packagingUnit: '1L Bottle', expiryDate: '2027-01-10', reorderLevel: 8, price: 480.00, stock: 30, image: 'https://placehold.co/100x100/eee/999?text=AGR', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Mancozeb Fungicide 1kg', sku: 'AGR-004', category: 'Agricultural Inputs', subcategory: 'Crop Protection/Chemicals', packagingUnit: '1kg Retail Pack', expiryDate: '2026-10-05', reorderLevel: 5, price: 520.00, stock: 14, image: 'https://placehold.co/100x100/eee/999?text=AGR', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Hybrid Corn Seeds 1kg', sku: 'AGR-005', category: 'Agricultural Inputs', subcategory: 'Seeds', packagingUnit: '1kg Retail Pack', expiryDate: '2026-09-30', reorderLevel: 10, price: 450.00, stock: 25, image: 'https://placehold.co/100x100/eee/999?text=AGR', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Rice Seeds NSIC Rc222 5kg', sku: 'AGR-006', category: 'Agricultural Inputs', subcategory: 'Seeds', packagingUnit: '5kg Bag', expiryDate: '2026-08-20', reorderLevel: 5, price: 650.00, stock: 3, image: 'https://placehold.co/100x100/eee/999?text=AGR', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Knapsack Sprayer 16L', sku: 'EQP-001', category: 'Farm Equipment & Hardware', subcategory: 'Sprayers', packagingUnit: '1 Unit', expiryDate: null, reorderLevel: 5, price: 1200.00, stock: 10, image: 'https://placehold.co/100x100/eee/999?text=EQP', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Motorized Mist Blower 25L', sku: 'EQP-002', category: 'Farm Equipment & Hardware', subcategory: 'Sprayers', packagingUnit: '1 Unit', expiryDate: null, reorderLevel: 3, price: 8500.00, stock: 4, image: 'https://placehold.co/100x100/eee/999?text=EQP', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Poultry Feeder 15kg Capacity', sku: 'EQP-003', category: 'Farm Equipment & Hardware', subcategory: 'Poultry/Hog Equipment', packagingUnit: '1 Unit', expiryDate: null, reorderLevel: 5, price: 650.00, stock: 18, image: 'https://placehold.co/100x100/eee/999?text=EQP', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Automatic Drinker 10L', sku: 'EQP-004', category: 'Farm Equipment & Hardware', subcategory: 'Poultry/Hog Equipment', packagingUnit: '1 Unit', expiryDate: null, reorderLevel: 5, price: 450.00, stock: 22, image: 'https://placehold.co/100x100/eee/999?text=EQP', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Stainless Steel Garden Scissors 8"', sku: 'EQP-005', category: 'Farm Equipment & Hardware', subcategory: 'Gardening Tools', packagingUnit: '1 Unit', expiryDate: null, reorderLevel: 10, price: 150.00, stock: 35, image: 'https://placehold.co/100x100/eee/999?text=EQP', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Heavy Duty Pruning Shears', sku: 'EQP-006', category: 'Farm Equipment & Hardware', subcategory: 'Gardening Tools', packagingUnit: '1 Unit', expiryDate: null, reorderLevel: 5, price: 580.00, stock: 12, image: 'https://placehold.co/100x100/eee/999?text=EQP', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Disposable Syringe 5ml 100pcs', sku: 'EQP-007', category: 'Farm Equipment & Hardware', subcategory: 'Veterinary Tools', packagingUnit: '100 pcs Box', expiryDate: null, reorderLevel: 10, price: 180.00, stock: 50, image: 'https://placehold.co/100x100/eee/999?text=EQP', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Hoof Cutter Heavy Duty', sku: 'EQP-008', category: 'Farm Equipment & Hardware', subcategory: 'Veterinary Tools', packagingUnit: '1 Unit', expiryDate: null, reorderLevel: 3, price: 680.00, stock: 7, image: 'https://placehold.co/100x100/eee/999?text=EQP', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Oxytetracycline LA 100ml', sku: 'VET-007', category: 'Veterinary Drugs & Biologics', subcategory: 'Antibiotics', packagingUnit: '100ml Vial', expiryDate: '2026-11-20', reorderLevel: 8, price: 550.00, stock: 20, image: 'https://placehold.co/100x100/eee/999?text=VET', createdAt: new Date().toISOString() },
    { id: crypto.randomUUID(), name: 'Poultry Electrolytes + Vitamins 100g', sku: 'VET-008', category: 'Veterinary Drugs & Biologics', subcategory: 'Vitamins/Supplements', packagingUnit: '500g Sachet', expiryDate: '2027-03-15', reorderLevel: 15, price: 95.00, stock: 120, image: 'https://placehold.co/100x100/eee/999?text=VET', createdAt: new Date().toISOString() },
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
