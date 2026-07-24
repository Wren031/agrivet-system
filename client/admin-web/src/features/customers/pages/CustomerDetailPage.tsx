import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { User, Trash2, Package } from 'lucide-react'
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
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDelete, setShowDelete] = useState(false)

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
        <select
          value={customer.status ?? 'PENDING'}
          onChange={e => handleStatusChange(e.target.value)}
          className="appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-medium border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-surface-500 cursor-pointer"
        >
          <option value="TERMINATED">Terminate</option>
          <option value="ACTIVE">Active</option>
        </select>
        <button
          onClick={() => setShowDelete(true)}
          disabled={isDeleting}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 bg-white dark:bg-surface-800 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-50"
        >
          <Trash2 size={14} />
          {isDeleting ? 'Deleting...' : 'Delete'}
        </button>
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
