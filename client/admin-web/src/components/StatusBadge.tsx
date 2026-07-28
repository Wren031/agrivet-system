interface StatusBadgeProps {
  status: string
  className?: string
}

interface StatusStyle {
  badge: string
  dot: string
}

const amber: StatusStyle = {
  badge: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
  dot: 'bg-amber-500',
}
const blue: StatusStyle = {
  badge: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30',
  dot: 'bg-blue-500',
}
const emerald: StatusStyle = {
  badge: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
  dot: 'bg-emerald-500',
}
const neutral: StatusStyle = {
  badge: 'bg-surface-100 text-surface-500 border-surface-200 dark:bg-surface-800 dark:text-surface-400 dark:border-surface-700',
  dot: 'bg-surface-400',
}
const rose: StatusStyle = {
  badge: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30',
  dot: 'bg-rose-500',
}

const statusStyles: Record<string, StatusStyle> = {
  Pending: amber,
  Process: blue,
  Approved: emerald,
  Completed: neutral,
  Cancelled: rose,
  PENDING: amber,
  CONFIRMED: blue,
  PROCESSING: blue,
  APPROVED: emerald,
  COMPLETED: neutral,
  CANCELLED: rose,
}

const fallback: StatusStyle = {
  badge: 'bg-surface-100 text-surface-700 border-surface-200 dark:bg-surface-800 dark:text-surface-300 dark:border-surface-700',
  dot: 'bg-surface-400',
}

export default function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const style = statusStyles[status] || fallback

  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border whitespace-nowrap ${style.badge} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${style.dot}`} />
      {status}
    </span>
  )
}
