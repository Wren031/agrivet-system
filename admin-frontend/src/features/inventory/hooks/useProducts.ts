import { useState, useEffect, useCallback } from 'react'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../services/productService'
import type { Product } from '../services/types'

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await fetchProducts()
    setProducts(data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const add = useCallback(async (product: Omit<Product, 'id' | 'createdAt'>) => {
    const created = await createProduct(product)
    setProducts(prev => [...prev, created])
    return created
  }, [])

  const update = useCallback(async (id: string, updates: Partial<Product>) => {
    const updated = await updateProduct(id, updates)
    setProducts(prev => prev.map(p => p.id === id ? updated : p))
    return updated
  }, [])

  const remove = useCallback(async (id: string) => {
    await deleteProduct(id)
    setProducts(prev => prev.filter(p => p.id !== id))
  }, [])

  return { products, loading, add, update, remove, reload: load }
}
