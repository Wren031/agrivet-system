import type { Booking } from '../../../data/booking/types'
import { formatLastUpdated, statusStyles } from '../services/taskUtils'
import Drawer from '../../../components/Drawer'
import { useApp } from '../../../context/AppContext'
import { User, BadgeCheck, Calendar, Package, Clock } from 'lucide-react'

interface TaskDetailsDrawerProps {
  task: Booking | null
  open: boolean
  onClose: () => void
}

export default function TaskDetailsDrawer({ task, open, onClose }: TaskDetailsDrawerProps) {
  const { settings } = useApp()
  if (!task) return null

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={`Booking #${task.id.slice(0, 8)}`}
      size="350"
    >
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">Customer</p>
            <p className="text-lg font-semibold text-surface-800 dark:text-surface-100 truncate">{task.customer}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium shrink-0 ${statusStyles[task.status]}`}>{task.status}</span>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-50 dark:bg-surface-800 flex items-center justify-center shrink-0">
              <BadgeCheck size={14} className="text-surface-500 dark:text-surface-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-surface-500 dark:text-surface-400 mb-0.5">Agent</p>
              <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{task.agent || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-50 dark:bg-surface-800 flex items-center justify-center shrink-0">
              <User size={14} className="text-surface-500 dark:text-surface-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-surface-500 dark:text-surface-400 mb-0.5">Assigned To</p>
              <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{task.assignedStaff || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-50 dark:bg-surface-800 flex items-center justify-center shrink-0">
              <Calendar size={14} className="text-surface-500 dark:text-surface-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-surface-500 dark:text-surface-400 mb-0.5">Date</p>
              <p className="text-sm font-medium text-surface-800 dark:text-surface-200">
                {new Date(task.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-surface-50 dark:bg-surface-800 flex items-center justify-center shrink-0">
              <Clock size={14} className="text-surface-500 dark:text-surface-400" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-surface-500 dark:text-surface-400 mb-0.5">Last Updated</p>
              <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{formatLastUpdated(task.updatedAt)}</p>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2.5 mb-3">
            <Package size={15} className="text-surface-400" />
            <h3 className="text-sm font-semibold text-surface-800 dark:text-surface-100">Items</h3>
          </div>
          <div className="rounded-lg border border-surface-200 dark:border-surface-700 overflow-hidden">
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
                {task.items.map((item, i) => (
                  <tr key={i} className="hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors">
                    <td className="px-4 py-2.5 text-surface-700 dark:text-surface-200 font-medium">{item.name}</td>
                    <td className="px-4 py-2.5 text-surface-500 dark:text-surface-400">{item.quantity}</td>
                    <td className="px-4 py-2.5 text-surface-500 dark:text-surface-400">{settings.currencySymbol}{item.price.toFixed(2)}</td>
                    <td className="px-4 py-2.5 text-surface-800 dark:text-surface-200 font-medium text-right">{settings.currencySymbol}{(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-surface-50 dark:bg-surface-800/50">
                  <td colSpan={3} className="px-4 py-2.5 text-right font-bold text-surface-700 dark:text-surface-200">Total Amount:</td>
                  <td className="px-4 py-2.5 text-right font-bold text-surface-800 dark:text-surface-100">{settings.currencySymbol}{task.amount.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </Drawer>
  )
}
