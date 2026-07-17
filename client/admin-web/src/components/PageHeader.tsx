import type { ReactNode } from 'react'

interface PageHeaderProps {
  title: string
  subtitle?: string
  children?: ReactNode
  className?: string
}

export default function PageHeader({ title, subtitle, children, className = '' }: PageHeaderProps) {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 ${className}`}>
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">{subtitle}</p>
        )}
      </div>
      {children && (
        <div className="flex items-center gap-3 shrink-0">
          {children}
        </div>
      )}
    </div>
  )
}
