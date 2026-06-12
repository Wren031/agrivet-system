import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Printer } from 'lucide-react'
import { useOrders } from '../hooks/useOrders'
import { useApp } from '../../../context/AppContext'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { orders, loading } = useOrders()
  const { settings } = useApp()

  const defaultItems = [
    { name: 'Paracetamol 500mg', quantity: 10, price: 12.50 },
    { name: 'Amoxicillin 250mg', quantity: 5, price: 25.00 },
    { name: 'Vitamin C 1000mg', quantity: 8, price: 8.75 },
  ]

  const found = orders.find(o => o.id === id)
  const order = found
    ? { ...found, items: found.items?.length ? found.items : defaultItems }
    : {
        id: id || 'ORD-0000',
        customerName: 'Green Fields Veterinary',
        agentName: 'Maria Santos',
        date: '2026-05-20',
        totalAmount: 352.50,
        status: 'Completed' as const,
        items: defaultItems,
      }

  const statusColors: Record<string, string> = {
    Pending: 'bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400',
    Completed: 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400',
    Cancelled: 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400',
  }

  if (loading) {
    return <div className="text-center py-16 text-slate-400">Loading...</div>
  }

  return (
    <div>
      <button onClick={() => navigate('/orders')}
        className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Orders
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-800 dark:text-white">Order {order.id}</h1>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">View full order details</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                <Printer size={14} /> Print
              </button>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>{order.status}</span>
            </div>
          </div>
        </div>

        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Customer</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{order.customerName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Agent</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{order.agentName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Date</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{new Date(order.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400 dark:text-slate-500 mb-1">Total Amount</p>
              <p className="text-sm font-bold text-slate-800 dark:text-white">{settings.currencySymbol}{order.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-5">
          <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Order Items</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-4 py-2">Item</th><th className="px-4 py-2">Qty</th><th className="px-4 py-2">Price</th><th className="px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {order.items.map((item, i) => (
                <tr key={i}>
                  <td className="px-4 py-2.5 text-slate-700 dark:text-slate-200">{item.name}</td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{item.quantity}</td>
                  <td className="px-4 py-2.5 text-slate-600 dark:text-slate-300">{settings.currencySymbol}{item.price.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-slate-700 dark:text-slate-200 font-medium">{settings.currencySymbol}{(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
