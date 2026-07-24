import { X, ShoppingCart, User, Calendar } from 'lucide-react'
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
    Pending: 'bg-amber-50 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400',
    Completed: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-400',
    Cancelled: 'bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400',
  }

  const currency = settings.currencySymbol

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/30 dark:bg-black/50 animate-fade-in" onClick={onClose} />
      <div className="relative w-full sm:max-w-sm bg-white dark:bg-surface-950 rounded-xl border border-surface-200 dark:border-surface-800 animate-scale-in">
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100 dark:border-surface-800">
          <h2 className="text-sm font-semibold text-surface-900 dark:text-surface-100">Order Details</h2>
          <button onClick={onClose} className="p-1 rounded-md hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
            <X size={16} className="text-surface-400" />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-surface-100 dark:border-surface-800">
            <div className="w-10 h-10 rounded-xl bg-surface-50 dark:bg-surface-800 flex items-center justify-center">
              <ShoppingCart size={20} className="text-surface-500 dark:text-surface-400" />
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-surface-800 dark:text-surface-100 text-sm truncate">{order.id}</p>
              <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium inline-block mt-0.5 ${statusColors[order.status] || 'bg-surface-100 text-surface-700'}`}>{order.status}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-50 dark:bg-surface-800 flex items-center justify-center shrink-0">
                <User size={14} className="text-surface-500 dark:text-surface-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-surface-500 dark:text-surface-400">Customer</p>
                <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{order.customerName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-50 dark:bg-surface-800 flex items-center justify-center shrink-0">
                <User size={14} className="text-surface-500 dark:text-surface-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-surface-500 dark:text-surface-400">Agent</p>
                <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{order.agentName}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-50 dark:bg-surface-800 flex items-center justify-center shrink-0">
                <Calendar size={14} className="text-surface-500 dark:text-surface-400" />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-surface-500 dark:text-surface-400">Date</p>
                <p className="text-sm font-medium text-surface-800 dark:text-surface-200">
                  {new Date(order.orderDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-50 dark:bg-surface-800 flex items-center justify-center shrink-0">
                <span className="text-xs font-bold text-surface-500 dark:text-surface-400">PHP</span>
              </div>
              <div className="min-w-0">
                <p className="text-[11px] text-surface-500 dark:text-surface-400">Total</p>
                <p className="text-base font-bold text-surface-900 dark:text-white">{currency}{order.totalAmount.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="px-5 py-4 border-t border-surface-100 dark:border-surface-800 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-surface-600 dark:text-surface-300 bg-surface-50 dark:bg-surface-800 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-700 transition-colors">Close</button>
        </div>
      </div>
    </div>
  )
}
