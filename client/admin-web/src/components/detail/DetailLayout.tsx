import { type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, AlertCircle } from 'lucide-react'

interface DetailLayoutProps {
  children?: ReactNode
  backTo?: string
  backLabel?: string
  onBack?: () => void
  loading?: boolean
  error?: string | null
  notFound?: boolean
  notFoundMessage?: string
  loadingMessage?: string
  className?: string
}

export default function DetailLayout({
  children,
  backTo,
  backLabel = 'Back',
  onBack,
  loading = false,
  error = null,
  notFound = false,
  notFoundMessage = 'The record you are looking for could not be found.',
  loadingMessage = 'Loading...',
  className = '',
}: DetailLayoutProps) {
  const navigate = useNavigate()

  const handleBack = onBack
    ? onBack
    : backTo
      ? () => navigate(backTo)
      : () => navigate(-1)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
        <div className="flex flex-col items-center gap-3 text-surface-400">
          <Loader2 size={24} className="animate-spin" />
          <span className="text-sm font-medium">{loadingMessage}</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/30 flex items-center justify-center mb-5">
          <AlertCircle size={28} className="text-red-500 dark:text-red-400" />
        </div>
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">Error Loading Data</h3>
        <p className="text-sm text-surface-500 dark:text-surface-400 max-w-sm mb-6">{error}</p>
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-surface-700 dark:text-surface-200 bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-700 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-750 transition-colors"
        >
          <ArrowLeft size={16} /> {backLabel}
        </button>
      </div>
    )
  }

  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in">
        <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-5">
          <AlertCircle size={32} className="text-surface-300 dark:text-surface-600" />
        </div>
        <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-1">Not Found</h3>
        <p className="text-sm text-surface-500 dark:text-surface-400 max-w-sm mb-6">{notFoundMessage}</p>
        <button
          onClick={handleBack}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-surface-700 dark:text-surface-200 bg-white dark:bg-surface-800 border border-surface-300 dark:border-surface-700 rounded-xl hover:bg-surface-50 dark:hover:bg-surface-750 transition-colors"
        >
          <ArrowLeft size={16} /> {backLabel}
        </button>
      </div>
    )
  }

  return (
    <div className={`animate-fade-in ${className}`}>
      <button
        onClick={handleBack}
        className="group inline-flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400 hover:text-surface-900 dark:hover:text-surface-100 mb-6 transition-colors"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
        {backLabel}
      </button>
      {children}
    </div>
  )
}
