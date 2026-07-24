import { useParams, useNavigate } from 'react-router-dom'
import { Printer, ShoppingCart } from 'lucide-react'
import { useOrders } from '../hooks/useOrders'
import { useApp } from '../../../context/AppContext'
import {
  DetailLayout,
  DetailHeader,
  DetailSection,
  DetailField,
  DetailGrid,
  DetailTable,
  DetailEmptyState,
} from '../../../components/detail'

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { agentOrders, loading } = useOrders()
  const { settings } = useApp()

  const order = agentOrders.find(o => o.id === id)

  if (loading) {
    return (
      <DetailLayout loading backTo="/orders" backLabel="Back to Orders" />
    )
  }

  if (!order) {
    return (
      <DetailLayout backTo="/orders" backLabel="Back to Orders">
        <DetailEmptyState
          
          title="Order Not Found"
          message="The order record you are looking for could not be found."
          backLabel="Back to Orders"
          onBack={() => navigate('/orders')}
        />
      </DetailLayout>
    )
  }

  return (
    <DetailLayout backTo="/orders" backLabel="Back to Orders">
      <DetailHeader
        title={`Order ${order.id}`}
        subtitle="View full order details"
        avatarIcon={<ShoppingCart size={20} className="text-surface-500 dark:text-surface-400" />}
      >
        <button onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-surface-600 dark:text-surface-300 border border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
          <Printer size={14} /> Print
        </button>
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${
          order.status === 'Pending' ? 'bg-surface-100 dark:bg-surface-700 text-surface-700 dark:text-surface-300' :
          order.status === 'Process' ? 'bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400' :
          order.status === 'Approved' ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' :
          order.status === 'Completed' ? 'bg-surface-100 dark:bg-surface-700 text-surface-500 dark:text-surface-400' :
          'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
        }`}>{order.status}</span>
      </DetailHeader>

      <div className="space-y-6">
        <DetailSection title="Order Information" >
          <DetailGrid cols={4}>
            <DetailField label="Customer" value={order.customerName} />
            <DetailField  label="Agent" value={order.agentName} />
            <DetailField label="Date" value={
              order.orderDate
                ? new Date(order.orderDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                : null
            } />
            <DetailField label="Total Amount" value={`${settings.currencySymbol}${order.totalAmount.toLocaleString()}`} />
          </DetailGrid>
          {order.assignedStaff && (
            <div className="mt-4 pt-4 border-t border-surface-100 dark:border-surface-800">
              <DetailGrid cols={2}>
                <DetailField  label="Assigned Staff" value={order.assignedStaff} />
              </DetailGrid>
            </div>
          )}
        </DetailSection>

        <DetailSection title="Order Items"  description={`${order.items.length} item(s)`}>
          <DetailTable
            headers={['Item', 'Qty', 'Price', 'Total']}
            emptyMessage="No items in this order"
            emptyColSpan={4}
          >
            {order.items.map((item) => (
              <tr key={item.id} className="hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors">
                <td className="px-5 py-3.5 text-surface-800 dark:text-surface-200 font-medium">{item.name}</td>
                <td className="px-5 py-3.5 text-surface-500 dark:text-surface-400">{item.quantity}</td>
                <td className="px-5 py-3.5 text-surface-500 dark:text-surface-400">{settings.currencySymbol}{item.price.toFixed(2)}</td>
                <td className="px-5 py-3.5 text-surface-800 dark:text-surface-200 font-medium text-right">{settings.currencySymbol}{item.subtotal.toFixed(2)}</td>
              </tr>
            ))}
          </DetailTable>
        </DetailSection>
      </div>
    </DetailLayout>
  )
}
