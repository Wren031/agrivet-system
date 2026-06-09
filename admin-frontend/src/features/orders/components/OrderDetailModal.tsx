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
    Pending: 'bg-yellow-50 text-yellow-700',
    Completed: 'bg-green-50 text-green-700',
    Cancelled: 'bg-red-50 text-red-700',
  }

  const currency = settings.currencySymbol

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800">Order Details</h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100"><X size={20} className="text-slate-400" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center"><ShoppingCart size={24} className="text-indigo-600" /></div>
            <div>
              <p className="font-semibold text-slate-800">{order.id}</p>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>{order.status}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-50 rounded-lg p-3"><p className="text-slate-400 text-xs">Customer</p><p className="font-medium text-slate-800">{order.customerName}</p></div>
            <div className="bg-slate-50 rounded-lg p-3"><p className="text-slate-400 text-xs">Agent</p><p className="font-medium text-slate-800">{order.agentName}</p></div>
            <div className="bg-slate-50 rounded-lg p-3"><p className="text-slate-400 text-xs">Date</p><p className="font-medium text-slate-800">{new Date(order.date).toLocaleDateString()}</p></div>
            <div className="bg-slate-50 rounded-lg p-3"><p className="text-slate-400 text-xs">Total</p><p className="font-bold text-lg text-indigo-600">{currency}{order.totalAmount.toFixed(2)}</p></div>
          </div>
        </div>
        <div className="px-5 py-4 border-t border-slate-100 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors">Close</button>
        </div>
      </div>
    </div>
  )
}
