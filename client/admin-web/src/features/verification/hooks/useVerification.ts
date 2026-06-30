import { useState, useEffect, useCallback } from 'react'
import {
  fetchPendingAgents,
  fetchBranchesForVerification,
  approveAgent,
  rejectAgent,
  activateBranch,
  deactivateBranch,
} from '../services/verificationService'
import type { VerificationAgent, VerificationBranch } from '../services/types'

export function useVerification() {
  const [pendingAgents, setPendingAgents] = useState<VerificationAgent[]>([])
  const [inactiveBranches, setInactiveBranches] = useState<VerificationBranch[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const [agents, branches] = await Promise.all([
      fetchPendingAgents(),
      fetchBranchesForVerification(),
    ])
    setPendingAgents(agents)
    setInactiveBranches(branches)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const approve = useCallback(async (id: string) => {
    await approveAgent(id)
    setPendingAgents(prev => prev.filter(a => a.id !== id))
  }, [])

  const reject = useCallback(async (id: string) => {
    await rejectAgent(id)
    setPendingAgents(prev => prev.filter(a => a.id !== id))
  }, [])

  const activate = useCallback(async (id: string) => {
    await activateBranch(id)
    setInactiveBranches(prev => prev.filter(b => b.id !== id))
  }, [])

  const deactivate = useCallback(async (id: string) => {
    await deactivateBranch(id)
    setInactiveBranches(prev => prev.filter(b => b.id !== id))
  }, [])

  return {
    pendingAgents,
    inactiveBranches,
    loading,
    approve,
    reject,
    activate,
    deactivate,
    reload: load,
  }
}
