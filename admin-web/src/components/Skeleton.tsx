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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="animate-pulse bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 h-[116px]">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-20" />
              <div className="h-7 bg-slate-200 dark:bg-slate-700 rounded w-16" />
            </div>
            <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  )
}
