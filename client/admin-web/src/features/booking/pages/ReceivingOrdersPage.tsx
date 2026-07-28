import { useState, useMemo, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, Search, ChevronLeft, ChevronRight, Eye, Calendar, Store, ArrowRight } from 'lucide-react'
import { useBookings } from '../hooks/useBookings'
import { useApp } from '../../../context/AppContext'
import { SkeletonTable } from '../../../components/Skeleton'
import PageHeader from '../../../components/PageHeader'
import TabNav from '../../../components/TabNav'
import Pagination from '../../../components/Pagination'
import StatusBadge from '../../../components/StatusBadge'
import { fetchBranchOrders } from '../../../data/branch-booking/branchBookingService'
import type { BranchOrder } from '../../../data/branch-booking/types'



const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const STATUS_DOT: Record<string, string> = {
  Pending: 'bg-amber-500',
  Process: 'bg-blue-500',
  Approved: 'bg-emerald-500',
  Completed: 'bg-surface-400',
  Cancelled: 'bg-rose-500',
}

const STATUS_PILL: Record<string, { active: string; dot: string }> = {
  Pending: { active: 'bg-amber-500 text-white shadow-sm', dot: 'bg-amber-500' },
  Process: { active: 'bg-blue-500 text-white shadow-sm', dot: 'bg-blue-500' },
  Approved: { active: 'bg-emerald-500 text-white shadow-sm', dot: 'bg-emerald-500' },
  Cancelled: { active: 'bg-rose-500 text-white shadow-sm', dot: 'bg-rose-500' },
}

const FILTER_OPTIONS: Array<{ key: string; label: string }> = [
  { key: '', label: 'All' },
  { key: 'Pending', label: 'Pending' },
  { key: 'Process', label: 'Process' },
  { key: 'Approved', label: 'Approved' },
  { key: 'Cancelled', label: 'Cancelled' },
]

export default function BookingPage() {
  const { bookings, loading } = useBookings()
  const { settings } = useApp()
  const [tab, setTab] = useState<'list' | 'calendar' | 'branch'>('list')
  const [calYear, setCalYear] = useState(new Date().getFullYear())
  const [calMonth, setCalMonth] = useState(new Date().getMonth())
  const [selectedDate, setSelectedDate] = useState('')
  const [calStatusFilter, setCalStatusFilter] = useState('')
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

  const statusBookingMap = useMemo(() => {
    const map: Record<string, Record<string, number>> = {}
    bookings.forEach(b => {
      if (activeStatuses.includes(b.status)) {
        if (!map[b.date]) map[b.date] = { Pending: 0, Process: 0, Approved: 0, Cancelled: 0 }
        map[b.date][b.status] = (map[b.date][b.status] || 0) + 1
      }
    })
    return map
  }, [bookings, activeStatuses])

  const monthStatusCounts = useMemo(() => {
    const prefix = `${calYear}-${String(calMonth + 1).padStart(2, '0')}`
    const counts = { Pending: 0, Process: 0, Approved: 0, Cancelled: 0 }
    bookings.forEach(b => {
      if (b.date.startsWith(prefix) && activeStatuses.includes(b.status)) {
        counts[b.status as keyof typeof counts] = (counts[b.status as keyof typeof counts] || 0) + 1
      }
    })
    return counts
  }, [bookings, calYear, calMonth, activeStatuses])

  const maxDayCount = useMemo(() => {
    return Math.max(0, ...Object.values(bookingMap))
  }, [bookingMap])

  const dayBookings = useMemo(() => {
    if (!selectedDate) return []
    let result = bookings.filter(b => b.date === selectedDate)
    if (calStatusFilter) result = result.filter(b => b.status === calStatusFilter)
    return result
  }, [bookings, selectedDate, calStatusFilter])

  const filtered = useMemo(() => {
    let result = bookings

    result = result.filter(b => b.status !== 'Completed')

    if (search) {
      const q = search.toLowerCase()
      result = result.filter(b =>
        b.id.toLowerCase().includes(q) ||
        b.customer.toLowerCase().includes(q) ||
        b.agent.toLowerCase().includes(q)
      )
    }

    if (statusFilter) {
      result = result.filter(b => b.status === statusFilter)
    }

    result.sort((a, b) => {
      const aVal = (a as any)[sortKey] || ''
      const bVal = (b as any)[sortKey] || ''

      const cmp =
        typeof aVal === 'string'
          ? aVal.localeCompare(bVal)
          : aVal - bVal

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
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/20 dark:text-amber-400 dark:border-amber-900/30',
    CONFIRMED: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30',
    PROCESSING: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30',
    APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/20 dark:text-emerald-400 dark:border-emerald-900/30',
    COMPLETED: 'bg-surface-100 text-surface-500 border-surface-200 dark:bg-surface-700 dark:text-surface-400 dark:border-surface-700',
    CANCELLED: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-900/30',
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
      <PageHeader title="Receiving Orders" subtitle="Manage customer bookings and appointments" />

      <TabNav
        tabs={[
          { key: 'list', label: 'Agent Bookings' },
          { key: 'branch', label: 'Branch Bookings' },
          { key: 'calendar', label: 'Calendar View' },
        ]}
        activeKey={tab}
        onTabChange={key => { setTab(key as 'list' | 'calendar' | 'branch'); if (key === 'list') setPage(1); if (key === 'branch') setBranchPage(1) }}
      />

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

            <Pagination page={branchPage} totalPages={branchTotalPages} onPageChange={setBranchPage} />
          </div>
        )
      ) : loading ? (
        <SkeletonTable rows={6} />
      ) : tab === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Left: Calendar (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200/60 dark:border-surface-800 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-surface-100 dark:border-surface-800">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white shadow-sm">
                    <CalendarDays size={16} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-surface-800 dark:text-surface-100 tracking-tight">{MONTHS[calMonth]} {calYear}</h2>
                    <p className="text-[10px] font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider">{bookings.length} total bookings</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <button onClick={goToday}
                    className="px-3 py-1.5 text-[10px] font-bold text-surface-700 dark:text-surface-200 bg-surface-100 dark:bg-surface-800 rounded-lg hover:bg-surface-200 dark:hover:bg-surface-700 transition-colors uppercase tracking-wider">
                    Today
                  </button>
                  <div className="flex items-center bg-surface-100 dark:bg-surface-800/60 rounded-lg p-0.5">
                    <button onClick={prevMonth}
                      className="p-1.5 rounded-md text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-white hover:bg-white dark:hover:bg-surface-700 transition-colors">
                      <ChevronLeft size={14} />
                    </button>
                    <button onClick={nextMonth}
                      className="p-1.5 rounded-md text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-white hover:bg-white dark:hover:bg-surface-700 transition-colors">
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Status filter */}
              <div className="px-5 sm:px-6 py-3 border-b border-surface-100 dark:border-surface-800 flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-surface-400 dark:text-surface-500 uppercase tracking-wider mr-1">Filter</span>
                {FILTER_OPTIONS.map(f => {
                  const isActive = calStatusFilter === f.key
                  const pillStyle = f.key ? STATUS_PILL[f.key] : null
                  return (
                    <button key={f.key} onClick={() => setCalStatusFilter(f.key)}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold rounded-full transition-all duration-200 ${
                        isActive
                          ? f.key
                            ? `${pillStyle?.active}`
                            : 'bg-surface-800 dark:bg-white text-white dark:text-surface-900 shadow-sm'
                          : 'bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400 hover:bg-surface-200 dark:hover:bg-surface-700'
                      }`}>
                      {f.key && <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white/80' : pillStyle?.dot}`} />}
                      {f.label}
                    </button>
                  )
                })}
              </div>

              {/* Grid */}
              <div className="p-3 sm:p-4">
                <div className="grid grid-cols-7 mb-2">
                  {DAYS.map((d, i) => (
                    <div key={d} className={`py-2 text-center text-[10px] font-bold uppercase tracking-wider ${
                      i === 0 || i === 6 ? 'text-rose-500/70 dark:text-rose-400/70' : 'text-surface-400 dark:text-surface-500'
                    }`}>
                      {d}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {Array.from({ length: firstDayOfWeek }).map((_, i) => (
                    <div key={`empty-${i}`} />
                  ))}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                    const dayStatuses = statusBookingMap[dateStr] || { Pending: 0, Process: 0, Approved: 0, Cancelled: 0 }
                    const totalCount = Object.values(dayStatuses).reduce((s, n) => s + n, 0)
                    const filteredCount = calStatusFilter ? (dayStatuses[calStatusFilter] || 0) : totalCount
                    const hasBooking = filteredCount > 0
                    const isSelected = selectedDate === dateStr
                    const isToday = dateStr === todayStr
                    const dow = (firstDayOfWeek + day - 1) % 7
                    const isWeekend = dow === 0 || dow === 6
                    const intensity = maxDayCount > 0 ? totalCount / maxDayCount : 0

                    return (
                      <button
                        key={day}
                        onClick={() => setSelectedDate(isSelected ? '' : dateStr)}
                        className={`relative flex flex-col items-center justify-start p-1.5 min-h-[60px] sm:min-h-[72px] rounded-lg transition-all duration-200 ${
                          isSelected
                            ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-500/30 scale-[1.03] z-10'
                            : isToday
                              ? 'bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-300 dark:border-indigo-700/60 hover:border-indigo-400 dark:hover:border-indigo-600'
                              : hasBooking
                                ? 'hover:bg-surface-50 dark:hover:bg-surface-800/40 hover:shadow-sm border border-transparent'
                                : 'hover:bg-surface-50/60 dark:hover:bg-surface-800/20 border border-transparent'
                        }`}
                      >
                        <span className={`text-[13px] font-semibold leading-none ${
                          isSelected
                            ? 'text-white'
                            : isToday
                              ? 'text-indigo-600 dark:text-indigo-300 font-bold'
                              : isWeekend
                                ? 'text-surface-400 dark:text-surface-500'
                                : 'text-surface-700 dark:text-surface-300'
                        }`}>
                          {day}
                        </span>

                        {/* Activity indicators */}
                        {totalCount > 0 && (
                          <div className="flex items-center gap-0.5 mt-1.5 flex-wrap justify-center max-w-full px-0.5">
                            {(() => {
                              const statusOrder: Array<keyof typeof dayStatuses> = ['Pending', 'Process', 'Approved', 'Cancelled']
                              const allDots: Array<{ color: string; key: string }> = []
                              statusOrder.forEach(s => {
                                for (let k = 0; k < (dayStatuses[s] || 0); k++) {
                                  allDots.push({ color: STATUS_DOT[s], key: `${s}-${k}` })
                                }
                              })
                              if (allDots.length <= 4) {
                                return allDots.map(d => (
                                  <span key={d.key} className={`w-1.5 h-1.5 rounded-full ${d.color} ${isSelected ? 'ring-1 ring-white/40' : ''}`} />
                                ))
                              }
                              return (
                                <>
                                  {allDots.slice(0, 3).map(d => (
                                    <span key={d.key} className={`w-1.5 h-1.5 rounded-full ${d.color} ${isSelected ? 'ring-1 ring-white/40' : ''}`} />
                                  ))}
                                  <span className={`text-[8px] font-bold leading-none ${
                                    isSelected ? 'text-white/90' : 'text-surface-500 dark:text-surface-400'
                                  }`}>
                                    +{allDots.length - 3}
                                  </span>
                                </>
                              )
                            })()}
                          </div>
                        )}

                        {/* Intensity bar at the bottom */}
                        {totalCount > 0 && (
                          <div className="absolute bottom-1 left-1.5 right-1.5 h-[2px] rounded-full overflow-hidden bg-surface-200/40 dark:bg-surface-700/40">
                            <div
                              className={`h-full transition-all duration-300 ${
                                isSelected ? 'bg-white/80' : 'bg-gradient-to-r from-indigo-500 to-violet-500'
                              }`}
                              style={{ width: `${Math.max(25, intensity * 100)}%` }}
                            />
                          </div>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Month summary footer */}
              <div className="px-5 sm:px-6 py-3 border-t border-surface-100 dark:border-surface-800 bg-surface-50/40 dark:bg-surface-800/20 flex items-center gap-4 flex-wrap">
                {(['Pending', 'Process', 'Approved', 'Cancelled'] as const).map(s => (
                  <div key={s} className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${STATUS_DOT[s]}`} />
                    <span className="text-[10px] font-semibold text-surface-500 dark:text-surface-400">
                      {s}: <span className="text-surface-800 dark:text-surface-200 font-bold">{monthStatusCounts[s] || 0}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Booking Details Panel (2 cols) */}
          <div className="lg:col-span-2">
            {!selectedDate ? (
              <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200/60 dark:border-surface-800 h-full min-h-[420px] flex items-center justify-center">
                <div className="text-center px-6 max-w-xs">
                  <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 border border-indigo-100 dark:border-indigo-900/40 flex items-center justify-center">
                    <CalendarDays size={22} className="text-indigo-500 dark:text-indigo-400" />
                  </div>
                  <p className="text-sm font-bold text-surface-700 dark:text-surface-200">Select a date</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400 mt-1">Choose any day on the calendar to view the scheduled bookings for that day.</p>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-surface-900 rounded-xl border border-surface-200/60 dark:border-surface-800 h-full flex flex-col overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-surface-100 dark:border-surface-800 bg-gradient-to-br from-indigo-50/70 via-violet-50/40 to-transparent dark:from-indigo-950/30 dark:via-violet-950/20 dark:to-transparent">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-12 h-12 rounded-lg bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 flex flex-col items-center justify-center shrink-0 shadow-sm">
                        <span className="text-[8px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider leading-none">
                          {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short' })}
                        </span>
                        <span className="text-base font-bold text-surface-800 dark:text-white leading-none mt-0.5">
                          {new Date(selectedDate + 'T12:00:00').getDate()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-bold text-surface-800 dark:text-surface-100 truncate">
                          {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long' })}
                        </h3>
                        <p className="text-[10px] font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                          {dayBookings.length} booking{dayBookings.length !== 1 ? 's' : ''} {calStatusFilter ? `· ${calStatusFilter}` : 'scheduled'}
                        </p>
                      </div>
                    </div>
                    {dayBookings.length > 0 && (
                      <div className="text-right shrink-0">
                        <p className="text-[9px] font-bold text-surface-400 dark:text-surface-500 uppercase tracking-wider">Total</p>
                        <p className="text-sm font-bold font-mono text-surface-800 dark:text-white">
                          {settings.currencySymbol}{dayBookings.reduce((s, b) => s + b.amount, 0).toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* List */}
                {dayBookings.length === 0 ? (
                  <div className="flex-1 flex items-center justify-center px-6 py-12">
                    <div className="text-center">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
                        <Calendar size={20} className="text-surface-400 dark:text-surface-500" />
                      </div>
                      <p className="text-sm font-semibold text-surface-600 dark:text-surface-400">No bookings</p>
                      <p className="text-[10px] text-surface-500 dark:text-surface-500 mt-1">
                        {calStatusFilter ? `No ${calStatusFilter.toLowerCase()} bookings this day` : 'This day is clear'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 divide-y divide-surface-100 dark:divide-surface-800 overflow-y-auto" style={{ maxHeight: 'min(600px, calc(100vh - 320px))' }}>
                    {dayBookings.map(b => {
                      const accentColor =
                        b.status === 'Pending' ? 'border-l-amber-500'
                        : b.status === 'Process' ? 'border-l-blue-500'
                        : b.status === 'Approved' ? 'border-l-emerald-500'
                        : b.status === 'Completed' ? 'border-l-surface-400'
                        : 'border-l-rose-500'
                      return (
                        <div key={b.id} className={`px-4 py-3.5 hover:bg-surface-50/70 dark:hover:bg-surface-800/30 transition-colors border-l-2 ${accentColor}`}>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-950/40 dark:to-violet-950/40 flex items-center justify-center shrink-0 text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase">
                              {b.customer.charAt(0)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold text-surface-800 dark:text-surface-100 truncate">{b.customer}</p>
                              <p className="text-[11px] text-surface-500 dark:text-surface-400 truncate">{b.agent}</p>
                            </div>
                            <div className="text-right shrink-0 space-y-1">
                              <p className="text-xs font-bold font-mono text-surface-800 dark:text-white">
                                {settings.currencySymbol}{b.amount.toLocaleString()}
                              </p>
                              <StatusBadge status={b.status} />
                            </div>
                          </div>
                          <div className="mt-2 flex items-center justify-between pl-12">
                            <span className="text-[10px] font-mono text-surface-400 dark:text-surface-500">#{b.id.slice(0, 8)}</span>
                            <Link to={`/bookings/${b.id}`}
                              className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors uppercase tracking-wider">
                              View <ArrowRight size={10} />
                            </Link>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
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
                  <td className="py-3 px-4"><StatusBadge status={b.status} /></td>
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

          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}
