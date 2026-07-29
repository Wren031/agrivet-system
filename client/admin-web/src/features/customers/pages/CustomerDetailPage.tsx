import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { User, Trash2, Package, MoreVertical, Check, X, Ban } from 'lucide-react'
import { fetchCustomer, updateCustomerStatus, deleteCustomer } from '../services/customerService'
import type { Customer } from '../services/types'
import { useApp } from '../../../context/AppContext'
import {
  DetailLayout,
  DetailHeader,
  DetailSection,
  DetailField,
  DetailGrid,
  DetailEmptyState,
} from '../../../components/detail'
import Modal from '../../../components/Modal'

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addNotification } = useApp()

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchCustomer(id)
      .then(setCustomer)
      .catch(() => addNotification({ message: 'Failed to load customer', type: 'error' }))
      .finally(() => setLoading(false))
  }, [id, addNotification])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
        setShowStatusMenu(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  async function handleStatusChange(status: string) {
    if (!customer) return
    setUpdating(true)
    try {
      const updated = await updateCustomerStatus(customer.id, status)
      setCustomer(updated)
      addNotification({ message: `Customer ${status.toLowerCase()}`, type: 'success' })
    } catch {
      addNotification({ message: 'Failed to update status', type: 'error' })
    } finally {
      setUpdating(false)
    }
  }

  async function handleDelete() {
    if (!customer) return
    setShowDelete(false)
    setIsDeleting(true)
    try {
      await deleteCustomer(customer.id)
      addNotification({ message: 'Customer successfully deleted', type: 'success' })
      navigate('/customers')
    } catch {
      addNotification({ message: 'Failed to delete customer', type: 'error' })
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <DetailLayout loading backTo="/customers" backLabel="Back to Customers" />
    )
  }

  if (!customer) {
    return (
      <DetailLayout backTo="/customers" backLabel="Back to Customers">
        <DetailEmptyState
          
          title="Customer Not Found"
          message="The customer record you are looking for could not be found."
          backLabel="Back to Customers"
          onBack={() => navigate('/customers')}
        />
      </DetailLayout>
    )
  }

  return (
    <DetailLayout backTo="/customers" backLabel="Back to Customers">
      <DetailHeader
        title={customer.fullName}
        subtitle="Customer Profile"
        avatar={customer.fullName.charAt(0)}
      >
        <div className="relative" ref={menuRef}>
          <button onClick={() => { setMenuOpen(!menuOpen); setShowStatusMenu(false) }}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-surface-500 dark:text-surface-400 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
            <MoreVertical size={15} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl shadow-lg shadow-surface-950/10 z-50 py-1.5 animate-fade-in origin-top-right">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  Update Status
                </span>
                <svg className={`w-3.5 h-3.5 text-surface-400 transition-transform ${showStatusMenu ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              {showStatusMenu && (
                <div className="mx-2 mb-1 bg-surface-50 dark:bg-surface-900/50 rounded-lg overflow-hidden">
                  {(['ACTIVE', 'TERMINATED'] as string[]).map(s => (
                    <button
                      key={s}
                      onClick={() => { handleStatusChange(s); setMenuOpen(false); setShowStatusMenu(false) }}
                      disabled={updating || s === (customer.status ?? 'ACTIVE')}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium transition-colors ${
                        s === (customer.status ?? 'ACTIVE')
                          ? 'text-surface-400 dark:text-surface-500 cursor-not-allowed'
                          : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
                      }`}
                    >
                      {s === 'ACTIVE' && <Check size={13} className="text-emerald-500" />}
                      {s === 'TERMINATED' && <Ban size={13} className="text-surface-500" />}
                      <span>{s.charAt(0) + s.slice(1).toLowerCase()}</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="h-px bg-surface-100 dark:bg-surface-700 mx-3 my-1" />
              <button
                onClick={() => { setShowDelete(true); setMenuOpen(false) }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <Trash2 size={15} />
                Delete Customer
              </button>
            </div>
          )}
        </div>
      </DetailHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DetailSection title="Contact Information" >
            <DetailGrid cols={2}>
              <DetailField  label="Contact Number" value={customer.phone} />
              <DetailField label="Store Name" value={customer.storeName} />
            </DetailGrid>
          </DetailSection>

          <DetailSection title="Address Information" >
            <DetailField  label="Registered Address" value={customer.address} />
          </DetailSection>
        </div>

        <div className="space-y-6">
          <DetailSection title="Statistics" >
            <div className="text-center py-2">
              <Package size={36} className="mx-auto mb-3 text-surface-300 dark:text-surface-600" />
              <p className="text-3xl font-bold text-surface-900 dark:text-white">{customer.totalOrders}</p>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                {customer.totalOrders === 1 ? 'Order' : 'Orders'}
              </p>
            </div>
          </DetailSection>

          <DetailSection title="Account Details" >
            <DetailField inline label="Status" value={customer.status ?? 'ACTIVE'} />
            <DetailField inline label="Assigned Agent" value={customer.agent} />
            <DetailField inline label="Customer ID" value={`${customer.id.slice(0, 12)}...`} mono />
          </DetailSection>
        </div>
      </div>

      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Delete Customer" size="sm">
        <div className="text-center">
          <p className="text-sm text-surface-600 dark:text-surface-300 mb-6">
            Are you sure you want to delete {customer.fullName}? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button onClick={handleDelete} disabled={isDeleting}
              className="flex-1 py-2.5 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-lg hover:bg-surface-800 dark:hover:bg-surface-200 transition-colors text-sm font-medium disabled:opacity-50">
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
            <button onClick={() => setShowDelete(false)}
              className="flex-1 py-2.5 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors text-sm font-medium">Cancel</button>
          </div>
        </div>
      </Modal>
    </DetailLayout>
  )
}
