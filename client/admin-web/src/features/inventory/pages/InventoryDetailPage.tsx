import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Package, AlertTriangle, Clock } from 'lucide-react'
import { fetchItem } from '../services/itemService'
import { getExpiryStatus, getUnitLabel } from '../services/types'
import type { Item } from '../services/types'
import { useApp } from '../../../context/AppContext'
import {
  DetailLayout,
  DetailHeader,
  DetailSection,
  DetailField,
  DetailGrid,
  DetailEmptyState,
} from '../../../components/detail'

function ExpiryBadge({ expiryDate }: { expiryDate: string | null }) {
  const status = getExpiryStatus(expiryDate)
  if (!expiryDate || status === 'none') return <span className="text-sm text-surface-500">No expiry</span>

  if (status === 'critical') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
        <AlertTriangle size={12} /> EXPIRED / CRITICAL
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
      <Clock size={12} /> Expiring Soon
    </span>
  )
}

export default function InventoryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addNotification, settings } = useApp()

  const [item, setItem] = useState<Item | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchItem(id)
      .then(setItem)
      .catch(() => addNotification({ message: 'Failed to load item', type: 'error' }))
      .finally(() => setLoading(false))
  }, [id, addNotification])

  if (loading) {
    return (
      <DetailLayout loading backTo="/inventory" backLabel="Back to Inventory" />
    )
  }

  if (!item) {
    return (
      <DetailLayout backTo="/inventory" backLabel="Back to Inventory">
        <DetailEmptyState
          
          title="Item Not Found"
          message="The inventory item you are looking for could not be found."
          backLabel="Back to Inventory"
          onBack={() => navigate('/inventory')}
        />
      </DetailLayout>
    )
  }

  return (
    <DetailLayout backTo="/inventory" backLabel="Back to Inventory">
      <DetailHeader
        title={item.name}
        subtitle={`SKU: ${item.sku}`}
        avatarSrc={item.image}
        avatar={item.name.charAt(0)}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DetailSection title="Product Information" >
            <DetailGrid cols={2}>
              <DetailField  label="Category" value={item.category.map(c => c.name).join(', ')} />
              <DetailField  label="Packaging Unit" value={item.packagingUnit} />
              <DetailField  label="Selling Price" value={`${settings.currencySymbol}${item.price.toFixed(2)}`} />
              <DetailField  label="Cost Price" value={`${settings.currencySymbol}${item.costPrice.toFixed(2)}`} />
            </DetailGrid>
          </DetailSection>
        </div>

        <div className="space-y-6">
          <DetailSection title="Stock Overview" >
            <div className="text-center py-2">
              <Package size={36} className="mx-auto mb-3 text-surface-300 dark:text-surface-600" />
              <p className="text-3xl font-bold text-surface-900 dark:text-white">{item.stock}</p>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{getUnitLabel(item.packagingUnit)}</p>
            </div>
          </DetailSection>

          <DetailSection title="Details" >
            <DetailField inline label="Reorder Level" value={item.reorderLevel} />
            <div className="flex items-center justify-between py-2.5">
              <span className="text-xs font-medium text-surface-500 dark:text-surface-400">Expiry</span>
              <ExpiryBadge expiryDate={item.expiryDate} />
            </div>
            <DetailField inline label="Product ID" value={`${item.id.slice(0, 12)}...`} mono />
          </DetailSection>
        </div>
      </div>
    </DetailLayout>
  )
}
