import { useState, useEffect, useCallback } from 'react'
import { fetchItems, createItem, updateItem, deleteItem } from '../services/itemService'
import type { Item } from '../services/types'

export function useItems() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await fetchItems()
      setItems(data)
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  const add = useCallback(async (item: Omit<Item, 'id' | 'createdAt'>) => {
    const created = await createItem(item)
    setItems(prev => [...prev, created])
    return created
  }, [])

  const update = useCallback(async (id: string, updates: Partial<Item>) => {
    const updated = await updateItem(id, updates)
    setItems(prev => prev.map(p => p.id === id ? updated : p))
    return updated
  }, [])

  const remove = useCallback(async (id: string) => {
    await deleteItem(id)
    setItems(prev => prev.filter(p => p.id !== id))
  }, [])

  return { items, loading, add, update, remove, reload: load }
}
