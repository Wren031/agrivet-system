import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardCheck, Search, Store } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import { useBranchTasks } from '../hooks/useBranchTasks'
import TaskCard from '../components/TaskCard'
import BranchTaskCard from '../components/BranchTaskCard'

type Tab = 'agent' | 'branch'

export default function TasksPage() {
  const navigate = useNavigate()
  const { tasks, myAdminProfileId, loading, handleApprove, handleComplete } = useTasks()
  const { orders: branchOrders, loading: branchLoading } = useBranchTasks()
  const [tab, setTab] = useState<Tab>('agent')
  const [search, setSearch] = useState('')

  const filtered = tasks.filter(t =>
    t.status !== 'Completed' && (
      !search ||
      t.customer.toLowerCase().includes(search.toLowerCase()) ||
      t.agent?.toLowerCase().includes(search.toLowerCase()) ||
      t.assignedStaff?.toLowerCase().includes(search.toLowerCase())
    )
  )

  const branchFiltered = branchOrders.filter(o =>
    o.status !== 'COMPLETED' && (
      !search ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.branchProfile.storeBranch.toLowerCase().includes(search.toLowerCase()) ||
      o.branchProfile.location.toLowerCase().includes(search.toLowerCase())
    )
  )

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Assign Booking</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            {tab === 'agent'
              ? `${filtered.length} task${filtered.length !== 1 ? 's' : ''} found`
              : `${branchFiltered.length} branch order${branchFiltered.length !== 1 ? 's' : ''} found`
            }
          </p>
        </div>
        <div className="relative max-w-xs w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..."
            className="w-full pl-9 pr-3 py-2 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 transition-shadow" />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-surface-200 dark:border-surface-700 mb-6">
        <nav className="flex gap-6">
          <button onClick={() => setTab('agent')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              tab === 'agent'
                ? 'border-surface-900 dark:border-white text-surface-900 dark:text-white'
                : 'border-transparent text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
            }`}>
            Agent Task
          </button>
          <button onClick={() => setTab('branch')}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              tab === 'branch'
                ? 'border-surface-900 dark:border-white text-surface-900 dark:text-white'
                : 'border-transparent text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
            }`}>
            Branches Task
          </button>
        </nav>
      </div>

      {tab === 'agent' ? (
        loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-surface-100 dark:bg-surface-700 rounded w-2/3" />
                    <div className="h-3 bg-surface-100 dark:bg-surface-700 rounded w-1/3" />
                  </div>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="h-3 bg-surface-100 dark:bg-surface-700 rounded w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-5">
              <ClipboardCheck size={32} className="text-surface-300 dark:text-surface-600" />
            </div>
            <p className="text-lg font-semibold text-surface-500 dark:text-surface-400">No assigned tasks</p>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Assign a task from the Booking Details page</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map(task => {
              const isMyTask = !!myAdminProfileId && task.adminProfileId === myAdminProfileId
              return (
                <TaskCard
                  key={task.id}
                  task={task}
                  isMyTask={isMyTask}
                  onViewDetails={() => navigate(`/tasks/${task.id}`)}
                  onApprove={handleApprove}
                  onComplete={handleComplete}
                />
              )
            })}
          </div>
        )
      ) : (
        branchLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="p-5 animate-pulse">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-700" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-surface-100 dark:bg-surface-700 rounded w-2/3" />
                    <div className="h-3 bg-surface-100 dark:bg-surface-700 rounded w-1/3" />
                  </div>
                </div>
                <div className="space-y-3">
                  {[1, 2, 3].map(j => (
                    <div key={j} className="h-3 bg-surface-100 dark:bg-surface-700 rounded w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : branchFiltered.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mx-auto mb-5">
              <Store size={32} className="text-surface-300 dark:text-surface-600" />
            </div>
            <p className="text-lg font-semibold text-surface-500 dark:text-surface-400">No branch orders assigned</p>
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Assign a branch order from the Branch Bookings detail page</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {branchFiltered.map(order => (
              <BranchTaskCard key={order.id} order={order} />
            ))}
          </div>
        )
      )}
    </>
  )
}
