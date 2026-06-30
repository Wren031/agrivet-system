import { useState, useEffect, useCallback } from 'react'
import { fetchAgents, createAgent, updateAgent, deleteAgent, updateStatus } from '../services/agentService'
import type { Agent, CreateAgentData, UpdateAgentData, UpdateAgentStatusData } from '../services/types'

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

  const add = useCallback(async (data: CreateAgentData) => {
    const created = await createAgent(data)
    setAgents(prev => [...prev, created])
    return created
  }, [])

  const update = useCallback(async (id: string, data: UpdateAgentData) => {
    const updated = await updateAgent(id, data)
    setAgents(prev => prev.map(a => a.id === id ? updated : a))
    return updated
  }, [])

  const changeStatus = useCallback(async (id: string, data: UpdateAgentStatusData) => {
    const updated = await updateStatus(id, data)
    setAgents(prev => prev.map(a => a.id === id ? updated : a))
    return updated
  }, [])

  const remove = useCallback(async (id: string) => {
    await deleteAgent(id)
    setAgents(prev => prev.filter(a => a.id !== id))
  }, [])

  return { agents, loading, add, update, changeStatus, remove, reload: load }
}
