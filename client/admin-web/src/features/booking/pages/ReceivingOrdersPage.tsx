import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Search, ChevronLeft, ChevronRight, Eye, Calendar, Store } from 'lucide-react'
import { useBookings } from '../hooks/useBookings'
import { useApp } from '../../../context/AppContext'
import { SkeletonTable } from '../../../components/Skeleton'
import { fetchBranchOrders } from '../../../data/branch-booking/branchBookingService'
import type { BranchOrder } from '../../../data/branch-booking/types'

const statusStyles: Record<string, string> = {
  Pending: 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300',
  Process: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400',
  Approved: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400',
  Completed: 'bg-surface-100 dark:bg-surface-700 text-surface-500 dark:text-surface-400',
  Cancelled: 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400',
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function BookingPage() {
  const { bookings, loading } = useBookings()
  const { settings } = useApp()
  const [tab, setTab] = useState<'list' | 'calendar' | 'branch'>('list')
  const [calYear, setCalYear] = useState(new Date().getFullYear())
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const [selectedDate, setSelectedDate] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [sortKey, setSortKey] = useState<string>('date')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')

  const PAGE_SIZE = 10

  const [branchOrders, setBranchOrders] = useState<BranchOrder[]>([])
  const [branchLoading, setBranchLoading] = useState(false)
  const [branchError, setBranchError] = useState('')
  const [branchSearch, setBranchSearch] = useState('')
  const [branchStatusFilter, setBranchStatusFilter] = useState('')
  const [branchPage, setBranchPage] = useState(1)
  const [branchSortKey, setBranchSortKey] = useState('createdAt')
  const [branchSortDir, setBranchSortDir] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    setBranchLoading(true)
    setBranchError('')
    fetchBranchOrders()
      .then(setBranchOrders)
      .catch(err => setBranchError(err.message || 'Failed to load branch bookings'))
      .finally(() => setBranchLoading(false))
  }, [])

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1) }
    else setCalMonth(m => m - 1)
    setSelectedDate('')
  }

  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1) }
    else setCalMonth(m => m + 1)
    setSelectedDate('')
  }

  function toggleSort(key: string) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate()
  const firstDayOfWeek = new Date(calYear, calMonth, 1).getDay()

  const activeStatuses = useMemo(() => ['Pending', 'Process', 'Approved', 'Cancelled'], [])

  const bookingMap = useMemo(() => {
    const map: Record<string, number> = {}
    bookings.forEach(b => {
      if (activeStatuses.includes(b.status)) {
        map[b.date] = (map[b.date] || 0) + 1
      }
    })
    return map
  }, [bookings, activeStatuses])

  const dayBookings = useMemo(() => {
    if (!selectedDate) return []
    return bookings.filter(b => b.date === selectedDate)
  }, [bookings, selectedDate])

  const filtered = useMemo(() => {
    let result = bookings
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(b =>
        b.id.toLowerCase().includes(q) ||
        b.customer.toLowerCase().includes(q) ||
        b.agent.toLowerCase().includes(q)
      )
    }
    if (statusFilter) result = result.filter(b => b.status === statusFilter)
    result.sort((a, b) => {
      const aVal = (a as any)[sortKey] || ''
      const bVal = (b as any)[sortKey] || ''
      const cmp = typeof aVal === 'string' ? aVal.localeCompare(bVal) : aVal - bVal
      return sortDir === 'asc' ? cmp : -cmp
    })
    return result
  }, [bookings, search, statusFilter, sortKey, sortDir])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  function goToday() {
    const now = new Date()
    setCalYear(now.getFullYear())
    setCalMonth(now.getMonth())
    setSelectedDate(now.toISOString().split('T')[0])
  }

  const branchStatusStyles: Record<string, string> = {
    PENDING: 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300',
    CONFIRMED: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400',
    PROCESSING: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400',
    APPROVED: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400',
    COMPLETED: 'bg-surface-100 dark:bg-surface-700 text-surface-500 dark:text-surface-400',
    CANCELLED: 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400',
  }

  const branchFiltered = useMemo(() => {
    let result = branchOrders
    if (branchSearch) {
      const q = branchSearch.toLowerCase()
      result = result.filter(o =>
        o.id.toLowerCase().includes(q) ||
        o.branchProfile.storeBranch.toLowerCase().includes(q) ||
        o.branchProfile.location.toLowerCase().includes(q)
      )
    }
    if (branchStatusFilter) result = result.filter(o => o.status === branchStatusFilter)
    result.sort((a, b) => {
      const aVal = (a as any)[branchSortKey] || ''
      const bVal = (b as any)[branchSortKey] || ''
      const cmp = typeof aVal === 'string' ? aVal.localeCompare(bVal) : aVal - bVal
      return branchSortDir === 'asc' ? cmp : -cmp
    })
    return result
  }, [branchOrders, branchSearch, branchStatusFilter, branchSortKey, branchSortDir])

  const branchTotalPages = Math.max(1, Math.ceil(branchFiltered.length / PAGE_SIZE))
  const branchPaginated = branchFiltered.slice((branchPage - 1) * PAGE_SIZE, branchPage * PAGE_SIZE)

  function toggleBranchSort(key: string) {
    if (branchSortKey === key) setBranchSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setBranchSortKey(key); setBranchSortDir('asc') }
  }

  const todayStr = new Date().toISOString().split('T')[0]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Receiving Orders</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Manage customer bookings and appointments</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface-200 dark:border-surface-700 mb-6">
        <nav className="flex gap-6">
          <button onClick={() => { setTab('list'); setPage(1) }}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              tab === 'list'
                ? 'border-surface-900 dark:border-white text-surface-900 dark:text-white'
                : 'border-transparent text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
            }`}>
            Agent Bookings
          </button>
          <button onClick={() => { setTab('branch'); setBranchPage(1) }}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              tab === 'branch'
                ? 'border-surface-900 dark:border-white text-surface-900 dark:text-white'
                : 'border-transparent text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
            }`}>
            Branch Bookings
          </button>
          <button onClick={() => setTab('calendar')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              tab === 'calendar'
                ? 'border-surface-900 dark:border-white text-surface-900 dark:text-white'
                : 'border-transparent text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
            }`}>
            Calendar View
          </button>
        </nav>
      </div>

      {tab === 'branch' ? (
        branchLoading ? (
          <SkeletonTable rows={6} />
        ) : branchError ? (
          <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-700 dark:text-red-400 text-sm rounded-lg px-4 py-3">{branchError}</div>
        ) : (
          <div>
            <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
              <div className="relative w-full sm:max-w-xs">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 dark:text-surface-400" />
                <input type="text" placeholder="Search by branch, location..." value={branchSearch} onChange={e => { setBranchSearch(e.target.value); setBranchPage(1) }}
                  className="w-full pl-9 pr-3 py-2 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 placeholder:text-surface-400 dark:placeholder:text-surface-500" />
              </div>
              <select value={branchStatusFilter} onChange={e => { setBranchStatusFilter(e.target.value); setBranchPage(1) }}
                className="py-2 px-3 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600">
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="CONFIRMED">Confirmed</option>
                <option value="PROCESSING">Processing</option>
                <option value="APPROVED">Approved</option>
                <option value="COMPLETED">Completed</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-50 dark:bg-surface-800/50 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4 cursor-pointer select-none" onClick={() => toggleBranchSort('id')}>
                      ID {branchSortKey === 'id' && <span>{branchSortDir === 'asc' ? '↑' : '↓'}</span>}
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer select-none" onClick={() => toggleBranchSort('branchProfile')}>
                      Branch {branchSortKey === 'branchProfile' && <span>{branchSortDir === 'asc' ? '↑' : '↓'}</span>}
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer select-none" onClick={() => toggleBranchSort('totalAmount')}>
                      Amount {branchSortKey === 'totalAmount' && <span>{branchSortDir === 'asc' ? '↑' : '↓'}</span>}
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer select-none" onClick={() => toggleBranchSort('status')}>
                      Status {branchSortKey === 'status' && <span>{branchSortDir === 'asc' ? '↑' : '↓'}</span>}
                    </th>
                    <th className="py-3.5 px-4 cursor-pointer select-none" onClick={() => toggleBranchSort('createdAt')}>
                      Date {branchSortKey === 'createdAt' && <span>{branchSortDir === 'asc' ? '↑' : '↓'}</span>}
                    </th>
                    <th className="py-3.5 px-4">Items</th>
                    <th className="py-3.5 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {branchPaginated.length === 0 ? (
                    <tr><td colSpan={7} className="px-5 py-12 text-center text-surface-500 dark:text-surface-400">
                      <Store size={40} className="mx-auto mb-2 opacity-40" /><p>No branch bookings found</p>
                    </td></tr>
                  ) : (
                    branchPaginated.map(o => (
                      <tr key={o.id} className="border-b border-surface-100 dark:border-surface-800 transition-colors hover:bg-surface-50/50 dark:hover:bg-surface-800/20">
                        <td className="py-3 px-4 text-xs font-mono text-surface-500 dark:text-surface-400">#{o.id.slice(0, 6)}</td>
                        <td className="py-3 px-4">
                          <div className="font-medium text-surface-800 dark:text-surface-200">{o.branchProfile.storeBranch}</div>
                          <div className="text-xs text-surface-500 dark:text-surface-400">{o.branchProfile.location}</div>
                        </td>
                        <td className="py-3 px-4 text-surface-700 dark:text-surface-200 font-medium">{settings.currencySymbol}{Number(o.totalAmount).toLocaleString()}</td>
                        <td className="py-3 px-4"><span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${branchStatusStyles[o.status] || 'bg-surface-100 text-surface-700'}`}>{o.status}</span></td>
                        <td className="py-3 px-4 text-surface-500 dark:text-surface-400">{new Date(o.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                        <td className="py-3 px-4 text-surface-500 dark:text-surface-400">{o.items.length} item{o.items.length !== 1 ? 's' : ''}</td>
                        <td className="py-3 px-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <Link to={`/bookings/branch/${o.id}`} className="p-1.5 text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors" title="View Details"><Eye size={15} /></Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {branchTotalPages > 1 && (
              <div className="flex items-center justify-between mt-6 text-sm">
                <p className="text-surface-500 dark:text-surface-400">Page {branchPage} of {branchTotalPages}</p>
                <div className="flex gap-2">
                  <button onClick={() => setBranchPage(p => Math.max(1, p - 1))} disabled={branchPage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors text-xs disabled:opacity-40 disabled:cursor-not-allowed">
                    <ChevronLeft size={14} /> Prev
                  </button>
                  <button onClick={() => setBranchPage(p => Math.min(branchTotalPages, p + 1))} disabled={branchPage === branchTotalPages}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors text-xs disabled:opacity-40 disabled:cursor-not-allowed">
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        )
      ) : loading ? (
        <SkeletonTable rows={6} />
      ) : tab === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Calendar (3 cols) */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200/50 dark:border-surface-800">
              {/* Header */}
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-surface-100 dark:border-surface-800">
                <div className="flex items-center gap-2.5">
                  <CalendarDays size={16} className="text-surface-500 dark:text-surface-400 shrink-0" />
                  <div>
                    <h2 className="text-sm font-semibold text-surface-800 dark:text-surface-200">{MONTHS[calMonth]} {calYear}</h2>
                    <p className="text-[11px] text-surface-500 dark:text-surface-400">{bookings.length} total bookings</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={goToday}
                    className="px-2.5 py-1.5 text-xs font-medium text-surface-600 dark:text-surface-300 bg-surface-100 dark:bg-surface-800 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors">
                    Today
                  </button>
                  <button onClick={prevMonth}
                    className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                    <ChevronLeft size={16} />
                  </button>
                  <button onClick={nextMonth}
                    className="p-1.5 rounded-lg text-surface-400 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>

              {/* Grid */}
              <div className="p-3 sm:p-4">
                <div className="grid grid-cols-7 mb-1">
                  {DAYS.map(d => (
                    <div key={d} className="py-1.5 text-center text-[10px] font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7">
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                    const count = bookingMap[dateStr] || 0
                    const hasBooking = count > 0
                    const isSelected = selectedDate === dateStr
                    const isToday = dateStr === todayStr
                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(isSelected ? '' : dateStr)}
                        className="flex items-center justify-center py-1"
                      >
                        <div className={`flex flex-col items-center justify-center w-full min-h-[52px] sm:min-h-[60px] rounded-lg transition-all duration-150 ${
                          isSelected
                            ? 'bg-surface-900 dark:bg-white'
                            : hasBooking
                              ? 'bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100 dark:hover:bg-emerald-950/50'
                              : 'hover:bg-surface-50/50 dark:hover:bg-surface-800/30'
                        }`}>
                          <span className={`text-sm font-medium leading-none ${
                            isSelected
                              ? 'text-white dark:text-surface-900'
                              : isToday
                                ? 'text-surface-900 dark:text-white'
                                : hasBooking
                                  ? 'text-emerald-700 dark:text-emerald-400'
                                  : 'text-surface-500 dark:text-surface-400'
                          }`}>
                            {day}
                          </span>
                          {hasBooking && (
                            <span className={`mt-1 text-[10px] font-bold leading-none ${
                              isSelected ? 'text-white dark:text-surface-900' : 'text-emerald-600 dark:text-emerald-400'
                            }`}>
                              {count}
                            </span>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Booking Details Panel (2 cols) */}
          <div className="lg:col-span-2">
            {!selectedDate ? (
              <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200/50 dark:border-surface-800 h-full min-h-[300px] flex items-center justify-center">
                <div className="text-center px-6">
                  <CalendarDays size={28} className="mx-auto mb-2 text-surface-300 dark:text-surface-600" />
                  <p className="text-sm text-surface-500 dark:text-surface-400">Select a date to view bookings</p>
                </div>
              </div>
            ) : dayBookings.length === 0 ? (
              <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200/50 dark:border-surface-800 h-full min-h-[300px] flex items-center justify-center">
                <div className="text-center px-6">
                  <CalendarDays size={28} className="mx-auto mb-2 text-surface-300 dark:text-surface-600" />
                  <p className="text-sm text-surface-500 dark:text-surface-400">No bookings on this day</p>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200/50 dark:border-surface-800 h-full">
                {/* Header */}
                <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800">
                  <div className="flex items-center gap-2.5">
                    <Calendar size={14} className="text-surface-500 dark:text-surface-400 shrink-0" />
                    <div>
                      <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-200">
                        {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                      </h3>
                      <p className="text-xs text-surface-500 dark:text-surface-400">{dayBookings.length} booking{dayBookings.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                </div>
                {/* List */}
                <div className="divide-y divide-surface-100 dark:divide-surface-800">
                  {dayBookings.map(b => (
                    <div key={b.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0 text-xs font-semibold text-surface-600 dark:text-surface-400 uppercase">
                        {b.customer.charAt(0)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">{b.customer}</p>
                        <p className="text-xs text-surface-500 dark:text-surface-400 truncate">{b.agent}</p>
                      </div>
                      <Link to={`/bookings/${b.id}`}
                        className="flex items-center gap-1 px-3 py-1.5 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-lg hover:bg-surface-800 transition-colors text-xs font-medium shrink-0">
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Booking List View */
        <div>
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between mb-4">
            <div className="relative w-full sm:max-w-xs">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 dark:text-surface-400" />
              <input type="text" placeholder="Search bookings..." value={search} onChange={e => { setSearch(e.target.value); setPage(1) }}
                className="w-full pl-9 pr-3 py-2 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 placeholder:text-surface-400 dark:placeholder:text-surface-500" />
            </div>
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}
              className="py-2 px-3 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600">
              <option value="">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Process">Process</option>
              <option value="Approved">Approved</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-50 dark:bg-surface-800/50 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 cursor-pointer select-none" onClick={() => toggleSort('id')}>
                    ID {sortKey === 'id' && <span>{sortDir === 'asc' ? '↑' : '↓'}</span>}
                  </th>
                  <th className="py-3.5 px-4 cursor-pointer select-none" onClick={() => toggleSort('customer')}>
                    Customer {sortKey === 'customer' && <span>{sortDir === 'asc' ? '↑' : '↓'}</span>}
                  </th>
                  <th className="py-3.5 px-4 cursor-pointer select-none" onClick={() => toggleSort('agent')}>
                    Agent {sortKey === 'agent' && <span>{sortDir === 'asc' ? '↑' : '↓'}</span>}
                  </th>
                  <th className="py-3.5 px-4 cursor-pointer select-none" onClick={() => toggleSort('date')}>
                    Date {sortKey === 'date' && <span>{sortDir === 'asc' ? '↑' : '↓'}</span>}
                  </th>
                  <th className="py-3.5 px-4 cursor-pointer select-none" onClick={() => toggleSort('amount')}>
                    Amount {sortKey === 'amount' && <span>{sortDir === 'asc' ? '↑' : '↓'}</span>}
                  </th>
                  <th className="py-3.5 px-4 cursor-pointer select-none" onClick={() => toggleSort('status')}>
                    Status {sortKey === 'status' && <span>{sortDir === 'asc' ? '↑' : '↓'}</span>}
                  </th>
                  <th className="py-3.5 px-4">Assigned Staff</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan={8} className="px-5 py-12 text-center text-surface-500 dark:text-surface-400">
                    <CalendarDays size={40} className="mx-auto mb-2 opacity-40" /><p>No bookings found</p>
                  </td></tr>
                ) : (
                  paginated.map(b => (
                    <tr key={b.id} className="border-b border-surface-100 dark:border-surface-800 transition-colors hover:bg-surface-50/50 dark:hover:bg-surface-800/20">
                      <td className="py-3 px-4 text-xs font-mono text-surface-500 dark:text-surface-400">#{b.id.slice(0, 6)}</td>
                      <td className="py-3 px-4 font-medium text-surface-800 dark:text-surface-200">{b.customer}</td>
                      <td className="py-3 px-4 text-surface-600 dark:text-surface-300">{b.agent}</td>
                      <td className="py-3 px-4 text-surface-500 dark:text-surface-400">{new Date(b.date + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</td>
                      <td className="py-3 px-4 text-surface-700 dark:text-surface-200 font-medium">{settings.currencySymbol}{b.amount.toLocaleString()}</td>
                      <td className="py-3 px-4"><span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${statusStyles[b.status]}`}>{b.status}</span></td>
                      <td className="py-3 px-4 text-surface-500 dark:text-surface-400">{b.assignedStaff || '—'}</td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <Link to={`/bookings/${b.id}`} className="p-1.5 text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors" title="View Details"><Eye size={15} /></Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 text-sm">
              <p className="text-surface-500 dark:text-surface-400">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors text-xs disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronLeft size={14} /> Prev
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors text-xs disabled:opacity-40 disabled:cursor-not-allowed">
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
