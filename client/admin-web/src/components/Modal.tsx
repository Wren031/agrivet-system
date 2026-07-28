import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export default function Modal({ open, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKey)
    }
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', handleKey)
    }
  }, [open, onClose])

  if (!open) return null

  const sizeClasses = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-lg',
    lg: 'sm:max-w-2xl',
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-surface-950/40 backdrop-blur-[2px] animate-fade-in" onClick={onClose} />
      <div className={`relative bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto animate-scale-in`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100 dark:border-surface-800 sticky top-0 bg-white dark:bg-surface-900 rounded-t-xl z-10">
          <h2 className="text-sm font-semibold text-surface-900 dark:text-surface-100 tracking-tight truncate">{title}</h2>
          <button onClick={onClose} className="p-1.5 -m-1 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors shrink-0">
            <X size={15} className="text-surface-400" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}
