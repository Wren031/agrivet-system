import { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react'
import { useApp } from '../context/AppContext'

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
}

const colors = {
  success: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50 text-green-700 dark:text-green-400',
  error: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400',
  warning: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-900/50 text-yellow-700 dark:text-yellow-400',
  info: 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-400',
}

const iconColors = {
  success: 'text-green-500 dark:text-green-400',
  error: 'text-red-500 dark:text-red-400',
  warning: 'text-yellow-500 dark:text-yellow-400',
  info: 'text-blue-500 dark:text-blue-400',
}

interface ToastItem {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
  exiting?: boolean
}

export default function ToastContainer() {
  const { notifications, removeNotification } = useApp()
  const [toasts, setToasts] = useState<ToastItem[]>([])

  useEffect(() => {
    setToasts(notifications.map(n => ({ ...n, exiting: false })))
  }, [notifications])

  function handleDismiss(id: string) {
    setToasts(prev => prev.map(t => t.id === id ? { ...t, exiting: true } : t))
    setTimeout(() => removeNotification(id), 200)
  }

  if (toasts.length === 0) return null

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const Icon = icons[toast.type]
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border ${
              colors[toast.type]
            } ${
              toast.exiting ? 'animate-fade-out-right' : 'animate-slide-in-right'
            }`}
          >
            <Icon size={18} className={`shrink-0 mt-0.5 ${iconColors[toast.type]}`} />
            <p className="text-sm flex-1 leading-relaxed">{toast.message}</p>
            <button
              onClick={() => handleDismiss(toast.id)}
              className="shrink-0 p-0.5 rounded hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        )
      })}
    </div>
  )
}
