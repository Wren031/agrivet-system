import { Tag } from 'lucide-react'

interface CategoryFormProps {
  name: string
  onChange: (name: string) => void
}

export default function CategoryForm({ name, onChange }: CategoryFormProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-surface-100 dark:border-surface-800">
        <div className="w-9 h-9 rounded-xl bg-surface-50 dark:bg-surface-950/30 flex items-center justify-center">
          <Tag size={16} className="text-surface-600 dark:text-surface-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-surface-800 dark:text-surface-200">Category Details</p>
          <p className="text-xs text-surface-500 dark:text-surface-400">Name your product category</p>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1.5">Category Name</label>
        <div className="relative">
          <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 dark:text-surface-400" />
          <input type="text" value={name} onChange={e => onChange(e.target.value)}
            placeholder="e.g. Medicines, Vaccines, Equipment..."
            className="w-full pl-9 pr-3 py-2.5 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600/30 focus:border-surface-500 placeholder:text-surface-400 dark:placeholder:text-surface-500 transition-all" />
        </div>
        {name.trim().length > 0 && (
          <p className="mt-1.5 text-xs text-surface-500 dark:text-surface-400">
            {name.trim().length} character{name.trim().length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  )
}