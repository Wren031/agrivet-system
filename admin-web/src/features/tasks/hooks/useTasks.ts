import { useState, useEffect, useCallback } from 'react'
import { fetchBookings, updateBooking } from '../../../data/booking/bookingService'
import { fetchStaffById } from '../../staff/services/staffService'
import type { Booking } from '../../../data/booking/types'
import { useApp } from '../../../context/AppContext'

export function useTasks() {
  const { user, addNotification } = useApp()
  const [tasks, setTasks] = useState<Booking[]>([])
  const [myAdminProfileId, setMyAdminProfileId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    try {
      const [all, profile] = await Promise.all([
        fetchBookings(),
        user?.id ? fetchStaffById(user.id) : Promise.resolve(null),
      ])
      setTasks(all.filter(b => b.adminProfileId))
      setMyAdminProfileId(profile?.adminProfileId ?? null)
    } catch {
      addNotification({ message: 'Failed to load tasks', type: 'error' })
    } finally {
      setLoading(false)
    }
  }, [user?.id, addNotification])

  useEffect(() => { load() }, [load])

  const handleApprove = useCallback(async (id: string) => {
    try {
      const updated = await updateBooking(id, { status: 'Approved' })
      setTasks(prev => prev.map(t => t.id === id ? updated : t))
      addNotification({ message: 'Booking approved successfully', type: 'success' })
    } catch {
      addNotification({ message: 'Failed to approve booking', type: 'error' })
    }
  }, [addNotification])

  const handleCancel = useCallback(async (id: string) => {
    try {
      const updated = await updateBooking(id, { status: 'Cancelled' })
      setTasks(prev => prev.map(t => t.id === id ? updated : t))
      addNotification({ message: 'Booking cancelled successfully', type: 'success' })
    } catch {
      addNotification({ message: 'Failed to cancel booking', type: 'error' })
    }
  }, [addNotification])

  const handleComplete = useCallback(async (id: string) => {
    try {
      const updated = await updateBooking(id, { status: 'Completed' })
      setTasks(prev => prev.map(t => t.id === id ? updated : t))
      addNotification({ message: 'Booking marked as completed', type: 'success' })
    } catch {
      addNotification({ message: 'Failed to complete booking', type: 'error' })
    }
  }, [addNotification])

  return { tasks, myAdminProfileId, loading, handleApprove, handleCancel, handleComplete, reload: load }
}