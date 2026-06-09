import { useState, useMemo } from 'react'
import { Plus, Trash2, Edit2, Tag, Search } from 'lucide-react'
import { useCategories } from '../hooks/useCategories'
import { addCategory, removeCategory, renameCategory } from '../services/categoriesService'
import { useApp } from '../../../context/AppContext'
import Drawer from '../../../components/Drawer'
import CategoryForm from '../components/CategoryForm'
import { SkeletonTable } from '../../../components/Skeleton'

const categoryColors = [
  { bg: 'bg-indigo-50 dark:bg-indigo-950/30', text: 'text-indigo-600 dark:text-indigo-400', dot: 'bg-indigo-500' },
  { bg: 'bg-emerald-50 dark:bg-emerald-950/30', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-500' },
  { bg: 'bg-amber-50 dark:bg-amber-950/30', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-500' },
  { bg: 'bg-rose-50 dark:bg-rose-950/30', text: 'text-rose-600 dark:text-rose-400', dot: 'bg-rose-500' },
  { bg: 'bg-cyan-50 dark:bg-cyan-950/30', text: 'text-cyan-600 dark:text-cyan-400', dot: 'bg-cyan-500' },
  { bg: 'bg-violet-50 dark:bg-violet-950/30', text: 'text-violet-600 dark:text-violet-400', dot: 'bg-violet-500' },
]

export default function CategoriesPage() {
  const { categories, loading, reload } = useCategories()
  const { addNotification } = useApp()
  const [search, setSearch] = useState('')
  const [showDrawer, setShowDrawer] = useState(false)
  const [editingCat, setEditingCat] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)

  const filtered = useMemo(() =>
    categories.filter(c => c.toLowerCase().includes(search.toLowerCase())),
    [categories, search]
  )

  function openAdd() {
    setEditingCat(null)
    setName('')
    setShowDrawer(true)
  }

  function openEdit(cat: string) {
    setEditingCat(cat)
    setName(cat)
    setShowDrawer(true)
  }

  async function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) return
    setSaving(true)
    try {
      if (editingCat) {
        if (editingCat === trimmed) { setShowDrawer(false); return }
        if (categories.includes(trimmed)) {
          addNotification({ message: 'Category already exists', type: 'warning' })
          return
        }
        await renameCategory(editingCat, trimmed)
        addNotification({ message: `Category renamed to "${trimmed}"`, type: 'success' })
      } else {
        if (categories.includes(trimmed)) {
          addNotification({ message: 'Category already exists', type: 'warning' })
          return
        }
        await addCategory(trimmed)
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

  async function handleRemove(cat: string) {
    try {
      await removeCategory(cat)
      addNotification({ message: `Category "${cat}" removed`, type: 'success' })
      reload()
    } catch {
      addNotification({ message: 'Failed to remove category', type: 'error' })
    }
  }

  function getColor(index: number) {
    return categoryColors[index % categoryColors.length]
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Categories</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Manage product categories</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm shadow-indigo-200 dark:shadow-none">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
          <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search categories..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" />
            </div>
          </div>

          {loading ? (
            <div className="p-5"><SkeletonTable rows={5} /></div>
          ) : filtered.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center mx-auto mb-4">
                <Tag size={28} className="text-slate-300 dark:text-slate-500" />
              </div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{search ? 'No matching categories' : 'No categories yet'}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{search ? 'Try a different search term' : 'Click "Add Category" to create one'}</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-700">
              {filtered.map((cat, i) => {
                const color = getColor(categories.indexOf(cat))
                return (
                  <div key={cat} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                    <div className={`w-9 h-9 rounded-xl ${color.bg} flex items-center justify-center`}>
                      <Tag size={15} className={color.text} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{cat}</p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openEdit(cat)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        title="Rename"><Edit2 size={15} /></button>
                      <button onClick={() => handleRemove(cat)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                        title="Remove"><Trash2 size={15} /></button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-indigo-50/50 dark:from-indigo-950/20 dark:to-indigo-950/10 border border-indigo-100 dark:border-indigo-900/50 rounded-xl px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">i</span>
            </div>
            <p className="text-xs text-indigo-700 dark:text-indigo-400 leading-relaxed">
              <strong>Note:</strong> Categories appear as options in the product form. Removing a category will not delete products using it, but their category field will remain unchanged.
            </p>
          </div>
        </div>
      </div>

      <Drawer open={showDrawer} onClose={() => { setShowDrawer(false); setEditingCat(null) }} title={editingCat ? 'Rename Category' : 'Add Category'}>
        <CategoryForm name={name} onChange={setName} />
        <div className="flex gap-3 mt-6">
          <button onClick={handleSave} disabled={saving || !name.trim()}
            className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50 shadow-sm shadow-indigo-200 dark:shadow-none">
            {saving ? 'Saving...' : editingCat ? 'Rename' : 'Save'}
          </button>
          <button onClick={() => { setShowDrawer(false); setEditingCat(null) }}
            className="px-4 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium">
            Cancel
          </button>
        </div>
      </Drawer>
    </div>
  )
}
