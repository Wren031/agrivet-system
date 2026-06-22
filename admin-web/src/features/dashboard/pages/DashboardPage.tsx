import { useMemo, useEffect, useState } from 'react'
import { Users, UserCircle, ShoppingCart, Landmark, Clock, TrendingUp, MapPin, ChevronDown } from 'lucide-react'
import { useAgents } from '../../agents/hooks/useAgents'
import { useCustomers } from '../../customers/hooks/useCustomers'
import { useOrders } from '../../orders/hooks/useOrders'
import { useBranches } from '../../branch/hooks/useBranches'
import { useApp } from '../../../context/AppContext'
import { SkeletonCards } from '../../../components/Skeleton'
import MetricCard from '../components/MetricCard'

const fakeStreets = ['Rizal St', 'Mabini St', 'Bonifacio St', 'Luna St', 'Aguinaldo St']
const fakeBarangays = ['Poblacion', 'San Roque', 'Sto Niño', 'Dagohoy', 'Kapitan Bayong']
const fakeCities = ['Valencia City', 'Malaybalay City', 'Cagayan de Oro City', 'Davao City', 'General Santos City']
const fakeProvinces = ['Bukidnon', 'Misamis Oriental', 'Davao del Sur', 'South Cotabato', 'Lanao del Norte']

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

  function fakeAddress(id: string): string {
    let hash = 0
    for (let i = 0; i < id.length; i++) {
      hash = ((hash << 5) - hash) + id.charCodeAt(i)
      hash |= 0
    }
    const street = fakeStreets[Math.abs(hash) % fakeStreets.length]
    const barangay = fakeBarangays[Math.abs(hash >> 2) % fakeBarangays.length]
    const city = fakeCities[Math.abs(hash >> 4) % fakeCities.length]
    const province = fakeProvinces[Math.abs(hash >> 6) % fakeProvinces.length]
    const houseNum = Math.abs(hash) % 999 + 1
    return `${houseNum} ${street}, ${barangay}, ${city}, ${province}`
  }

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
        {/* Yearly Sales Bar Chart */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
                <TrendingUp size={16} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Yearly Sales</h2>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">Monthly revenue breakdown</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 dark:text-slate-500">
                Total: {currency}{yearTotal.toLocaleString()}
              </span>
              <div className="relative">
                <select
                  value={selectedYear}
                  onChange={e => setSelectedYear(e.target.value)}
                  className="appearance-none bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-xs font-medium rounded-lg pl-3 pr-8 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-400 cursor-pointer"
                >
                  {years.map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
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
                      <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity bg-white dark:bg-slate-700 px-1.5 py-0.5 rounded shadow-sm border border-slate-200 dark:border-slate-600 absolute -top-6 z-10 whitespace-nowrap">
                        {currency}{m.value.toLocaleString()}
                      </span>
                    </div>
                    <div
                      className="w-full rounded-t-md transition-all duration-300 hover:opacity-80 cursor-pointer"
                      style={{
                        height: `${Math.max(pct, 2)}%`,
                        background: `linear-gradient(to top, #6366f1, #818cf8)`,
                      }}
                    />
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 absolute bottom-0">{m.label}</span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-slate-400 dark:text-slate-500 text-sm">
              No sales data for {selectedYear}
            </div>
          )}
        </div>

        {/* Agent Locations Table */}
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
                <MapPin size={16} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Agent Locations</h2>
                <p className="text-[11px] text-slate-400 dark:text-slate-500">{agents.length} agent{agents.length !== 1 ? 's' : ''} registered</p>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50/80 dark:bg-slate-800/50 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3">Agent</th>
                  <th className="px-5 py-3">Location</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/80">
                {agents.length === 0 ? (
                  <tr><td colSpan={2} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500">
                    <MapPin size={40} className="mx-auto mb-2 opacity-40" /><p className="text-sm">No agents yet</p>
                  </td></tr>
                ) : (
                  agents.map(agent => (
                    <tr key={agent.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/20 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center font-bold text-xs text-indigo-600 dark:text-indigo-400 uppercase">
                            {agent.fullName.charAt(0)}
                          </div>
                          <span className="font-medium text-slate-800 dark:text-slate-200">{agent.fullName}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 dark:text-slate-400 max-w-[260px] truncate">{fakeAddress(agent.id)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
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
