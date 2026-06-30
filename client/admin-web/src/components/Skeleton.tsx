export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4">
          <div className="h-5 bg-surface-100 dark:bg-surface-800 rounded flex-1 animate-pulse-subtle" />
          <div className="h-5 bg-surface-100 dark:bg-surface-800 rounded flex-1 animate-pulse-subtle" />
          <div className="h-5 bg-surface-100 dark:bg-surface-800 rounded flex-1 animate-pulse-subtle" />
          <div className="h-5 bg-surface-100 dark:bg-surface-800 rounded w-24 animate-pulse-subtle" />
          <div className="h-5 bg-surface-100 dark:bg-surface-800 rounded w-20 animate-pulse-subtle" />
          <div className="h-5 bg-surface-100 dark:bg-surface-800 rounded w-24 animate-pulse-subtle" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonCards({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="border border-surface-200 dark:border-surface-800 rounded-xl p-5 animate-pulse-subtle">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="h-3 bg-surface-100 dark:bg-surface-800 rounded w-20" />
              <div className="h-7 bg-surface-100 dark:bg-surface-800 rounded w-16" />
            </div>
            <div className="w-9 h-9 bg-surface-100 dark:bg-surface-800 rounded-xl" />
          </div>
        </div>
      ))}
    </div>
  )
}
