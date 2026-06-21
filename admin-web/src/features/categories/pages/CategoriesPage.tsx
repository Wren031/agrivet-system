import { useState, useMemo } from 'react'
import { Plus, Trash2, Edit2, Tag, Search, ChevronDown, ChevronRight } from 'lucide-react'
import { useCategories } from '../hooks/useCategories'
import { useApp } from '../../../context/AppContext'
import Drawer from '../../../components/Drawer'
import CategoryForm from '../components/CategoryForm'
import { SkeletonTable } from '../../../components/Skeleton'
import { createSubcategory, deleteSubcategory } from '../services/subcategoriesService'
import type { Category } from '../services/types'

const categoryColors = [
  { bg: 'bg-indigo-50 dark:bg-indigo-950/30', text: 'text-indigo-600 dark:text-indigo-400', dot: 'bg-indigo-500' },
  { bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-700 dark:text-indigo-300', dot: 'bg-indigo-600' },
  { bg: 'bg-indigo-200/50 dark:bg-indigo-800/50', text: 'text-indigo-800 dark:text-indigo-300', dot: 'bg-indigo-700' },
  { bg: 'bg-indigo-50 dark:bg-indigo-950/30', text: 'text-indigo-600 dark:text-indigo-400', dot: 'bg-indigo-500' },
  { bg: 'bg-indigo-100 dark:bg-indigo-900/40', text: 'text-indigo-700 dark:text-indigo-300', dot: 'bg-indigo-600' },
  { bg: 'bg-indigo-200/50 dark:bg-indigo-800/50', text: 'text-indigo-800 dark:text-indigo-300', dot: 'bg-indigo-700' },
]

export default function CategoriesPage() {
  const { categories, loading, add, remove, update, reload } = useCategories()
  const { addNotification } = useApp()
  const [search, setSearch] = useState('')
  const [showDrawer, setShowDrawer] = useState(false)
  const [editingCat, setEditingCat] = useState<Category | null>(null)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [expandedCat, setExpandedCat] = useState<string | null>(null)
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

  function getColor(index: number) {
    return categoryColors[index % categoryColors.length]
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Categories</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Manage product categories</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors text-sm font-medium shadow-sm shadow-indigo-200 dark:shadow-none w-full sm:w-auto justify-center">
          <Plus size={16} /> Add Category
        </button>
      </div>

      <div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden mb-6">
          <div className="px-4 sm:px-5 py-4 border-b border-slate-100 dark:border-slate-700">
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
                const isExpanded = expandedCat === cat.id
                return (
                  <div key={cat.id}>
                    <div className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors group">
                      <button onClick={() => { setExpandedCat(isExpanded ? null : cat.id); setSubName('') }}
                        className="p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                        {isExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                      </button>
                      <div className={`w-9 h-9 rounded-xl ${color.bg} flex items-center justify-center`}>
                        <Tag size={15} className={color.text} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{cat.name}</p>
                        {cat.subcategories && cat.subcategories.length > 0 && (
                          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{cat.subcategories.length} {cat.subcategories.length === 1 ? 'subcategory' : 'subcategories'}</p>
                        )}
                      </div>
                      <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                        <button onClick={() => openEdit(cat)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          title="Rename"><Edit2 size={15} /></button>
                        <button onClick={() => handleRemove(cat)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                          title="Remove"><Trash2 size={15} /></button>
                      </div>
                    </div>
                    {isExpanded && (
                      <div className="px-5 pb-4 pl-14 border-t border-slate-100 dark:border-slate-700">
                        <div className="pt-3 space-y-2">
                          {cat.subcategories && cat.subcategories.length > 0 ? (
                            cat.subcategories.map(sub => (
                              <div key={sub.id} className="flex items-center gap-2 group/sub">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
                                <span className="text-sm text-slate-600 dark:text-slate-400 flex-1">{sub.name}</span>
                                <button onClick={async () => {
                                  try {
                                    await deleteSubcategory(cat.id, sub.id)
                                    reload()
                                    addNotification({ message: `Subcategory "${sub.name}" removed`, type: 'success' })
                                  } catch {
                                    addNotification({ message: 'Failed to remove subcategory', type: 'error' })
                                  }
                                }}
                                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 opacity-100 sm:opacity-0 sm:group-hover/sub:opacity-100 transition-all"
                                  title="Remove subcategory"><Trash2 size={13} /></button>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-slate-400 dark:text-slate-500 italic">No subcategories</p>
                          )}
                          <div className="flex items-center gap-2 pt-1">
                            <input type="text" value={subName} onChange={e => setSubName(e.target.value)}
                              placeholder="Add subcategory..."
                              className="flex-1 px-3 py-1.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" />
                            <button onClick={async () => {
                              const trimmed = subName.trim()
                              if (!trimmed) return
                              setAddingSub(true)
                              try {
                                await createSubcategory(cat.id, trimmed)
                                setSubName('')
                                reload()
                                addNotification({ message: `Subcategory "${trimmed}" added`, type: 'success' })
                              } catch {
                                addNotification({ message: 'Failed to add subcategory', type: 'error' })
                              } finally {
                                setAddingSub(false)
                              }
                            }} disabled={addingSub || !subName.trim()}
                              className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs font-medium disabled:opacity-50">
                              {addingSub ? 'Adding...' : 'Add'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
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

      <Drawer open={showDrawer} onClose={() => { setShowDrawer(false); setEditingCat(null) }} title={editingCat ? 'Rename Category' : 'Add Category'} size="full" className="max-w-[400px]">
        <div className="flex flex-col h-full">
          <div className="flex-1">
            <CategoryForm name={name} onChange={setName} />
          </div>
          <div className="flex gap-3 pt-6 mt-6 border-t border-slate-100 dark:border-slate-800">
            <button onClick={handleSave} disabled={saving || !name.trim()}
              className="flex-1 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl hover:from-indigo-700 hover:to-indigo-800 transition-all duration-200 text-sm font-semibold disabled:opacity-50 shadow-sm shadow-indigo-200 dark:shadow-none">
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>
                  Saving...
                </span>
              ) : editingCat ? 'Rename' : 'Save'}
            </button>
            <button onClick={() => { setShowDrawer(false); setEditingCat(null) }}
              className="px-6 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200 text-sm font-medium">
              Cancel
            </button>
          </div>
        </div>
      </Drawer>
    </div>
  )
}
