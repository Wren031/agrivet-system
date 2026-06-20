import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Trash2, UserCheck, Package, ChevronDown, ChevronUp, User, Calendar, DollarSign, BadgeCheck, Phone, Mail, CheckCircle } from 'lucide-react'
import { useBookings } from '../hooks/useBookings'
import { useApp } from '../../../context/AppContext'
import { useStaff } from '../../staff/hooks/useStaff'
import Modal from '../../../components/Modal'
import { useState } from 'react'

const statusStyles: Record<string, string> = {
  Pending: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400',
  Process: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400',
  Approved: 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400',
  Completed: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400',
  Cancelled: 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400',
}

export default function BookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { bookings, loading, update, assignTask, remove } = useBookings()
  const { staff } = useStaff()
  const { addNotification } = useApp()
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showAssignTask, setShowAssignTask] = useState(false)
  const [assigning, setAssigning] = useState(false)
  const [showItems, setShowItems] = useState(false)


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
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">Booking Details</h1>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">View full booking information</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setShowDelete(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                <Trash2 size={14} /> Delete
              </button>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[booking.status]}`}>{booking.status}</span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center shrink-0 mt-0.5">
                <User size={16} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Customer Name</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{booking.customer}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center shrink-0 mt-0.5">
                <BadgeCheck size={16} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Assigned Staff</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{booking.assignedStaff || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center shrink-0 mt-0.5">
                <User size={16} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Agent Name</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{booking.agent || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center shrink-0 mt-0.5">
                <Calendar size={16} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Date</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{new Date(booking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center shrink-0 mt-0.5">
                <DollarSign size={16} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Total Amount</p>
                <p className="text-sm font-bold text-slate-800 dark:text-white truncate">₱{booking.amount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="border-b border-slate-100 dark:border-slate-700">
          <button
            onClick={() => setShowItems(!showItems)}
            className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
                <Package size={16} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Booking Items</p>
                <p className="text-xs text-slate-400 dark:text-slate-500">{booking.items?.length || 0} item(s)</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 dark:text-slate-500">{showItems ? 'Hide' : 'Show'} items</span>
              {showItems ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
            </div>
          </button>

          {showItems && (
            <div className="px-6 pb-5">
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      <th className="px-4 py-2.5">Item</th>
                      <th className="px-4 py-2.5">Qty</th>
                      <th className="px-4 py-2.5">Price</th>
                      <th className="px-4 py-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    {(booking.items?.length ?? 0) === 0 ? (
                      <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500">No items found</td></tr>
                    ) : (
                      booking.items?.map((item, i) => {
                        const total = item.quantity * item.price
                        return (
                          <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                            <td className="px-4 py-2.5 text-slate-700 dark:text-slate-200 font-medium">{item.name}</td>
                            <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">{item.quantity}</td>
                            <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">₱{item.price.toFixed(2)}</td>
                            <td className="px-4 py-2.5 text-slate-800 dark:text-slate-200 font-medium text-right">₱{total.toFixed(2)}</td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                  <tfoot className="bg-slate-50 dark:bg-slate-800/50">
                    <tr>
                      <td colSpan={3} className="px-4 py-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total</td>
                      <td className="px-4 py-2.5 text-sm font-bold text-slate-800 dark:text-white text-right">₱{booking.amount.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
        </div>


        {/* Assign Task */}
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
                <UserCheck size={16} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Assign Task</p>
                {booking.assignedStaff ? (
                  <p className="text-xs text-green-600 dark:text-green-400 font-medium flex items-center gap-1">
                    <CheckCircle size={12} /> Assigned to <span className="font-semibold">{booking.assignedStaff}</span>
                  </p>
                ) : (
                  <p className="text-xs text-slate-400 dark:text-slate-500">Assign this booking to a staff member</p>
                )}
              </div>
            </div>
            <button onClick={() => setShowAssignTask(!showAssignTask)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
              <UserCheck size={16} /> {showAssignTask ? 'Close' : 'Assign Task'}
            </button>
          </div>

          {showAssignTask && (
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="px-4 py-2.5">Name</th>
                    <th className="px-4 py-2.5">Email</th>
                    <th className="px-4 py-2.5">Contact</th>
                    <th className="px-4 py-2.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {staff.length === 0 ? (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500">No staff available</td></tr>
                  ) : (
                    staff.map(member => {
                      const isAssigned = booking.assignedStaff === member.fullName
                      return (
                        <tr key={member.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-xs">
                                {member.fullName.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-slate-800 dark:text-slate-200">{member.fullName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                              <Mail size={13} />
                              <span>{member.email}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                              <Phone size={13} />
                              <span>{member.contactNumber}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right">
                            {isAssigned ? (
                              <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-950/30 rounded-lg">
                                <CheckCircle size={13} /> Assigned
                              </span>
                            ) : (
                              <button
                                onClick={() => handleAssignTask(member.adminProfileId, member.fullName)}
                                disabled={assigning}
                                className="px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition-colors disabled:opacity-50"
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
              <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <button onClick={() => setShowAssignTask(false)}
                  className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          )}
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
