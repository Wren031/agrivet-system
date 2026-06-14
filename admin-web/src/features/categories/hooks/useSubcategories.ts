import { useState, useCallback } from 'react'
import { createSubcategory, deleteSubcategory } from '../services/subcategoriesService'
import type { SubCategory } from '../services/types'

export function useSubcategories(categoryId: string) {
  const [subcategories, setSubcategories] = useState<SubCategory[]>([])
  const [loading, setLoading] = useState(false)

  const add = useCallback(async (name: string) => {
    const created = await createSubcategory(categoryId, name)
    setSubcategories(prev => [...prev, created])
    return created
  }, [categoryId])

  const remove = useCallback(async (id: string) => {
    await deleteSubcategory(categoryId, id)
    setSubcategories(prev => prev.filter(s => s.id !== id))
  }, [categoryId])

  return { subcategories, setSubcategories, loading, setLoading, add, remove }
}
