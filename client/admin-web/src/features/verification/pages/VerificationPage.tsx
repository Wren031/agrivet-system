import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Store, Search, CheckCircle, Building2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useVerification } from '../hooks/useVerification'
import { useApp } from '../../../context/AppContext'
import { SkeletonCards } from '../../../components/Skeleton'
import PageHeader from '../../../components/PageHeader'
import TabNav from '../../../components/TabNav'
import Pagination from '../../../components/Pagination'
import VerificationAgentRow from '../components/VerificationAgentRow'
import VerificationBranchRow from '../components/VerificationBranchRow'
import type { VerificationTab } from '../services/types'

const PAGE_SIZE = 8

export default function VerificationPage() {
  const navigate = useNavigate()
  const {
    pendingAgents,
    inactiveBranches,
    loading,
    approve,
    reject,
    activate,
    deactivate,
  } = useVerification()
  const { addNotification } = useApp()
  const [activeTab, setActiveTab] = useState<VerificationTab>('agents')
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const filteredAgents = pendingAgents.filter(a =>
    a.fullName.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  )

  const filteredBranches = inactiveBranches.filter(b =>
    b.fullName.toLowerCase().includes(search.toLowerCase()) ||
    b.email.toLowerCase().includes(search.toLowerCase()) ||
    b.address.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.max(1, Math.ceil((activeTab === 'agents' ? filteredAgents.length : filteredBranches.length) / PAGE_SIZE))
  const paginatedAgents = filteredAgents.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const paginatedBranches = filteredBranches.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  async function handleApprove(id: string) {
    await approve(id)
    addNotification({ message: 'Agent approved successfully', type: 'success' })
  }

  async function handleReject(id: string) {
    await reject(id)
    addNotification({ message: 'Agent rejected', type: 'success' })
  }

  async function handleActivate(id: string) {
    await activate(id)
    addNotification({ message: 'Branch activated successfully', type: 'success' })
  }

  async function handleDeactivate(id: string) {
    await deactivate(id)
    addNotification({ message: 'Branch declined', type: 'success' })
  }

  function handleViewDetails(id: string) {
    navigate(`/branches/${id}`)
  }

  return (
    <div>
      <PageHeader title="Verification" subtitle="Review and verify pending agents and branch registrations" />

      <TabNav
        tabs={[
          { key: 'agents', label: 'Agents', badge: pendingAgents.length },
          { key: 'branches', label: 'Branches', badge: inactiveBranches.length },
        ]}
        activeKey={activeTab}
        onTabChange={key => { setActiveTab(key as VerificationTab); setSearch(''); setPage(1) }}
      />
        <div className="px-4 pb-3 sm:pb-0">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 dark:text-surface-400" />
            <input
              type="text"
              placeholder={`Search ${activeTab}...`}
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="w-full sm:w-56 pl-9 pr-3 py-2 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 placeholder:text-surface-400 dark:placeholder:text-surface-500"
            />
          </div>
        </div>

      {loading ? (
        <SkeletonCards count={4} />
      ) : activeTab === 'agents' ? (
        filteredAgents.length === 0 ? (
          <div className="text-center py-16 text-surface-500 dark:text-surface-400">
            <CheckCircle size={48} className="mx-auto mb-3 opacity-40" />
            <p className="font-semibold text-surface-500 dark:text-surface-400">No pending agents</p>
            <p className="text-sm mt-1">All agents have been verified</p>
          </div>
        ) : (
          <div>
            <table className="w-full">
              <thead>
<tr className="bg-surface-50 dark:bg-surface-800/50 text-surface-500 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-semibold">Name</th>
                  <th className="text-left px-4 py-3 font-semibold">Email</th>
                  <th className="text-left px-4 py-3 font-semibold">Contact</th>
                  <th className="text-left px-4 py-3 font-semibold">Registered</th>
                  <th className="text-left px-4 py-3 font-semibold">ID</th>
                  <th className="text-left px-4 py-3 font-semibold">Status</th>
                  <th className="text-right px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                {paginatedAgents.map(agent => (
                  <VerificationAgentRow
                    key={agent.id}
                    agent={agent}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    updating={updating}
                    setUpdating={setUpdating}
                    />
                  ))}
                </tbody>
              </table>
            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )
      ) : filteredBranches.length === 0 ? (
        <div className="text-center py-16 text-surface-500 dark:text-surface-400">
          <Building2 size={48} className="mx-auto mb-3 opacity-40" />
          <p className="font-semibold text-surface-500 dark:text-surface-400">No inactive branches</p>
          <p className="text-sm mt-1">All branches are active</p>
        </div>
      ) : (
        <div>
          <table className="w-full">
            <thead>
              <tr className="bg-surface-50 dark:bg-surface-800/50 text-surface-500 text-xs uppercase tracking-wider">
                <th className="text-left px-4 py-3 font-semibold">Name</th>
                <th className="text-left px-4 py-3 font-semibold">Store Branch</th>
                <th className="text-left px-4 py-3 font-semibold">Email</th>
                <th className="text-left px-4 py-3 font-semibold">Contact</th>
                <th className="text-left px-4 py-3 font-semibold">Address</th>
                <th className="text-left px-4 py-3 font-semibold">Status</th>
                <th className="text-right px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
              {paginatedBranches.map(branch => (
                <VerificationBranchRow
                  key={branch.id}
                  branch={branch}
                  onActivate={handleActivate}
                  onDeactivate={handleDeactivate}
                  onViewDetails={handleViewDetails}
                  updating={updating}
                  setUpdating={setUpdating}
                />
              ))}
            </tbody>
          </table>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      )}
    </div>
  )
}
