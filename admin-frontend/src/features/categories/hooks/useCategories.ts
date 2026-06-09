import { useState, useEffect, useCallback } from 'react'
import { fetchCategories, addCategory, removeCategory, renameCategory } from '../services/categoriesService'

export function useCategories() {
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await fetchCategories()
    setCategories(data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const add = useCallback(async (name: string) => {
    const updated = await addCategory(name)
    setCategories(updated)
    return updated
  }, [])

  const remove = useCallback(async (name: string) => {
    const updated = await removeCategory(name)
    setCategories(updated)
    return updated
  }, [])

  const update = useCallback(async (oldName: string, newName: string) => {
    const updated = await renameCategory(oldName, newName)
    setCategories(updated)
    return updated
  }, [])

  return { categories, loading, add, remove, update, reload: load }
}
