import { useState } from 'react'
import { Plus, Edit2, Trash2, Search, AlertTriangle, Clock, Eye, Package, CheckSquare, Square } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
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
  const navigate = useNavigate()
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const filtered = items.filter(p =>
    (!categoryFilter || p.category.some(c => c.name === categoryFilter)) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) ||
     p.category.some(c => c.name.toLowerCase().includes(search.toLowerCase())) ||
     p.sku.toLowerCase().includes(search.toLowerCase()))
  )

  const allSelected = filtered.length > 0 && filtered.every(o => selectedIds.has(o.id))

  function toggleAll() {
    if (allSelected) setSelectedIds(new Set())
    else setSelectedIds(new Set(filtered.map(o => o.id)))
  }

  function toggleOne(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

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
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-surface-200/50 dark:bg-surface-800/50 text-surface-800 dark:text-surface-300 border border-surface-200 dark:border-surface-800">
          <AlertTriangle size={12} /> EXPIRED / CRITICAL
        </span>
      )
    }

    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-surface-50 dark:bg-surface-950/30 text-surface-700 dark:text-surface-400 border border-surface-200 dark:border-surface-800">
        <Clock size={12} /> Expiring Soon
      </span>
    )
  }



  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Inventory</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Manage your agrivet supply products</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-lg hover:bg-surface-800 dark:hover:bg-surface-200 transition-colors text-sm font-medium w-full sm:w-auto justify-center">
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div>
        <div className="px-4 sm:px-5 py-4 border-b border-surface-100 dark:border-surface-700 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative w-full sm:flex-1 sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 dark:text-surface-400" />
            <input type="text" placeholder="Search by name, SKU, category..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 placeholder:text-surface-400 dark:placeholder:text-surface-500" />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="py-2 px-3 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600">
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="p-5"><SkeletonCards count={8} /></div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-surface-500 dark:text-surface-400">
            <Package size={40} className="mx-auto mb-3 opacity-40" />
            <p>No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-50 dark:bg-surface-800/50 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-10">
                    <button onClick={toggleAll} className="flex items-center justify-center">
                      {allSelected ? <CheckSquare size={15} className="text-surface-500" /> : <Square size={15} className="text-surface-400" />}
                    </button>
                  </th>
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">Product Name</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock</th>
                  <th className="py-3.5 px-4">Packaging</th>
                  <th className="py-3.5 px-4">Expiry</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(item => {
                  const lowStock = item.reorderLevel > 0 && item.stock <= item.reorderLevel
                  const checked = selectedIds.has(item.id)
                  return (
                    <tr key={item.id} className={`border-b border-surface-100 dark:border-surface-800 transition-colors ${checked ? 'bg-surface-50/50 dark:bg-surface-950/20' : ''}`}>
                      <td className="py-3 px-4">
                        <button onClick={() => toggleOne(item.id)} className="flex items-center justify-center">
                          {checked ? <CheckSquare size={15} className="text-surface-600" /> : <Square size={15} className="text-surface-400" />}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-xs font-mono text-surface-500 dark:text-surface-400">#{item.id.slice(0, 6)}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-surface-700 flex items-center justify-center shrink-0 overflow-hidden">
                            <img src={item.image} alt={item.name}
                              className="w-full h-full object-cover"
                              onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/200x160/eee/999?text=N/A' }} />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-surface-800 dark:text-surface-200 truncate">{item.name}</p>
                            <p className="text-xs text-surface-500 dark:text-surface-400 font-mono">{item.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-surface-600 dark:text-surface-300">
                        <span className="truncate">{item.category.map(c => c.name).join(', ')}</span>
                        {item.subcategory && (
                          <span className="text-xs text-surface-500 dark:text-surface-400 block">{item.subcategory}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-surface-700 dark:text-surface-200">{settings.currencySymbol}{item.price.toFixed(2)}</td>
                      <td className="py-3 px-4">
                        <span className={lowStock ? 'text-surface-600 dark:text-surface-400 font-semibold' : 'text-surface-700 dark:text-surface-300'}>
                          {item.stock}
                        </span>
                        {lowStock && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] font-medium bg-surface-100 dark:bg-surface-900/40 text-surface-700 dark:text-surface-400">
                            Low
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-surface-500 dark:text-surface-400">{getUnitLabel(item.packagingUnit)}</td>
                      <td className="py-3 px-4"><ExpiryBadge expiryDate={item.expiryDate} /></td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => navigate(`/inventory/${item.id}`)}
                            className="p-1.5 text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors" title="View Details"><Eye size={15} /></button>
                          <button onClick={() => openEdit(item)}
                            className="p-1.5 text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors" title="Edit"><Edit2 size={15} /></button>
                          <button onClick={() => setDeleteId(item.id)}
                            className="p-1.5 text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors" title="Delete"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Drawer open={showDrawer} onClose={() => setShowDrawer(false)} title={editingItem ? 'Edit Product' : 'Add Product'} className="max-w-[700px]">
        <ItemForm form={form} onChange={setForm} categories={categories} currencySymbol={settings.currencySymbol} onImageFileChange={setImageFile} />
        <div className="flex gap-3 mt-6">
          <button onClick={handleSave} disabled={saving}
            className="flex-1 py-2.5 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-lg hover:bg-surface-800 dark:hover:bg-surface-200 transition-colors text-sm font-medium disabled:opacity-50">
            {saving ? 'Saving...' : 'Save'}
          </button>
          <button onClick={() => setShowDrawer(false)}
            className="px-4 py-2.5 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors text-sm font-medium">
            Cancel
          </button>
        </div>
      </Drawer>

      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Delete Product" size="sm">
        <div className="text-center">
          <p className="text-sm text-surface-600 dark:text-surface-300 mb-6">Are you sure you want to delete this product? This action cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={handleDelete}
              className="flex-1 py-2.5 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-lg hover:bg-surface-800 dark:hover:bg-surface-200 transition-colors text-sm font-medium">Delete</button>
            <button onClick={() => setDeleteId(null)}
              className="flex-1 py-2.5 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors text-sm font-medium">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
