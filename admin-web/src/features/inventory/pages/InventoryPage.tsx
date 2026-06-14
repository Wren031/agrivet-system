import { useState } from 'react'
import { Plus, Edit2, Trash2, Search, AlertTriangle, Clock, Package } from 'lucide-react'
import { useItems } from '../hooks/useItems'
import { useCategories } from '../../categories/hooks/useCategories'
import { createItem, updateItem, deleteItem } from '../services/itemService'
import { uploadFile } from '../../../config/apiClient'
import { useApp } from '../../../context/AppContext'
import Drawer from '../../../components/Drawer'
import Modal from '../../../components/Modal'
import { SkeletonCards } from '../../../components/Skeleton'
import ItemForm from '../components/ItemForm'
import type { Item } from '../services/types'

import { getUnitLabel, getExpiryStatus } from '../services/types'

const CATEGORY_SKU_MAP: Record<string, string> = {
  'Feeds & Nutrition': 'FED',
  'Veterinary Drugs & Biologics': 'VET',
  'Agricultural Inputs': 'AGR',
  'Farm Equipment & Hardware': 'EQP',
}

function generateSku(category: string, existing: Item[]): string {
  const prefix = CATEGORY_SKU_MAP[category] || 'GEN'
  const nums = existing
    .filter(i => i.sku?.startsWith(prefix))
    .map(i => {
      const parts = i.sku.split('-')
      return parseInt(parts[1], 10)
    })
    .filter(n => !isNaN(n))
  const next = nums.length ? Math.max(...nums) + 1 : 1
  return `${prefix}-${String(next).padStart(3, '0')}`
}

export default function InventoryPage() {
  const { items, loading, reload } = useItems()
  const { categories } = useCategories()
  const { addNotification, settings } = useApp()
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [showDrawer, setShowDrawer] = useState(false)

  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [form, setForm] = useState<Partial<Item>>({})
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = items.filter(p =>
    (!categoryFilter || p.category.some(c => c.name === categoryFilter)) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.category.some(c => c.name.toLowerCase().includes(search.toLowerCase())) ||
     p.sku.toLowerCase().includes(search.toLowerCase()))
  )

  function openAdd() {
    setEditingItem(null)
    setForm({})
    setImageFile(null)
    setShowDrawer(true)
  }

  function openEdit(item: Item) {
    setEditingItem(item)
    setForm({ ...item })
    setImageFile(null)
    setShowDrawer(true)
  }

  async function handleSave() {
    if (!form.name?.trim()) return
    setSaving(true)
    try {
      let imageUrl = form.image || ''
      if (imageFile) {
        imageUrl = await uploadFile(imageFile)
      }

      const categoryId = form.category?.[0]?.id
      const selectedCategory = categories.find(c => c.id === categoryId)
      const subcategoryId = selectedCategory?.subcategories?.find(s => s.name === form.subcategory)?.id

      if (editingItem) {
        const { id, createdAt, category, subcategory, sku, ...updates } = form
        await updateItem(editingItem.id, { ...updates, image: imageUrl, categoryId, subcategoryId })
        addNotification({ message: 'Item updated', type: 'success' })
      } else {
        const categoryName = form.category?.[0]?.name || ''
        await createItem({
          name: form.name || '',
          sku: form.sku || generateSku(categoryName, items),
          category: form.category || [],
          subcategory: form.subcategory || '',
          packagingUnit: form.packagingUnit || '',
          costPrice: form.costPrice || 0,
          expiryDate: form.expiryDate || null,
          reorderLevel: form.reorderLevel || 0,
          price: form.price || 0,
          stock: form.stock || 0,
          image: imageUrl,
          categoryId,
          subcategoryId,
        })
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
          <div className="p-5"><SkeletonCards count={8} /></div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-slate-400 dark:text-slate-500">
            <Package size={40} className="mx-auto mb-3 opacity-40" />
            <p>No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-5">
            {filtered.map(item => (
              <div key={item.id} className="group bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:border-indigo-200 dark:hover:border-indigo-800 transition-all duration-200">
                <div className="relative h-40 bg-slate-50 dark:bg-slate-700">
                  <img src={item.image} alt={item.name}
                    className="w-full h-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/200x160/eee/999?text=N/A' }} />
                  <div className="absolute top-2 right-2 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-2.5 py-1 rounded-lg text-sm font-bold text-slate-800 dark:text-slate-200 shadow-sm text-right leading-tight">
                    <div>{settings.currencySymbol}{item.price.toFixed(2)}</div>
                    {item.costPrice > 0 && (
                      <div className="text-xs font-normal text-slate-400 dark:text-slate-500">
                        Cost: {settings.currencySymbol}{item.costPrice.toFixed(2)}
                      </div>
                    )}
                  </div>
                  {item.reorderLevel > 0 && item.stock <= item.reorderLevel && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-500 text-white shadow-sm">
                        Low Stock
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-4 space-y-2.5">
                  <div>
                    <h3 className="font-semibold text-slate-800 dark:text-slate-200 truncate leading-snug">{item.name}</h3>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-mono">{item.sku}</span>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
                    <span className="truncate">{item.category.map(c => c.name).join(', ')}</span>
                    {item.subcategory && (
                      <>
                        <span className="text-slate-300 dark:text-slate-600">›</span>
                        <span className="truncate">{item.subcategory}</span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <span className={item.stock <= item.reorderLevel ? 'text-red-600 dark:text-red-400 font-semibold' : 'text-slate-700 dark:text-slate-300'}>
                      {item.stock} {getUnitLabel(item.packagingUnit)}
                    </span>
                    {item.reorderLevel > 0 && (
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        Reorder at {item.reorderLevel}
                      </span>
                    )}
                  </div>

                  <ExpiryBadge expiryDate={item.expiryDate} />

                  {item.packagingUnit && (
                    <div className="text-xs text-slate-400 dark:text-slate-500">
                      {item.packagingUnit}
                    </div>
                  )}

                  <div className="flex items-center gap-2 pt-2.5 border-t border-slate-100 dark:border-slate-700">
                    <button onClick={() => openEdit(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors">
                      <Edit2 size={13} /> Edit
                    </button>
                    <button onClick={() => setDeleteId(item.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Drawer open={showDrawer} onClose={() => setShowDrawer(false)} title={editingItem ? 'Edit Product' : 'Add Product'} className="max-w-[700px]">
        <ItemForm form={form} onChange={setForm} categories={categories} currencySymbol={settings.currencySymbol} onImageFileChange={setImageFile} />
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
