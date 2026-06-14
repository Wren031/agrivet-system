interface CategoryFormProps {
  name: string
  onChange: (name: string) => void
}

export default function CategoryForm({ name, onChange }: CategoryFormProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category Name</label>
      <input type="text" value={name} onChange={e => onChange(e.target.value)}
        placeholder="Enter category name..."
        className="w-full px-3 py-2.5 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
    </div>
  )
}