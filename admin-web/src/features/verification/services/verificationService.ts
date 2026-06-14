import { fetchAgents, fetchAgent, updateStatus } from '../../agents/services/agentService'
import { fetchBranches, updateBranch } from '../../../data/branch/branchService'
import type { VerificationAgent, VerificationBranch } from './types'
import type { Agent } from '../../agents/services/types'
import type { Branch } from '../../../data/branch/types'

function toVerificationAgent(agent: Agent): VerificationAgent {
  return {
    id: agent.id,
    fullName: agent.fullName,
    email: agent.email,
    contactNumber: agent.contactNumber,
    idVerificationUrl: agent.idVerificationUrl,
    status: agent.status,
    createdAt: agent.createdAt,
  }
}

function toVerificationBranch(branch: Branch): VerificationBranch {
  return {
    id: branch.id,
    name: branch.name,
    email: branch.email,
    address: branch.address,
    contactNumber: branch.contactNumber,
    status: branch.status,
    date: branch.date,
  }
}

export async function fetchPendingAgents(): Promise<VerificationAgent[]> {
  const agents = await fetchAgents()
  const pending = agents.filter(a => a.status === 'PENDING')
  return pending.map(toVerificationAgent)
}

export async function approveAgent(id: string): Promise<VerificationAgent> {
  const agent = await updateStatus(id, { status: 'APPROVED' })
  return toVerificationAgent(agent)
}

export async function rejectAgent(id: string): Promise<VerificationAgent> {
  const agent = await updateStatus(id, { status: 'REJECTED' })
  return toVerificationAgent(agent)
}

export async function fetchBranchesForVerification(): Promise<VerificationBranch[]> {
  const branches = await fetchBranches()
  const inactive = branches.filter(b => b.status === 'Inactive')
  return inactive.map(toVerificationBranch)
}

export async function activateBranch(id: string): Promise<VerificationBranch> {
  const branch = await updateBranch(id, { status: 'Active' })
  return toVerificationBranch(branch)
}

export async function deactivateBranch(id: string): Promise<VerificationBranch> {
  const branch = await updateBranch(id, { status: 'Inactive' })
  return toVerificationBranch(branch)
}

export async function fetchAllForVerification(): Promise<{
  pendingAgents: VerificationAgent[]
  inactiveBranches: VerificationBranch[]
}> {
  const [agents, branches] = await Promise.all([
    fetchPendingAgents(),
    fetchBranchesForVerification(),
  ])
  return { pendingAgents: agents, inactiveBranches: branches }
}
