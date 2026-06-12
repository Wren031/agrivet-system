import { useState, useEffect, useCallback } from 'react'
import { fetchCustomers, createCustomer, updateCustomer, deleteCustomer } from '../services/customerService'
import type { Customer } from '../services/types'

export function useCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await fetchCustomers()
    setCustomers(data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const add = useCallback(async (customer: Omit<Customer, 'id'>) => {
    const created = await createCustomer(customer)
    setCustomers(prev => [...prev, created])
    return created
  }, [])

  const update = useCallback(async (id: string, updates: Partial<Customer>) => {
    const updated = await updateCustomer(id, updates)
    setCustomers(prev => prev.map(c => c.id === id ? updated : c))
    return updated
  }, [])

  const remove = useCallback(async (id: string) => {
    await deleteCustomer(id)
    setCustomers(prev => prev.filter(c => c.id !== id))
  }, [])

  return { customers, loading, add, update, remove, reload: load }
}
