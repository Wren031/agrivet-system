import { useState, useEffect, useCallback } from 'react'
import { fetchAgents, createAgent, updateAgent, deleteAgent } from '../services/agentService'
import type { Agent } from '../services/types'

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await fetchAgents()
    setAgents(data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const add = useCallback(async (agent: Omit<Agent, 'id'>) => {
    const created = await createAgent(agent)
    setAgents(prev => [...prev, created])
    return created
  }, [])

  const update = useCallback(async (id: string, updates: Partial<Agent>) => {
    const updated = await updateAgent(id, updates)
    setAgents(prev => prev.map(a => a.id === id ? updated : a))
    return updated
  }, [])

  const remove = useCallback(async (id: string) => {
    await deleteAgent(id)
    setAgents(prev => prev.filter(a => a.id !== id))
  }, [])

  return { agents, loading, add, update, remove, reload: load }
}
