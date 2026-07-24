import { useParams, useNavigate } from 'react-router-dom'
import { Search, Package, Printer, ChevronDown, Trash2, ClipboardList } from 'lucide-react'
import { useBranchTasks } from '../hooks/useBranchTasks'
import { useApp } from '../../../context/AppContext'
import { useState, useMemo, useRef, useEffect } from 'react'
import {
  DetailLayout,
  DetailHeader,
  DetailSection,
  DetailField,
  DetailGrid,
  DetailTable,
  DetailEmptyState,
} from '../../../components/detail'
import Modal from '../../../components/Modal'

const branchStatusStyles: Record<string, string> = {
  PENDING: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400',
  CONFIRMED: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400',
  PROCESSING: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400',
  APPROVED: 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400',
  COMPLETED: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400',
  CANCELLED: 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400',
}

export default function BranchTaskDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { orders, loading, handleUpdateStatus, handleDelete } = useBranchTasks()
  const { settings } = useApp()
  const [itemSearch, setItemSearch] = useState('')
  const [statusOpen, setStatusOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const order = orders.find(o => o.id === id)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setStatusOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredItems = useMemo(() => {
    if (!order?.items) return []
    if (!itemSearch) return order.items
    return order.items.filter(item =>
      item.inventory?.productName.toLowerCase().includes(itemSearch.toLowerCase())
    )
  }, [order?.items, itemSearch])

  const statusOptions = [
    { label: 'Approve', value: 'APPROVED' },
    { label: 'Processing', value: 'PROCESSING' },
    { label: 'Complete', value: 'COMPLETED' },
  ]

  async function handleStatusSelect(status: string) {
    if (!order) return
    try {
      await handleUpdateStatus(order.id, status)
      setStatusOpen(false)
    } catch {
      // Keep menu open or handle local error state if needed
    }
  }

  async function handleDeleteTask() {
    if (!order) return
    try {
      await handleDelete(order.id)
      setShowDeleteConfirm(false)
      navigate('/tasks')
    } catch {
      // Keep confirmation modal open so the user can retry
    }
  }

  if (loading) {
    return <DetailLayout loading backTo="/tasks" backLabel="Back to Tasks" loadingMessage="Loading branch task details..." />
  }

  if (!order) {
    return (
      <DetailLayout backTo="/tasks" backLabel="Back to Tasks">
        <DetailEmptyState
          
          title="Branch Task Not Found"
          message="The branch task record you are looking for could not be found."
          backLabel="Back to Tasks"
          onBack={() => navigate('/tasks')}
        />
      </DetailLayout>
    )
  }

  return (
    <DetailLayout backTo="/tasks" backLabel="Back to Tasks">
      <DetailHeader
        title="Branch Task Details"
        subtitle={`Branch Order #${order.id.slice(0, 8)}`}
        avatarIcon={<ClipboardList size={20} className="text-surface-500 dark:text-surface-400" />}
      >
        <div className="relative" ref={dropdownRef}>
          <button onClick={() => setStatusOpen(!statusOpen)}
            className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 cursor-pointer ${branchStatusStyles[order.status] || 'bg-surface-100 text-surface-700'}`}>
            {order.status} <ChevronDown size={12} />
          </button>
          {statusOpen && (
            <div className="absolute right-0 mt-1.5 w-36 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg shadow-lg z-10 py-1">
              {statusOptions.map(opt => (
                <button key={opt.value} onClick={() => handleStatusSelect(opt.value)}
                  className="w-full text-left px-3 py-1.5 text-xs text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </DetailHeader>

      <div className="space-y-6">
        <DetailSection title="Branch Information" >
          <DetailGrid cols={4}>
            <DetailField  label="Branch" value={order.branchProfile.storeBranch} />
            <DetailField label="Address" value={order.branchProfile.location} />
            <DetailField label="Contact" value={order.branchProfile.contactNumber} />
            <DetailField label="Assigned To" value={order.adminProfile?.fullName} />
            <DetailField label="Date" value={
              new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            } />
          </DetailGrid>
        </DetailSection>

        <DetailSection
          title="Order Items"
          
          actions={
            <div className="relative max-w-xs w-full sm:w-60">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                value={itemSearch}
                onChange={e => setItemSearch(e.target.value)}
                placeholder="Search items..."
                className="w-full pl-9 pr-3 py-2 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 transition-shadow"
              />
            </div>
          }
        >
          <DetailTable
            headers={['Item', 'Qty', 'Price', 'Total']}
            emptyMessage={itemSearch ? 'No items match your search' : 'No items found'}
            emptyColSpan={4}
            footer={
              <>
                <td colSpan={3} className="px-4 py-2.5 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Grand Total</td>
                <td className="px-4 py-2.5 text-sm font-bold text-surface-900 dark:text-white text-right">{settings.currencySymbol}{Number(order.totalAmount).toLocaleString()}</td>
              </>
            }
          >
            {filteredItems.map((item, i) => {
              const price = Number(item.inventory?.sellingPrice || 0)
              const total = item.quantity * price
              return (
                <tr key={item.id || i} className="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                  <td className="px-4 py-2.5 text-surface-700 dark:text-surface-200 font-medium">{item.inventory?.productName || 'Unknown Item'}</td>
                  <td className="px-4 py-2.5 text-surface-500 dark:text-surface-400">{item.quantity}</td>
                  <td className="px-4 py-2.5 text-surface-500 dark:text-surface-400">{settings.currencySymbol}{price.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-surface-800 dark:text-surface-200 font-medium text-right">{settings.currencySymbol}{total.toFixed(2)}</td>
                </tr>
              )
            })}
          </DetailTable>

          <div className="flex items-center justify-end gap-3 mt-4">
            <button onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-surface-700 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-sm font-medium">
              <Trash2 size={15} /> Delete
            </button>
            <button onClick={() => window.print()}
              className="flex items-center gap-1.5 px-4 py-2 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-lg hover:bg-surface-800 dark:hover:bg-surface-200 transition-colors text-sm font-medium">
              <Printer size={15} /> Print
            </button>
          </div>
        </DetailSection>
      </div>

      <Modal open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Delete Branch Task" size="sm">
        <div className="text-center">
          <p className="text-sm text-surface-600 dark:text-surface-300 mb-6">Are you sure you want to delete this branch task? This action cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={handleDeleteTask}
              className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
              Delete
            </button>
            <button onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 py-2.5 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors text-sm font-medium">Cancel</button>
          </div>
        </div>
      </Modal>
    </DetailLayout>
  )
}
