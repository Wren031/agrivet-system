import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Package, User, Calendar, DollarSign, BadgeCheck, Building2, XCircle, Printer } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import { useApp } from '../../../context/AppContext'
import { statusStyles, handlePrint } from '../services/taskUtils'
import { useState, useMemo } from 'react'

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { tasks, loading, handleCancel } = useTasks()
  const { settings } = useApp()
  const [itemSearch, setItemSearch] = useState('')

  const task = tasks.find(b => b.id === id)

  const filteredItems = useMemo(() => {
    if (!task?.items) return []
    if (!itemSearch) return task.items
    return task.items.filter(item =>
      item.name.toLowerCase().includes(itemSearch.toLowerCase())
    )
  }, [task?.items, itemSearch])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex items-center gap-3 text-slate-400">
          <div className="w-5 h-5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading task details...</span>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400 dark:text-slate-500">
        <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-5">
          <Package size={32} className="text-slate-300 dark:text-slate-600" />
        </div>
        <p className="text-lg font-medium">Task not found</p>
        <button onClick={() => navigate('/tasks')}
          className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:underline transition-colors">
          Back to Tasks
        </button>
      </div>
    )
  }

  const canCancel = task.status !== 'Completed' && task.status !== 'Cancelled'

  return (
    <div>
      <button onClick={() => navigate('/tasks')}
        className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Tasks
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-5 border-b border-slate-100 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">Task Details</h1>
              <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Booking #{task.id.slice(0, 8)}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[task.status]}`}>{task.status}</span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="px-4 sm:px-6 py-5 border-b border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center shrink-0 mt-0.5">
                <User size={16} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Customer</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{task.customer}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center shrink-0 mt-0.5">
                <BadgeCheck size={16} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Assigned To</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{task.assignedStaff || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center shrink-0 mt-0.5">
                <Building2 size={16} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Agent</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{task.agent || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center shrink-0 mt-0.5">
                <Calendar size={16} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Date</p>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                  {new Date(task.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Booking Items</h3>
            <div className="relative max-w-xs w-full sm:w-60">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={itemSearch}
                onChange={e => setItemSearch(e.target.value)}
                placeholder="Search items..."
                className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow"
              />
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="overflow-x-auto">
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
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-slate-400 dark:text-slate-500">
                        {itemSearch ? 'No items match your search' : 'No items found'}
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item, i) => {
                      const total = item.quantity * item.price
                      return (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                          <td className="px-4 py-2.5 text-slate-700 dark:text-slate-200 font-medium">{item.name}</td>
                          <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">{item.quantity}</td>
                          <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">{settings.currencySymbol}{item.price.toFixed(2)}</td>
                          <td className="px-4 py-2.5 text-slate-800 dark:text-slate-200 font-medium text-right">{settings.currencySymbol}{total.toFixed(2)}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
                <tfoot className="bg-slate-50 dark:bg-slate-800/50">
                  <tr>
                    <td colSpan={3} className="px-4 py-2.5 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Grand Total</td>
                    <td className="px-4 py-2.5 text-sm font-bold text-slate-800 dark:text-white text-right">{settings.currencySymbol}{task.amount.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        <div className="flex items-center justify-end gap-2 mt-4">
          {canCancel && (
            <button onClick={() => handleCancel(task.id)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-600 transition-colors text-sm font-medium">
              <XCircle size={15} /> Cancel
            </button>
          )}
          <button onClick={() => handlePrint(task, settings.currencySymbol)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
            <Printer size={15} /> Print
          </button>
        </div>
        </div>
      </div>
    </div>
  )
}
