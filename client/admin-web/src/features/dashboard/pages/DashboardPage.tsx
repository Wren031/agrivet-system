import { useMemo, useEffect, useState } from 'react'
import { Users, UserCircle, ShoppingCart, Landmark, Clock, TrendingUp, ChevronDown, Coins } from 'lucide-react'
import { useAgents } from '../../agents/hooks/useAgents'
import { useCustomers } from '../../customers/hooks/useCustomers'
import { useOrders } from '../../orders/hooks/useOrders'
import { useBranches } from '../../branch/hooks/useBranches'
import { useApp } from '../../../context/AppContext'
import { SkeletonCards } from '../../../components/Skeleton'
import MetricCard from '../components/MetricCard'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

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

  const years = useMemo(() => {
    const y = new Set(orders.map(o => o.date.slice(0, 4)))
    return Array.from(y).sort().reverse()
  }, [orders])

  const [selectedYear, setSelectedYear] = useState<string>('')

  useEffect(() => {
    if (!selectedYear && years.length > 0) {
      setSelectedYear(years[0])
    }
  }, [years, selectedYear])

  const yearlySales = useMemo(() => {
    if (!selectedYear) return []
    return MONTHS.map((label, i) => {
      const prefix = `${selectedYear}-${String(i + 1).padStart(2, '0')}`
      const total = orders
        .filter(o => o.date.startsWith(prefix))
        .reduce((s, o) => s + o.totalAmount, 0)
      return { label, value: Math.round(total * 100) / 100 }
    })
  }, [orders, selectedYear])

  const yearTotal = yearlySales.reduce((s, m) => s + m.value, 0)
  const maxMonthValue = Math.max(...yearlySales.map(m => m.value), 1)

  const loading = agentLoading || custLoading || orderLoading

  const statusColors: Record<string, string> = {
    Pending: 'bg-surface-50 text-surface-600 dark:bg-surface-800 dark:text-surface-300',
    Completed: 'bg-surface-50 text-success dark:bg-surface-800 dark:text-success',
    Cancelled: 'bg-surface-50 text-error dark:bg-surface-800 dark:text-error',
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-surface-900 dark:text-white tracking-tight">Dashboard</h1>
          <p className="text-sm text-surface-400 dark:text-surface-500 mt-1">Overview of your inventory system</p>
        </div>

      </div>

      {/* Stats Cards */}
      {loading ? (
        <SkeletonCards count={6} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <MetricCard title="Total Agents" value={agents.length} icon={<Users size={18} />} />
          <MetricCard title="Total Customers" value={customers.length} icon={<UserCircle size={18} />} />
          <MetricCard title="Total Orders" value={orders.length} icon={<ShoppingCart size={18} />} />
          <MetricCard title="Total Revenue" value={`${currency}${totalRevenue.toLocaleString()}`} icon={<Coins size={18} />} trend={{ value: `${Math.abs(Math.round(prevMonthRevenue))}%`, positive: prevMonthRevenue >= 0 }} />
          <MetricCard title="Total Branches" value={branches.length} icon={<Landmark size={18} />} />
          <MetricCard title="Pending Orders" value={pendingOrders} icon={<Clock size={18} />} />
        </div>
      )}

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Yearly Sales Bar Chart */}
        <div className="border border-surface-200 dark:border-surface-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-500 dark:text-surface-400">
                <TrendingUp size={16} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-surface-800 dark:text-surface-100">Yearly Sales</h2>
                <p className="text-[12px] text-surface-400 dark:text-surface-500">Monthly revenue breakdown</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-surface-400 dark:text-surface-500">
                Total: {currency}{yearTotal.toLocaleString()}
              </span>
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={e => setSelectedYear(e.target.value)}
                  className="appearance-none bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 text-xs font-medium rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 cursor-pointer"
                >
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-surface-400" />
              </div>
            </div>
          </div>
          {yearlySales.length > 0 ? (
            <div className="flex items-end gap-1.5 h-[220px] pb-6 relative">
              {yearlySales.map((m, i) => {
                const pct = maxMonthValue > 0 ? (m.value / maxMonthValue) * 100 : 0
                return (
                  <div key={m.label} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                    <div className="w-full flex justify-center">
                      <span className="text-[10px] font-medium text-surface-500 dark:text-surface-400 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-surface-800 px-1.5 py-0.5 rounded absolute -top-6 z-10 whitespace-nowrap border border-surface-200 dark:border-surface-700">
                        {currency}{m.value.toLocaleString()}
                      </span>
                    </div>
                    <div
                      className="w-full rounded-t-sm transition-all duration-300 hover:opacity-80 cursor-pointer"
                      style={{
                        height: `${Math.max(pct, 2)}%`,
                        background: `linear-gradient(to top, #a3a3a3, #d4d4d4)`,
                      }}
                    />
                    <span className="text-[10px] text-surface-400 dark:text-surface-500 mt-1 absolute bottom-0">{m.label}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-surface-400 dark:text-surface-500 text-sm">
              No sales data for {selectedYear}
            </div>
          )}
        </div>

        {/* Recently Login */}
        <div className="border border-surface-200 dark:border-surface-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between px-6 pt-6 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-500 dark:text-surface-400">
                <Clock size={16} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-surface-800 dark:text-surface-100">Recent Agents</h2>
                <p className="text-[12px] text-surface-400 dark:text-surface-500">{agents.length} agent{agents.length !== 1 ? 's' : ''} registered</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs font-semibold text-surface-400 dark:text-surface-500 border-t border-surface-100 dark:border-surface-800">
                  <th className="px-6 py-3">Agent</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Last Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                {agents.length === 0 ? (
                  <tr><td colSpan={3} className="px-6 py-12 text-center text-surface-400 dark:text-surface-500">
                    <Users size={36} className="mx-auto mb-2 opacity-30" /><p className="text-sm">No agents yet</p>
                  </td></tr>
                ) : (
                  [...agents]
                    .sort((a, b) => {
                      if (a.status === 'ONLINE' && b.status !== 'ONLINE') return -1
                      if (a.status !== 'ONLINE' && b.status === 'ONLINE') return 1
                      return 0
                    })
                    .slice(0, 5)
                    .map(agent => (
                    <tr key={agent.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center font-semibold text-xs text-surface-500 dark:text-surface-400 uppercase">
                            {agent.fullName.charAt(0)}
                          </div>
                          <span className="text-sm font-medium text-surface-800 dark:text-surface-200">{agent.fullName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium ${
                          agent.status === 'ONLINE'
                            ? 'bg-surface-50 dark:bg-surface-800 text-surface-600 dark:text-surface-300'
                            : 'bg-surface-50 dark:bg-surface-800 text-surface-400 dark:text-surface-500'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            agent.status === 'ONLINE' ? 'bg-success' : 'bg-surface-300 dark:bg-surface-600'
                          }`} />
                          {agent.status === 'ONLINE' ? 'Online' : 'Offline'}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-xs text-surface-400 dark:text-surface-500">
                        {agent.createdAt
                          ? new Date(agent.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                          : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="border border-surface-200 dark:border-surface-800 rounded-xl overflow-hidden">
        <div className="px-6 pt-6 pb-4">
          <h2 className="text-sm font-semibold text-surface-800 dark:text-surface-100">Recent Orders</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs font-semibold text-surface-400 dark:text-surface-500 border-t border-surface-100 dark:border-surface-800">
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Agent</th>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
              {recentOrders.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-12 text-center text-surface-400 dark:text-surface-500">
                  <ShoppingCart size={36} className="mx-auto mb-2 opacity-30" /><p className="text-sm">No orders yet</p>
                </td></tr>
              ) : (
                recentOrders.map(order => (
                  <tr key={order.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                    <td className="px-6 py-3.5 font-medium text-surface-800 dark:text-surface-200">{order.id}</td>
                    <td className="px-6 py-3.5 text-surface-500 dark:text-surface-300">{order.customerName}</td>
                    <td className="px-6 py-3.5 text-surface-500 dark:text-surface-300">{order.agentName}</td>
                    <td className="px-6 py-3.5 text-surface-400 dark:text-surface-500">{new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                    <td className="px-6 py-3.5 text-surface-700 dark:text-surface-200 font-medium">{currency}{order.totalAmount.toFixed(2)}</td>
                    <td className="px-6 py-3.5">
                      <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${statusColors[order.status]}`}>{order.status}</span>
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
