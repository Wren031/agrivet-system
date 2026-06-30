import type { Booking } from '../../../data/booking/types'
import { formatLastUpdated, statusStyles } from '../services/taskUtils'
import Drawer from '../../../components/Drawer'
import { useApp } from '../../../context/AppContext'

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
      className="max-w-[350px]"
    >
      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Customer</p>
            <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">{task.customer}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[task.status]}`}>{task.status}</span>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-slate-500 dark:text-slate-400">Agent</p>
            <p className="font-medium text-slate-800 dark:text-slate-100">{task.agent || '—'}</p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Assigned To</p>
            <p className="font-medium text-slate-800 dark:text-slate-100">{task.assignedStaff || '—'}</p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Date</p>
            <p className="font-medium text-slate-800 dark:text-slate-100">{new Date(task.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div>
            <p className="text-slate-500 dark:text-slate-400">Last Updated</p>
            <p className="font-medium text-slate-800 dark:text-slate-100">{formatLastUpdated(task.updatedAt)}</p>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100 mb-3">Items</h3>
          <div className="rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
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
                {task.items.map((item, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-2.5 text-slate-700 dark:text-slate-200 font-medium">{item.name}</td>
                    <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">{item.quantity}</td>
                    <td className="px-4 py-2.5 text-slate-500 dark:text-slate-400">{settings.currencySymbol}{item.price.toFixed(2)}</td>
                    <td className="px-4 py-2.5 text-slate-800 dark:text-slate-200 font-medium text-right">{settings.currencySymbol}{(item.quantity * item.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <td colSpan={3} className="px-4 py-2.5 text-right font-bold text-slate-700 dark:text-slate-200">Total Amount:</td>
                  <td className="px-4 py-2.5 text-right font-bold text-slate-800 dark:text-slate-100">{settings.currencySymbol}{task.amount.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </Drawer>
  )
}