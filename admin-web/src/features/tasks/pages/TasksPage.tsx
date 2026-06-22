import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ClipboardCheck, Search } from 'lucide-react'
import { useTasks } from '../hooks/useTasks'
import TaskCard from '../components/TaskCard'

export default function TasksPage() {
  const navigate = useNavigate()
  const { tasks, myAdminProfileId, loading, handleApprove, handleComplete } = useTasks()
  const [search, setSearch] = useState('')

  const filtered = tasks.filter(t =>
    !search ||
    t.customer.toLowerCase().includes(search.toLowerCase()) ||
    t.agent?.toLowerCase().includes(search.toLowerCase()) ||
    t.assignedStaff?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Tasks</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            {filtered.length} task{filtered.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <div className="relative max-w-xs w-full sm:w-72">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tasks..."
            className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-shadow" />
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 animate-pulse">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-100 dark:bg-slate-700 rounded w-2/3" />
                  <div className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-1/3" />
                </div>
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map(j => (
                  <div key={j} className="h-3 bg-slate-100 dark:bg-slate-700 rounded w-full" />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-5">
            <ClipboardCheck size={32} className="text-slate-300 dark:text-slate-600" />
          </div>
          <p className="text-lg font-semibold text-slate-500 dark:text-slate-400">No assigned tasks</p>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Assign a task from the Booking Details page</p>
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
      )}

    </>
  )
}
