import { useParams, useNavigate } from 'react-router-dom'
import { Trash2, UserCheck, Package, User, Calendar, BadgeCheck, Phone, Mail, CheckCircle } from 'lucide-react'
import { useBookings } from '../hooks/useBookings'
import { useApp } from '../../../context/AppContext'
import { useStaff } from '../../staff/hooks/useStaff'
import Modal from '../../../components/Modal'
import { useState } from 'react'
import {
  DetailLayout,
  DetailHeader,
  DetailSection,
  DetailField,
  DetailGrid,
  DetailTable,
  DetailEmptyState,
  DetailBadge,
} from '../../../components/detail'

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
    return <DetailLayout loading backTo="/bookings" backLabel="Back to Bookings" />
  }

  if (!booking) {
    return (
      <DetailLayout backTo="/bookings" backLabel="Back to Bookings">
        <DetailEmptyState
          
          title="Booking Not Found"
          message="The booking record you are looking for could not be found."
          backLabel="Back to Bookings"
          onBack={() => navigate('/bookings')}
        />
      </DetailLayout>
    )
  }

  return (
    <DetailLayout backTo="/bookings" backLabel="Back to Bookings">
      <DetailHeader
        title={`Booking #${booking.id.slice(0, 6)}`}
        subtitle="View full booking information"
        avatarIcon={<Package size={20} className="text-surface-500 dark:text-surface-400" />}
      >
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${
          booking.status === 'Pending' ? 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400' :
          booking.status === 'Process' ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400' :
          booking.status === 'Approved' ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400' :
          booking.status === 'Completed' ? 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-400' :
          'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400'
        }`}>{booking.status}</span>
        <button onClick={() => setShowDelete(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 bg-white dark:bg-surface-800 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
          <Trash2 size={14} /> Delete
        </button>
      </DetailHeader>

      <div className="space-y-6">
        <DetailSection title="Booking Overview" >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 truncate">
                  {new Date(booking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-surface-50 dark:bg-surface-800/40">
              <div className="w-9 h-9 rounded-lg bg-white dark:bg-surface-700 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-surface-600 dark:text-surface-400">PHP</span>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-surface-500 dark:text-surface-400 mb-0.5 uppercase tracking-wider font-medium">Amount</p>
                <p className="text-sm font-bold text-surface-900 dark:text-white truncate">{settings.currencySymbol}{booking.amount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </DetailSection>

        <DetailSection
          title="Booking Items"
          
          description={`${booking.items?.length || 0} item(s)`}
        >
          <DetailTable
            headers={['Item', 'Qty', 'Price', 'Total']}
            emptyMessage="No items found"
            emptyColSpan={4}
            footer={
              <>
                <td colSpan={3} className="px-5 py-3.5 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider text-right">Total</td>
                <td className="px-5 py-3.5 text-sm font-bold text-surface-900 dark:text-white text-right">{settings.currencySymbol}{booking.amount.toLocaleString()}</td>
              </>
            }
          >
            {booking.items?.map((item, i) => {
              const total = item.quantity * item.price
              return (
                <tr key={i} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                  <td className="px-5 py-3.5 text-surface-800 dark:text-surface-200 font-medium">{item.name}</td>
                  <td className="px-5 py-3.5 text-surface-500 dark:text-surface-400">{item.quantity}</td>
                  <td className="px-5 py-3.5 text-surface-500 dark:text-surface-400">{settings.currencySymbol}{item.price.toFixed(2)}</td>
                  <td className="px-5 py-3.5 text-surface-800 dark:text-surface-200 font-medium text-right">{settings.currencySymbol}{total.toFixed(2)}</td>
                </tr>
              )
            })}
          </DetailTable>
        </DetailSection>

        <DetailSection
          title="Assign Task"
          
          description={booking.assignedStaff ? `Assigned to ${booking.assignedStaff}` : 'Assign this booking to a staff member'}
          actions={
            <button onClick={() => setShowAssignTask(!showAssignTask)}
              className="flex items-center gap-2 px-4 py-2 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-lg hover:bg-surface-800 dark:hover:bg-surface-200 transition-colors text-sm font-medium">
              <UserCheck size={16} /> {showAssignTask ? 'Close' : 'Assign Task'}
            </button>
          }
        >
          {showAssignTask && (
            <DetailTable
              headers={['Name', 'Email', 'Contact', 'Action']}
              emptyMessage="No staff available"
              emptyColSpan={4}
            >
              {staff.map(member => {
                const isAssigned = booking.assignedStaff === member.fullName
                return (
                  <tr key={member.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-surface-50 dark:bg-surface-950/30 flex items-center justify-center text-surface-600 dark:text-surface-400 font-semibold text-xs">
                          {member.fullName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-surface-800 dark:text-surface-200">{member.fullName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-surface-500 dark:text-surface-400">
                        <Mail size={13} />
                        <span>{member.email}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-surface-500 dark:text-surface-400">
                        <Phone size={13} />
                        <span>{member.contactNumber}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-right">
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
              })}
            </DetailTable>
          )}
        </DetailSection>
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
    </DetailLayout>
  )
}
