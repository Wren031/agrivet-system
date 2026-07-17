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
      <p className="text-surface-500 dark:text-surface-400">
        Page {page} of {totalPages}
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors text-xs disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={14} /> Prev
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors text-xs disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}
