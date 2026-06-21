import { useMemo } from 'react'
import { Users, UserCircle, ShoppingCart, Landmark, Clock, TrendingUp, Package } from 'lucide-react'
import { useAgents } from '../../agents/hooks/useAgents'
import { useCustomers } from '../../customers/hooks/useCustomers'
import { useOrders } from '../../orders/hooks/useOrders'
import { useBranches } from '../../branch/hooks/useBranches'
import { useApp } from '../../../context/AppContext'
import { SkeletonCards } from '../../../components/Skeleton'
import MetricCard from '../components/MetricCard'
import LineChart from '../components/LineChart'
import HorizontalBarChart from '../components/HorizontalBarChart'

export default function DashboardPage() {
  const { agents, loading: agentLoading } = useAgents()
  const { customers, loading: custLoading } = useCustomers()
  const { orders, loading: orderLoading } = useOrders()
  const { branches } = useBranches()
  const { settings } = useApp()

  const currency = settings.currencySymbol

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0)
  const pendingOrders = orders.filter(o => o.status === 'Pending').length
  const prevMonthRevenue = useMemo(() => {
    const now = new Date()
    const curMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    const prevDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const prevMonth = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, '0')}`
    const cur = orders.filter(o => o.date.startsWith(curMonth)).reduce((s, o) => s + o.totalAmount, 0)
    const prev = orders.filter(o => o.date.startsWith(prevMonth)).reduce((s, o) => s + o.totalAmount, 0)
    return prev > 0 ? ((cur - prev) / prev * 100) : cur > 0 ? 100 : 0
  }, [orders])

  const recentOrders = useMemo(() =>
    [...orders].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5),
    [orders]
  )

  const monthlySales = useMemo(() => {
    const groups: Record<string, number> = {}
    orders.forEach(o => {
      const month = o.date.slice(0, 7)
      groups[month] = (groups[month] || 0) + o.totalAmount
    })
    return Object.entries(groups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, total]) => {
        const [y, m] = month.split('-')
        const date = new Date(+y, +m - 1)
        return {
          label: date.toLocaleDateString('en-US', { month: 'short' }),
          value: Math.round(total * 100) / 100,
        }
      })
  }, [orders])

  const topItems = useMemo(() => {
    const groups: Record<string, number> = {}
    orders.forEach(o => {
      ;(o.items || []).forEach(item => {
        const total = item.quantity * item.price
        groups[item.name] = (groups[item.name] || 0) + total
      })
    })
    return Object.entries(groups)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, total]) => ({
        label: name,
        value: Math.round(total * 100) / 100,
      }))
  }, [orders])

  const loading = agentLoading || custLoading || orderLoading

  const statusColors: Record<string, string> = {
    Pending: 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400',
    Completed: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
    Cancelled: 'bg-indigo-200/50 dark:bg-indigo-800/50 text-indigo-800 dark:text-indigo-300',
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Overview of your inventory system</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-800 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700">
          <Clock size={14} />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Cards */}
      {loading ? (
        <SkeletonCards count={6} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <MetricCard title="Total Agents" value={agents.length} icon={<Users size={20} />} color="bg-indigo-50 dark:bg-indigo-950/30" />
          <MetricCard title="Total Customers" value={customers.length} icon={<UserCircle size={20} />} color="bg-indigo-50 dark:bg-indigo-950/30" />
          <MetricCard title="Total Orders" value={orders.length} icon={<ShoppingCart size={20} />} color="bg-indigo-50 dark:bg-indigo-950/30" />
          <MetricCard title="Total Revenue" value={`${currency}${totalRevenue.toLocaleString()}`} icon={<TrendingUp size={20} />} color="bg-indigo-50 dark:bg-indigo-950/30" trend={{ value: `${Math.abs(Math.round(prevMonthRevenue))}%`, positive: prevMonthRevenue >= 0 }} />
          <MetricCard title="Total Branches" value={branches.length} icon={<Landmark size={20} />} color="bg-indigo-50 dark:bg-indigo-950/30" />
          <MetricCard title="Pending Orders" value={pendingOrders} icon={<Clock size={20} />} color="bg-indigo-50 dark:bg-indigo-950/30" />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Sales Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
                <TrendingUp size={16} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Monthly Sales</h2>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">Revenue trend over time</p>
              </div>
            </div>
            <span className="text-xs text-slate-400 dark:text-slate-500">
              Total: {currency}{monthlySales.reduce((s, m) => s + m.value, 0).toLocaleString()}
            </span>
          </div>
          <LineChart data={monthlySales} height={220} currency={currency} />
        </div>

        {/* Top Selling Items */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
              <Package size={16} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Top Selling Items</h2>
              <p className="text-[11px] text-slate-400 dark:text-slate-500">Highest revenue generating products</p>
            </div>
          </div>
          {topItems.length === 0 ? (
            <div className="flex items-center justify-center" style={{ height: 200 }}>
              <p className="text-sm text-slate-400 dark:text-slate-500">No item data available</p>
            </div>
          ) : (
            <HorizontalBarChart data={topItems} currency={currency} />
          )}
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div className="px-4 sm:px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center">
              <ShoppingCart size={15} className="text-slate-500 dark:text-slate-400" />
            </div>
            <h2 className="font-semibold text-sm text-slate-800 dark:text-slate-100">Recent Orders</h2>
          </div>
          <span className="text-xs text-slate-400 dark:text-slate-500">Latest 5 transactions</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                <th className="px-5 py-3">Order ID</th>
                <th className="px-5 py-3">Customer</th>
                <th className="px-5 py-3">Agent</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/80">
              {recentOrders.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500">
                  <ShoppingCart size={40} className="mx-auto mb-2 opacity-40" /><p className="text-sm">No orders yet</p>
                </td></tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/20 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-slate-200">{order.id}</td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{order.customerName}</td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{order.agentName}</td>
                    <td className="px-5 py-3.5 text-slate-400 dark:text-slate-500">{new Date(order.date).toLocaleDateString()}</td>
                    <td className="px-5 py-3.5 text-slate-700 dark:text-slate-200 font-medium">{currency}{order.totalAmount.toFixed(2)}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>{order.status}</span>
                    </td>
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
