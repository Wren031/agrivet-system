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
    <div className="flex items-center gap-3 mb-6">
      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-surface-900 dark:bg-white text-white dark:text-surface-900 text-xs font-bold shrink-0">
        {number}
      </span>
      <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-100">{title}</h3>
      <div className="flex-1 h-px bg-surface-100 dark:bg-surface-700/60" />
    </div>
  )
}

function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-surface-800/60 rounded-xl border border-surface-200 dark:border-surface-700/80 shadow-sm shadow-surface-950/5 p-5 sm:p-6">
      {children}
    </div>
  )
}

const inputBase = "w-full px-3.5 py-2.5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-800 dark:text-surface-100 rounded-lg text-sm transition-all duration-150 outline-none focus:border-surface-400 dark:focus:border-surface-500 focus:ring-2 focus:ring-surface-200 dark:focus:ring-surface-600/50 focus:ring-offset-1 dark:focus:ring-offset-surface-900 placeholder:text-surface-400 dark:placeholder:text-surface-500 disabled:opacity-50 disabled:cursor-not-allowed"

const selectBase = "w-full appearance-none pl-3.5 pr-10 py-2.5 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-800 dark:text-surface-100 rounded-lg text-sm transition-all duration-150 outline-none focus:border-surface-400 dark:focus:border-surface-500 focus:ring-2 focus:ring-surface-200 dark:focus:ring-surface-600/50 focus:ring-offset-1 dark:focus:ring-offset-surface-900 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"

const labelBase = "block text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-2"

function SelectArrow() {
  return (
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-surface-400">
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
      </svg>
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

  return (
    <div className="space-y-8">
      {/* SECTION 1: BASIC INFORMATION */}
      <section>
        <SectionHeader number="1" title="Basic Information" />
        <FormCard>
          <div className="space-y-5">
            <div>
              <label className={labelBase}>Product Name</label>
              <input
                type="text"
                value={form.name || ''}
                onChange={e => onChange({ ...form, name: e.target.value })}
                placeholder="e.g. Premium Arabica Beans"
                className={inputBase}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className={labelBase}>Category</label>
                <div className="relative">
                  <select
                    value={form.category?.[0]?.name || ''}
                    onChange={e => {
                      const cat = categories.find(c => c.name === e.target.value)
                      onChange({ ...form, category: cat ? [cat] : [], subcategory: '' })
                    }}
                    className={selectBase}
                  >
                    <option value="" disabled>Select category...</option>
                    {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                  </select>
                  <SelectArrow />
                </div>
              </div>

              <div>
                <label className={labelBase}>Subcategory</label>
                <div className="relative">
                  <select
                    value={form.subcategory || ''}
                    disabled={!form.category?.[0]}
                    onChange={e => onChange({ ...form, subcategory: e.target.value })}
                    className={selectBase}
                  >
                    <option value="" disabled>Select subcategory...</option>
                    {subcategoryOptions.map(sub => <option key={sub.id} value={sub.name}>{sub.name}</option>)}
                  </select>
                  <SelectArrow />
                </div>
                {!form.category?.[0] && (
                  <p className="text-xs text-surface-400 dark:text-surface-500 mt-1.5">Select a category first</p>
                )}
              </div>
            </div>
          </div>
        </FormCard>
      </section>

      {/* SECTION 2: PACKAGING & SHELF LIFE */}
      <section>
        <SectionHeader number="2" title="Packaging & Shelf Life" />
        <FormCard>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className={labelBase}>Packaging Unit</label>
              <div className="relative">
                <select
                  value={form.packagingUnit || ''}
                  onChange={e => onChange({ ...form, packagingUnit: e.target.value })}
                  className={selectBase}
                >
                  <option value="" disabled>Select packaging...</option>
                  {PACKAGING_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                </select>
                <SelectArrow />
              </div>
            </div>

            <div>
              <label className={labelBase}>Expiry Date</label>
              <input
                type="date"
                value={form.expiryDate || ''}
                onChange={e => onChange({ ...form, expiryDate: e.target.value || null })}
                className={inputBase}
              />
              <p className="text-xs text-surface-400 dark:text-surface-500 mt-1.5 flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Leave blank for non-perishable items
              </p>
            </div>
          </div>
        </FormCard>
      </section>

      {/* SECTION 3: PRICING & INVENTORY */}
      <section>
        <SectionHeader number="3" title="Pricing & Inventory" />
        <FormCard>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
            <div>
              <label className={labelBase}>Cost Price</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-surface-400 font-medium select-none pointer-events-none">{currencySymbol}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.costPrice ?? ''}
                  onChange={e => onChange({ ...form, costPrice: parseFloat(e.target.value) || 0 })}
                  className={`${inputBase} pl-8 font-mono tabular-nums`}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className={labelBase}>Selling Price</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-surface-400 font-medium select-none pointer-events-none">{currencySymbol}</span>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.price ?? ''}
                  onChange={e => onChange({ ...form, price: parseFloat(e.target.value) || 0 })}
                  className={`${inputBase} pl-8 font-mono tabular-nums`}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className={labelBase}>Stock Quantity</label>
              <input
                type="number"
                min="0"
                value={form.stock ?? ''}
                onChange={e => onChange({ ...form, stock: parseInt(e.target.value) || 0 })}
                className={`${inputBase} font-mono tabular-nums`}
                placeholder="0"
              />
            </div>

            <div>
              <label className={labelBase}>Reorder Point</label>
              <input
                type="number"
                min="0"
                value={form.reorderLevel ?? ''}
                onChange={e => onChange({ ...form, reorderLevel: parseInt(e.target.value) || 0 })}
                className={`${inputBase} font-mono tabular-nums`}
                placeholder="0"
              />
            </div>
          </div>
          <p className="text-xs text-surface-400 dark:text-surface-500 mt-4 flex items-center gap-1.5">
            <svg className="w-3.5 h-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Low stock alert triggers when quantity drops to or below the reorder point
          </p>
        </FormCard>
      </section>

      {/* SECTION 4: PRODUCT IMAGE */}
      <section>
        <SectionHeader number="4" title="Product Image" />
        <FormCard>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="group cursor-pointer relative flex flex-col items-center justify-center min-h-[180px] px-6 py-8 border-2 border-dashed border-surface-200 dark:border-surface-700 hover:border-surface-400 dark:hover:border-surface-500 bg-surface-50/50 dark:bg-surface-900/30 hover:bg-surface-100/50 dark:hover:bg-surface-800/40 rounded-xl transition-all duration-200"
          >
            {form.image ? (
              <div className="flex flex-col sm:flex-row items-center gap-5 w-full">
                <div className="relative h-28 w-28 rounded-lg overflow-hidden border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 shrink-0 shadow-sm">
                  <img
                    src={form.image}
                    alt="Product preview"
                    className="h-full w-full object-cover"
                    onError={e => { (e.target as HTMLImageElement).src = 'https://placehold.co/112x112/eee/999?text=Error' }}
                  />
                </div>
                <div className="flex-1 text-center sm:text-left min-w-0">
                  <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">Image uploaded</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">Click or tap to replace</p>
                  <button
                    type="button"
                    onClick={handleClearImage}
                    className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors bg-white dark:bg-surface-900 px-2.5 py-1.5 rounded-md border border-surface-200 dark:border-surface-700 hover:border-red-200 dark:hover:border-red-800"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-xl bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-400 dark:text-surface-500 mb-4 group-hover:bg-surface-200 dark:group-hover:bg-surface-700 transition-colors">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 002-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-surface-700 dark:text-surface-200">Click to upload product image</p>
                <p className="text-xs text-surface-500 dark:text-surface-400 mt-1.5 max-w-xs mx-auto">
                  Drag and drop or click to browse. Supports PNG, JPG, or WEBP up to 5MB
                </p>
              </div>
            )}
          </div>
        </FormCard>
      </section>
    </div>
  )
}
