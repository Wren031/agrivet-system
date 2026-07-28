import { type ReactNode } from 'react'

interface DetailSectionProps {
  title?: string
  description?: string
  actions?: ReactNode
  children: ReactNode
  className?: string
  padding?: boolean
}

export default function DetailSection({
  title,
  description,
  actions,
  children,
  className = '',
  padding = true,
}: DetailSectionProps) {
  return (
    <div
      className={`bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-800 ${className}`}
    >
      {(title || actions) && (
        <div className={`flex items-center justify-between gap-3 ${padding ? 'px-5 sm:px-6 py-4' : 'px-0 py-0'} border-b border-surface-100 dark:border-surface-800`}>
          <div className="min-w-0">
            {title && (
              <h2 className="text-sm font-semibold text-surface-900 dark:text-white">{title}</h2>
            )}
            {description && (
              <p className="text-xs text-surface-500 dark:text-surface-400 mt-0.5">{description}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-2 shrink-0">{actions}</div>
          )}
        </div>
      )}
      <div className={padding ? 'p-5 sm:p-6' : ''}>
        {children}
      </div>
    </div>
  )
}
