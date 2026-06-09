import { useState, useEffect, useCallback } from 'react'
import { fetchOrders } from '../services/orderService'
import type { Order } from '../services/types'

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await fetchOrders()
    setOrders(data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  return { orders, loading, reload: load }
}
