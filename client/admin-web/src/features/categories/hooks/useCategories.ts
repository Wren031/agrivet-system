import { useState, useEffect, useCallback } from 'react'
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '../services/categoriesService'
import type { Category } from '../services/types'

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchCategories()
      setCategories(data)
    } catch {
      // error handled by apiClient
    }
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const add = useCallback(async (name: string) => {
    const created = await createCategory(name)
    setCategories(prev => [...prev, created])
    return created
  }, [])

  const remove = useCallback(async (id: string) => {
    await deleteCategory(id)
    setCategories(prev => prev.filter(c => c.id !== id))
  }, [])

  const update = useCallback(async (id: string, name: string) => {
    const updated = await updateCategory(id, name)
    setCategories(prev => prev.map(c => c.id === id ? updated : c))
    return updated
  }, [])

  return { categories, loading, add, remove, update, reload: load }
}
