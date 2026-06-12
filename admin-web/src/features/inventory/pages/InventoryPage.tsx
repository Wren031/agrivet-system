import { useState } from 'react'
import { Plus, Edit2, Trash2, Search, AlertTriangle, Clock } from 'lucide-react'
import { useItems } from '../hooks/useItems'
import { useCategories } from '../../categories/hooks/useCategories'
import { createItem, updateItem, deleteItem } from '../services/itemService'
import { useApp } from '../../../context/AppContext'
import Drawer from '../../../components/Drawer'
import Modal from '../../../components/Modal'
import { SkeletonTable } from '../../../components/Skeleton'
import ItemForm from '../components/ItemForm'
import type { Item } from '../services/types'

import { getUnitLabel, getExpiryStatus } from '../services/types'

export default function InventoryPage() {
  const { items, loading, reload } = useItems()
  const { categories } = useCategories()
  const { addNotification, settings } = useApp()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [showDrawer, setShowDrawer] = useState(false)

  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [form, setForm] = useState<Partial<Item>>({})

  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = items.filter(p =>
    (!categoryFilter || p.category === categoryFilter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.category.toLowerCase().includes(search.toLowerCase()) ||
     p.sku.toLowerCase().includes(search.toLowerCase()))
  )

  function openAdd() {
    setEditingItem(null)
    setForm({})
    setShowDrawer(true)
  }

  function openEdit(item: Item) {
    setEditingItem(item)
    setForm({ ...item })
    setShowDrawer(true)
  }

  async function handleSave() {
    if (!form.name?.trim()) return
    setSaving(true)
    try {
      const payload = { ...form }
      if (editingItem) {
        await updateItem(editingItem.id, payload)
        addNotification({ message: 'Item updated', type: 'success' })
      } else {
        await createItem(payload as Omit<Item, 'id'>)
        addNotification({ message: 'Item created', type: 'success' })
      }
      setShowDrawer(false)
      reload()
    } catch {
      addNotification({ message: 'Failed to save item', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      await deleteItem(deleteId)
      addNotification({ message: 'Item deleted', type: 'success' })
      setDeleteId(null)
      reload()
    } catch {
      addNotification({ message: 'Failed to delete item', type: 'error' })
    }
  }

  function ExpiryBadge({ expiryDate }: { expiryDate: string | null }) {
    const status = getExpiryStatus(expiryDate)
    if (!expiryDate || status === 'none') return null

    if (status === 'critical') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
          <AlertTriangle size={12} /> EXPIRED / CRITICAL
        </span>
      )
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
        <Clock size={12} /> Expiring Soon
      </span>
    )
  }

  function StockDisplay({ item }: { item: Item }) {
    const isLow = item.reorderLevel > 0 && item.stock <= item.reorderLevel
    const unitLabel = getUnitLabel(item.packagingUnit)

    return (
      <div className="flex items-center gap-2">
        <span className={isLow ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-slate-700 dark:text-slate-300'}>
          {item.stock} {unitLabel}
        </span>
        {isLow && (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800">
            Low Stock
          </span>
        )}
      </div>
    )
  }

  function formatDate(dateStr: string | null): string {
    if (!dateStr) return '—'
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Inventory</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Manage your agrivet supply products</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input type="text" placeholder="Search by name, SKU, category..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="py-2 px-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="p-5"><SkeletonTable rows={8} /></div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-slate-400 dark:text-slate-500">
            <p>No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">SKU</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Product</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Category</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Packaging</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Stock</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Reorder</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Expiry</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Price</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map(item => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 text-slate-500 dark:text-slate-400 font-mono text-xs">{item.sku}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name}
                          className="w-9 h-9 rounded-lg object-cover bg-slate-50 dark:bg-slate-700 flex-shrink-0"
                          onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/36x36/eee/999?text=N/A' }} />
                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate max-w-[220px]">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-700 dark:text-slate-300">{item.category}</div>
                      <div className="text-xs text-slate-400 dark:text-slate-500">{item.subcategory}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.packagingUnit || '—'}</td>
                    <td className="px-4 py-3"><StockDisplay item={item} /></td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{item.reorderLevel || '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className="text-slate-600 dark:text-slate-300">{formatDate(item.expiryDate)}</span>
                        <ExpiryBadge expiryDate={item.expiryDate} />
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-800 dark:text-slate-200">{settings.currencySymbol}{item.price.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => openEdit(item)}
                          className="p-1.5 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/30 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          title="Edit"><Edit2 size={15} /></button>
                        <button onClick={() => setDeleteId(item.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Delete"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Drawer open={showDrawer} onClose={() => setShowDrawer(false)} title={editingItem ? 'Edit Product' : 'Add Product'}>
        <ItemForm form={form} onChange={setForm} categories={categories.map(c => c.name)} currencySymbol={settings.currencySymbol} />
        <div className="flex gap-3 mt-6">
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={() => setShowDrawer(false)}
            className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium">
            Cancel
          </button>
        </div>
      </Drawer>

      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Delete Product" size="sm">
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={handleDelete}
              className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">Delete</button>
            <button onClick={() => setDeleteId(null)}
              className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
