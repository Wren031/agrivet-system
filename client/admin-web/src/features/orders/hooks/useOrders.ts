import { useState, useEffect, useCallback } from 'react'
import { fetchAgentOrders, fetchBranchOrders } from '../services/orderService'
import type { AgentOrder, BranchOrder } from '../services/types'

export function useOrders() {
  const [agentOrders, setAgentOrders] = useState<AgentOrder[]>([])
  const [branchOrders, setBranchOrders] = useState<BranchOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [agents, branches] = await Promise.all([
        fetchAgentOrders(),
        fetchBranchOrders(),
      ])
      setAgentOrders(agents)
      setBranchOrders(branches)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to load orders'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return { agentOrders, branchOrders, loading, error, reload: load }
}
