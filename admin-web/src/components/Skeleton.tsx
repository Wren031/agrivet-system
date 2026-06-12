export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded flex-1" />
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded flex-1" />
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded flex-1" />
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-24" />
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-20" />
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-24" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonCards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white dark:bg-slate-800 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-700 rounded-lg" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20" />
              <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-12" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
