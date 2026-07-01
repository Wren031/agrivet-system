import { useState, useEffect, useCallback } from 'react'
import { fetchBranchOrders } from '../../../data/branch-booking/branchBookingService'
import { fetchStaffById } from '../../staff/services/staffService'
import type { BranchOrder } from '../../../data/branch-booking/types'
import { useApp } from '../../../context/AppContext'

export function useBranchTasks() {
  const { user, addNotification } = useApp()
  const [orders, setOrders] = useState<BranchOrder[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const [all, profile] = await Promise.all([
        fetchBranchOrders(),
        user?.id ? fetchStaffById(user.id) : Promise.resolve(null),
      ])
      const adminProfileId = profile?.adminProfileId
      setOrders(adminProfileId ? all.filter(o => o.adminProfileId === adminProfileId) : [])
    } catch {
      addNotification({ message: 'Failed to load branch tasks', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [user?.id, addNotification])

  useEffect(() => { load() }, [load])

  return { orders, loading, reload: load }
}
