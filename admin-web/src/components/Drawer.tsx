import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

const sizeMap = {
  sm: 'sm:max-w-sm',
  md: 'sm:max-w-md',
  lg: 'sm:max-w-lg',
  xl: 'sm:max-w-xl',
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

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 dark:bg-black/50 z-40 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-auto ${size !== 'full' ? `sm:${sizeMap[size]}` : ''} bg-white dark:bg-slate-900 shadow-xl z-50 transform transition-transform duration-200 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        } ${className}`}
      >
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100 truncate">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors shrink-0">
            <X size={20} className="text-slate-400 dark:text-slate-500" />
          </button>
        </div>
        <div className="overflow-y-auto h-[calc(100%-61px)] p-4 sm:p-5">
          {children}
        </div>
      </div>
    </>
  )
}
