import { CheckCircle } from 'lucide-react'
import type { Booking } from '../../../data/booking/types'

interface TaskActionsProps {
  task: Booking
  isMyTask: boolean
  onApprove: (id: string) => void
  onComplete: (id: string) => void
}

export default function TaskActions({ task, isMyTask, onApprove, onComplete }: TaskActionsProps) {
  if (task.status === 'Process' && isMyTask) {
    return (
      <button onClick={() => onComplete(task.id)}
        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs font-medium">
        <CheckCircle size={14} /> Complete Task
      </button>
    )
  }

  if (task.status === 'Pending' && isMyTask) {
    return (
      <button onClick={() => onApprove(task.id)}
        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-xs font-medium">
        <CheckCircle size={14} /> Approve
      </button>
    )
  }

  return null
}