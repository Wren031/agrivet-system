import type { Product } from '../services/types'

interface ProductFormProps {
  form: Partial<Product>
  onChange: (form: Partial<Product>) => void
  categories: string[]
}

export default function ProductForm({ form, onChange, categories }: ProductFormProps) {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Product Name</label>
        <input value={form.name || ''} onChange={e => onChange({ ...form, name: e.target.value })}
          className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
        <select value={form.category || ''} onChange={e => onChange({ ...form, category: e.target.value })}
          className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
          <option value="">Select category</option>
          {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price ({form.currency || '$'})</label>
          <input type="number" step="0.01" min="0" value={form.price ?? ''} onChange={e => onChange({ ...form, price: parseFloat(e.target.value) || 0 })}
            className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Stock</label>
          <input type="number" min="0" value={form.stock ?? ''} onChange={e => onChange({ ...form, stock: parseInt(e.target.value) || 0 })}
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
