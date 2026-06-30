import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Eye, ChevronLeft, ChevronRight, CheckSquare, Square } from 'lucide-react'
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

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

  const allSelected = paginated.length > 0 && paginated.every(o => selectedIds.has(o.id))

  function toggleAll() {
    if (allSelected) setSelectedIds(new Set())
    else setSelectedIds(new Set(paginated.map(o => o.id)))
  }

  function toggleOne(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const statusColors: Record<string, string> = {
    Pending: 'bg-surface-50 dark:bg-surface-950/30 text-surface-700 dark:text-surface-400',
    Completed: 'bg-surface-100 dark:bg-surface-900/40 text-surface-700 dark:text-surface-300',
    Cancelled: 'bg-surface-200/50 dark:bg-surface-800/50 text-surface-800 dark:text-surface-300',
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
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Orders</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">View all transactions and order details</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="p-5 border border-surface-200 dark:border-surface-700 rounded-xl">
          <p className="text-sm text-surface-500 dark:text-surface-400">Total Orders</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">{totalOrders}</p>
        </div>
        <div className="p-5 border border-surface-200 dark:border-surface-700 rounded-xl">
          <p className="text-sm text-surface-500 dark:text-surface-400">New Orders</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">{newOrders}</p>
        </div>
        <div className="p-5 border border-surface-200 dark:border-surface-700 rounded-xl">
          <p className="text-sm text-surface-500 dark:text-surface-400">Weekly Orders</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">{weeklyOrders}</p>
        </div>
        <div className="p-5 border border-surface-200 dark:border-surface-700 rounded-xl">
          <p className="text-sm text-surface-500 dark:text-surface-400">Total Sales</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">{settings.currencySymbol}{totalSales.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-6">
        <div className="flex gap-1 flex-wrap">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => { setFilter(tab.key); setPage(1) }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
                filter === tab.key
                  ? 'bg-surface-50 dark:bg-surface-950/30 text-surface-700 dark:text-surface-400'
                  : 'text-surface-500 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-700'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>
        <input type="text" placeholder="Search orders..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="w-full sm:w-64 px-3 py-2 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 placeholder:text-surface-400 dark:placeholder:text-surface-500" />
      </div>
      <div className="overflow-x-auto">
        {loading ? (
          <SkeletonTable rows={6} />
        ) : (
          <>
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-50 dark:bg-surface-800/50 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-10">
                    <button onClick={toggleAll} className="flex items-center justify-center">
                      {allSelected ? <CheckSquare size={15} className="text-surface-500" /> : <Square size={15} className="text-surface-400" />}
                    </button>
                  </th>
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Agent</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan={8} className="px-5 py-12 text-center text-surface-500 dark:text-surface-400">
                    <ShoppingCart size={40} className="mx-auto mb-2 opacity-40" /><p>No orders found</p>
                  </td></tr>
                ) : (
                  paginated.map(order => {
                    const checked = selectedIds.has(order.id)
                    return (
                      <tr key={order.id} className={`border-b border-surface-100 dark:border-surface-800 transition-colors ${checked ? 'bg-surface-50/50 dark:bg-surface-950/20' : ''}`}>
                        <td className="py-3 px-4">
                          <button onClick={() => toggleOne(order.id)} className="flex items-center justify-center">
                            {checked ? <CheckSquare size={15} className="text-surface-600" /> : <Square size={15} className="text-surface-400" />}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-xs font-mono text-surface-500 dark:text-surface-400">#{order.id.slice(0, 6)}</td>
                        <td className="py-3 px-4 font-medium text-surface-800 dark:text-surface-200">{order.customerName}</td>
                        <td className="py-3 px-4 text-surface-600 dark:text-surface-300">{order.agentName}</td>
                        <td className="py-3 px-4 text-surface-500 dark:text-surface-400">{new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td className="py-3 px-4 text-surface-700 dark:text-surface-200 font-medium">{settings.currencySymbol}{order.totalAmount.toFixed(2)}</td>
                        <td className="py-3 px-4"><span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${statusColors[order.status]}`}>{order.status}</span></td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Link to={`/orders/${order.id}`}
                              className="p-1.5 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-xl transition-colors"
                              title="View Details"><Eye size={16} /></Link>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 text-sm">
                <p className="text-surface-500 dark:text-surface-400">
                  Page {page} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors text-xs disabled:opacity-40 disabled:cursor-not-allowed">
                    <ChevronLeft size={14} /> Prev
                  </button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors text-xs disabled:opacity-40 disabled:cursor-not-allowed">
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
