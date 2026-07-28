import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex items-center justify-between mt-6 text-sm">
      <p className="text-xs text-surface-500 dark:text-surface-400 tabular-nums">
        Page <span className="font-semibold text-surface-700 dark:text-surface-300">{page}</span> of {totalPages}
      </p>
      <div className="flex gap-1.5">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-600 dark:text-surface-300 hover:border-surface-300 dark:hover:border-surface-600 hover:text-surface-900 dark:hover:text-surface-100 transition-all text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-surface-200 dark:disabled:hover:border-surface-700"
        >
          <ChevronLeft size={14} /> Prev
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-900 text-surface-600 dark:text-surface-300 hover:border-surface-300 dark:hover:border-surface-600 hover:text-surface-900 dark:hover:text-surface-100 transition-all text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-surface-200 dark:disabled:hover:border-surface-700"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}
