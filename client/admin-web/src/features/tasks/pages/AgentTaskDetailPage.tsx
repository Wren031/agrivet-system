import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Package, User, Calendar, BadgeCheck, Building2, Printer, ChevronDown, Trash2 } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import { useApp } from '../../../context/AppContext'
import { statusStyles, handlePrint } from '../services/taskUtils'
import { useState, useMemo, useRef, useEffect } from 'react'

export default function AgentTaskDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { tasks, loading, handleUpdateStatus, handleDelete } = useTasks()
  const { settings } = useApp()
  const [itemSearch, setItemSearch] = useState('')
  const [statusOpen, setStatusOpen] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const task = tasks.find(b => b.id === id)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setStatusOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
        <div className="flex items-center gap-3 text-surface-400">
          <div className="w-5 h-5 border-2 border-surface-500 border-t-transparent rounded-full animate-spin" />
          <span>Loading task details...</span>
        </div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-surface-500 dark:text-surface-400">
        <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-5">
          <Package size={32} className="text-surface-300 dark:text-surface-600" />
        </div>
        <p className="text-lg font-medium">Task not found</p>asf
        <button onClick={() => navigate('/tasks')}
          className="mt-4 text-sm text-surface-600 dark:text-surface-400 hover:underline transition-colors">
          Back to Tasks
        </button>
      </div>
    )
  }

  const statusOptions = [
    { label: 'Approved', value: 'Approved' as const },
    { label: 'Processing', value: 'Processing' as const },
    { label: 'Complete', value: 'Completed' as const },
  ]

  async function handleStatusSelect(status: 'Approved' | 'Cancelled' | 'Completed') {
    setStatusOpen(false)
    await handleUpdateStatus(task.id, status)
  }

  async function handleDeleteTask() {
    setShowDeleteConfirm(false)
    await handleDelete(task.id)
    navigate('/tasks')
  }

  return (
    <div>
      <button onClick={() => navigate('/tasks')}
        className="flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Tasks
      </button>

      <div className="overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-5 border-b border-surface-100 dark:border-surface-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-surface-900 dark:text-white">Agent Task Details</h1>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Booking #{task.id.slice(0, 8)}</p>
            </div>
            <div className="relative" ref={dropdownRef}>
              <button onClick={() => setStatusOpen(!statusOpen)}
                className={`px-3 py-1 rounded-md text-xs font-medium flex items-center gap-1.5 cursor-pointer ${statusStyles[task.status]}`}>
                {task.status} <ChevronDown size={12} />
              </button>
              {statusOpen && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg shadow-lg z-10 py-1">
                  {statusOptions.map(opt => (
                    <button key={opt.value} onClick={() => handleStatusSelect(opt.value)}
                      className="w-full text-left px-3 py-1.5 text-xs text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div className="px-4 sm:px-6 py-5 border-b border-surface-100 dark:border-surface-700 bg-surface-50/50 dark:bg-surface-800/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0 mt-0.5">
                <User size={16} className="text-surface-600 dark:text-surface-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">Customer</p>
                <p className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">{task.customer}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0 mt-0.5">
                <BadgeCheck size={16} className="text-surface-600 dark:text-surface-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">Assigned To</p>
                <p className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">{task.assignedStaff || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0 mt-0.5">
                <Building2 size={16} className="text-surface-600 dark:text-surface-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">Agent</p>
                <p className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">{task.agent || '—'}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0 mt-0.5">
                <Calendar size={16} className="text-surface-600 dark:text-surface-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">Date</p>
                <p className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">
                  {new Date(task.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="px-4 sm:px-6 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300">Booking Items</h3>
            <div className="relative max-w-xs w-full sm:w-60">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                value={itemSearch}
                onChange={e => setItemSearch(e.target.value)}
                placeholder="Search items..."
                className="w-full pl-9 pr-3 py-2 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 transition-shadow"
              />
            </div>
          </div>
          <div className="rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-50 dark:bg-surface-800/50 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    <th className="px-4 py-2.5">Item</th>
                    <th className="px-4 py-2.5">Qty</th>
                    <th className="px-4 py-2.5">Price</th>
                    <th className="px-4 py-2.5 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
                  {filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-8 text-center text-surface-500 dark:text-surface-400">
                        {itemSearch ? 'No items match your search' : 'No items found'}
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item, i) => {
                      const total = item.quantity * item.price
                      return (
                        <tr key={i} className="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                          <td className="px-4 py-2.5 text-surface-700 dark:text-surface-200 font-medium">{item.name}</td>
                          <td className="px-4 py-2.5 text-surface-500 dark:text-surface-400">{item.quantity}</td>
                          <td className="px-4 py-2.5 text-surface-500 dark:text-surface-400">{settings.currencySymbol}{item.price.toFixed(2)}</td>
                          <td className="px-4 py-2.5 text-surface-800 dark:text-surface-200 font-medium text-right">{settings.currencySymbol}{total.toFixed(2)}</td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
                <tfoot className="bg-surface-50 dark:bg-surface-800/50">
                  <tr>
                    <td colSpan={3} className="px-4 py-2.5 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Grand Total</td>
                    <td className="px-4 py-2.5 text-sm font-bold text-surface-900 dark:text-white text-right">{settings.currencySymbol}{task.amount.toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        <div className="flex items-center justify-end gap-2 mt-4">
          <button onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-surface-700 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-sm font-medium">
            <Trash2 size={15} /> Delete
          </button>
          <button onClick={() => handlePrint(task, settings.currencySymbol)}
            className="flex items-center gap-1.5 px-4 py-2 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-lg hover:bg-surface-800 dark:hover:bg-surface-200 transition-colors text-sm font-medium">
            <Printer size={15} /> Print
          </button>
        </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-surface-800 rounded-xl p-6 max-w-sm w-full mx-4 shadow-xl">
            <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">Delete Task</h3>
            <p className="text-sm text-surface-500 dark:text-surface-400 mb-6">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3">
              <button onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-700 rounded-lg transition-colors">
                Cancel
              </button>
              <button onClick={handleDeleteTask}
                className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
