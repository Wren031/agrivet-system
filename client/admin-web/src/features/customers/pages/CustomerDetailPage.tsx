import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Phone, MapPin, Store, ShoppingBag, User, Trash2 } from 'lucide-react'
import { fetchCustomer, updateCustomerStatus, deleteCustomer } from '../services/customerService'
import type { Customer } from '../services/types'
import { useApp } from '../../../context/AppContext'

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addNotification } = useApp()

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchCustomer(id)
      .then(setCustomer)
      .catch(() => addNotification({ message: 'Failed to load customer', type: 'error' }))
      .finally(() => setLoading(false))
  }, [id, addNotification])

  async function handleStatusChange(status: string) {
    if (!customer) return
    try {
      const updated = await updateCustomerStatus(customer.id, status)
      setCustomer(updated)
      addNotification({ message: `Customer ${status.toLowerCase()}`, type: 'success' })
    } catch {
      addNotification({ message: 'Failed to update status', type: 'error' })
    }
  }

  async function handleDelete() {
    if (!customer) return
    if (!window.confirm(`Are you sure you want to delete ${customer.fullName}?`)) return

    try {
      setIsDeleting(true)
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
    return <div className="text-center py-16 text-surface-400">Loading...</div>
  }

  if (!customer) {
    return (
      <div className="text-center py-16 text-surface-500 dark:text-surface-400">
        <p className="text-lg font-medium">Customer not found</p>
        <button onClick={() => navigate('/customers')}
          className="mt-4 text-sm text-surface-600 dark:text-surface-400 hover:underline">
          Back to Customers
        </button>
      </div>
    )
  }

  return (
    <div>
      <button onClick={() => navigate('/customers')}
        className="flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Customers
      </button>

      <div>
        {/* Header */}
        <div className="px-4 sm:px-6 py-5 border-b border-surface-100 dark:border-surface-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-600 dark:text-surface-400 font-bold text-lg shrink-0 uppercase">
                {customer.fullName.charAt(0)}
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-surface-900 dark:text-white">{customer.fullName}</h1>
                <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">Customer Profile</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative">
                <select
                  value={customer.status ?? 'PENDING'}
                  onChange={e => handleStatusChange(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-medium border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-surface-500 disabled:opacity-40 cursor-pointer"
                >
                  <option value="TERMINATED">Terminate</option>
                  <option value="ACTIVE">Active</option>
                </select>
              </div>
              
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/30 dark:text-red-400 dark:hover:bg-red-950/50 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 transition-colors"
              >
                <Trash2 size={14} />
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Phone size={16} className="text-surface-600 dark:text-surface-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">Contact Number</p>
                      <p className="text-sm font-medium text-surface-880 dark:text-surface-200">{customer.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Store size={16} className="text-surface-600 dark:text-surface-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">Store Name</p>
                      <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{customer.storeName ?? '—'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">Address</h3>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={16} className="text-surface-600 dark:text-surface-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">Registered Address</p>
                    <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{customer.address || 'No address on record'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Stats */}
              <div>
                <h3 className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">Statistics</h3>
                <div className="p-6 text-center">
                  <ShoppingBag size={32} className="mx-auto mb-3 text-surface-400" />
                  <p className="text-3xl font-bold text-surface-900 dark:text-white">{customer.totalOrders}</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                    {customer.totalOrders === 1 ? 'Order' : 'Orders'}
                  </p>
                </div>
              </div>

              {/* Account Details */}
              <div>
                <h3 className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">Account Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2.5 px-4">
                    <span className="text-xs font-medium text-surface-500 dark:text-surface-400">Status</span>
                    <span className="text-xs font-semibold text-surface-700 dark:text-surface-300">{customer.status ?? 'ACTIVE'}</span>
                  </div>
                  {customer.agent && (
                    <div className="flex items-center justify-between py-2.5 px-4">
                      <span className="text-xs font-medium text-surface-500 dark:text-surface-400">Assigned Agent</span>
                      <span className="text-xs font-semibold text-surface-700 dark:text-surface-300">{customer.agent}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between py-2.5 px-4">
                    <span className="text-xs font-medium text-surface-500 dark:text-surface-400">Customer ID</span>
                    <span className="text-xs font-mono font-semibold text-surface-700 dark:text-surface-300">{customer.id.slice(0, 12)}...</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}