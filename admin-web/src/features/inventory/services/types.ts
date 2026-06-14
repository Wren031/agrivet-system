import type { Category } from '../../categories/services/types'

export interface InventoryApiResponse {
  id: string
  productName: string
  unit: string
  costPrice: number
  sellingPrice: number
  stockLevel: number
  reorderPoint: number
  expiryDate: string | null
  imageUrl: string | null
  createdAt: string
  updatedAt: string
  categoryId: string | null
  subcategoryId: string | null
  category: { id: string; name: string } | null
  subcategory: { id: string; name: string; categoryId: string } | null
}

export interface Item {
  id: string
  name: string
  sku: string
  category: Category[]
  subcategory: string
  packagingUnit: string
  costPrice: number
  expiryDate: string | null
  reorderLevel: number
  price: number
  stock: number
  image: string
  createdAt: string
}

export interface Product extends Item {
  currency?: string
}

export const PACKAGING_UNITS = [
  '50kg Bag',
  '25kg Bag',
  '20kg Bag',
  '10kg Bag',
  '5kg Bag',
  '1kg Retail Pack',
  '500g Sachet',
  '250g Sachet',
  '100ml Bottle',
  '250ml Bottle',
  '500ml Bottle',
  '1L Bottle',
  '100ml Vial',
  '50ml Vial',
  '10ml Syringe',
  '100 pcs Box',
  '500 pcs Box',
  '1 Unit',
  '1 Roll',
  '1 Set',
] as const

export function getUnitLabel(packagingUnit: string): string {
  if (!packagingUnit) return 'Units'
  if (packagingUnit.includes('Bag')) return 'Bags'
  if (packagingUnit.includes('Bottle')) return 'Bottles'
  if (packagingUnit.includes('Vial')) return 'Vials'
  if (packagingUnit.includes('Sachet')) return 'Sachets'
  if (packagingUnit.includes('Pack')) return 'Packs'
  if (packagingUnit.includes('Syringe')) return 'Syringes'
  if (packagingUnit.includes('Box')) return 'Boxes'
  if (packagingUnit.includes('Roll')) return 'Rolls'
  if (packagingUnit.includes('Set')) return 'Sets'
  if (packagingUnit.includes('Unit')) return 'Units'
  return 'Units'
}

export function getExpiryStatus(expiryDate: string | null): 'none' | 'critical' | 'warning' {
  if (!expiryDate) return 'none'
  const now = new Date()
  const expiry = new Date(expiryDate)
  const diffMs = expiry.getTime() - now.getTime()
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays <= 30) return 'critical'
  if (diffDays <= 90) return 'warning'
  return 'none'
}
