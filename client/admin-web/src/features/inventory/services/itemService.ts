import type { Item, InventoryApiResponse } from './types'
import { apiFetch } from '../../../config/apiClient'
import { getImageUrl } from '../../../config/api.config'

function fromApi(item: InventoryApiResponse): Item {
  return {
    id: item.id,
    name: item.productName,
    sku: '',
    category: item.category ? [{ id: item.category.id, name: item.category.name }] : [],
    subcategory: item.subcategory?.name || '',
    packagingUnit: item.unit,
    costPrice: Number(item.costPrice),
    expiryDate: item.expiryDate,
    reorderLevel: item.reorderPoint,
    price: Number(item.sellingPrice),
    stock: item.stockLevel,
    image: getImageUrl(item.imageUrl) || '',
    createdAt: item.createdAt,
  }
}

export async function fetchItems(): Promise<Item[]> {
  const data = await apiFetch<InventoryApiResponse[]>('/inventory')
  return data.map(fromApi)
}

export async function fetchItem(id: string): Promise<Item> {
  const data = await apiFetch<InventoryApiResponse>(`/inventory/${id}`)
  return fromApi(data)
}

export async function createItem(
  item: Omit<Item, 'id' | 'createdAt'> & { categoryId?: string; subcategoryId?: string },
): Promise<Item> {
  const data = await apiFetch<InventoryApiResponse>('/inventory', {
    method: 'POST',
    body: JSON.stringify({
      productName: item.name,
      unit: item.packagingUnit,
      costPrice: item.costPrice ?? 0,
      sellingPrice: item.price,
      stockLevel: item.stock,
      reorderPoint: item.reorderLevel,
      categoryId: item.categoryId || undefined,
      subcategoryId: item.subcategoryId || undefined,
      expiryDate: item.expiryDate || undefined,
      imageUrl: item.image || undefined,
    }),
  })
  return fromApi(data)
}

export async function updateItem(
  id: string,
  updates: Partial<Item> & { categoryId?: string; subcategoryId?: string },
): Promise<Item> {
  const body: Record<string, unknown> = {}
  if (updates.name !== undefined) body.productName = updates.name
  if (updates.packagingUnit !== undefined) body.unit = updates.packagingUnit
  if (updates.price !== undefined) body.sellingPrice = updates.price
  if (updates.stock !== undefined) body.stockLevel = updates.stock
  if (updates.reorderLevel !== undefined) body.reorderPoint = updates.reorderLevel
  if (updates.costPrice !== undefined) body.costPrice = updates.costPrice
  if (updates.expiryDate !== undefined) body.expiryDate = updates.expiryDate || null
  if (updates.image !== undefined) body.imageUrl = updates.image
  if (updates.categoryId !== undefined) body.categoryId = updates.categoryId || null
  if (updates.subcategoryId !== undefined) body.subcategoryId = updates.subcategoryId || null

  const data = await apiFetch<InventoryApiResponse>(`/inventory/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
  return fromApi(data)
}

export async function deleteItem(id: string): Promise<void> {
  return apiFetch<void>(`/inventory/${id}`, { method: 'DELETE' })
}
