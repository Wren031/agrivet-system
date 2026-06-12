import type { Category } from './types'
import { apiFetch } from '../../../config/apiClient'

export async function fetchCategories(): Promise<Category[]> {
  return apiFetch<Category[]>('/categories')
}

export async function createCategory(name: string): Promise<Category> {
  return apiFetch<Category>('/categories', {
    method: 'POST',
    body: JSON.stringify({ name }),
  })
}

export async function updateCategory(id: string, name: string): Promise<Category> {
  return apiFetch<Category>(`/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ name }),
  })
}

export async function deleteCategory(id: string): Promise<void> {
  return apiFetch<void>(`/categories/${id}`, { method: 'DELETE' })
}
