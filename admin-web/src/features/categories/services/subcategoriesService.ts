import type { SubCategory } from './types'
import { apiFetch } from '../../../config/apiClient'

export async function fetchSubcategories(categoryId: string): Promise<SubCategory[]> {
  return apiFetch<SubCategory[]>(`/categories/${categoryId}/subcategories`)
}

export async function createSubcategory(categoryId: string, name: string): Promise<SubCategory> {
  return apiFetch<SubCategory>(`/categories/${categoryId}/subcategories`, {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
}

export async function updateSubcategory(categoryId: string, id: string, name: string): Promise<SubCategory> {
  return apiFetch<SubCategory>(`/categories/${categoryId}/subcategories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  })
}

export async function deleteSubcategory(categoryId: string, id: string): Promise<void> {
  return apiFetch<void>(`/categories/${categoryId}/subcategories/${id}`, { method: 'DELETE' })
}
