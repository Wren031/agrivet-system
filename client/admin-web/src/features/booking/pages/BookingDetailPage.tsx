import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Trash2, UserCheck, Package, ChevronDown, ChevronUp, User, Calendar, DollarSign, BadgeCheck, Phone, Mail, CheckCircle } from 'lucide-react'
import { useBookings } from '../hooks/useBookings'
import { useApp } from '../../../context/AppContext'
import { useStaff } from '../../staff/hooks/useStaff'
import Modal from '../../../components/Modal'
import { useState } from 'react'

const statusStyles: Record<string, string> = {
  Pending: 'bg-surface-50 dark:bg-surface-950/30 text-surface-700 dark:text-surface-400',
  Process: 'bg-surface-100 dark:bg-surface-900/40 text-surface-700 dark:text-surface-300',
  Approved: 'bg-surface-200/50 dark:bg-surface-800/50 text-surface-800 dark:text-surface-300',
  Completed: 'bg-surface-50 dark:bg-surface-950/30 text-surface-700 dark:text-surface-400',
  Cancelled: 'bg-surface-200/50 dark:bg-surface-800/50 text-surface-800 dark:text-surface-300',
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

      <div>
        {/* Header */}
        <div className="px-4 sm:px-6 py-5 border-b border-surface-100 dark:border-surface-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-surface-900 dark:text-white">Booking Details</h1>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">View full booking information</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={() => setShowDelete(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-surface-800 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-950/30 transition-colors">
                <Trash2 size={14} /> Delete
              </button>
              <span className={`px-3 py-1 rounded-md text-xs font-medium ${statusStyles[booking.status]}`}>{booking.status}</span>
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="px-4 sm:px-6 py-5 border-b border-surface-100 dark:border-surface-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 sm:gap-6">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0 mt-0.5">
                <User size={16} className="text-surface-600 dark:text-surface-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">Customer Name</p>
                <p className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">{booking.customer}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0 mt-0.5">
                <BadgeCheck size={16} className="text-surface-600 dark:text-surface-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">Assigned Staff</p>
                <p className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">{booking.assignedStaff || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0 mt-0.5">
                <User size={16} className="text-surface-600 dark:text-surface-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">Agent Name</p>
                <p className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">{booking.agent || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0 mt-0.5">
                <Calendar size={16} className="text-surface-600 dark:text-surface-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">Date</p>
                <p className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">{new Date(booking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0 mt-0.5">
                <DollarSign size={16} className="text-surface-600 dark:text-surface-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">Total Amount</p>
                <p className="text-sm font-bold text-surface-900 dark:text-white truncate">{settings.currencySymbol}{booking.amount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="border-b border-surface-100 dark:border-surface-700">
          <button
            onClick={() => setShowItems(!showItems)}
            className="w-full flex items-center justify-between px-4 sm:px-6 py-4 hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
                <Package size={16} className="text-surface-600 dark:text-surface-400" />
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-surface-700 dark:text-surface-300">Booking Items</p>
                <p className="text-xs text-surface-500 dark:text-surface-400">{booking.items?.length || 0} item(s)</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-surface-500 dark:text-surface-400">{showItems ? 'Hide' : 'Show'} items</span>
              {showItems ? <ChevronUp size={16} className="text-surface-400" /> : <ChevronDown size={16} className="text-surface-400" />}
            </div>
          </button>

          {showItems && (
            <div className="px-4 sm:px-6 pb-5">
              <div className="rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
                <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-surface-50 dark:bg-surface-800/50 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                      <th className="px-4 py-2.5">Item</th>
                      <th className="px-4 py-2.5">Qty</th>
                      <th className="px-4 py-2.5">Price</th>
                      <th className="px-4 py-2.5 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
                    {(booking.items?.length ?? 0) === 0 ? (
                      <tr><td colSpan={4} className="px-4 py-8 text-center text-surface-500 dark:text-surface-400">No items found</td></tr>
                    ) : (
                      booking.items?.map((item, i) => {
                        const total = item.quantity * item.price
                        return (
                          <tr key={i} className="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                            <td className="px-4 py-2.5 text-surface-700 dark:text-surface-200 font-medium">{item.name}</td>
                            <td className="px-4 py-2.5 text-surface-500 dark:text-surface-400">{item.quantity}</td>
                            <td className="px-4 py-2.5 text-surface-500 dark:text-surface-400">{settings.currencySymbol}{item.price.toFixed(2)}</td>
                            <td className="px-4 py-2.5 text-surface-800 dark:text-surface-200 font-medium text-right">{settings.currencySymbol}{total.toFixed(2)}</td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                  <tfoot className="bg-surface-50 dark:bg-surface-800/50">
                    <tr>
                      <td colSpan={3} className="px-4 py-2.5 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Total</td>
                      <td className="px-4 py-2.5 text-sm font-bold text-surface-900 dark:text-white text-right">{settings.currencySymbol}{booking.amount.toLocaleString()}</td>
                    </tr>
                  </tfoot>
                </table>
                </div>
              </div>
            </div>
          )}
        </div>


        {/* Assign Task */}
        <div className="px-4 sm:px-6 py-5">
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
