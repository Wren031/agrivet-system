import type { Item } from './types'

const STORAGE_KEY = 'inventory_products'

function delay(ms = 400): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getDefaults(): Item[] {
  return [
      // // Feeds
      // { id: crypto.randomUUID(), name: 'Broiler Starter Feeds (50kg)', sku: 'FED-001', category: 'Feeds', price: 1450.00, stock: 40, image: 'https://placehold.co/100x100/eee/999?text=FEED', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Broiler Grower Feeds (50kg)', sku: 'FED-002', category: 'Feeds', price: 1380.00, stock: 35, image: 'https://placehold.co/100x100/eee/999?text=FEED', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Hog Starter Feeds (50kg)', sku: 'FED-003', category: 'Feeds', price: 1520.00, stock: 25, image: 'https://placehold.co/100x100/eee/999?text=FEED', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Hog Grower Pellets (50kg)', sku: 'FED-004', category: 'Feeds', price: 1380.00, stock: 20, image: 'https://placehold.co/100x100/eee/999?text=FEED', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Layer Pellets (50kg)', sku: 'FED-005', category: 'Feeds', price: 1420.00, stock: 30, image: 'https://placehold.co/100x100/eee/999?text=FEED', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Duck Breeder Feeds (50kg)', sku: 'FED-006', category: 'Feeds', price: 1480.00, stock: 15, image: 'https://placehold.co/100x100/eee/999?text=FEED', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Fish Floating Feeds (25kg)', sku: 'FED-007', category: 'Feeds', price: 980.00, stock: 50, image: 'https://placehold.co/100x100/eee/999?text=FEED', createdAt: new Date().toISOString() },

      // // Veterinary Medicines
      // { id: crypto.randomUUID(), name: 'Ivermectin 1% Injection (100ml)', sku: 'MED-001', category: 'Veterinary Medicines', price: 850.00, stock: 15, image: 'https://placehold.co/100x100/eee/999?text=MED', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Amoxicillin Water Soluble Powder (1kg)', sku: 'MED-002', category: 'Veterinary Medicines', price: 1200.00, stock: 8, image: 'https://placehold.co/100x100/eee/999?text=MED', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Enrofloxacin Injection (100ml)', sku: 'MED-003', category: 'Veterinary Medicines', price: 680.00, stock: 12, image: 'https://placehold.co/100x100/eee/999?text=MED', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Oxytetracycline LA (100ml)', sku: 'MED-004', category: 'Veterinary Medicines', price: 550.00, stock: 20, image: 'https://placehold.co/100x100/eee/999?text=MED', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Tylosin Injection (100ml)', sku: 'MED-005', category: 'Veterinary Medicines', price: 720.00, stock: 10, image: 'https://placehold.co/100x100/eee/999?text=MED', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Dexamethasone Injection (50ml)', sku: 'MED-006', category: 'Veterinary Medicines', price: 380.00, stock: 18, image: 'https://placehold.co/100x100/eee/999?text=MED', createdAt: new Date().toISOString() },

      // // Crop Protection
      // { id: crypto.randomUUID(), name: 'Glyphosate Herbicide (1L)', sku: 'CRP-001', category: 'Crop Protection', price: 480.00, stock: 30, image: 'https://placehold.co/100x100/eee/999?text=CROP', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Alpha-Cypermethrin Insecticide (500ml)', sku: 'CRP-002', category: 'Crop Protection', price: 350.00, stock: 3, image: 'https://placehold.co/100x100/eee/999?text=CROP', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Fipronil Insecticide (250ml)', sku: 'CRP-003', category: 'Crop Protection', price: 420.00, stock: 14, image: 'https://placehold.co/100x100/eee/999?text=CROP', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Mancozeb Fungicide (1kg)', sku: 'CRP-004', category: 'Crop Protection', price: 520.00, stock: 22, image: 'https://placehold.co/100x100/eee/999?text=CROP', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: '2,4-D Amine Herbicide (1L)', sku: 'CRP-005', category: 'Crop Protection', price: 380.00, stock: 18, image: 'https://placehold.co/100x100/eee/999?text=CROP', createdAt: new Date().toISOString() },

      // // Supplements
      // { id: crypto.randomUUID(), name: 'Poultry Electrolytes + Vitamins (100g)', sku: 'VIT-001', category: 'Supplements', price: 95.00, stock: 120, image: 'https://placehold.co/100x100/eee/999?text=VIT', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Calcium + Phosphorus Premix (1kg)', sku: 'VIT-002', category: 'Supplements', price: 210.00, stock: 45, image: 'https://placehold.co/100x100/eee/999?text=VIT', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Multivitamin Soluble Powder (500g)', sku: 'VIT-003', category: 'Supplements', price: 175.00, stock: 60, image: 'https://placehold.co/100x100/eee/999?text=VIT', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Probiotic Powder for Poultry (200g)', sku: 'VIT-004', category: 'Supplements', price: 250.00, stock: 35, image: 'https://placehold.co/100x100/eee/999?text=VIT', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Vitamin AD3E Injectable (100ml)', sku: 'VIT-005', category: 'Supplements', price: 320.00, stock: 25, image: 'https://placehold.co/100x100/eee/999?text=VIT', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Iron + Copper Premix (1kg)', sku: 'VIT-006', category: 'Supplements', price: 190.00, stock: 40, image: 'https://placehold.co/100x100/eee/999?text=VIT', createdAt: new Date().toISOString() },

      // // Equipment
      // { id: crypto.randomUUID(), name: 'Poultry Feeder (15kg capacity)', sku: 'EQP-001', category: 'Equipment', price: 650.00, stock: 18, image: 'https://placehold.co/100x100/eee/999?text=EQP', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Automatic Drinker (10L)', sku: 'EQP-002', category: 'Equipment', price: 450.00, stock: 22, image: 'https://placehold.co/100x100/eee/999?text=EQP', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Disposable Syringe 5ml (100pcs)', sku: 'EQP-003', category: 'Equipment', price: 180.00, stock: 50, image: 'https://placehold.co/100x100/eee/999?text=EQP', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Digital Weighing Scale (50kg)', sku: 'EQP-004', category: 'Equipment', price: 2800.00, stock: 5, image: 'https://placehold.co/100x100/eee/999?text=EQP', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Sprayer Backpack (16L)', sku: 'EQP-005', category: 'Equipment', price: 1200.00, stock: 12, image: 'https://placehold.co/100x100/eee/999?text=EQP', createdAt: new Date().toISOString() },

      // // Vaccines
      // { id: crypto.randomUUID(), name: 'Newcastle Disease Vaccine (500 doses)', sku: 'VAC-001', category: 'Vaccines', price: 950.00, stock: 10, image: 'https://placehold.co/100x100/eee/999?text=VAC', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Avian Influenza Vaccine (500 doses)', sku: 'VAC-002', category: 'Vaccines', price: 1500.00, stock: 8, image: 'https://placehold.co/100x100/eee/999?text=VAC', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'FMD Vaccine (50 doses)', sku: 'VAC-003', category: 'Vaccines', price: 2200.00, stock: 5, image: 'https://placehold.co/100x100/eee/999?text=VAC', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Anti-Rabies Vaccine (20 doses)', sku: 'VAC-004', category: 'Vaccines', price: 1800.00, stock: 7, image: 'https://placehold.co/100x100/eee/999?text=VAC', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Bovine Pasteurella Vaccine (100 doses)', sku: 'VAC-005', category: 'Vaccines', price: 1200.00, stock: 9, image: 'https://placehold.co/100x100/eee/999?text=VAC', createdAt: new Date().toISOString() },

      // // Animal Health Products
      // { id: crypto.randomUUID(), name: 'Wound Spray Antiseptic (250ml)', sku: 'HLT-001', category: 'Animal Health Products', price: 180.00, stock: 35, image: 'https://placehold.co/100x100/eee/999?text=HLT', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Betadine Solution for Animals (500ml)', sku: 'HLT-002', category: 'Animal Health Products', price: 250.00, stock: 28, image: 'https://placehold.co/100x100/eee/999?text=HLT', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Fly Repellent Spray (500ml)', sku: 'HLT-003', category: 'Animal Health Products', price: 220.00, stock: 40, image: 'https://placehold.co/100x100/eee/999?text=HLT', createdAt: new Date().toISOString() },

      // // Farming Tools
      // { id: crypto.randomUUID(), name: 'Stainless Steel Scissors (8\")', sku: 'TL-001', category: 'Farming Tools', price: 150.00, stock: 30, image: 'https://placehold.co/100x100/eee/999?text=TOOL', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Hoof Cutter (Heavy Duty)', sku: 'TL-002', category: 'Farming Tools', price: 680.00, stock: 10, image: 'https://placehold.co/100x100/eee/999?text=TOOL', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Dehorning Wire Set', sku: 'TL-003', category: 'Farming Tools', price: 450.00, stock: 15, image: 'https://placehold.co/100x100/eee/999?text=TOOL', createdAt: new Date().toISOString() },
      // { id: crypto.randomUUID(), name: 'Ear Tag Applicator', sku: 'TL-004', category: 'Farming Tools', price: 320.00, stock: 20, image: 'https://placehold.co/100x100/eee/999?text=TOOL', createdAt: new Date().toISOString() },
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
