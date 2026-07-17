import { useState, useMemo } from 'react'
import { Plus, Trash2, Edit2, Tag, Search, FolderSync } from 'lucide-react'
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
    <div className="max-w-7xl mx-auto px-4 py-2">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Categories</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">Manage product taxonomy</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-lg hover:bg-surface-800 dark:hover:bg-surface-100 transition-colors text-sm font-medium w-full sm:w-auto justify-center">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* Control Bar */}
      <div className="relative w-full sm:max-w-xs mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
        <input type="text" placeholder="Search categories..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-900 dark:focus:ring-white placeholder:text-surface-400" />
      </div>

{/* Grid Content */}
{loading ? (
  <SkeletonTable rows={5} />
) : filtered.length === 0 ? (
  <div className="text-center py-16 border border-dashed border-surface-200 dark:border-surface-700 rounded-xl text-surface-500 dark:text-surface-400">
    <FolderSync size={40} className="mx-auto mb-3 text-surface-300 dark:text-surface-600" />
    <p className="text-sm">{search ? 'No matching categories found' : 'No categories created yet'}</p>
  </div>
) : (
  <div className="grid grid-cols-1 gap-3">
    {filtered.map((cat) => (
      <div 
        key={cat.id} 
        className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl hover:bg-surface-50/40 dark:hover:bg-surface-800/80 transition-all duration-150"
      >
        {/* Left Side: Identity & Meta */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-surface-700/40 flex items-center justify-center shrink-0">
            <Tag size={14} className="text-surface-500 dark:text-surface-400" />
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 flex-1 min-w-0">
            <h3 className="font-medium text-surface-900 dark:text-white text-sm truncate max-w-[200px]">
              {cat.name}
            </h3>
            
            <div className="hidden md:block text-[11px] font-mono text-surface-400 dark:text-surface-500 truncate">
              ID: {cat.id.toString().slice(0, 8)}
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Badge & Actions */}
        <div className="flex items-center justify-between sm:justify-end gap-6 mt-3 sm:mt-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-surface-100 dark:border-surface-700">
          {/* Action Trigger Badge */}
          <button 
            onClick={() => setSubModalCat(cat)}
            className="text-xs font-medium text-surface-600 dark:text-surface-400 hover:text-surface-900 dark:hover:text-white bg-surface-50 hover:bg-surface-100 dark:bg-surface-700/40 dark:hover:bg-surface-700 px-2.5 py-1 rounded-md border border-surface-200/50 dark:border-surface-700/60 transition-colors"
          >
            {cat.subcategories?.length ?? 0} {cat.subcategories?.length === 1 ? 'subcategory' : 'subcategories'}
          </button>

          {/* Action Icons */}
          <div className="flex items-center gap-1">
            <button 
              onClick={() => openEdit(cat)}
              className="p-2 text-surface-400 hover:text-surface-900 dark:hover:text-white hover:bg-surface-100 dark:hover:bg-surface-700/50 rounded-lg transition-colors" 
              title="Rename"
            >
              <Edit2 size={14} />
            </button>
            <button 
              onClick={() => handleRemove(cat)}
              className="p-2 text-surface-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors" 
              title="Remove"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>

      </div>
    ))}
  </div>
)}


      {/* Subcategory modal overlay */}
      <Modal open={subModalCat !== null} onClose={() => { setSubModalCat(null); setSubName('') }} title={subModalCat ? `Subcategories — ${subModalCat.name}` : ''} size="md">
        {subModalCat && (
          <div className="space-y-4">
            {subModalCat.subcategories && subModalCat.subcategories.length > 0 ? (
              <div className="space-y-1.5">
                {subModalCat.subcategories.map(sub => (
                  <div key={sub.id} className="flex items-center gap-3 py-2 px-2.5 bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-100 dark:border-surface-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-surface-400" />
                    <span className="text-xs font-medium text-surface-700 dark:text-surface-300 flex-1">{sub.name}</span>
                    <button onClick={async () => {
                      try {
                        await deleteSubcategory(subModalCat.id, sub.id)
                        reload()
                        addNotification({ message: `Subcategory "${sub.name}" removed`, type: 'success' })
                      } catch {
                        addNotification({ message: 'Failed to remove subcategory', type: 'error' })
                      }
                    }}
                      className="p-1 rounded text-surface-400 hover:text-red-600 transition-colors"
                      title="Remove subcategory"><Trash2 size={13} /></button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-surface-400 dark:text-surface-500 italic py-2 text-center">No subcategories defined.</p>
            )}
            <div className="flex items-center gap-2 pt-3 border-t border-surface-100 dark:border-surface-700">
              <input type="text" value={subName} onChange={e => setSubName(e.target.value)}
                placeholder="New subcategory name..."
                className="flex-1 px-3 py-1.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-surface-900 dark:focus:ring-white placeholder:text-surface-400" />
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
                className="px-3 py-1.5 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-lg hover:bg-surface-800 dark:hover:bg-surface-200 transition-colors text-xs font-medium disabled:opacity-50">
                {addingSub ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Drawer Configuration */}
      <Drawer open={showDrawer} onClose={() => { setShowDrawer(false); setEditingCat(null) }} title={editingCat ? 'Rename Category' : 'Add Category'} size="350">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <CategoryForm name={name} onChange={setName} />
          </div>
          <div className="flex gap-2 pt-4 mt-4 border-t border-surface-100 dark:border-surface-700">
            <button onClick={handleSave} disabled={saving || !name.trim()}
              className="flex-1 py-2 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-lg hover:bg-surface-800 dark:hover:bg-surface-200 transition-colors text-sm font-medium disabled:opacity-50">
              {saving ? 'Saving...' : editingCat ? 'Rename' : 'Save'}
            </button>
            <button onClick={() => { setShowDrawer(false); setEditingCat(null) }}
              className="px-4 py-2 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors text-sm font-medium">
              Cancel
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  )
}