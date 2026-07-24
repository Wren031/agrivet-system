import { Package, ArrowLeft, type LucideIcon } from 'lucide-react'

interface DetailEmptyStateProps {
  icon?: LucideIcon
  title?: string
  message?: string
  backTo?: string
  backLabel?: string
  onBack?: () => void
}

export default function DetailEmptyState({
  icon: Icon = Package,
  title = 'Not Found',
  message = 'The record you are looking for could not be found.',
  backLabel = 'Go Back',
  onBack,
}: DetailEmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-5">
        <Icon size={32} className="text-surface-300 dark:text-surface-600" />
      </div>
      <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">{title}</h3>
      <p className="text-sm text-surface-500 dark:text-surface-400 max-w-sm mb-6">{message}</p>
      {onBack && (
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-surface-700 dark:text-surface-200 bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-700 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-750 transition-colors"
        >
          <ArrowLeft size={16} /> {backLabel}
        </button>
      )}
    </div>
  )
}
