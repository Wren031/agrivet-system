import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Trash2, UserCheck, Package, User, Calendar, DollarSign, BadgeCheck, Phone, Mail, CheckCircle } from 'lucide-react'
import { useBookings } from '../hooks/useBookings'
import { useApp } from '../../../context/AppContext'
import { useStaff } from '../../staff/hooks/useStaff'
import Modal from '../../../components/Modal'
import { useState } from 'react'

const statusStyles: Record<string, string> = {
  Pending: 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400',
  Process: 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400',
  Approved: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400',
  Completed: 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400',
  Cancelled: 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400',
}

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { bookings, loading, update, assignTask, remove } = useBookings()
  const { staff } = useStaff()
  const { addNotification, settings } = useApp()
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showAssignTask, setShowAssignTask] = useState(false)
  const [assigning, setAssigning] = useState(false)


  const booking = bookings.find(b => b.id === id)

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

  async function handleAssignTask(adminProfileId: string, staffName: string) {
    if (!id) return
    setAssigning(true)
    try {
      await assignTask(id, adminProfileId)
      await update(id, { status: 'Pending' })
      addNotification({ message: `Task assigned to ${staffName}`, type: 'success' })
      setShowAssignTask(false)
    } catch {
      addNotification({ message: 'Failed to assign task', type: 'error' })
    } finally {
      setAssigning(false)
    }
  }

  if (loading) {
    return <div className="text-center py-16 text-surface-400">Loading...</div>
  }

  if (!booking) {
    return (
      <div className="text-center py-16 text-surface-500 dark:text-surface-400">
        <p className="text-lg font-medium">Booking not found</p>
        <button onClick={() => navigate('/bookings')}
          className="mt-4 text-sm text-surface-600 dark:text-surface-400 hover:underline">
          Back to Bookings
        </button>
      </div>
    )
  }

  return (
    <div>
      <button onClick={() => navigate('/bookings')}
        className="flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Bookings
      </button>

      <div className="space-y-6">
        {/* Header Card */}
        <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200/50 dark:border-surface-800 overflow-hidden">
          <div className="px-5 sm:px-6 py-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
                  <Package size={18} className="text-surface-600 dark:text-surface-400" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-surface-900 dark:text-white">Booking #{booking.id.slice(0, 6)}</h1>
                  <p className="text-sm text-surface-500 dark:text-surface-400">View full booking information</p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`px-3 py-1 rounded-md text-xs font-medium ${statusStyles[booking.status]}`}>{booking.status}</span>
                <button onClick={() => setShowDelete(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-surface-800 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-950/30 transition-colors">
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          </div>

          {/* Info Grid */}
          <div className="px-5 sm:px-6 pb-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-50 dark:bg-surface-800/40">
                <div className="w-9 h-9 rounded-lg bg-white dark:bg-surface-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User size={16} className="text-surface-600 dark:text-surface-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-surface-500 dark:text-surface-400 mb-0.5 uppercase tracking-wider font-medium">Customer</p>
                  <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 truncate">{booking.customer}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-50 dark:bg-surface-800/40">
                <div className="w-9 h-9 rounded-lg bg-white dark:bg-surface-700 flex items-center justify-center shrink-0 mt-0.5">
                  <BadgeCheck size={16} className="text-surface-600 dark:text-surface-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-surface-500 dark:text-surface-400 mb-0.5 uppercase tracking-wider font-medium">Staff</p>
                  <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 truncate">{booking.assignedStaff || '—'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-50 dark:bg-surface-800/40">
                <div className="w-9 h-9 rounded-lg bg-white dark:bg-surface-700 flex items-center justify-center shrink-0 mt-0.5">
                  <User size={16} className="text-surface-600 dark:text-surface-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-surface-500 dark:text-surface-400 mb-0.5 uppercase tracking-wider font-medium">Agent</p>
                  <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 truncate">{booking.agent || '—'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-50 dark:bg-surface-800/40">
                <div className="w-9 h-9 rounded-lg bg-white dark:bg-surface-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Calendar size={16} className="text-surface-600 dark:text-surface-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-surface-500 dark:text-surface-400 mb-0.5 uppercase tracking-wider font-medium">Date</p>
                  <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 truncate">{new Date(booking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-50 dark:bg-surface-800/40">
                <div className="w-9 h-9 rounded-lg bg-white dark:bg-surface-700 flex items-center justify-center shrink-0 mt-0.5">
                  <DollarSign size={16} className="text-surface-600 dark:text-surface-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-surface-500 dark:text-surface-400 mb-0.5 uppercase tracking-wider font-medium">Amount</p>
                  <p className="text-sm font-bold text-surface-900 dark:text-white truncate">{settings.currencySymbol}{booking.amount.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Items Section - Always visible */}
        <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200/50 dark:border-surface-800 overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
                <Package size={16} className="text-surface-600 dark:text-surface-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">Booking Items</p>
                <p className="text-xs text-surface-500 dark:text-surface-400">{booking.items?.length || 0} item(s)</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-50 dark:bg-surface-800/50 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                  <th className="px-5 py-3">Item</th>
                  <th className="px-5 py-3">Qty</th>
                  <th className="px-5 py-3">Price</th>
                  <th className="px-5 py-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                {(booking.items?.length ?? 0) === 0 ? (
                  <tr><td colSpan={4} className="px-5 py-12 text-center text-surface-500 dark:text-surface-400">No items found</td></tr>
                ) : (
                  booking.items?.map((item, i) => {
                    const total = item.quantity * item.price
                    return (
                      <tr key={i} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                        <td className="px-5 py-3.5 text-surface-800 dark:text-surface-200 font-medium">{item.name}</td>
                        <td className="px-5 py-3.5 text-surface-500 dark:text-surface-400">{item.quantity}</td>
                        <td className="px-5 py-3.5 text-surface-500 dark:text-surface-400">{settings.currencySymbol}{item.price.toFixed(2)}</td>
                        <td className="px-5 py-3.5 text-surface-800 dark:text-surface-200 font-medium text-right">{settings.currencySymbol}{total.toFixed(2)}</td>
                      </tr>
                    )
                  })
                )}
              </tbody>
              <tfoot>
                <tr className="bg-surface-50 dark:bg-surface-800/50">
                  <td colSpan={3} className="px-5 py-3.5 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Total</td>
                  <td className="px-5 py-3.5 text-sm font-bold text-surface-900 dark:text-white text-right">{settings.currencySymbol}{booking.amount.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Assign Task */}
        <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200/50 dark:border-surface-800 overflow-hidden">
          <div className="px-5 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
                <UserCheck size={16} className="text-surface-600 dark:text-surface-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-surface-700 dark:text-surface-300">Assign Task</p>
                {booking.assignedStaff ? (
                  <p className="text-xs text-surface-600 dark:text-surface-400 font-medium flex items-center gap-1">
                    <CheckCircle size={12} /> Assigned to <span className="font-semibold">{booking.assignedStaff}</span>
                  </p>
                ) : (
                  <p className="text-xs text-surface-500 dark:text-surface-400">Assign this booking to a staff member</p>
                )}
              </div>
            </div>
            <button onClick={() => setShowAssignTask(!showAssignTask)}
              className="flex items-center gap-2 px-4 py-2 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-lg hover:bg-surface-800 dark:hover:bg-surface-200 transition-colors text-sm font-medium">
              <UserCheck size={16} /> {showAssignTask ? 'Close' : 'Assign Task'}
            </button>
          </div>

          {showAssignTask && (
            <div className="rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
              <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-50 dark:bg-surface-800/50 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    <th className="px-4 py-2.5">Name</th>
                    <th className="px-4 py-2.5">Email</th>
                    <th className="px-4 py-2.5">Contact</th>
                    <th className="px-4 py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
                  {staff.length === 0 ? (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-surface-500 dark:text-surface-400">No staff available</td></tr>
                  ) : (
                    staff.map(member => {
                      const isAssigned = booking.assignedStaff === member.fullName
                      return (
                        <tr key={member.id} className="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-surface-50 dark:bg-surface-950/30 flex items-center justify-center text-surface-600 dark:text-surface-400 font-semibold text-xs">
                                {member.fullName.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-surface-800 dark:text-surface-200">{member.fullName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 text-surface-500 dark:text-surface-400">
                              <Mail size={13} />
                              <span>{member.email}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 text-surface-500 dark:text-surface-400">
                              <Phone size={13} />
                              <span>{member.contactNumber}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {isAssigned ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-surface-700 dark:text-surface-400 bg-surface-50 dark:bg-surface-950/30 rounded-lg">
                                <CheckCircle size={13} /> Assigned
                              </span>
                            ) : (
                              <button
                                onClick={() => handleAssignTask(member.adminProfileId, member.fullName)}
                                disabled={assigning}
                                className="px-3 py-1.5 text-xs font-medium text-surface-600 dark:text-surface-400 bg-surface-50 dark:bg-surface-950/30 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-950/50 transition-colors disabled:opacity-50"
                              >
                                {assigning ? 'Assigning...' : 'Assign'}
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
              </div>
              <div className="px-4 py-3 border-t border-surface-100 dark:border-surface-700 bg-surface-50 dark:bg-surface-800/50">
                <button onClick={() => setShowAssignTask(false)}
                  className="text-xs font-medium text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      </div>

      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Delete Booking" size="sm">
        <div className="text-center">
          <p className="text-sm text-surface-600 dark:text-surface-300 mb-6">Are you sure you want to delete this booking? This action cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={handleDelete} disabled={deleting}
              className="flex-1 py-2.5 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-lg hover:bg-surface-800 dark:hover:bg-surface-200 transition-colors text-sm font-medium disabled:opacity-50">
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
            <button onClick={() => setShowDelete(false)}
              className="flex-1 py-2.5 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors text-sm font-medium">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
