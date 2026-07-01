import { useState, useMemo } from 'react'
import { Plus, Edit2, Trash2, Search, AlertTriangle, Clock, Eye, Package, CheckSquare, Square, ChevronLeft, ChevronRight } from 'lucide-react'
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

const PAGE_SIZE = 8

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
  const [page, setPage] = useState(1)
  const [showDrawer, setShowDrawer] = useState(false)

  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [form, setForm] = useState<Partial<Item>>({})
  const [imageFile, setImageFile] = useState<File | null>(null)

  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const filtered = useMemo(() =>
    items.filter(p =>
      (!categoryFilter || p.category.some(c => c.name === categoryFilter)) &&
      (p.name.toLowerCase().includes(search.toLowerCase()) ||
       p.category.some(c => c.name.toLowerCase().includes(search.toLowerCase())) ||
       p.sku.toLowerCase().includes(search.toLowerCase()))
    ),
    [items, search, categoryFilter]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const allSelected = paginated.length > 0 && paginated.every(o => selectedIds.has(o.id))

  function toggleAll() {
    if (allSelected) setSelectedIds(new Set())
    else setSelectedIds(new Set(paginated.map(o => o.id)))
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

      <div className="rounded-xl">
        <div className="px-4 sm:px-5 py-4 border-b border-surface-100 dark:border-surface-700 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <div className="relative w-full sm:flex-1 sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 dark:text-surface-400" />
            <input type="text" placeholder="Search by name, SKU, category..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-9 pr-3 py-2 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 placeholder:text-surface-400 dark:placeholder:text-surface-500" />
          </div>
          <select value={categoryFilter} onChange={e => { setCategoryFilter(e.target.value); setPage(1) }}
            className="py-2 px-3 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600">
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <div className="p-5"><SkeletonCards count={8} /></div>
        ) : paginated.length === 0 ? (
          <div className="px-5 py-12 text-center text-surface-500 dark:text-surface-400">
            <Package size={40} className="mx-auto mb-3 opacity-40" />
            <p>No products found</p>
          </div>
        ) : (
          <>
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4">
                <button onClick={toggleAll} className="flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 transition-colors">
                  {allSelected ? <CheckSquare size={14} /> : <Square size={14} />}
                  <span>{allSelected ? 'Deselect All' : 'Select All'}</span>
                </button>
                <span className="text-xs text-surface-400 dark:text-surface-500">({paginated.length} of {filtered.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginated.map(item => {
                  const lowStock = item.reorderLevel > 0 && item.stock <= item.reorderLevel
                  const checked = selectedIds.has(item.id)
                  return (
                    <div key={item.id}
                      className={`relative border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden bg-white dark:bg-surface-800 transition-all hover:shadow-md hover:-translate-y-0.5 ${checked ? 'ring-2 ring-surface-400 dark:ring-surface-500' : ''}`}>
                      <button onClick={() => toggleOne(item.id)}
                        className="absolute top-2.5 left-2.5 z-10 p-1 bg-white/80 dark:bg-surface-800/80 rounded-md transition-colors">
                        {checked ? <CheckSquare size={15} className="text-surface-600" /> : <Square size={15} className="text-surface-400" />}
                      </button>
                      <div className="h-36 bg-surface-50 dark:bg-surface-900/50 flex items-center justify-center overflow-hidden">
                        <img src={item.image} alt={item.name}
                          className="w-full h-full object-cover"
                          onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/200x160/eee/999?text=N/A' }} />
                      </div>
                      <div className="p-4">
                        <div className="mb-2">
                          <p className="font-medium text-surface-800 dark:text-surface-200 truncate">{item.name}</p>
                          <p className="text-xs text-surface-500 dark:text-surface-400 font-mono">#{item.id.slice(0, 6)} · {item.sku}</p>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-surface-500 dark:text-surface-400 mb-2">
                          <span className="truncate">{item.category.map(c => c.name).join(', ')}</span>
                          {item.subcategory && <><span>·</span><span className="truncate">{item.subcategory}</span></>}
                        </div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-surface-800 dark:text-surface-200">{settings.currencySymbol}{item.price.toFixed(2)}</span>
                          <div className="flex items-center gap-1.5">
                            <span className={lowStock ? 'text-surface-700 dark:text-surface-300 font-semibold' : 'text-surface-600 dark:text-surface-300'}>
                              {item.stock}
                            </span>
                            {lowStock && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-surface-100 dark:bg-surface-900/40 text-surface-700 dark:text-surface-400">
                                Low
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-surface-500 dark:text-surface-400">{getUnitLabel(item.packagingUnit)}</span>
                          <ExpiryBadge expiryDate={item.expiryDate} />
                        </div>
                      </div>
                      <div className="flex border-t border-surface-100 dark:border-surface-700 divide-x divide-surface-100 dark:divide-surface-700">
                        <button onClick={() => navigate(`/inventory/${item.id}`)}
                          className="flex-1 flex items-center justify-center gap-1 py-2.5 text-xs text-surface-500 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                          <Eye size={13} /> View
                        </button>
                        <button onClick={() => openEdit(item)}
                          className="flex-1 flex items-center justify-center gap-1 py-2.5 text-xs text-surface-500 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                          <Edit2 size={13} /> Edit
                        </button>
                        <button onClick={() => setDeleteId(item.id)}
                          className="flex-1 flex items-center justify-center gap-1 py-2.5 text-xs text-surface-500 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors">
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-4 border-t border-surface-100 dark:border-surface-700 text-sm">
                <p className="text-surface-500 dark:text-surface-400">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors text-xs disabled:opacity-40 disabled:cursor-not-allowed">
                    <ChevronLeft size={14} /> Prev
                  </button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors text-xs disabled:opacity-40 disabled:cursor-not-allowed">
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
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
