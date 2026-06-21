import { X, ShoppingCart } from 'lucide-react'
import { useApp } from '../../../context/AppContext'
import type { Order } from '../services/types'

interface OrderDetailModalProps {
  order: Order | null
  onClose: () => void
}

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  const { settings } = useApp()
  if (!order) return null

  const statusColors: Record<string, string> = {
    Pending: 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400',
    Completed: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
    Cancelled: 'bg-indigo-200/50 dark:bg-indigo-800/50 text-indigo-800 dark:text-indigo-300',
  }

  const currency = settings.currencySymbol

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/30 dark:bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded-xl shadow-xl w-full sm:max-w-sm">
        <div className="flex items-center justify-between px-4 sm:px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-base sm:text-lg font-semibold text-slate-800 dark:text-slate-100">Order Details</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"><X size={20} className="text-slate-400 dark:text-slate-500" /></button>
        </div>
        <div className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center"><ShoppingCart size={24} className="text-indigo-600 dark:text-indigo-400" /></div>
            <div>
              <p className="font-semibold text-slate-800 dark:text-slate-100">{order.id}</p>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>{order.status}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3"><p className="text-slate-400 dark:text-slate-500 text-xs">Customer</p><p className="font-medium text-slate-800 dark:text-slate-200">{order.customerName}</p></div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3"><p className="text-slate-400 dark:text-slate-500 text-xs">Agent</p><p className="font-medium text-slate-800 dark:text-slate-200">{order.agentName}</p></div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3"><p className="text-slate-400 dark:text-slate-500 text-xs">Date</p><p className="font-medium text-slate-800 dark:text-slate-200">{new Date(order.date).toLocaleDateString()}</p></div>
            <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3"><p className="text-slate-400 dark:text-slate-500 text-xs">Total</p><p className="font-bold text-lg text-indigo-600 dark:text-indigo-400">{currency}{order.totalAmount.toFixed(2)}</p></div>
          </div>
        </div>
        <div className="px-4 sm:px-5 py-4 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Close</button>
        </div>
      </div>
    </div>
  )
}
