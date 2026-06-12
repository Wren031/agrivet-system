import { type Item, CATEGORY_SUBCATEGORIES, PACKAGING_UNITS } from '../services/types'

interface ItemFormProps {
  form: Partial<Item>
  onChange: (form: Partial<Item>) => void
  categories: string[]
  currencySymbol?: string
}

export default function ItemForm({ form, onChange, categories, currencySymbol = '₱' }: ItemFormProps) {
  const subcategories = CATEGORY_SUBCATEGORIES[form.category || ''] || []

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product Name</label>
        <input value={form.name || ''} onChange={e => onChange({ ...form, name: e.target.value })}
          className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
          <select value={form.category || ''} onChange={e => {
            onChange({ ...form, category: e.target.value, subcategory: '' })
          }}
            className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Select category</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subcategory</label>
          <select value={form.subcategory || ''} onChange={e => onChange({ ...form, subcategory: e.target.value })}
            disabled={!form.category}
            className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
            <option value="">Select subcategory</option>
            {subcategories.map(sub => <option key={sub} value={sub}>{sub}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Packaging Unit</label>
          <select value={form.packagingUnit || ''} onChange={e => onChange({ ...form, packagingUnit: e.target.value })}
            className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="">Select packaging</option>
            {PACKAGING_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expiry Date</label>
          <input type="date" value={form.expiryDate || ''} onChange={e => onChange({ ...form, expiryDate: e.target.value || null })}
            className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Leave empty for non-perishable items</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price ({currencySymbol})</label>
          <input type="number" step="0.01" min="0" value={form.price ?? ''} onChange={e => onChange({ ...form, price: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stock Qty</label>
          <input type="number" min="0" value={form.stock ?? ''} onChange={e => onChange({ ...form, stock: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reorder Level</label>
          <input type="number" min="0" value={form.reorderLevel ?? ''} onChange={e => onChange({ ...form, reorderLevel: parseInt(e.target.value) || 0 })}
            className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Image URL</label>
        <input value={form.image || ''} onChange={e => onChange({ ...form, image: e.target.value })}
          placeholder="https://example.com/image.jpg"
          className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
      </div>
      {form.image && (
        <div>
          <p className="text-xs text-slate-400 dark:text-slate-500 mb-2">Preview:</p>
          <img src={form.image} alt="preview"
            className="w-24 h-24 object-cover rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/eee/999?text=No+Image' }} />
        </div>
      )}
    </div>
  )
}
