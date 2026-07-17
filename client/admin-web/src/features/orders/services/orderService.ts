import { apiFetch } from '../../../config/apiClient'
import type { AgentOrder, AgentOrderItem, BranchOrder, OrderApiResponse, BranchOrderApiResponse } from './types'

const statusMap: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Approved',
  PROCESSING: 'Process',
  APPROVED: 'Approved',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

function fromApiAgentOrder(item: OrderApiResponse): AgentOrder {
  return {
    id: item.id,
    orderDate: item.orderDate.split('T')[0],
    totalAmount: Number(item.totalAmount),
    status: statusMap[item.status] || item.status,
    customerName: item.customer.fullName,
    customerPhone: item.customer.phone,
    customerAddress: item.customer.address,
    agentName: item.agentProfile?.fullName || item.customer.agentProfile?.fullName || '',
    assignedStaff: item.adminProfile?.fullName ?? null,
    adminProfileId: item.adminProfileId ?? null,
    items: item.items.map((i): AgentOrderItem => ({
      id: i.id,
      name: i.inventory?.productName ?? 'Unknown Item',
      quantity: i.quantity,
      price: Number(i.unitPrice),
      subtotal: Number(i.subtotal),
    })),
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }
}

function fromApiBranchOrder(item: BranchOrderApiResponse): BranchOrder {
  return {
    id: item.id,
    branchName: item.branchProfile.storeBranch,
    address: item.branchProfile.location,
    branchContact: item.branchProfile.contactNumber,
    totalAmount: Number(item.totalAmount),
    status: statusMap[item.status] || item.status,
    assignedStaff: item.adminProfile?.fullName ?? null,
    notes: item.notes,
    itemCount: item.items.length,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
  }
}

export async function fetchAgentOrders(): Promise<AgentOrder[]> {
  const data = await apiFetch<OrderApiResponse[]>('/orders')
  return data.map(fromApiAgentOrder)
}

export async function fetchAgentOrderById(id: string): Promise<AgentOrder> {
  const data = await apiFetch<OrderApiResponse>(`/orders/${id}`)
  return fromApiAgentOrder(data)
}

export async function fetchBranchOrders(): Promise<BranchOrder[]> {
  const data = await apiFetch<BranchOrderApiResponse[]>('/branch-orders')
  return data.map(fromApiBranchOrder)
}
