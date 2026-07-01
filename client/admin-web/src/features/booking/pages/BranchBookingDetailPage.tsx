import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Package, Store, Calendar, 
  Phone, MapPin, Tag, User, AlertCircle,
  UserCheck, Mail, CheckCircle, X
} from 'lucide-react'
import { fetchBranchOrderById, assignBranchOrder } from '../../../data/branch-booking/branchBookingService'
import type { BranchOrder } from '../../../data/branch-booking/types'
import { useApp } from '../../../context/AppContext'
import { useStaff } from '../../staff/hooks/useStaff'

const statusStyles: Record<string, string> = {
  PENDING: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-950/20 dark:text-amber-400 dark:ring-amber-500/20',
  CONFIRMED: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-950/20 dark:text-blue-400 dark:ring-blue-500/20',
  PROCESSING: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-950/20 dark:text-blue-400 dark:ring-blue-500/20',
  APPROVED: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/20 dark:text-emerald-400 dark:ring-emerald-500/20',
  COMPLETED: 'bg-surface-100 text-surface-700 ring-1 ring-inset ring-surface-600/10 dark:bg-surface-800 dark:text-surface-300 dark:ring-surface-700',
  CANCELLED: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10 dark:bg-red-950/20 dark:text-red-400 dark:ring-red-900/30',
}

export default function BranchBookingDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { settings, addNotification } = useApp()
  const [order, setOrder] = useState<BranchOrder | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showAssign, setShowAssign] = useState(false)
  const [assigning, setAssigning] = useState(false)
  const { staff } = useStaff()

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchBranchOrderById(id)
      .then(setOrder)
      .catch(err => setError(err.message || 'Failed to load branch order'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleAssign(adminProfileId: string, staffName: string) {
    if (!id) return
    setAssigning(true)
    try {
      const updated = await assignBranchOrder(id, adminProfileId)
      setOrder(updated)
      addNotification({ message: `Order assigned to ${staffName}`, type: 'success' })
      setShowAssign(false)
    } catch {
      addNotification({ message: 'Failed to assign order', type: 'error' })
    } finally {
      setAssigning(false)
    }
  }

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-5 w-28 bg-surface-200 dark:bg-surface-800 rounded mb-6" />
        <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-6 space-y-4">
          <div className="h-7 w-48 bg-surface-200 dark:bg-surface-800 rounded" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-16 bg-surface-100 dark:bg-surface-800/60 rounded-xl" />
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl h-64" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={24} />
        </div>
        <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-1">Data Fetch Error</h3>
        <p className="text-sm text-surface-500 dark:text-surface-400 max-w-sm mb-5">{error}</p>
        <button 
          onClick={() => navigate('/bookings')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-surface-700 dark:text-surface-200 bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-700 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-750 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Bookings
        </button>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="w-12 h-12 bg-surface-100 dark:bg-surface-800 text-surface-400 rounded-full flex items-center justify-center mb-4">
          <Store size={24} />
        </div>
        <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-1">Order Not Found</h3>
        <p className="text-sm text-surface-500 dark:text-surface-400 max-w-sm mb-5">The branch order record you are trying to access might have been deleted or moved.</p>
        <button 
          onClick={() => navigate('/bookings')}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-surface-700 dark:text-surface-200 bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-700 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-750 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Bookings
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <button 
          onClick={() => navigate('/bookings')}
          className="group inline-flex items-center gap-2 text-sm font-medium text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 transition-colors"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" /> 
          Back to Bookings
        </button>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 flex items-center justify-center shrink-0">
            <Store size={22} className="text-surface-600 dark:text-surface-400" />
          </div>
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight text-surface-900 dark:text-white">
                Order #{order.id.slice(0, 6).toUpperCase()}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyles[order.status] || 'bg-surface-100 text-surface-700'}`}>
                {order.status}
              </span>
            </div>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
              {order.branchProfile.storeBranch}
            </p>
          </div>
        </div>
      </div>

      {/* Overview Block */}
      <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200/60 dark:border-surface-800/80 overflow-hidden">
        <div className="p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="flex gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-surface-50 dark:bg-surface-800 flex items-center justify-center shrink-0">
              <Store size={16} className="text-surface-500 dark:text-surface-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-surface-400 dark:text-surface-500 uppercase tracking-wider">Branch Name</p>
              <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 mt-0.5 truncate">{order.branchProfile.storeBranch}</p>
            </div>
          </div>

          <div className="flex gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-surface-50 dark:bg-surface-800 flex items-center justify-center shrink-0">
              <User size={16} className="text-surface-500 dark:text-surface-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-surface-400 dark:text-surface-500 uppercase tracking-wider">Store Owner</p>
              <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 mt-0.5 truncate">{order.branchProfile.fullName}</p>
            </div>
          </div>

          <div className="flex gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-surface-50 dark:bg-surface-800 flex items-center justify-center shrink-0">
              <Phone size={16} className="text-surface-500 dark:text-surface-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-surface-400 dark:text-surface-500 uppercase tracking-wider">Phone Number</p>
              <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 mt-0.5 truncate">{order.branchProfile.contactNumber}</p>
            </div>
          </div>

          <div className="flex gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-surface-50 dark:bg-surface-800 flex items-center justify-center shrink-0">
              <Calendar size={16} className="text-surface-500 dark:text-surface-400" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-surface-400 dark:text-surface-500 uppercase tracking-wider">Date Created</p>
              <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 mt-0.5 truncate">
                {new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {order.branchProfile.address && (
          <div className="px-5 sm:px-6 pb-5 pt-1 border-t border-surface-100 dark:border-surface-800/60">
              <div className="flex items-start gap-3.5 mt-4">
                <div className="w-9 h-9 rounded-lg bg-surface-50 dark:bg-surface-800 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={16} className="text-surface-500 dark:text-surface-400" />
                </div>
                <div>
                  <p className="text-xs font-medium text-surface-400 dark:text-surface-500 uppercase tracking-wider">Fulfillment Address</p>
                  <a href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(order.branchProfile.address)}`} target="_blank" rel="noopener noreferrer"
                    className="text-sm text-blue-600 dark:text-blue-400 mt-1 leading-relaxed hover:underline inline-flex items-center gap-1">
                    <MapPin size={13} />
                    {order.branchProfile.address}
                  </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Assign Staff Block */}
      <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200/60 dark:border-surface-800/80 overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-50 dark:bg-surface-800 flex items-center justify-center">
              <UserCheck size={16} className="text-surface-500 dark:text-surface-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-surface-900 dark:text-white">Assign Staff</h2>
              {order.adminProfile ? (
                <p className="text-xs text-surface-500 dark:text-surface-400 flex items-center gap-1 mt-0.5">
                  <CheckCircle size={12} /> Assigned to <span className="font-semibold">{order.adminProfile.fullName}</span>
                </p>
              ) : (
                <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">No staff assigned yet</p>
              )}
            </div>
          </div>
          <button onClick={() => setShowAssign(!showAssign)}
            className="flex items-center gap-2 px-4 py-2 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-lg hover:bg-surface-800 dark:hover:bg-surface-200 transition-colors text-sm font-medium">
            <UserCheck size={16} /> {showAssign ? 'Close' : 'Assign'}
          </button>
        </div>

        {showAssign && (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-50/70 dark:bg-surface-850 border-b border-surface-100 dark:border-surface-800 text-left text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                {staff.length === 0 ? (
                  <tr><td colSpan={3} className="px-5 py-8 text-center text-surface-500 dark:text-surface-400">No staff available</td></tr>
                ) : (
                  staff.map(member => {
                    const isAssigned = order.adminProfile?.id === member.adminProfileId
                    return (
                      <tr key={member.id} className="hover:bg-surface-50/50 dark:hover:bg-surface-800/20 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-surface-50 dark:bg-surface-800 flex items-center justify-center text-surface-600 dark:text-surface-400 font-semibold text-xs">
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
                        <td className="px-5 py-3.5 text-right">
                          {isAssigned ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-surface-700 dark:text-surface-400 bg-surface-50 dark:bg-surface-800 rounded-lg">
                              <CheckCircle size={13} /> Assigned
                            </span>
                          ) : (
                            <button
                              onClick={() => handleAssign(member.adminProfileId, member.fullName)}
                              disabled={assigning}
                              className="px-3 py-1.5 text-xs font-medium text-surface-600 dark:text-surface-400 bg-surface-50 dark:bg-surface-800 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors disabled:opacity-50"
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
        )}
      </div>

      {/* Manifest Block */}
      <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200/60 dark:border-surface-800/80 overflow-hidden">
        <div className="px-5 sm:px-6 py-4 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-50 dark:bg-surface-800 flex items-center justify-center">
              <Package size={16} className="text-surface-500 dark:text-surface-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-surface-900 dark:text-white">Order Manifest</h2>
              <p className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">{order.items.length} distinct line item(s)</p>
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-surface-50/70 dark:bg-surface-850 border-b border-surface-100 dark:border-surface-800 text-left text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">
                <th className="px-6 py-3.5">Item Description</th>
                <th className="px-6 py-3.5 text-center w-32">Quantity</th>
                <th className="px-6 py-3.5 text-right w-44">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
              {order.items.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-surface-400 dark:text-surface-500 font-medium">
                    No individual manifest entries reported for this order.
                  </td>
                </tr>
              ) : (
                order.items.map(item => (
                  <tr key={item.id} className="hover:bg-surface-50/50 dark:hover:bg-surface-800/20 transition-colors">
                    <td className="px-6 py-4 text-surface-900 dark:text-surface-100 font-medium max-w-sm break-words">
                      {item.inventory?.productName ?? 'Legacy System Product'}
                    </td>
                    <td className="px-6 py-4 text-surface-600 dark:text-surface-400 font-mono text-center">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 text-surface-900 dark:text-surface-100 font-semibold text-right font-mono">
                      {settings.currencySymbol}{Number(item.subtotal).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot>
              <tr className="bg-surface-50/40 dark:bg-surface-850/40 border-t border-surface-200 dark:border-surface-800">
                <td colSpan={2} className="px-6 py-4 text-sm font-semibold text-surface-500 dark:text-surface-400 text-right uppercase tracking-wider">
                  Total Final Amount
                </td>
                <td className="px-6 py-4 text-base font-bold text-surface-900 dark:text-white text-right font-mono">
                  {settings.currencySymbol}{Number(order.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Notes Block */}
      {order.notes && (
        <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200/60 dark:border-surface-800/80 overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b border-surface-100 dark:border-surface-800 flex items-center gap-2.5">
            <Tag size={16} className="text-surface-400 dark:text-surface-500" />
            <h2 className="text-sm font-semibold text-surface-900 dark:text-white">Special Instructions & Notes</h2>
          </div>
          <div className="px-5 sm:px-6 py-4 bg-surface-50/30 dark:bg-surface-850/20">
            <p className="text-sm text-surface-600 dark:text-surface-300 whitespace-pre-wrap leading-relaxed">
              {order.notes}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}