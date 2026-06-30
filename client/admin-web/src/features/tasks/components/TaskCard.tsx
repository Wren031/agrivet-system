import { ClipboardCheck, User, BadgeCheck, Calendar, Package, Printer, Building2 } from 'lucide-react'
import type { Booking } from '../../../data/booking/types'
import { statusStyles, formatLastUpdated, handlePrint } from '../services/taskUtils'
import TaskActions from './TaskActions'
import { useApp } from '../../../context/AppContext'

interface TaskCardProps {
  task: Booking
  isMyTask: boolean
  onViewDetails: () => void
  onApprove: (id: string) => void
  onComplete: (id: string) => void
}



export default function TaskCard({ task, isMyTask, onViewDetails, onApprove, onComplete }: TaskCardProps) {
  const { settings } = useApp()
  const totalItems = task.items.reduce((sum, item) => sum + item.quantity * item.price, 0)

  return (
    <div className="border border-dashed border-slate-300 dark:border-slate-600 p-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
              <ClipboardCheck size={20} className="text-slate-500 dark:text-slate-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                Booking #{task.id.slice(0, 8)}
              </p>
              <p className="text-xs text-slate-400 dark:text-slate-500">
                {new Date(task.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${statusStyles[task.status]}`}>{task.status}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center shrink-0">
              <User size={14} className="text-slate-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">Customer</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{task.customer}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center shrink-0">
              <BadgeCheck size={14} className="text-slate-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">Assigned To</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{task.assignedStaff || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center shrink-0">
              <Building2 size={14} className="text-slate-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">Agent</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{task.agent || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center shrink-0">
              <Calendar size={14} className="text-slate-400" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">Date</p>
              <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                {new Date(task.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <Package size={13} />
            <span>{task.items.length} item{task.items.length !== 1 ? 's' : ''}</span>
            <span className="text-slate-300 dark:text-slate-600">·</span>
            <span className="font-medium text-slate-600 dark:text-slate-300">{settings.currencySymbol}{totalItems.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onViewDetails}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-900 dark:bg-white text-white dark:text-surface-900 hover:bg-surface-800 dark:hover:bg-surface-200 transition-colors text-xs font-medium">
              View Details
            </button>
            <button onClick={() => handlePrint(task, settings.currencySymbol)}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
              aria-label="Print">
              <Printer size={15} />
            </button>
          </div>
        </div>

      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] text-slate-400 dark:text-slate-500">Updated {formatLastUpdated(task.updatedAt)}</p>
        <TaskActions
          task={task}
          isMyTask={isMyTask}
          onApprove={onApprove}
          onComplete={onComplete}
        />
      </div>
    </div>
  )
}
