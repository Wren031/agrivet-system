import type { Booking } from '../../../data/booking/types'

export const statusStyles: Record<string, string> = {
  Pending: 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400',
  Process: 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400',
  Approved: 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400',
  Completed: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400',
  Cancelled: 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400',
}

export const statusColors: Record<string, string> = {
  Pending: '#f59e0b',
  Process: '#3b82f6',
  Approved: '#22c55e',
  Completed: '#10b981',
  Cancelled: '#ef4444',
}

export function formatLastUpdated(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function handlePrint(task: Booking, currencySymbol = '₱') {
  const printWindow = window.open('', '_blank')
  if (!printWindow) return

  const itemsHtml = task.items.map(item => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.name}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${currencySymbol}${item.price.toFixed(2)}</td>
      <td style="padding: 8px; border: 1px solid #ddd; text-align: right;">${currencySymbol}${(item.quantity * item.price).toFixed(2)}</td>
    </tr>
  `).join('')

  const statusColor = statusColors[task.status] || '#6b7280'

  printWindow.document.write(`
    <html>
      <head>
        <title>Booking Details - ${task.id.slice(0, 8)}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 10px; }
          th, td { border: 1px solid #ddd; }
          th { background: #f3f4f6; }
          .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
          .status { padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; color: white; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Booking Details</h1>
          <span class="status" style="background: ${statusColor};">${task.status}</span>
        </div>
        <div style="margin-bottom: 20px;">
          <p><strong>Booking ID:</strong> ${task.id}</p>
          <p><strong>Customer:</strong> ${task.customer}</p>
          <p><strong>Agent:</strong> ${task.agent || '—'}</p>
          <p><strong>Assigned To:</strong> ${task.assignedStaff || '—'}</p>
          <p><strong>Date:</strong> ${new Date(task.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p><strong>Last Updated:</strong> ${formatLastUpdated(task.updatedAt)}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th style="padding: 8px; border: 1px solid #ddd;">Item</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: center;">Qty</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Price</th>
              <th style="padding: 8px; border: 1px solid #ddd; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr style="background: #f3f4f6;">
              <td colspan="3" style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">Total Amount:</td>
              <td style="padding: 8px; border: 1px solid #ddd; text-align: right; font-weight: bold;">${currencySymbol}${task.amount.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
        <script>
          window.onload = function() { window.print(); }
        </script>
      </body>
    </html>
  `)
  printWindow.document.close()
}
