import { useState } from 'react'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import { useCategories } from '../../categories/hooks/useCategories'
import { createProduct, updateProduct, deleteProduct } from '../services/productService'
import { useApp } from '../../../context/AppContext'
import Drawer from '../../../components/Drawer'
import Modal from '../../../components/Modal'
import { SkeletonTable } from '../../../components/Skeleton'
import ProductForm from '../components/ProductForm'
import type { Product } from '../services/types'

export default function InventoryPage() {
  const { products, loading, reload: refresh } = useProducts()
  const { categories } = useCategories()
  const { addNotification, settings } = useApp()
  const [search, setSearch] = useState('')
  const [showDrawer, setShowDrawer] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState<Partial<Product>>({})
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  )

  function openAdd() {
    setEditingProduct(null)
    setForm({ currency: settings.currencySymbol })
    setShowDrawer(true)
  }

  function openEdit(product: Product) {
    setEditingProduct(product)
    setForm({ ...product })
    setShowDrawer(true)
  }

  async function handleSave() {
    if (!form.name?.trim()) return
    setSaving(true)
    try {
      const payload = { ...form, currency: settings.currencySymbol }
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload)
        addNotification({ message: 'Product updated', type: 'success' })
      } else {
        await createProduct(payload as Omit<Product, 'id'>)
        addNotification({ message: 'Product created', type: 'success' })
      }
      setShowDrawer(false)
      refresh()
    } catch {
      addNotification({ message: 'Failed to save product', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      await deleteProduct(deleteId)
      addNotification({ message: 'Product deleted', type: 'success' })
      setDeleteId(null)
      refresh()
    } catch {
      addNotification({ message: 'Failed to delete product', type: 'error' })
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
          <Plus size={16} /> Add Product
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <div className="relative max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-5"><SkeletonTable rows={6} /></div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3">Product</th><th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Price</th><th className="px-5 py-3">Stock</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500">
                    <p>No products found</p>
                  </td></tr>
                ) : (
                  filtered.map(product => (
                    <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                            onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/eee/999?text=N/A' }} />
                          <span className="font-medium text-slate-800 dark:text-slate-200">{product.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-slate-600 dark:text-slate-300">{product.category}</td>
                      <td className="px-5 py-3 text-slate-700 dark:text-slate-200 font-medium">{product.currency}{product.price.toFixed(2)}</td>
                      <td className="px-5 py-3">
                        <span className={`text-sm font-medium ${product.stock <= settings.lowStockThreshold ? 'text-red-600 dark:text-red-400' : 'text-slate-700 dark:text-slate-200'}`}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.stock <= settings.lowStockThreshold
                            ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                            : 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                        }`}>
                          {product.stock <= settings.lowStockThreshold ? 'Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(product)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            title="Edit"><Edit2 size={16} /></button>
                          <button onClick={() => setDeleteId(product.id)}
                            className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                            title="Delete"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Drawer open={showDrawer} onClose={() => setShowDrawer(false)} title={editingProduct ? 'Edit Product' : 'Add Product'}>
        <ProductForm form={form} onChange={setForm} categories={categories} />
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
