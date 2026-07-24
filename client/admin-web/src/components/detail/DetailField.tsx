import { type ReactNode } from 'react'

interface DetailFieldProps {
  label: string
  value: ReactNode
  mono?: boolean
  href?: string
  inline?: boolean
}

export default function DetailField({ label, value, mono, href, inline }: DetailFieldProps) {
  const displayValue = value === null || value === undefined || value === ''
    ? <span className="text-surface-400 dark:text-surface-500 italic">N/A</span>
    : value

  if (inline) {
    return (
      <div className="flex items-center justify-between py-2.5">
        <span className="text-xs font-medium text-surface-500 dark:text-surface-400">{label}</span>
        <span className={`text-xs font-semibold text-surface-700 dark:text-surface-300 ${mono ? 'font-mono' : ''}`}>
          {displayValue}
        </span>
      </div>
    )
  }

  const valueContent = href && value
    ? (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline inline-flex items-center gap-1"
      >
        {displayValue}
      </a>
    )
    : (
      <span className={`text-sm font-medium text-surface-800 dark:text-surface-200 ${mono ? 'font-mono' : ''}`}>
        {displayValue}
      </span>
    )

  return (
    <div className="min-w-0">
      <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">{label}</p>
      {valueContent}
    </div>
  )
}
