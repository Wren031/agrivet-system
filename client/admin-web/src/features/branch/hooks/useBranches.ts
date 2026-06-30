import { useState, useEffect, useCallback } from 'react'
import { fetchBranches, createBranch, updateBranch, deleteBranch } from '../../../data/branch/branchService'
import type { Branch } from '../../../data/branch/types'

export function useBranches() {
  const [branches, setBranches] = useState<Branch[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await fetchBranches()
    setBranches(data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const add = useCallback(async (branch: Parameters<typeof createBranch>[0]) => {
    const created = await createBranch(branch)
    setBranches(prev => [...prev, created])
    return created
  }, [])

  const update = useCallback(async (id: string, updates: Partial<Branch>) => {
    const updated = await updateBranch(id, updates)
    setBranches(prev => prev.map(b => b.id === id ? updated : b))
    return updated
  }, [])

  const remove = useCallback(async (id: string) => {
    await deleteBranch(id)
    setBranches(prev => prev.filter(b => b.id !== id))
  }, [])

  return { branches, loading, add, update, remove, reload: load }
}
