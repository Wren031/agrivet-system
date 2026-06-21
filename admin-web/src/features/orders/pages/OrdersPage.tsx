import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Eye, Clock, CalendarDays, ListOrdered, ChevronLeft, ChevronRight, DollarSign } from 'lucide-react'
import { useOrders } from '../hooks/useOrders'
import { SkeletonTable } from '../../../components/Skeleton'
import { useApp } from '../../../context/AppContext'

const PAGE_SIZE = 8

function getWeekRange() {
  const now = new Date()
  const weekAgo = new Date(now)
  weekAgo.setDate(weekAgo.getDate() - 7)
  return { start: weekAgo.toISOString().split('T')[0], end: now.toISOString().split('T')[0] }
}

function getMonthRange() {
  const now = new Date()
  const monthAgo = new Date(now)
  monthAgo.setMonth(monthAgo.getMonth() - 1)
  return { start: monthAgo.toISOString().split('T')[0], end: now.toISOString().split('T')[0] }
}

export default function OrdersPage() {
  const { orders, loading } = useOrders()
  const { settings } = useApp()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'new' | 'weekly' | 'monthly'>('all')
  const [page, setPage] = useState(1)

  const weekRange = getWeekRange()
  const monthRange = getMonthRange()

  const filtered = useMemo(() => {
    let result = orders

    if (filter === 'new') {
      result = result.filter(o => o.status === 'Pending')
    } else if (filter === 'weekly') {
      result = result.filter(o => o.date >= weekRange.start && o.date <= weekRange.end)
    } else if (filter === 'monthly') {
      result = result.filter(o => o.date >= monthRange.start && o.date <= monthRange.end)
    }

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.agentName.toLowerCase().includes(q)
      )
    }

    return result
  }, [orders, filter, search, weekRange, monthRange])

  const totalOrders = orders.length
  const newOrders = orders.filter(o => o.status === 'Pending').length
  const weeklyOrders = orders.filter(o => o.date >= weekRange.start && o.date <= weekRange.end).length
  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0)

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const statusColors: Record<string, string> = {
    Pending: 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400',
    Completed: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
    Cancelled: 'bg-indigo-200/50 dark:bg-indigo-800/50 text-indigo-800 dark:text-indigo-300',
  }

  const tabs: { key: typeof filter; label: string }[] = [
    { key: 'all', label: 'All Orders' },
    { key: 'new', label: 'New Orders' },
    { key: 'weekly', label: 'Weekly' },
    { key: 'monthly', label: 'Monthly' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Orders</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">View all transactions and order details</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center"><ListOrdered size={22} className="text-indigo-600" /></div>
          <div><p className="text-sm text-slate-500 dark:text-slate-400">Total Orders</p><p className="text-2xl font-bold text-slate-800 dark:text-white">{totalOrders}</p></div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center"><Clock size={22} className="text-indigo-600" /></div>
          <div><p className="text-sm text-slate-500 dark:text-slate-400">New Orders</p><p className="text-2xl font-bold text-slate-800 dark:text-white">{newOrders}</p></div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center"><CalendarDays size={22} className="text-indigo-700" /></div>
          <div><p className="text-sm text-slate-500 dark:text-slate-400">Weekly Orders</p><p className="text-2xl font-bold text-slate-800 dark:text-white">{weeklyOrders}</p></div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-200/50 dark:bg-indigo-800/50 flex items-center justify-center"><DollarSign size={22} className="text-indigo-800" /></div>
          <div><p className="text-sm text-slate-500 dark:text-slate-400">Total Sales</p><p className="text-2xl font-bold text-slate-800 dark:text-white">{settings.currencySymbol}{totalSales.toFixed(2)}</p></div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex gap-1 flex-wrap">
              {tabs.map(tab => (
                <button key={tab.key} onClick={() => { setFilter(tab.key); setPage(1) }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    filter === tab.key
                      ? 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                  }`}>
                  {tab.label}
                </button>
              ))}
            </div>
            <input type="text" placeholder="Search orders..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="w-full sm:w-64 px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-5"><SkeletonTable rows={6} /></div>
          ) : (
            <>
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="px-5 py-3">Order ID</th><th className="px-5 py-3">Customer</th><th className="px-5 py-3">Agent</th>
                    <th className="px-5 py-3">Date</th><th className="px-5 py-3">Amount</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {paginated.length === 0 ? (
                    <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500">
                      <ShoppingCart size={40} className="mx-auto mb-2 opacity-40" /><p>No orders found</p>
                    </td></tr>
                  ) : (
                    paginated.map(order => (
                      <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-slate-200">{order.id}</td>
                        <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{order.customerName}</td>
                        <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{order.agentName}</td>
                        <td className="px-5 py-3.5 text-slate-400 dark:text-slate-500">{new Date(order.date).toLocaleDateString()}</td>
                        <td className="px-5 py-3.5 text-slate-700 dark:text-slate-200 font-medium">{settings.currencySymbol}{order.totalAmount.toFixed(2)}</td>
                        <td className="px-5 py-3.5"><span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status]}`}>{order.status}</span></td>
                        <td className="px-5 py-3.5">
                          <Link to={`/orders/${order.id}`}
                            className="inline-flex p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                            title="View Details"><Eye size={16} /></Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>

              {totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 dark:border-slate-700">
                  <p className="text-xs text-slate-400 dark:text-slate-500">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-xs disabled:opacity-40 disabled:cursor-not-allowed">
                      <ChevronLeft size={14} /> Prev
                    </button>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-xs disabled:opacity-40 disabled:cursor-not-allowed">
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
