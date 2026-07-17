import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { ShoppingCart, Store, Eye, Search, AlertCircle, RefreshCw } from 'lucide-react'
import { useOrders } from '../hooks/useOrders'
import { SkeletonTable } from '../../../components/Skeleton'
import PageHeader from '../../../components/PageHeader'
import TabNav from '../../../components/TabNav'
import Pagination from '../../../components/Pagination'
import StatusBadge from '../../../components/StatusBadge'
import { useApp } from '../../../context/AppContext'

const PAGE_SIZE = 8



export default function OrdersPage() {
  const { agentOrders, branchOrders, loading, error, reload } = useOrders()
  const { settings, counts } = useApp()
  const [activeTab, setActiveTab] = useState<'agent' | 'branch'>('agent')

  const [agentSearch, setAgentSearch] = useState('')
  const [agentStatusFilter, setAgentStatusFilter] = useState('')
  const [agentPage, setAgentPage] = useState(1)

  const [branchSearch, setBranchSearch] = useState('')
  const [branchStatusFilter, setBranchStatusFilter] = useState('')
  const [branchPage, setBranchPage] = useState(1)

  const totalOrders = agentOrders.length + branchOrders.length
  const totalRevenue = [...agentOrders, ...branchOrders].reduce((sum, o) => sum + o.totalAmount, 0)
  const agentCount = agentOrders.length
  const branchCount = branchOrders.length

  const agentFiltered = useMemo(() => {
    let result = agentOrders
    if (agentSearch) {
      const q = agentSearch.toLowerCase()
      result = result.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.customerName.toLowerCase().includes(q) ||
        o.agentName.toLowerCase().includes(q)
      )
    }
    if (agentStatusFilter) {
      result = result.filter(o => o.status === agentStatusFilter)
    }
    return result
  }, [agentOrders, agentSearch, agentStatusFilter])

  const agentTotalPages = Math.max(1, Math.ceil(agentFiltered.length / PAGE_SIZE))
  const agentPaginated = agentFiltered.slice((agentPage - 1) * PAGE_SIZE, agentPage * PAGE_SIZE)

  const branchFiltered = useMemo(() => {
    let result = branchOrders
    if (branchSearch) {
      const q = branchSearch.toLowerCase()
      result = result.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.branchName.toLowerCase().includes(q) ||
        o.address.toLowerCase().includes(q)
      )
    }
    if (branchStatusFilter) {
      result = result.filter(o => o.status === branchStatusFilter)
    }
    return result
  }, [branchOrders, branchSearch, branchStatusFilter])

  const branchTotalPages = Math.max(1, Math.ceil(branchFiltered.length / PAGE_SIZE))
  const branchPaginated = branchFiltered.slice((branchPage - 1) * PAGE_SIZE, branchPage * PAGE_SIZE)

  if (error) {
    return (
      <div>
        <PageHeader title="Orders" subtitle="View all transactions and order details" />
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 rounded-xl p-8 text-center">
          <AlertCircle size={48} className="mx-auto mb-3 text-red-400 dark:text-red-500" />
          <p className="text-red-700 dark:text-red-400 font-medium mb-1">Failed to load orders</p>
          <p className="text-red-500 dark:text-red-400 text-sm mb-4">{error}</p>
          <button onClick={reload}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors">
            <RefreshCw size={16} /> Retry
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Orders" subtitle="View all transactions and order details" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        <div className="p-5 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-900">
          <p className="text-sm text-surface-500 dark:text-surface-400">Total Orders</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">{totalOrders}</p>
        </div>
        <div className="p-5 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-900">
          <p className="text-sm text-surface-500 dark:text-surface-400">Agent Orders</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">{agentCount}</p>
        </div>
        <div className="p-5 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-900">
          <p className="text-sm text-surface-500 dark:text-surface-400">Branch Orders</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">{branchCount}</p>
        </div>
        <div className="p-5 border border-surface-200 dark:border-surface-700 rounded-xl bg-white dark:bg-surface-900">
          <p className="text-sm text-surface-500 dark:text-surface-400">Total Revenue</p>
          <p className="text-2xl font-bold text-surface-900 dark:text-white mt-1">{settings.currencySymbol}{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      <TabNav
        tabs={[
          { key: 'agent', label: 'Agent Booking Orders', badge: counts.agentBookingOrders },
          { key: 'branch', label: 'Branch Booking Orders', badge: counts.branchBookingOrders },
        ]}
        activeKey={activeTab}
        onTabChange={key => { setActiveTab(key as 'agent' | 'branch'); key === 'agent' ? setAgentPage(1) : setBranchPage(1) }}
      />

      {activeTab === 'agent' && (
        loading ? (
          <SkeletonTable rows={6} />
        ) : (
          <AgentOrdersTab
            orders={agentPaginated}
            totalPages={agentTotalPages}
            page={agentPage}
            setPage={setAgentPage}
            search={agentSearch}
            setSearch={v => { setAgentSearch(v); setAgentPage(1) }}
            statusFilter={agentStatusFilter}
            setStatusFilter={v => { setAgentStatusFilter(v); setAgentPage(1) }}
            currencySymbol={settings.currencySymbol}
          />
        )
      )}

      {activeTab === 'branch' && (
        loading ? (
          <SkeletonTable rows={6} />
        ) : (
          <BranchOrdersTab
            orders={branchPaginated}
            totalPages={branchTotalPages}
            page={branchPage}
            setPage={setBranchPage}
            search={branchSearch}
            setSearch={v => { setBranchSearch(v); setBranchPage(1) }}
            statusFilter={branchStatusFilter}
            setStatusFilter={v => { setBranchStatusFilter(v); setBranchPage(1) }}
            currencySymbol={settings.currencySymbol}
          />
        )
      )}
    </div>
  )
}

function AgentOrdersTab({
  orders, totalPages, page, setPage,
  search, setSearch, statusFilter, setStatusFilter, currencySymbol,
}: {
  orders: import('../services/types').AgentOrder[]
  totalPages: number
  page: number
  setPage: (n: number) => void
  search: string
  setSearch: (v: string) => void
  statusFilter: string
  setStatusFilter: (v: string) => void
  currencySymbol: string
}) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 dark:text-surface-400" />
          <input type="text" placeholder="Search by ID, customer, agent..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 placeholder:text-surface-400 dark:placeholder:text-surface-500" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="py-2 px-3 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600">
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Process">Process</option>
          <option value="Approved">Approved</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-50 dark:bg-surface-800/50 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">ID</th>
              <th className="py-3.5 px-4">Customer</th>
              <th className="py-3.5 px-4">Agent</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Assigned Staff</th>
              <th className="py-3.5 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={8} className="px-5 py-12 text-center text-surface-500 dark:text-surface-400">
                <ShoppingCart size={40} className="mx-auto mb-2 opacity-40" /><p>No agent orders found</p>
              </td></tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} className="border-b border-surface-100 dark:border-surface-800 transition-colors hover:bg-surface-50/50 dark:hover:bg-surface-800/20">
                  <td className="py-3 px-4 text-xs font-mono text-surface-500 dark:text-surface-400">#{order.id.slice(0, 6)}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-surface-800 dark:text-surface-200">{order.customerName}</div>
                    <div className="text-xs text-surface-500 dark:text-surface-400">{order.customerPhone}</div>
                  </td>
                  <td className="py-3 px-4 text-surface-600 dark:text-surface-300">{order.agentName || '—'}</td>
                  <td className="py-3 px-4 text-surface-500 dark:text-surface-400">
                    {new Date(order.orderDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-3 px-4 text-surface-700 dark:text-surface-200 font-medium">{currencySymbol}{order.totalAmount.toLocaleString()}</td>
                  <td className="py-3 px-4"><StatusBadge status={order.status} /></td>
                  <td className="py-3 px-4 text-surface-500 dark:text-surface-400">{order.assignedStaff || '—'}</td>
                  <td className="py-3 px-4 text-center">
                    <Link to={`/orders/${order.id}`}
                      className="inline-flex p-1.5 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                      title="View Details"><Eye size={16} /></Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  )
}

function BranchOrdersTab({
  orders, totalPages, page, setPage,
  search, setSearch, statusFilter, setStatusFilter, currencySymbol,
}: {
  orders: import('../services/types').BranchOrder[]
  totalPages: number
  page: number
  setPage: (n: number) => void
  search: string
  setSearch: (v: string) => void
  statusFilter: string
  setStatusFilter: (v: string) => void
  currencySymbol: string
}) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 dark:text-surface-400" />
          <input type="text" placeholder="Search by ID, branch, location..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 placeholder:text-surface-400 dark:placeholder:text-surface-500" />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="py-2 px-3 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600">
          <option value="">All Status</option>
          <option value="Pending">Pending</option>
          <option value="Process">Process</option>
          <option value="Approved">Approved</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-surface-50 dark:bg-surface-800/50 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
              <th className="py-3.5 px-4">ID</th>
              <th className="py-3.5 px-4">Branch</th>
              <th className="py-3.5 px-4">Location</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Amount</th>
              <th className="py-3.5 px-4">Items</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4">Assigned Staff</th>
              <th className="py-3.5 px-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={9} className="px-5 py-12 text-center text-surface-500 dark:text-surface-400">
                <Store size={40} className="mx-auto mb-2 opacity-40" /><p>No branch orders found</p>
              </td></tr>
            ) : (
              orders.map(order => (
                <tr key={order.id} className="border-b border-surface-100 dark:border-surface-800 transition-colors hover:bg-surface-50/50 dark:hover:bg-surface-800/20">
                  <td className="py-3 px-4 text-xs font-mono text-surface-500 dark:text-surface-400">#{order.id.slice(0, 6)}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-surface-800 dark:text-surface-200">{order.branchName}</div>
                    <div className="text-xs text-surface-500 dark:text-surface-400">{order.branchContact}</div>
                  </td>
                  <td className="py-3 px-4 text-surface-600 dark:text-surface-300">{order.address}</td>
                  <td className="py-3 px-4 text-surface-500 dark:text-surface-400">
                    {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-3 px-4 text-surface-700 dark:text-surface-200 font-medium">{currencySymbol}{order.totalAmount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-surface-500 dark:text-surface-400">{order.itemCount} item{order.itemCount !== 1 ? 's' : ''}</td>
                  <td className="py-3 px-4"><StatusBadge status={order.status} /></td>
                  <td className="py-3 px-4 text-surface-500 dark:text-surface-400">{order.assignedStaff || '—'}</td>
                  <td className="py-3 px-4 text-center">
                    <Link to={`/orders/branch/${order.id}`}
                      className="inline-flex p-1.5 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                      title="View Details"><Eye size={16} /></Link>
                  </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    )
  }
