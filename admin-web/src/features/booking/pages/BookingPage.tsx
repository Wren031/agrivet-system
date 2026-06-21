import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { CalendarDays, DollarSign, Search, UserCircle, ClipboardList, Eye } from 'lucide-react'
import { useBookings } from '../hooks/useBookings'
import { useApp } from '../../../context/AppContext'
import { SkeletonCards } from '../../../components/Skeleton'

const statusStyles: Record<string, string> = {
  Pending: 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400',
  Process: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300',
  Approved: 'bg-indigo-200/50 dark:bg-indigo-800/50 text-indigo-800 dark:text-indigo-300',
  Completed: 'bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400',
  Cancelled: 'bg-indigo-200/50 dark:bg-indigo-800/50 text-indigo-800 dark:text-indigo-300',
}

export default function BookingPage() {
  const { bookings, loading } = useBookings()
  const { settings } = useApp()
  const [search, setSearch] = useState('')

  const filtered = useMemo(() =>
    bookings.filter(b =>
      b.customer.toLowerCase().includes(search.toLowerCase()) ||
      b.agent.toLowerCase().includes(search.toLowerCase())
    ),
    [bookings, search]
  )

  const totalAmount = bookings.reduce((sum, b) => sum + b.amount, 0)
  const pendingCount = bookings.filter(b => b.status === 'Pending').length

  // View only — no add/edit/delete on this page

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Bookings</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Manage customer bookings and appointments</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
            <ClipboardList size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Bookings</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">{bookings.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300">
            <CalendarDays size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Pending</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">{pendingCount}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-indigo-200/50 dark:bg-indigo-800/50 text-indigo-800 dark:text-indigo-300">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Revenue</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">{settings.currencySymbol}{totalAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="relative max-w-xs mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input type="text" placeholder="Search bookings..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
      </div>

      {loading ? (
        <SkeletonCards count={4} />
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-slate-400 dark:text-slate-500">
          <ClipboardList size={48} className="mx-auto mb-3 opacity-40" />
          <p>No bookings found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(booking => (
            <div key={booking.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                    {booking.customer.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 dark:text-slate-200 text-sm truncate">{booking.customer}</p>
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[booking.status]}`}>
                      {booking.status}
                    </span>
                  </div>
                </div>
                <Link to={`/bookings/${booking.id}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-950/50 transition-colors text-xs font-medium">
                  <Eye size={14} /> View Details
                </Link>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <UserCircle size={14} /><span className="truncate">{booking.agent}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <CalendarDays size={14} /><span>{new Date(booking.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <DollarSign size={14} /><span className="font-medium text-slate-700 dark:text-slate-200">{settings.currencySymbol}{booking.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}


    </div>
  )
}
