import { useState } from 'react'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import { useItems } from '../hooks/useItems'
import { useCategories } from '../../categories/hooks/useCategories'
import { createItem, updateItem, deleteItem } from '../services/itemService'
import { useApp } from '../../../context/AppContext'
import Drawer from '../../../components/Drawer'
import Modal from '../../../components/Modal'
import { SkeletonCards } from '../../../components/Skeleton'
import ItemForm from '../components/ItemForm'
import type { Item } from '../services/types'

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
     p.category.toLowerCase().includes(search.toLowerCase()))
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

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Inventory</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Manage your product inventory</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
          <Plus size={16} /> Add Item
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input type="text" placeholder="Search items..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
          </div>
          <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}
            className="py-2 px-3 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        {loading ? (
          <div className="p-5"><SkeletonCards count={8} /></div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-12 text-center text-slate-400 dark:text-slate-500">
            <p>No items found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 p-5">
            {filtered.map(item => (
              <div key={item.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img src={item.image} alt={item.name}
                    className="w-full h-40 object-cover bg-slate-50 dark:bg-slate-700"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/400x300/eee/999?text=N/A' }} />
                  <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-medium ${
                    item.stock <= settings.lowStockThreshold
                      ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                      : 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                  }`}>
                    {item.stock <= settings.lowStockThreshold ? 'Low Stock' : 'In Stock'}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-slate-800 dark:text-slate-200 truncate">{item.name}</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{item.category}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-slate-800 dark:text-slate-200">{settings.currencySymbol}{item.price.toFixed(2)}</span>
                    <span className={`text-sm font-medium ${item.stock <= settings.lowStockThreshold ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-300'}`}>
                      Stock: {item.stock}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                    <button onClick={() => openEdit(item)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition-colors"
                      title="Edit"><Edit2 size={14} /> Edit</button>
                    <button onClick={() => setDeleteId(item.id)}
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 text-sm font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 rounded-lg hover:bg-red-100 dark:hover:bg-red-950/50 transition-colors"
                      title="Delete"><Trash2 size={14} /> Delete</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Drawer open={showDrawer} onClose={() => setShowDrawer(false)} title={editingItem ? 'Edit Item' : 'Add Item'}>
        <ItemForm form={form} onChange={setForm} categories={categories} currencySymbol={settings.currencySymbol} />
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

      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Delete Item" size="sm">
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">Are you sure you want to delete this item? This action cannot be undone.</p>
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
