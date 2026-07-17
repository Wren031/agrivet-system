import { fetchAgentOrders, fetchBranchOrders } from '../features/orders/services/orderService'
import { fetchAgents } from '../features/agents/services/agentService'
import { fetchBranches } from '../features/branch/services/branchService'
import { fetchBookings } from '../data/booking/customer-order-Service'

export interface NotificationCounts {
  newOrders: number
  newAgents: number
  newBranches: number
  pendingTasks: number
  agentBookingOrders: number
  branchBookingOrders: number
}

export async function fetchNotificationCounts(): Promise<NotificationCounts> {
  try {
    const [agentOrders, branchOrders, agents, branches, bookings] = await Promise.all([
      fetchAgentOrders(),
      fetchBranchOrders(),
      fetchAgents(),
      fetchBranches(),
      fetchBookings(),
    ])

    const agentPending = agentOrders.filter(
      o => o.status === 'Pending' || o.status === 'Process'
    ).length
    const branchPending = branchOrders.filter(
      o => o.status === 'Pending' || o.status === 'Process'
    ).length

    return {
      newOrders: agentPending + branchPending,
      newAgents: agents.filter(a => a.status === 'PENDING').length,
      newBranches: branches.filter(b => b.status === 'PENDING').length,
      pendingTasks: bookings.filter(
        b => b.status !== 'Completed' && b.status !== 'Cancelled'
      ).length,
      agentBookingOrders: agentPending,
      branchBookingOrders: branchPending,
    }
  } catch {
    return {
      newOrders: 0,
      newAgents: 0,
      newBranches: 0,
      pendingTasks: 0,
      agentBookingOrders: 0,
      branchBookingOrders: 0,
    }
  }
}
