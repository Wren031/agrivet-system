import { Tag } from 'lucide-react'

interface CategoryFormProps {
  name: string
  onChange: (name: string) => void
}

export default function CategoryForm({ name, onChange }: CategoryFormProps) {
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
          <Tag size={16} className="text-indigo-600 dark:text-indigo-400" />
        </div>
        <div>
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">Category Details</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Name your product category</p>
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Category Name</label>
        <div className="relative">
          <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input type="text" value={name} onChange={e => onChange(e.target.value)}
            placeholder="e.g. Medicines, Vaccines, Equipment..."
            className="w-full pl-9 pr-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all" />
        </div>
        {name.trim().length > 0 && (
          <p className="mt-1.5 text-xs text-slate-400 dark:text-slate-500">
            {name.trim().length} character{name.trim().length !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    </div>
  )
}