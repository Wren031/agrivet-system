import { useState, useEffect } from 'react'
import { ClipboardCheck, User, BadgeCheck, Calendar, Package, CheckCircle, XCircle, ChevronDown, ChevronUp, Search, Clock, Printer } from 'lucide-react'
import { useApp } from '../../../context/AppContext'
import { fetchBookings, updateBooking } from '../../../data/booking/bookingService'
import { fetchStaffById } from '../../staff/services/staffService'
import type { Booking } from '../../../data/booking/types'

const statusStyles: Record<string, string> = {
  Pending: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400',
  Process: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400',
  Approved: 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400',
  Completed: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400',
  Cancelled: 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400',
}

function formatLastUpdated(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function handlePrint(task: Booking) {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const itemsHtml = task.items.map(item => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₱${item.price.toFixed(2)}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">₱${(item.quantity * item.price).toFixed(2)}</td>
    </tr>
  `).join('')

  printWindow.document.write(`
    <html>
      <head>
        <title>Booking Details - ${task.id.slice(0, 8)}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; }
          th { background: #f3f4f6; }
          .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .status { padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Booking Details</h1>
          <span class="status" style="background: ${statusStyles[task.status].replace('bg-', '').replace('dark:bg-', '').replace('text-', 'color: ').replace('dark:text-', 'color: ')};">${task.status}</span>
        </div>
        <div style="margin-bottom: 20px;">
          <p><strong>Booking ID:</strong> ${task.id}</p>
          <p><strong>Customer:</strong> ${task.customer}</p>
          <p><strong>Agent:</strong> ${task.agent || '—'}</p>
          <p><strong>Assigned To:</strong> ${task.assignedStaff || '—'}</p>
          <p><strong>Date:</strong> ${new Date(task.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p><strong>Last Updated:</strong> ${formatLastUpdated(task.updatedAt)}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th style="padding: 8px; border: 1px solid #ddd;">Item</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Qty</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Price</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr style="background: #f3f4f6;">
              <td colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">Total Amount:</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">₱${task.amount.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `)
  printWindow.document.close()
}

export default function TasksPage() {
  const { user, addNotification } = useApp()
  const [tasks, setTasks] = useState<Booking[]>([])
  const [myAdminProfileId, setMyAdminProfileId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState<Set<string>>(new Set())

  useEffect(() => {
    async function load() {
      try {
        const [all, profile] = await Promise.all([
          fetchBookings(),
          user?.id ? fetchStaffById(user.id) : Promise.resolve(null),
        ])
        setTasks(all.filter(b => b.adminProfileId))
        setMyAdminProfileId(profile?.adminProfileId ?? null)
      } catch {
        addNotification({ message: 'Failed to load tasks', type: 'error' })
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user?.id])

  async function handleApprove(id: string) {
    try {
      const updated = await updateBooking(id, { status: 'Approved' })
      setTasks(prev => prev.map(t => t.id === id ? updated : t))
      addNotification({ message: 'Booking approved successfully', type: 'success' })
    } catch {
      addNotification({ message: 'Failed to approve booking', type: 'error' })
    }
  }

  async function handleCancel(id: string) {
    try {
      const updated = await updateBooking(id, { status: 'Cancelled' })
      setTasks(prev => prev.map(t => t.id === id ? updated : t))
      addNotification({ message: 'Booking cancelled successfully', type: 'success' })
    } catch {
      addNotification({ message: 'Failed to cancel booking', type: 'error' })
    }
  }

  const filtered = tasks.filter(t =>
    !search || t.customer.toLowerCase().includes(search.toLowerCase()) ||
    t.agent.toLowerCase().includes(search.toLowerCase()) ||
    (t.assignedStaff?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Staff Punch</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            {tasks.length} assigned task{tasks.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="relative max-w-xs w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 animate-pulse">
              <div className="h-5 bg-slate-100 dark:bg-slate-700 rounded w-1/3 mb-4" />
              <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <ClipboardCheck size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-lg font-medium text-slate-500 dark:text-slate-400">No assigned tasks</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Assign a task from the Booking Details page</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(task => {
            const isMyTask = myAdminProfileId && task.adminProfileId === myAdminProfileId
            const isExpanded = expanded.has(task.id)

            return (
              <div key={task.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center">
                        <ClipboardCheck size={20} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                          Booking #{task.id.slice(0, 8)}
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">{task.agent || 'No agent'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[task.status]}`}>{task.status}</span>
                      <button onClick={() => setExpanded(prev => { const n = new Set(prev); n.has(task.id) ? n.delete(task.id) : n.add(task.id); return n })}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 transition-colors">
                        {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="flex items-center gap-2.5">
                      <User size={15} className="text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">Customer</p>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{task.customer}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <BadgeCheck size={15} className="text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">Assigned To</p>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{task.assignedStaff || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <User size={15} className="text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">Agent</p>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{task.agent || '—'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Calendar size={15} className="text-slate-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[11px] text-slate-400 dark:text-slate-500">Date</p>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{new Date(task.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {isExpanded && (
                  <div className="border-t border-slate-100 dark:border-slate-700">
                    <div className="px-5 py-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Package size={15} className="text-slate-400" />
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Items</p>
                      </div>
                      <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              <th className="px-4 py-2.5">Item</th>
                              <th className="px-4 py-2.5">Qty</th>
                              <th className="px-4 py-2.5">Price</th>
                              <th className="px-4 py-2.5 text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                            {task.items.map((item, i) => (
                              <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                                <td className="px-4 py-2.5 text-slate-700 dark:text-slate-200 font-medium">{item.name}</td>
                                <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">{item.quantity}</td>
                                <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">₱{item.price.toFixed(2)}</td>
                                <td className="px-4 py-2.5 text-slate-800 dark:text-slate-200 font-medium text-right">₱{(item.quantity * item.price).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                <div className="px-5 py-3 border-t border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex items-center justify-end gap-3">
                  {task.status === 'Approved' ? (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                      <CheckCircle size={14} /> Approved
                    </span>
                  ) : task.status === 'Cancelled' ? (
                    <span className="flex items-center gap-1.5 text-xs font-medium text-red-600 dark:text-red-400">
                      <XCircle size={14} /> Cancelled
                    </span>
                  ) : isMyTask ? (
                    <div className="flex gap-2">
                      <button onClick={() => handleApprove(task.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs font-medium">
                        <CheckCircle size={14} /> Approve
                      </button>
                      <button onClick={() => handleCancel(task.id)}
                        className="flex items-center gap-1.5 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-xs font-medium">
                        <XCircle size={14} /> Cancel
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400 dark:text-slate-500">
                      Awaiting approval from assigned staff
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}