import { useParams, useNavigate } from 'react-router-dom'
import { Search, Package, Printer, ChevronDown, Trash2, ClipboardList } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import { useApp } from '../../../context/AppContext'
import { statusStyles, handlePrint } from '../services/taskUtils'
import { useState, useMemo, useRef, useEffect } from 'react'
import {
  DetailLayout,
  DetailHeader,
  DetailSection,
  DetailField,
  DetailGrid,
  DetailTable,
  DetailEmptyState,
} from '../../../components/detail'
import Modal from '../../../components/Modal'

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

  const statusOptions = [
    { label: 'Approved', value: 'Approved' as const },
    { label: 'Processing', value: 'Processing' as const },
    { label: 'Complete', value: 'Completed' as const },
  ]

  async function handleStatusSelect(status: string) {
    setStatusOpen(false)
    await handleUpdateStatus(task!.id, status as 'Approved' | 'Cancelled' | 'Completed')
  }

  async function handleDeleteTask() {
    setShowDeleteConfirm(false)
    await handleDelete(task!.id)
    navigate('/tasks')
  }

  if (loading) {
    return <DetailLayout loading backTo="/tasks" backLabel="Back to Tasks" loadingMessage="Loading task details..." />
  }

  if (!task) {
    return (
      <DetailLayout backTo="/tasks" backLabel="Back to Tasks">
        <DetailEmptyState
          
          title="Task Not Found"
          message="The task record you are looking for could not be found."
          backLabel="Back to Tasks"
          onBack={() => navigate('/tasks')}
        />
      </DetailLayout>
    )
  }

  return (
    <DetailLayout backTo="/tasks" backLabel="Back to Tasks">
      <DetailHeader
        title="Agent Task Details"
        subtitle={`Booking #${task.id.slice(0, 8)}`}
        avatarIcon={<ClipboardList size={20} className="text-surface-500 dark:text-surface-400" />}
      >
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
      </DetailHeader>

      <div className="space-y-6">
        <DetailSection title="Task Information" >
          <DetailGrid cols={4}>
            <DetailField label="Customer" value={task.customer} />
            <DetailField label="Assigned To" value={task.assignedStaff} />
            <DetailField label="Agent" value={task.agent} />
            <DetailField label="Date" value={
              new Date(task.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            } />
          </DetailGrid>
        </DetailSection>

        <DetailSection
          title="Booking Items"
          
          actions={
            <div className="relative max-w-xs w-full sm:w-60">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input
                value={itemSearch}
                onChange={e => setItemSearch(e.target.value)}
                placeholder="Search items..."
                className="w-full pl-9 pr-3 py-2 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 transition-shadow"
              />
            </div>
          }
        >
          <DetailTable
            headers={['Item', 'Qty', 'Price', 'Total']}
            emptyMessage={itemSearch ? 'No items match your search' : 'No items found'}
            emptyColSpan={4}
            footer={
              <>
                <td colSpan={3} className="px-4 py-2.5 text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">Grand Total</td>
                <td className="px-4 py-2.5 text-sm font-bold text-surface-900 dark:text-white text-right">{settings.currencySymbol}{task.amount.toLocaleString()}</td>
              </>
            }
          >
            {filteredItems.map((item, i) => {
              const total = item.quantity * item.price
              return (
                <tr key={i} className="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                  <td className="px-4 py-2.5 text-surface-700 dark:text-surface-200 font-medium">{item.name}</td>
                  <td className="px-4 py-2.5 text-surface-500 dark:text-surface-400">{item.quantity}</td>
                  <td className="px-4 py-2.5 text-surface-500 dark:text-surface-400">{settings.currencySymbol}{item.price.toFixed(2)}</td>
                  <td className="px-4 py-2.5 text-surface-800 dark:text-surface-200 font-medium text-right">{settings.currencySymbol}{total.toFixed(2)}</td>
                </tr>
              )
            })}
          </DetailTable>

          <div className="flex items-center justify-end gap-3 mt-4">
            <button onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-white dark:bg-surface-700 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-sm font-medium">
              <Trash2 size={15} /> Delete
            </button>
            <button onClick={() => handlePrint(task, settings.currencySymbol)}
              className="flex items-center gap-1.5 px-4 py-2 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-lg hover:bg-surface-800 dark:hover:bg-surface-200 transition-colors text-sm font-medium">
              <Printer size={15} /> Print
            </button>
          </div>
        </DetailSection>
      </div>

      <Modal open={showDeleteConfirm} onClose={() => setShowDeleteConfirm(false)} title="Delete Task" size="sm">
        <div className="text-center">
          <p className="text-sm text-surface-600 dark:text-surface-300 mb-6">Are you sure you want to delete this task? This action cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={handleDeleteTask}
              className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
              Delete
            </button>
            <button onClick={() => setShowDeleteConfirm(false)}
              className="flex-1 py-2.5 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors text-sm font-medium">Cancel</button>
          </div>
        </div>
      </Modal>
    </DetailLayout>
  )
}
