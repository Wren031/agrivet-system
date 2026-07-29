import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, X, Upload, Loader2 } from 'lucide-react'
import { useCategories } from '../../categories/hooks/useCategories'
import { createItem } from '../services/itemService'
import { uploadFile } from '../../../config/apiClient'
import { useApp } from '../../../context/AppContext'
import { type Item, PACKAGING_UNITS } from '../services/types'
import type { Category } from '../../categories/services/types'

const CATEGORY_SKU_MAP: Record<string, string> = {
  'Feeds & Nutrition': 'FED',
  'Veterinary Drugs & Biologics': 'VET',
  'Agricultural Inputs': 'AGR',
  'Farm Equipment & Hardware': 'EQP',
}

function generateSku(category: string): string {
  const prefix = CATEGORY_SKU_MAP[category] || 'GEN'
  return `${prefix}-${Date.now().toString(36).toUpperCase()}`
}

interface FormErrors {
  name?: string
  category?: string
  price?: string
  stock?: string
  costPrice?: string
}

function Field({ label, required, error, children }: { label: string; required?: boolean; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wider text-surface-500 dark:text-surface-400 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 dark:text-red-400 mt-1">{error}</p>}
    </div>
  )
}

const inputCls = "w-full px-3 py-2 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-800 dark:text-surface-100 rounded-lg text-sm outline-none focus:border-surface-400 dark:focus:border-surface-500 focus:ring-2 focus:ring-surface-200 dark:focus:ring-surface-600/50 placeholder:text-surface-400 dark:placeholder:text-surface-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"

const inputErrCls = "border-red-300 dark:border-red-700 focus:border-red-400 dark:focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-800/50"

const selectCls = "w-full appearance-none px-3 py-2 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 text-surface-800 dark:text-surface-100 rounded-lg text-sm outline-none focus:border-surface-400 dark:focus:border-surface-500 focus:ring-2 focus:ring-surface-200 dark:focus:ring-surface-600/50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-all pr-8"

export default function AddProductPage() {
  const navigate = useNavigate()
  const { categories } = useCategories()
  const { addNotification, settings } = useApp()

  const [form, setForm] = useState<Partial<Item>>({})
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<FormErrors>({})
  const fileRef = useRef<HTMLInputElement>(null)

  const selectedCategory = categories.find(c => c.name === form.category?.[0]?.name)
  const subcategoryOptions = selectedCategory?.subcategories ?? []

  function validate(): FormErrors {
    const e: FormErrors = {}
    if (!form.name?.trim()) e.name = 'Product name is required'
    if (!form.category?.[0]?.name) e.category = 'Please select a category'
    if (!form.price || form.price <= 0) e.price = 'Selling price must be greater than 0'
    if (form.stock === undefined || form.stock < 0) e.stock = 'Stock quantity is required'
    if (form.costPrice === undefined || form.costPrice < 0) e.costPrice = 'Cost price is required'
    return e
  }

  async function handleSave() {
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setSaving(true)
    try {
      let imageUrl = ''
      if (imageFile) imageUrl = await uploadFile(imageFile)
      const categoryId = form.category?.[0]?.id
      const cat = categories.find(c => c.id === categoryId)
      const subcategoryId = cat?.subcategories?.find(s => s.name === form.subcategory)?.id
      await createItem({
        name: form.name || '',
        sku: form.sku || generateSku(form.category?.[0]?.name || ''),
        category: form.category || [],
        subcategory: form.subcategory || '',
        packagingUnit: form.packagingUnit || '',
        costPrice: form.costPrice || 0,
        expiryDate: form.expiryDate || null,
        reorderLevel: form.reorderLevel || 0,
        price: form.price || 0,
        stock: form.stock || 0,
        image: imageUrl, categoryId, subcategoryId,
      })
      addNotification({ message: 'Product created successfully', type: 'success' })
      navigate('/inventory')
    } catch {
      addNotification({ message: 'Failed to create product', type: 'error' })
    } finally { setSaving(false) }
  }

  function upd(updates: Partial<Item>) {
    setForm(p => ({ ...p, ...updates }))
    if (Object.keys(errors).length) setErrors({})
  }

  return (
    <div className="animate-fade-in pb-28">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/inventory')}
            className="w-8 h-8 flex items-center justify-center rounded-lg border border-surface-200 dark:border-surface-700 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
            <ArrowLeft size={15} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-surface-900 dark:text-white">Add Product</h1>
            <p className="text-xs text-surface-500 dark:text-surface-400">Add a new item to your inventory</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => navigate('/inventory')}
            className="px-4 py-2 text-sm font-medium text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
            Cancel
          </button>
          <button onClick={handleSave} disabled={saving}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-lg hover:bg-surface-800 dark:hover:bg-surface-200 transition-colors disabled:opacity-50 min-w-[100px] justify-center">
            {saving ? <><Loader2 size={15} className="animate-spin" /> Saving</> : <><Save size={15} /> Save</>}
          </button>
        </div>
      </div>

      {/* Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700/80 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-100">Basic Information</h3>
            <Field label="Product Name" required error={errors.name}>
              <input value={form.name || ''} onChange={e => upd({ name: e.target.value })}
                placeholder="e.g. Premium Arabica Beans"
                className={`${inputCls} ${errors.name ? inputErrCls : ''}`} />
            </Field>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Category" required error={errors.category}>
                <div className="relative">
                  <select value={form.category?.[0]?.name || ''}
                    onChange={e => { const c = categories.find(cat => cat.name === e.target.value); upd({ category: c ? [c] : [], subcategory: '' }) }}
                    className={`${selectCls} ${errors.category ? inputErrCls : ''}`}>
                    <option value="" disabled>Select...</option>
                    {categories.map((cat: Category) => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                  </select>
                  <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </Field>
              <Field label="Subcategory">
                <div className="relative">
                  <select value={form.subcategory || ''} disabled={!form.category?.[0]}
                    onChange={e => upd({ subcategory: e.target.value })} className={selectCls}>
                    <option value="" disabled>Select...</option>
                    {subcategoryOptions.map(sub => <option key={sub.id} value={sub.name}>{sub.name}</option>)}
                  </select>
                  <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </Field>
            </div>
            <Field label="SKU">
              <input value={form.sku || ''} onChange={e => upd({ sku: e.target.value })}
                placeholder="Auto-generated if left blank" className={`${inputCls} font-mono text-xs`} />
            </Field>
          </div>

          {/* Pricing & Stock */}
          <div className="bg-white dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700/80 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-100">Pricing & Stock</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Cost Price" required error={errors.costPrice}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-surface-400 select-none pointer-events-none">{settings.currencySymbol}</span>
                  <input type="number" step="0.01" min="0" value={form.costPrice ?? ''}
                    onChange={e => upd({ costPrice: parseFloat(e.target.value) || 0 })}
                    className={`${inputCls} ${errors.costPrice ? inputErrCls : ''} pl-7 font-mono tabular-nums`} placeholder="0.00" />
                </div>
              </Field>
              <Field label="Selling Price" required error={errors.price}>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-surface-400 select-none pointer-events-none">{settings.currencySymbol}</span>
                  <input type="number" step="0.01" min="0" value={form.price ?? ''}
                    onChange={e => upd({ price: parseFloat(e.target.value) || 0 })}
                    className={`${inputCls} ${errors.price ? inputErrCls : ''} pl-7 font-mono tabular-nums`} placeholder="0.00" />
                </div>
              </Field>
              <Field label="Stock Quantity" required error={errors.stock}>
                <input type="number" min="0" value={form.stock ?? ''}
                  onChange={e => upd({ stock: parseInt(e.target.value) || 0 })}
                  className={`${inputCls} ${errors.stock ? inputErrCls : ''} font-mono tabular-nums`} placeholder="0" />
              </Field>
              <Field label="Reorder Point">
                <input type="number" min="0" value={form.reorderLevel ?? ''}
                  onChange={e => upd({ reorderLevel: parseInt(e.target.value) || 0 })}
                  className={`${inputCls} font-mono tabular-nums`} placeholder="0" />
              </Field>
            </div>
          </div>

          {/* Packaging & Expiry */}
          <div className="bg-white dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700/80 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-100">Packaging & Shelf Life</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Packaging Unit">
                <div className="relative">
                  <select value={form.packagingUnit || ''} onChange={e => upd({ packagingUnit: e.target.value })} className={selectCls}>
                    <option value="" disabled>Select...</option>
                    {PACKAGING_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
                  </select>
                  <svg className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
                </div>
              </Field>
              <Field label="Expiry Date">
                <input type="date" value={form.expiryDate || ''}
                  onChange={e => upd({ expiryDate: e.target.value || null })} className={inputCls} />
              </Field>
            </div>
          </div>
        </div>

        {/* Right Column: Image */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-surface-800/50 rounded-xl border border-surface-200 dark:border-surface-700/80 p-5">
            <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-100 mb-4">Product Image</h3>
            <input type="file" ref={fileRef} onChange={e => {
              const file = e.target.files?.[0]
              if (file) { setImageFile(file); setImagePreview(URL.createObjectURL(file)) }
            }} accept="image/*" className="hidden" />
            {imagePreview ? (
              <div className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>
                <button onClick={() => { setImageFile(null); setImagePreview(null); if (fileRef.current) fileRef.current.value = '' }}
                  className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
                  <X size={13} />
                </button>
              </div>
            ) : (
              <div onClick={() => fileRef.current?.click()}
                className="aspect-square border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-lg flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-surface-400 dark:hover:border-surface-500 bg-surface-50/50 dark:bg-surface-900/30 hover:bg-surface-100/50 dark:hover:bg-surface-800/40 transition-all">
                <Upload size={20} className="text-surface-400" />
                <p className="text-xs text-surface-500 dark:text-surface-400 text-center px-4">Click to upload<br/>PNG, JPG, WEBP</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
