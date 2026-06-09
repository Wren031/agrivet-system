import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Printer, Trash2 } from 'lucide-react'
import { useBookings } from '../hooks/useBookings'
import { useApp } from '../../../context/AppContext'
import Modal from '../../../components/Modal'
import { useState } from 'react'

const statusStyles: Record<string, string> = {
  Pending: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400',
  Completed: 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400',
  Cancelled: 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400',
}

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { bookings, loading, update, remove } = useBookings()
  const { addNotification } = useApp()
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const booking = bookings.find(b => b.id === id)

  async function handleStatusChange(status: string) {
    if (!id) return
    try {
      await update(id, { status: status as 'Pending' | 'Completed' | 'Cancelled' })
      addNotification({ message: `Booking ${status.toLowerCase()}`, type: 'success' })
    } catch {
      addNotification({ message: 'Failed to update status', type: 'error' })
    }
  }

  async function handleDelete() {
    if (!id) return
    setDeleting(true)
    try {
      await remove(id)
      addNotification({ message: 'Booking deleted', type: 'success' })
      navigate('/bookings')
    } catch {
      addNotification({ message: 'Failed to delete booking', type: 'error' })
      setDeleting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-16 text-slate-400">Loading...</div>
  }

  if (!booking) {
    return (
      <div className="text-center py-16 text-slate-400 dark:text-slate-500">
        <p className="text-lg font-medium">Booking not found</p>
        <button onClick={() => navigate('/bookings')}
          className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          Back to Bookings
        </button>
      </div>
    )
  }

  return (
    <div>
      <button onClick={() => navigate('/bookings')}
        className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Bookings
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">Booking Details</h1>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">View full booking information</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <Printer size={14} /> Print
              </button>
              <button onClick={() => setShowDelete(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                <Trash2 size={14} /> Delete
              </button>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[booking.status]}`}>{booking.status}</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Customer</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{booking.customer}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Agent</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{booking.agent}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Date</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{new Date(booking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Total Amount</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white">₱{booking.amount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Status</h3>
          <select value={booking.status} onChange={e => handleStatusChange(e.target.value)}
            className="w-full max-w-xs px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <div className="px-6 py-5">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Booking Items / Inventory</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-4 py-2">Item</th><th className="px-4 py-2">Qty</th><th className="px-4 py-2">Price</th><th className="px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {(booking.items?.length ?? 0) === 0 ? (
                <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500">No items found</td></tr>
              ) : (
                booking.items?.map((item, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2.5 text-slate-700 dark:text-slate-200">{item.name}</td>
                    <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{item.quantity}</td>
                    <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">₱{item.price.toFixed(2)}</td>
                    <td className="px-4 py-2.5 text-slate-700 dark:text-slate-200 font-medium">₱{(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Delete Booking" size="sm">
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">Are you sure you want to delete this booking? This action cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={handleDelete} disabled={deleting}
              className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50">
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
            <button onClick={() => setShowDelete(false)}
              className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
