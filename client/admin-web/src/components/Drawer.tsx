import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

// Explicit full-string lookups so Tailwind can parse and output the classes safely
const sizeMap = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
  '350': 'sm:max-w-[350px]',
  '650': 'sm:max-w-[650px]', 
  full: 'w-full',
}

interface DrawerProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
  className?: string
  size?: keyof typeof sizeMap
}

export default function Drawer({ open, onClose, title, children, className = '', size = 'lg' }: DrawerProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose])

  // Get the safe compiled Tailwind width layout string
  const widthClass = sizeMap[size] || sizeMap['lg']

  return (
    <>
      {/* Overlay Backdrop */}
      <div
        className={`fixed inset-0 bg-black/20 dark:bg-black/50 z-40 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      {/* Sliding Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full ${widthClass} bg-white dark:bg-surface-950 border-l border-surface-200 dark:border-surface-800 z-50 transform transition-transform duration-200 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        } ${className}`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100 dark:border-surface-800">
          <h2 className="text-sm font-semibold text-surface-900 dark:text-surface-100 truncate">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors shrink-0">
            <X size={16} className="text-surface-400" />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-57px)] p-5">
          {children}
        </div>
      </div>
    </>
  )
}