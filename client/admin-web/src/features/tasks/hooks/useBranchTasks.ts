import { useState, useEffect, useCallback } from 'react'

import {
  fetchBranchOrders,
  deleteBranchOrder,
  updateBranchOrderStatus,
} from '../../../data/branch-booking/branchBookingService'
import { fetchStaffById } from '../../staff/services/staffService'
import type { BranchOrder } from '../../../data/branch-booking/types'
import { useApp } from '../../../context/AppContext'

export function useBranchTasks() {
  const { user, addNotification } = useApp()

  const [orders, setOrders] = useState<BranchOrder[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)

    try {
      if (!user?.id) {
        setOrders([])
        return
      }

      const [all, profile] = await Promise.all([
        fetchBranchOrders(),
        fetchStaffById(user.id),
      ])


      const adminProfileId = profile?.adminProfileId

      setOrders(
        adminProfileId
          ? all.filter(o => o.adminProfileId === adminProfileId)
          : all 
      )
    } catch (err) {
      console.error(err)

      addNotification({
        message: 'Failed to load branch tasks',
        type: 'error',
      })
    } finally {
      setLoading(false)
    }
  }, [user?.id, addNotification])

  useEffect(() => {
    load()
  }, [load])


  const handleUpdateStatus = useCallback(
    async (id: string, status: string) => {
      try {
        const updated = await updateBranchOrderStatus(id, status)

        setOrders(prev =>
          prev.map(o => (o.id === id ? updated : o))
        )

        addNotification({
          message: 'Status updated successfully',
          type: 'success',
        })
      } catch (err) {
        console.error(err)

        addNotification({
          message: 'Failed to update status',
          type: 'error',
        })
      }
    },
    [addNotification]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteBranchOrder(id)

        setOrders(prev => prev.filter(o => o.id !== id))

        addNotification({
          message: 'Deleted successfully',
          type: 'success',
        })
      } catch (err) {
        console.error(err)

        addNotification({
          message: 'Failed to delete',
          type: 'error',
        })
      }
    },
    [addNotification]
  )

  return {
    orders,
    loading,
    reload: load,
    handleUpdateStatus,
    handleDelete,
  }
}