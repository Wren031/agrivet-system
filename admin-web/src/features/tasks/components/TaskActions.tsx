import { CheckCircle, XCircle, Clock, Truck } from 'lucide-react'
import type { Booking } from '../../../data/booking/types'

interface TaskActionsProps {
  task: Booking
  isMyTask: boolean
  onApprove: (id: string) => void
  onCancel: (id: string) => void
  onComplete: (id: string) => void
}

export default function TaskActions({ task, isMyTask, onApprove, onCancel, onComplete }: TaskActionsProps) {
  if (task.status === 'Completed') {
    return (
      <span className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">
        <CheckCircle size={14} /> Completed
      </span>
    )
  }

  if (task.status === 'Cancelled') {
    return (
      <span className="flex items-center gap-1.5 text-xs font-medium text-indigo-700 dark:text-indigo-300">
        <XCircle size={14} /> Cancelled
      </span>
    )
  }

  if (task.status === 'Approved') {
    if (isMyTask) {
      return (
        <div className="flex gap-2">
          <button onClick={() => onComplete(task.id)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs font-medium">
            <Truck size={14} /> Complete
          </button>
          <button onClick={() => onCancel(task.id)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors text-xs font-medium">
            <XCircle size={14} /> Cancel
          </button>
        </div>
      )
    }
    return (
      <span className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">
        <CheckCircle size={14} /> Approved
      </span>
    )
  }

  if (task.status === 'Process') {
    if (isMyTask) {
      return (
        <div className="flex gap-2">
          <button onClick={() => onComplete(task.id)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs font-medium">
            <CheckCircle size={14} /> Complete Task
          </button>
          <button onClick={() => onCancel(task.id)}
            className="flex items-center gap-1.5 px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors text-xs font-medium">
            <XCircle size={14} /> Cancel
          </button>
        </div>
      )
    }
    return (
      <span className="flex items-center gap-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400">
        <Clock size={14} /> In Progress
      </span>
    )
  }

  if (isMyTask) {
    return (
      <div className="flex gap-2">
        <button onClick={() => onApprove(task.id)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs font-medium">
          <CheckCircle size={14} /> Approve
        </button>
        <button onClick={() => onCancel(task.id)}
          className="flex items-center gap-1.5 px-4 py-2 bg-indigo-700 text-white rounded-lg hover:bg-indigo-800 transition-colors text-xs font-medium">
          <XCircle size={14} /> Cancel
        </button>
      </div>
    )
  }

  return (
    <span className="text-xs text-slate-400 dark:text-slate-500">
      Awaiting action from assigned staff
    </span>
  )
}