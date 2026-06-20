import { useState, useEffect, useCallback } from 'react'
import { fetchBookings, createBooking, updateBooking, assignBooking, deleteBooking } from '../../../data/booking/bookingService'
import type { Booking, BookingItem } from '../../../data/booking/types'

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const data = await fetchBookings()
    setBookings(data)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const add = useCallback(async (booking: Omit<Booking, 'id'> & { items?: BookingItem[] }) => {
    const created = await createBooking(booking)
    setBookings(prev => [...prev, created])
    return created
  }, [])

  const update = useCallback(async (id: string, updates: Partial<Booking>) => {
    const updated = await updateBooking(id, updates)
    setBookings(prev => prev.map(b => b.id === id ? updated : b))
    return updated
  }, [])

  const assignTask = useCallback(async (id: string, adminProfileId: string) => {
    const updated = await assignBooking(id, adminProfileId)
    setBookings(prev => prev.map(b => b.id === id ? updated : b))
    return updated
  }, [])

  const remove = useCallback(async (id: string) => {
    await deleteBooking(id)
    setBookings(prev => prev.filter(b => b.id !== id))
  }, [])

  return { bookings, loading, add, update, assignTask, remove, reload: load }
}
