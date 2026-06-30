import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Package, Tag, DollarSign, Layers, Calendar, AlertTriangle, Clock } from 'lucide-react'
import { fetchItem } from '../services/itemService'
import { getExpiryStatus, getUnitLabel } from '../services/types'
import type { Item } from '../services/types'
import { useApp } from '../../../context/AppContext'

function ExpiryBadge({ expiryDate }: { expiryDate: string | null }) {
  const status = getExpiryStatus(expiryDate)
  if (!expiryDate || status === 'none') return <span className="text-sm text-surface-600 dark:text-surface-300">No expiry</span>

  if (status === 'critical') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
        <AlertTriangle size={12} /> EXPIRED / CRITICAL
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
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
    return <div className="text-center py-16 text-surface-400">Loading...</div>
  }

  if (!item) {
    return (
      <div className="text-center py-16 text-surface-500 dark:text-surface-400">
        <p className="text-lg font-medium">Item not found</p>
        <button onClick={() => navigate('/inventory')}
          className="mt-4 text-sm text-surface-600 dark:text-surface-400 hover:underline">
          Back to Inventory
        </button>
      </div>
    )
  }

  return (
    <div>
      <button onClick={() => navigate('/inventory')}
        className="flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Inventory
      </button>

      <div>
        {/* Header */}
        <div className="px-4 sm:px-6 py-6 border-b border-surface-100 dark:border-surface-700">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0 overflow-hidden border border-surface-200 dark:border-surface-700">
              <img src={item.image} alt={item.name}
                className="w-full h-full object-cover"
                onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/200x160/eee/999?text=N/A' }} />
            </div>
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white">{item.name}</h1>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1 font-mono">{item.sku}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Product Information */}
              <div>
                <h3 className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">Product Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Tag size={16} className="text-surface-600 dark:text-surface-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">Category</p>
                      <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{item.category.map(c => c.name).join(', ') || '—'}</p>
                      {item.subcategory && (
                        <p className="text-xs text-surface-500 dark:text-surface-400">{item.subcategory}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Layers size={16} className="text-surface-600 dark:text-surface-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">Packaging Unit</p>
                      <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{item.packagingUnit || '—'}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0 mt-0.5">
                      <DollarSign size={16} className="text-surface-600 dark:text-surface-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">Selling Price</p>
                      <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{settings.currencySymbol}{item.price.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0 mt-0.5">
                      <DollarSign size={16} className="text-surface-600 dark:text-surface-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">Cost Price</p>
                      <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{settings.currencySymbol}{item.costPrice.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Stock Stats */}
              <div>
                <h3 className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">Stock Overview</h3>
                <div className="p-6 text-center">
                  <Package size={32} className="mx-auto mb-3 text-surface-400" />
                  <p className="text-3xl font-bold text-surface-900 dark:text-white">{item.stock}</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{getUnitLabel(item.packagingUnit)}</p>
                </div>
              </div>

              {/* Details */}
              <div>
                <h3 className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2.5 px-4">
                    <span className="text-xs font-medium text-surface-500 dark:text-surface-400">Reorder Level</span>
                    <span className="text-xs font-semibold text-surface-700 dark:text-surface-300">{item.reorderLevel}</span>
                  </div>
                  <div className="flex items-center justify-between py-2.5 px-4">
                    <span className="text-xs font-medium text-surface-500 dark:text-surface-400">Expiry</span>
                    <ExpiryBadge expiryDate={item.expiryDate} />
                  </div>
                  <div className="flex items-center justify-between py-2.5 px-4">
                    <span className="text-xs font-medium text-surface-500 dark:text-surface-400">Product ID</span>
                    <span className="text-xs font-mono font-semibold text-surface-700 dark:text-surface-300">{item.id.slice(0, 12)}...</span>
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
