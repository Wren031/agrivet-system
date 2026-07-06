import { useNavigate } from 'react-router-dom'
import { Store, MapPin, Package, Calendar, Eye } from 'lucide-react'
import type { BranchOrder } from '../../../data/branch-booking/types'
import { useApp } from '../../../context/AppContext'

const branchStatusStyles: Record<string, string> = {
  PENDING: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400',
  CONFIRMED: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400',
  PROCESSING: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400',
  APPROVED: 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400',
  COMPLETED: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400',
  CANCELLED: 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400',
}

interface BranchTaskCardProps {
  order: BranchOrder
}

export default function BranchTaskCard({ order }: BranchTaskCardProps) {
  const navigate = useNavigate()
  const { settings } = useApp()

  return (
    <div className="border border-dashed border-slate-300 dark:border-slate-600 p-4">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center shrink-0">
            <Store size={20} className="text-slate-500 dark:text-slate-400" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
              Branch Order #{order.id.slice(0, 8)}
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500">
              {order.branchProfile.storeBranch}
            </p>
          </div>
        </div>
        <span className={`px-2.5 py-1 rounded-md text-xs font-medium shrink-0 ${branchStatusStyles[order.status] || 'bg-surface-100 text-surface-700'}`}>
          {order.status}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center shrink-0">
            <Store size={14} className="text-slate-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">Branch</p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{order.branchProfile.storeBranch}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center shrink-0">
            <MapPin size={14} className="text-slate-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">Location</p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{order.branchProfile.location}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center shrink-0">
            <Calendar size={14} className="text-slate-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-tight">Date</p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
              {new Date(order.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
          <Package size={13} />
          <span>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</span>
          <span className="text-slate-300 dark:text-slate-600">·</span>
          <span className="font-medium text-slate-600 dark:text-slate-300">{settings.currencySymbol}{Number(order.totalAmount).toLocaleString()}</span>
        </div>
        <button onClick={() => navigate(`/tasks/branch/${order.id}`)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-900 dark:bg-white text-white dark:text-surface-900 hover:bg-surface-800 dark:hover:bg-surface-200 transition-colors text-xs font-medium">
          <Eye size={14} /> View Details
        </button>
      </div>
    </div>
  )
}
