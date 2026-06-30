import type { ReactNode } from 'react'

interface MetricCardProps {
  title: string
  value: string | number
  icon: ReactNode
  trend?: { value: string; positive: boolean }
}

export default function MetricCard({ title, value, icon, trend }: MetricCardProps) {
  return (
    <div className="border border-surface-200 dark:border-surface-800 rounded-xl p-5 transition-colors duration-150 hover:bg-surface-50 dark:hover:bg-surface-900/50">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[11px] font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-[0.06em]">{title}</span>
        <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0 text-surface-500 dark:text-surface-400">
          {icon}
        </div>
      </div>
      <div className="flex items-end justify-between gap-2">
        <p className="text-2xl font-semibold text-surface-900 dark:text-white tracking-tight leading-none">
          {value}
        </p>
        {trend && (
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium ${
            trend.positive
              ? 'bg-surface-50 dark:bg-surface-800 text-success'
              : 'bg-surface-50 dark:bg-surface-800 text-error'
          }`}>
            <svg className={`w-3 h-3 ${trend.positive ? '' : 'rotate-180'}`} viewBox="0 0 12 12" fill="none">
              <path d="M6 2L10 8H2L6 2Z" fill="currentColor" />
            </svg>
            <span>{trend.value}</span>
          </div>
        )}
      </div>
    </div>
  )
}
