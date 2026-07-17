interface StatusBadgeProps {
  status: string
  className?: string
}

const statusStyles: Record<string, string> = {
  Pending: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
  Process: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30',
  Approved: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
  Completed: 'bg-surface-100 text-surface-500 border-surface-200 dark:bg-surface-700 dark:text-surface-400 dark:border-surface-700',
  Cancelled: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30',
  PENDING: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
  CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30',
  PROCESSING: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30',
  APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
  COMPLETED: 'bg-surface-100 text-surface-500 border-surface-200 dark:bg-surface-700 dark:text-surface-400 dark:border-surface-700',
  CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30',
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const style = statusStyles[status] || 'bg-surface-100 text-surface-700 border-surface-200 dark:bg-surface-700 dark:text-surface-300 dark:border-surface-700'

  return (
    <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium border ${style} ${className}`}>
      {status}
    </span>
  )
}
