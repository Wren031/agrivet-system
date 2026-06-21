import { useRef } from 'react'
import { type Item, PACKAGING_UNITS } from '../services/types'
import type { Category } from '../../categories/services/types'

interface ItemFormProps {
  form: Partial<Item>
  onChange: (form: Partial<Item>) => void
  categories: Category[]
  currencySymbol?: string
  onImageFileChange?: (file: File | null) => void
}

function SectionHeader({ number, title }: { number: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5 select-none">
      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 text-xs font-bold ring-1 ring-indigo-500/10">
        {number}
      </span>
      <h3 className="text-sm font-semibold tracking-wide text-slate-800 dark:text-slate-200">{title}</h3>
      <div className="flex-1 h-px bg-slate-200/80 dark:bg-slate-700/60" />
    </div>
  )
}

export default function ItemForm({ form, onChange, categories, currencySymbol = '₱', onImageFileChange }: ItemFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const localUrl = URL.createObjectURL(file)
      onChange({ ...form, image: localUrl })
      onImageFileChange?.(file)
    }
  }

  const selectedCategory = categories.find(c => c.name === form.category?.[0]?.name)
  const subcategoryOptions = selectedCategory?.subcategories ?? []

  const handleClearImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (fileInputRef.current) fileInputRef.current.value = ''
    onChange({ ...form, image: '' })
    onImageFileChange?.(null)
  }

  // Shared Tailwinds class styles for unified form architecture
  const inputClasses = "w-full px-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg text-sm transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 placeholder:text-slate-400 dark:placeholder:text-slate-500"
  const selectClasses = "w-full appearance-none pl-3.5 pr-10 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 rounded-lg text-sm transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 cursor-pointer"
  const labelClasses = "block text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase mb-2"

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* SECTION 1: BASIC INFO */}
      <div>
        <SectionHeader number="1" title="Basic Information" />
        <div className="space-y-5">
          <div>
            <label className={labelClasses}>Product Name</label>
            <input
              type="text"
              value={form.name || ''}
              onChange={e => onChange({ ...form, name: e.target.value })}
              placeholder="e.g. Premium Arabica Beans"
              className={inputClasses}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClasses}>Category</label>
              <div className="relative">
                <select
                  value={form.category?.[0]?.name || ''}
                  onChange={e => {
                    const cat = categories.find(c => c.name === e.target.value)
                    onChange({ ...form, category: cat ? [cat] : [], subcategory: '' })
                  }}
                  className={selectClasses}>
                  <option value="" disabled>Select category...</option>
                  {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>

            <div className={`transition-opacity duration-200 ${form.category?.[0] ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
              <label className={labelClasses}>Subcategory</label>
              <div className="relative">
                <select
                  value={form.subcategory || ''}
                  disabled={!form.category?.[0]}
                  onChange={e => onChange({ ...form, subcategory: e.target.value })}
                  className={selectClasses}>
                  <option value="" disabled>Select subcategory...</option>
                  {subcategoryOptions.map(sub => <option key={sub.id} value={sub.name}>{sub.name}</option>)}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: PACKAGING */}
      <div>
        <SectionHeader number="2" title="Packaging & Shelf Life" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className={labelClasses}>Packaging Unit</label>
            <div className="relative">
              <select
                value={form.packagingUnit || ''}
                onChange={e => onChange({ ...form, packagingUnit: e.target.value })}
                className={selectClasses}>
                <option value="" disabled>Select packaging...</option>
                {PACKAGING_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
              </div>
            </div>
          </div>

          <div>
            <label className={labelClasses}>Expiry Date</label>
            <input
              type="date"
              value={form.expiryDate || ''}
              onChange={e => onChange({ ...form, expiryDate: e.target.value || null })}
              className={inputClasses}
            />
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-2 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              Leave blank for non-perishable items
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 3: PRICING */}
      <div>
        <SectionHeader number="3" title="Pricing & Inventory" />
        <div className="bg-slate-50/70 dark:bg-slate-800/40 p-6 rounded-xl border border-slate-200/80 dark:border-slate-700/80">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className={labelClasses}>Cost Price</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium select-none">{currencySymbol}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.costPrice ?? ''}
                  onChange={e => onChange({ ...form, costPrice: parseFloat(e.target.value) || 0 })}
                  className={`${inputClasses} pl-8 font-mono`}
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Selling Price</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-medium select-none">{currencySymbol}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price ?? ''}
                  onChange={e => onChange({ ...form, price: parseFloat(e.target.value) || 0 })}
                  className={`${inputClasses} pl-8 font-mono`}
                />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={form.stock ?? ''}
                onChange={e => onChange({ ...form, stock: parseInt(e.target.value) || 0 })}
                className={`${inputClasses} font-mono`}
              />
            </div>

            <div>
              <label className={labelClasses}>Reorder Point</label>
              <input
                type="number"
                min="0"
                value={form.reorderLevel ?? ''}
                onChange={e => onChange({ ...form, reorderLevel: parseInt(e.target.value) || 0 })}
                className={`${inputClasses} font-mono`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 4: PRODUCT IMAGE */}
      <div>
        <SectionHeader number="4" title="Product Image" />
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="group cursor-pointer relative flex flex-col items-center justify-center min-h-[150px] px-6 py-6 border-2 border-dashed border-slate-200 dark:border-slate-700 hover:border-indigo-500 dark:hover:border-indigo-500 bg-white dark:bg-slate-900/40 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 rounded-xl transition-all duration-200 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500"
          >
            {form.image ? (
              <div className="flex flex-col sm:items-center sm:flex-row gap-5 w-full animate-in fade-in duration-200">
                <div className="relative h-24 w-24 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex-shrink-0 shadow-inner mx-auto sm:mx-0">
                  <img
                    src={form.image}
                    alt="Product preview"
                    className="h-full w-full object-cover group-hover:scale-102 transition-transform duration-300"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/eee/999?text=Error' }}
                  />
                </div>
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Image successfully attached</h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">Click anywhere within the box to replace</p>
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1.5 rounded-md border border-indigo-100 dark:border-indigo-900/30"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    Remove Image
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center space-y-3 pointer-events-none">
                <div className="mx-auto h-10 w-10 flex items-center justify-center rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 group-hover:border-indigo-200 transition-colors">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">Click to upload product image</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Supports PNG, JPG, or WEBP images up to 5MB</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}