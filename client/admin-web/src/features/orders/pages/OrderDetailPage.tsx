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
    Pending: 'bg-surface-50 dark:bg-surface-950/30 text-surface-700 dark:text-surface-400',
    Completed: 'bg-surface-100 dark:bg-surface-900/40 text-surface-700 dark:text-surface-300',
    Cancelled: 'bg-surface-200/50 dark:bg-surface-800/50 text-surface-800 dark:text-surface-300',
  }

  if (loading) {
    return <div className="text-center py-16 text-surface-400">Loading...</div>
  }

  return (
    <div>
      <button onClick={() => navigate('/orders')}
        className="flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Orders
      </button>

      <div>
        <div className="px-4 sm:px-6 py-5 border-b border-surface-100 dark:border-surface-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-surface-900 dark:text-white truncate">Order {order.id}</h1>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">View full order details</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
                <Printer size={14} /> Print
              </button>
              <span className={`px-3 py-1 rounded-md text-xs font-medium ${statusColors[order.status]}`}>{order.status}</span>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-5 border-b border-surface-100 dark:border-surface-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">Customer</p>
              <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{order.customerName}</p>
            </div>
            <div>
              <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">Agent</p>
              <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{order.agentName}</p>
            </div>
            <div>
              <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">Date</p>
              <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
            </div>
            <div>
              <p className="text-xs text-surface-500 dark:text-surface-400 mb-1">Total Amount</p>
              <p className="text-sm font-bold text-surface-900 dark:text-white">{settings.currencySymbol}{order.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="px-4 sm:px-6 py-5">
          <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-3">Order Items</h3>
          <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-50 dark:bg-surface-800/50 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                <th className="px-4 py-2">Item</th><th className="px-4 py-2">Qty</th><th className="px-4 py-2">Price</th><th className="px-4 py-2">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
              {order.items.map((item, i) => (
                <tr key={i}>
                  <td className="px-4 py-2.5 text-surface-700 dark:text-surface-200">{item.name}</td>
                  <td className="px-4 py-2.5 text-surface-600 dark:text-surface-300">{item.quantity}</td>
                  <td className="px-4 py-2.5 text-surface-600 dark:text-surface-300">{settings.currencySymbol}{item.price.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-surface-700 dark:text-surface-200 font-medium">{settings.currencySymbol}{(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  )
}
