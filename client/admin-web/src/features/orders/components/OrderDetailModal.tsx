import { X, ShoppingCart } from 'lucide-react'
import { useApp } from '../../../context/AppContext'
import type { AgentOrder } from '../services/types'

interface OrderDetailModalProps {
  order: AgentOrder | null
  onClose: () => void
}

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const { settings } = useApp()
  if (!order) return null

  const statusColors: Record<string, string> = {
    Pending: 'bg-surface-50 dark:bg-surface-950/30 text-surface-700 dark:text-surface-400',
    Completed: 'bg-surface-100 dark:bg-surface-900/40 text-surface-700 dark:text-surface-300',
    Cancelled: 'bg-surface-200/50 dark:bg-surface-800/50 text-surface-800 dark:text-surface-300',
  }

  const currency = settings.currencySymbol

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/30 dark:bg-black/50" onClick={onClose} />
      <div className="relative w-full sm:max-w-sm border border-surface-200 dark:border-surface-800 rounded-xl bg-white dark:bg-surface-900">
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-surface-200 dark:border-surface-800">
          <h2 className="text-base sm:text-lg font-semibold text-surface-800 dark:text-surface-100">Order Details</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800"><X size={20} className="text-surface-500 dark:text-surface-400" /></button>
        </div>
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-surface-100 dark:border-surface-800">
            <div className="w-12 h-12 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center"><ShoppingCart size={24} className="text-surface-600 dark:text-surface-400" /></div>
            <div>
              <p className="font-semibold text-surface-800 dark:text-surface-100">{order.id}</p>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${statusColors[order.status]}`}>{order.status}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="p-3"><p className="text-surface-500 dark:text-surface-400 text-xs">Customer</p><p className="font-medium text-surface-800 dark:text-surface-200">{order.customerName}</p></div>
            <div className="p-3"><p className="text-surface-500 dark:text-surface-400 text-xs">Agent</p><p className="font-medium text-surface-800 dark:text-surface-200">{order.agentName}</p></div>
            <div className="p-3"><p className="text-surface-500 dark:text-surface-400 text-xs">Date</p><p className="font-medium text-surface-800 dark:text-surface-200">{new Date(order.orderDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p></div>
            <div className="p-3"><p className="text-surface-500 dark:text-surface-400 text-xs">Total</p><p className="font-bold text-lg text-surface-600 dark:text-surface-400">{currency}{order.totalAmount.toFixed(2)}</p></div>
          </div>
        </div>
        <div className="px-4 sm:px-5 py-4 border-t border-surface-200 dark:border-surface-800 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-surface-600 dark:text-surface-300 bg-surface-100 dark:bg-surface-800 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors">Close</button>
        </div>
      </div>
    </div>
  )
}
