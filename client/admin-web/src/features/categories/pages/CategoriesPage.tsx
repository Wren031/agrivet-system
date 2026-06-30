import { useState, useMemo } from 'react'
import { Plus, Trash2, Edit2, Tag, Search, Users } from 'lucide-react'
import { useCategories } from '../hooks/useCategories'
import { useApp } from '../../../context/AppContext'
import Drawer from '../../../components/Drawer'
import CategoryForm from '../components/CategoryForm'
import { SkeletonTable } from '../../../components/Skeleton'
import Modal from '../../../components/Modal'
import { createSubcategory, deleteSubcategory } from '../services/subcategoriesService'
import type { Category } from '../services/types'



export default function CategoriesPage() {
  const { categories, loading, add, remove, update, reload } = useCategories()
  const { addNotification } = useApp()
  const [search, setSearch] = useState('')
  const [showDrawer, setShowDrawer] = useState(false)
  const [editingCat, setEditingCat] = useState<Category | null>(null)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [subModalCat, setSubModalCat] = useState<Category | null>(null)
  const [subName, setSubName] = useState('')
  const [addingSub, setAddingSub] = useState(false)

  const filtered = useMemo(() =>
    categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase())),
    [categories, search]
  )

  function openAdd() {
    setEditingCat(null)
    setName('')
    setShowDrawer(true)
  }

  function openEdit(cat: Category) {
    setEditingCat(cat)
    setName(cat.name)
    setShowDrawer(true)
  }

  async function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) return
    setSaving(true)
    try {
      if (editingCat) {
        if (editingCat.name === trimmed) { setShowDrawer(false); return }
        await update(editingCat.id, trimmed)
        addNotification({ message: `Category renamed to "${trimmed}"`, type: 'success' })
      } else {
        await add(trimmed)
        addNotification({ message: `Category "${trimmed}" added`, type: 'success' })
      }
      setName('')
      setEditingCat(null)
      setShowDrawer(false)
      reload()
    } catch {
      addNotification({ message: 'Failed to save category', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  async function handleRemove(cat: Category) {
    try {
      await remove(cat.id)
      addNotification({ message: `Category "${cat.name}" removed`, type: 'success' })
      reload()
    } catch {
      addNotification({ message: 'Failed to remove category', type: 'error' })
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Categories</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Manage product categories</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-xl hover:bg-surface-800 dark:hover:bg-surface-200 transition-colors text-sm font-medium w-full sm:w-auto justify-center">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div className="relative w-full sm:max-w-xs mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input type="text" placeholder="Search categories..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 placeholder:text-surface-400" />
      </div>

      {loading ? (
        <SkeletonTable rows={5} />
      ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-surface-500 dark:text-surface-400">
          <Users size={48} className="mx-auto mb-3 opacity-40" />
          <p>{search ? 'No matching categories' : 'No categories yet'}</p>
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-50 dark:bg-surface-800/50 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4"></th>
                  <th className="py-3.5 px-4">Name</th>
                  <th className="py-3.5 px-4">Subcategories</th>
                  <th className="py-3.5 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((cat, i) => (
                    <tr key={cat.id} className="border-b border-surface-100 dark:border-surface-800 transition-colors">
                      <td className="py-3 px-4 w-10">
                        <button onClick={() => setSubModalCat(cat)}
                          className="p-1 text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors">
                          <Users size={14} />
                        </button>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-surface-700 flex items-center justify-center shrink-0">
                            <Tag size={14} className="text-surface-500 dark:text-surface-400" />
                          </div>
                          <span className="font-medium text-surface-800 dark:text-surface-200">{cat.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-surface-500 dark:text-surface-400">{cat.subcategories?.length ?? 0}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => openEdit(cat)}
                            className="p-1.5 text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors" title="Rename"><Edit2 size={15} /></button>
                          <button onClick={() => handleRemove(cat)}
                            className="p-1.5 text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors" title="Remove"><Trash2 size={15} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

        <div className="border border-dashed border-surface-300 dark:border-surface-600 rounded-xl px-5 py-4 mt-6">
          <p className="text-xs text-surface-500 dark:text-surface-400 leading-relaxed">
            <strong>Note:</strong> Categories appear as options in the product form. Removing a category will not delete products using it, but their category field will remain unchanged.
          </p>
        </div>

      <Modal open={subModalCat !== null} onClose={() => { setSubModalCat(null); setSubName('') }} title={subModalCat ? `Subcategories - ${subModalCat.name}` : ''} size="md">
        {subModalCat && (
          <div className="space-y-4">
            {subModalCat.subcategories && subModalCat.subcategories.length > 0 ? (
              subModalCat.subcategories.map(sub => (
                <div key={sub.id} className="flex items-center gap-3 py-2 border-b border-surface-100 dark:border-surface-700 last:border-b-0">
                  <span className="w-2 h-2 rounded-full bg-surface-300 dark:bg-surface-600" />
                  <span className="text-sm text-surface-700 dark:text-surface-300 flex-1">{sub.name}</span>
                  <button onClick={async () => {
                    try {
                      await deleteSubcategory(subModalCat.id, sub.id)
                      reload()
                      addNotification({ message: `Subcategory "${sub.name}" removed`, type: 'success' })
                    } catch {
                      addNotification({ message: 'Failed to remove subcategory', type: 'error' })
                    }
                  }}
                    className="p-1 rounded text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors"
                    title="Remove subcategory"><Trash2 size={14} /></button>
                </div>
              ))
            ) : (
              <p className="text-sm text-surface-500 dark:text-surface-400 italic">No subcategories</p>
            )}
            <div className="flex items-center gap-2 pt-3 border-t border-surface-100 dark:border-surface-700">
              <input type="text" value={subName} onChange={e => setSubName(e.target.value)}
                placeholder="Add subcategory..."
                className="flex-1 px-3 py-2 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 placeholder:text-surface-400" />
              <button onClick={async () => {
                const trimmed = subName.trim()
                if (!trimmed || !subModalCat) return
                setAddingSub(true)
                try {
                  await createSubcategory(subModalCat.id, trimmed)
                  setSubName('')
                  reload()
                  addNotification({ message: `Subcategory "${trimmed}" added`, type: 'success' })
                } catch {
                  addNotification({ message: 'Failed to add subcategory', type: 'error' })
                } finally {
                  setAddingSub(false)
                }
              }} disabled={addingSub || !subName.trim()}
                className="px-4 py-2 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-lg hover:bg-surface-800 dark:hover:bg-surface-200 transition-colors text-sm font-medium disabled:opacity-50">
                {addingSub ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        )}
      </Modal>
      <Drawer open={showDrawer} onClose={() => { setShowDrawer(false); setEditingCat(null) }} title={editingCat ? 'Rename Category' : 'Add Category'} className="max-w-[350px]">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <CategoryForm name={name} onChange={setName} />
          </div>
          <div className="flex gap-3 pt-6 mt-6 border-t border-surface-100 dark:border-surface-800">
            <button onClick={handleSave} disabled={saving || !name.trim()}
              className="flex-1 py-2.5 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-xl hover:bg-surface-800 dark:hover:bg-surface-200 transition-all duration-200 text-sm font-semibold disabled:opacity-50">
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  Saving...
                </span>
              ) : editingCat ? 'Rename' : 'Save'}
            </button>
            <button onClick={() => { setShowDrawer(false); setEditingCat(null) }}
              className="px-6 py-2.5 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-800 transition-all duration-200 text-sm font-medium">
              Cancel
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  )
}
