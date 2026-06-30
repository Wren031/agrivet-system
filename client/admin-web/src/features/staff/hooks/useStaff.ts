import { useState, useEffect, useCallback } from 'react'
import { fetchStaff, createStaff, updateStaff, deleteStaff } from '../services/staffService'
import type { AdminStaff, CreateAdminStaffData, UpdateAdminStaffData } from '../services/types'

export function useStaff() {
  const [staff, setStaff] = useState<AdminStaff[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await fetchStaff()
    setStaff(data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const add = useCallback(async (member: CreateAdminStaffData) => {
    const created = await createStaff(member)
    setStaff(prev => [...prev, created])
    return created
  }, [])

  const update = useCallback(async (id: string, updates: UpdateAdminStaffData) => {
    const updated = await updateStaff(id, updates)
    setStaff(prev => prev.map(s => s.id === id ? updated : s))
    return updated
  }, [])

  const remove = useCallback(async (id: string) => {
    await deleteStaff(id)
    setStaff(prev => prev.filter(s => s.id !== id))
  }, [])

  return { staff, loading, add, update, remove, reload: load }
}
