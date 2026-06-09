import { useState, useMemo } from 'react'
import { CalendarDays, DollarSign, Search, UserCircle, ClipboardList, Plus, Edit2, Trash2 } from 'lucide-react'
import { useBookings } from '../hooks/useBookings'
import { SkeletonCards } from '../../../components/Skeleton'
import { useApp } from '../../../context/AppContext'
import Drawer from '../../../components/Drawer'
import Modal from '../../../components/Modal'
import type { Booking } from '../../../data/booking/types'
import BookingForm from '../components/BookingForm'

const statusStyles: Record<string, string> = {
  Pending: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400',
  Completed: 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400',
  Cancelled: 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400',
}

export default function BookingPage() {
  const { bookings, loading, add, update, remove } = useBookings()
  const { addNotification } = useApp()
  const [search, setSearch] = useState('')
  const [showDrawer, setShowDrawer] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [form, setForm] = useState<Partial<Booking>>({})
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() =>
    bookings.filter(b =>
      b.customer.toLowerCase().includes(search.toLowerCase()) ||
      b.agent.toLowerCase().includes(search.toLowerCase())
    ),
    [bookings, search]
  )

  const totalAmount = bookings.reduce((sum, b) => sum + b.amount, 0)
  const pendingCount = bookings.filter(b => b.status === 'Pending').length

  function openAdd() {
    setEditingBooking(null)
    setForm({ status: 'Pending', date: new Date().toISOString().split('T')[0] })
    setShowDrawer(true)
  }

  function openEdit(booking: Booking) {
    setEditingBooking(booking)
    setForm({ ...booking })
    setShowDrawer(true)
  }

  async function handleSave() {
    if (!form.customer?.trim() || !form.agent?.trim()) return
    setSaving(true)
    try {
      if (editingBooking) {
        await update(editingBooking.id, form)
        addNotification({ message: 'Booking updated', type: 'success' })
      } else {
        await add(form as Omit<Booking, 'id' | 'items'>)
        addNotification({ message: 'Booking created', type: 'success' })
      }
      setShowDrawer(false)
    } catch {
      addNotification({ message: 'Failed to save booking', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      await remove(deleteId)
      addNotification({ message: 'Booking deleted', type: 'success' })
      setDeleteId(null)
    } catch {
      addNotification({ message: 'Failed to delete booking', type: 'error' })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Bookings</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Manage customer bookings and appointments</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
          <Plus size={16} /> Add Booking
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
            <ClipboardList size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Bookings</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">{bookings.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
            <CalendarDays size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Pending</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">{pendingCount}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Revenue</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">₱{totalAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="relative max-w-xs mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input type="text" placeholder="Search bookings..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
      </div>

      {loading ? (
        <SkeletonCards count={4} />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400 dark:text-slate-500">
          <ClipboardList size={48} className="mx-auto mb-3 opacity-40" />
          <p>No bookings found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(booking => (
            <div key={booking.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                    {booking.customer.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 dark:text-slate-200 text-sm truncate">{booking.customer}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[booking.status]}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => openEdit(booking)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                    title="Edit"><Edit2 size={15} /></button>
                  <button onClick={() => setDeleteId(booking.id)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                    title="Delete"><Trash2 size={15} /></button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <UserCircle size={14} /><span className="truncate">{booking.agent}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <CalendarDays size={14} /><span>{new Date(booking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <DollarSign size={14} /><span className="font-medium text-slate-700 dark:text-slate-200">₱{booking.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Drawer open={showDrawer} onClose={() => setShowDrawer(false)} title={editingBooking ? 'Edit Booking' : 'Add Booking'}>
        <BookingForm form={form} onChange={setForm} />
        <div className="flex gap-3 mt-6">
          <button onClick={handleSave} disabled={saving || !form.customer?.trim() || !form.agent?.trim()}
            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={() => setShowDrawer(false)}
            className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium">
            Cancel
          </button>
        </div>
      </Drawer>

      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Delete Booking" size="sm">
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">Are you sure you want to delete this booking? This action cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={handleDelete}
              className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">Delete</button>
            <button onClick={() => setDeleteId(null)}
              className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
