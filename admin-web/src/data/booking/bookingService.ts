import type { Booking, BookingItem, OrderApiResponse } from './types'
import { apiFetch } from '../../config/apiClient'

const statusMap: Record<string, Booking['status']> = {
  PENDING: 'Pending',
  CONFIRMED: 'Process',
  PROCESSING: 'Process',
  APPROVED: 'Approved',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
}

function toApiStatus(status: Booking['status']): string {
  const map: Record<string, string> = {
    Pending: 'PENDING',
    Process: 'PROCESSING',
    Approved: 'APPROVED',
    Completed: 'COMPLETED',
    Cancelled: 'CANCELLED',
  }
  return map[status] || 'PENDING'
}

function fromApi(item: OrderApiResponse): Booking {
  const agentName =
    item.agentProfile?.fullName ||
    item.customer.agentProfile?.fullName ||
    ''

  return {
    id: item.id,
    customer: item.customer.fullName,
    agent: agentName,
    assignedStaff: item.adminProfile?.fullName ?? undefined,
    adminProfileId: item.adminProfile?.id ?? undefined,
    date: item.orderDate.split('T')[0],
    amount: Number(item.totalAmount),
    status: statusMap[item.status] || 'Pending',
    updatedAt: item.updatedAt,
    items: item.items.map((i) => ({
      name: i.inventory?.productName ?? 'Unknown Item',
      quantity: i.quantity,
      price: Number(i.unitPrice),
    })),
  }
}

export async function fetchBookings(): Promise<Booking[]> {
  const data = await apiFetch<OrderApiResponse[]>('/orders')
  return data.map(fromApi)
}

export async function fetchBookingById(id: string): Promise<Booking | undefined> {
  const data = await apiFetch<OrderApiResponse>(`/orders/${id}`)
  return fromApi(data)
}

export async function createBooking(
  booking: Omit<Booking, 'id'> & { items?: BookingItem[] },
): Promise<Booking> {
  const data = await apiFetch<OrderApiResponse>('/orders', {
    method: 'POST',
    body: JSON.stringify({
      customerId: booking.customer,
      status: toApiStatus(booking.status || 'Pending'),
      items: (booking.items || []).map((item) => ({
        quantity: item.quantity,
        unitPrice: item.price,
      })),
    }),
  })
  return fromApi(data)
}

export async function updateBooking(
  id: string,
  updates: Partial<Booking>,
): Promise<Booking> {
  const body: Record<string, unknown> = {}
  if (updates.status !== undefined) body.status = toApiStatus(updates.status)
  if (updates.amount !== undefined) body.totalAmount = updates.amount

  const data = await apiFetch<OrderApiResponse>(`/orders/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
  return fromApi(data)
}

export async function assignBooking(id: string, adminProfileId: string): Promise<Booking> {
  const data = await apiFetch<OrderApiResponse>(`/orders/${id}/assign`, {
    method: 'PATCH',
    body: JSON.stringify({ adminProfileId }),
  })
  return fromApi(data)
}

export async function deleteBooking(id: string): Promise<void> {
  await apiFetch<void>(`/orders/${id}`, { method: 'DELETE' })
}
