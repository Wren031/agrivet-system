import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Package, Store, UserCheck, Mail, CheckCircle } from 'lucide-react'
import { fetchBranchOrderById, assignBranchOrder } from '../../../data/branch-booking/branchBookingService'
import type { BranchOrder } from '../../../data/branch-booking/types'
import { useApp } from '../../../context/AppContext'
import { useStaff } from '../../staff/hooks/useStaff'
import {
  DetailLayout,
  DetailHeader,
  DetailSection,
  DetailField,
  DetailGrid,
  DetailTable,
  DetailEmptyState,
} from '../../../components/detail'

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

  const statusStyles: Record<string, string> = {
    PENDING: 'bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-600/20 dark:bg-amber-950/20 dark:text-amber-400 dark:ring-amber-500/20',
    CONFIRMED: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-950/20 dark:text-blue-400 dark:ring-blue-500/20',
    PROCESSING: 'bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-600/20 dark:bg-blue-950/20 dark:text-blue-400 dark:ring-blue-500/20',
    APPROVED: 'bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-600/20 dark:bg-emerald-950/20 dark:text-emerald-400 dark:ring-emerald-500/20',
    COMPLETED: 'bg-surface-100 text-surface-700 ring-1 ring-inset ring-surface-600/10 dark:bg-surface-800 dark:text-surface-300 dark:ring-surface-700',
    CANCELLED: 'bg-red-50 text-red-700 ring-1 ring-inset ring-red-600/10 dark:bg-red-950/20 dark:text-red-400 dark:ring-red-900/30',
  }

  if (loading) {
    return (
      <DetailLayout loading backTo="/bookings" backLabel="Back to Bookings" loadingMessage="Loading branch order..." />
    )
  }

  if (error) {
    return (
      <DetailLayout
        error={error}
        backTo="/bookings"
        backLabel="Back to Bookings"
      />
    )
  }

  if (!order) {
    return (
      <DetailLayout backTo="/bookings" backLabel="Back to Bookings">
        <DetailEmptyState
          icon={Store}
          title="Order Not Found"
          message="The branch order record you are trying to access might have been deleted or moved."
          backLabel="Back to Bookings"
          onBack={() => navigate('/bookings')}
        />
      </DetailLayout>
    )
  }

  return (
    <DetailLayout backTo="/bookings" backLabel="Back to Bookings">
      <DetailHeader
        title={`Order #${order.id.slice(0, 6).toUpperCase()}`}
        subtitle={order.branchProfile.storeBranch}
        avatarIcon={<Store size={20} className="text-surface-500 dark:text-surface-400" />}
      >
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusStyles[order.status] || 'bg-surface-100 text-surface-700'}`}>
          {order.status}
        </span>
      </DetailHeader>

      <div className="space-y-6">
        <DetailSection title="Order Overview" >
          <DetailGrid cols={4}>
            <DetailField label="Branch Name" value={order.branchProfile.storeBranch} />
            <DetailField label="Store Owner" value={order.branchProfile.fullName} />
            <DetailField label="Phone Number" value={order.branchProfile.contactNumber} />
            <DetailField label="Date Created" value={
              new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
            } />
          </DetailGrid>
          {order.branchProfile.address && (
            <div className="mt-4 pt-4 border-t border-surface-100 dark:border-surface-800">
              <DetailField
                
                label="Fulfillment Address"
                value={order.branchProfile.address}
                href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(order.branchProfile.address)}`}
              />
            </div>
          )}
        </DetailSection>

        <DetailSection
          title="Assign Staff"
          
          description={order.adminProfile ? `Assigned to ${order.adminProfile.fullName}` : 'No staff assigned yet'}
          actions={
            <button onClick={() => setShowAssign(!showAssign)}
              className="flex items-center gap-2 px-4 py-2 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-lg hover:bg-surface-800 dark:hover:bg-surface-200 transition-colors text-sm font-medium">
              <UserCheck size={16} /> {showAssign ? 'Close' : 'Assign'}
            </button>
          }
        >
          {showAssign && (
            <DetailTable
              headers={['Name', 'Email', 'Action']}
              emptyMessage="No staff available"
              emptyColSpan={3}
            >
              {staff.map(member => {
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
              })}
            </DetailTable>
          )}
        </DetailSection>

        <DetailSection
          title="Order Manifest"
          
          description={`${order.items.length} distinct line item(s)`}
        >
          <DetailTable
            headers={['Item Description', 'Quantity', 'Subtotal']}
            emptyMessage="No individual manifest entries reported for this order."
            emptyColSpan={3}
            footer={
              <>
                <td colSpan={2} className="px-6 py-4 text-sm font-semibold text-surface-500 dark:text-surface-400 text-right uppercase tracking-wider">
                  Total Final Amount
                </td>
                <td className="px-6 py-4 text-base font-bold text-surface-900 dark:text-white text-right font-mono">
                  {settings.currencySymbol}{Number(order.totalAmount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </td>
              </>
            }
          >
            {order.items.map(item => (
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
            ))}
          </DetailTable>
        </DetailSection>

        {order.notes && (
          <DetailSection title="Special Instructions & Notes" >
            <div className="bg-surface-50/50 dark:bg-surface-800/30 rounded-xl p-4">
              <p className="text-sm text-surface-600 dark:text-surface-300 whitespace-pre-wrap leading-relaxed">
                {order.notes}
              </p>
            </div>
          </DetailSection>
        )}
      </div>
    </DetailLayout>
  )
}
