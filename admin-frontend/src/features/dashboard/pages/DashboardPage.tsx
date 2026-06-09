import { Package, Users, UserCircle, AlertTriangle, ShoppingCart } from 'lucide-react'
import { useProducts } from '../../inventory/hooks/useProducts'
import { useAgents } from '../../agents/hooks/useAgents'
import { useCustomers } from '../../customers/hooks/useCustomers'
import { useOrders } from '../../orders/hooks/useOrders'
import { useApp } from '../../../context/AppContext'
import { SkeletonCards } from '../../../components/Skeleton'
import MetricCard from '../components/MetricCard'

export default function DashboardPage() {
  const { products, loading: prodLoading } = useProducts()
  const { agents, loading: agentLoading } = useAgents()
  const { customers, loading: custLoading } = useCustomers()
  const { orders, loading: orderLoading } = useOrders()
  const { settings } = useApp()

  const loading = prodLoading || agentLoading || custLoading || orderLoading

  const lowStockCount = products.filter(p => p.stock <= settings.lowStockThreshold).length

  const recentOrders = [...orders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5)

  const statusColors: Record<string, string> = {
    Pending: 'bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400',
    Completed: 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400',
    Cancelled: 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400',
  }

  if (loading) {
    return (
      <div>
        <div className="mb-8">
          <div className="h-7 w-48 bg-slate-200 dark:bg-slate-700 rounded animate-pulse mb-2" />
          <div className="h-4 w-64 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
        </div>
        <SkeletonCards count={5} />
        <div className="mt-8 h-64 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
      </div>
    )
  }

  const currency = settings.currencySymbol

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Overview of your inventory system</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 mb-8">
        <MetricCard title="Total Products" value={products.length} icon={<Package size={22} className="text-indigo-600" />} color="bg-indigo-50 dark:bg-indigo-950/30" />
        <MetricCard title="Total Agents" value={agents.length} icon={<Users size={22} className="text-blue-600" />} color="bg-blue-50 dark:bg-blue-950/30" />
        <MetricCard title="Total Customers" value={customers.length} icon={<UserCircle size={22} className="text-emerald-600" />} color="bg-emerald-50 dark:bg-emerald-950/30" />
        <MetricCard title="Low Stock Alerts" value={lowStockCount} icon={<AlertTriangle size={22} className="text-amber-600" />} color="bg-amber-50 dark:bg-amber-950/30" />
        <MetricCard title="Total Orders" value={orders.length} icon={<ShoppingCart size={22} className="text-rose-600" />} color="bg-rose-50 dark:bg-rose-950/30" />
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800 dark:text-white">Recent Orders</h2>
          <span className="text-xs text-slate-400 dark:text-slate-500">Latest 5 transactions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3">Order ID</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Agent</th>
                <th className="px-5 py-3">Date</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {recentOrders.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500">
                  <ShoppingCart size={40} className="mx-auto mb-2 opacity-40" /><p className="text-sm">No orders yet</p>
                </td></tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-slate-200">{order.id}</td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{order.customerName}</td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{order.agentName}</td>
                    <td className="px-5 py-3.5 text-slate-400 dark:text-slate-500">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5 text-slate-700 dark:text-slate-200 font-medium">{currency}{order.totalAmount.toFixed(2)}</td>
                    <td className="px-5 py-3.5"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>{order.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
