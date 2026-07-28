import { type ReactNode } from 'react'

interface DetailTableProps {
  headers: string[]
  children: ReactNode
  footer?: ReactNode
  emptyMessage?: string
  emptyColSpan?: number
  className?: string
}

export default function DetailTable({
  headers,
  children,
  footer,
  emptyMessage,
  emptyColSpan = headers.length,
  className = '',
}: DetailTableProps) {
  const hasContent = children !== null && children !== undefined

  return (
    <div className={`rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-50 dark:bg-surface-800/50 text-left border-b border-surface-200 dark:border-surface-700">
              {headers.map((header, i) => (
                <th key={i} className="px-5 py-3 text-[11px] font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-[0.06em] whitespace-nowrap">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
            {hasContent ? (
              children
            ) : emptyMessage ? (
              <tr>
                <td colSpan={emptyColSpan} className="px-5 py-12 text-center text-surface-500 dark:text-surface-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : null}
          </tbody>
          {footer && (
            <tfoot>
              <tr className="bg-surface-50 dark:bg-surface-800/50 border-t border-surface-200 dark:border-surface-700">
                {footer}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  )
}
