import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Store, Search, CheckCircle, Building2, ChevronLeft, ChevronRight } from 'lucide-react'
import { useVerification } from '../hooks/useVerification'
import { useApp } from '../../../context/AppContext'
import { SkeletonCards } from '../../../components/Skeleton'
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
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Verification</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            Review and verify pending agents and branch registrations
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-surface-100 dark:border-surface-700 mb-5">
        <div className="flex overflow-x-auto">
          <button
            onClick={() => { setActiveTab('agents'); setSearch(''); setPage(1) }}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'agents'
                ? 'border-surface-800 text-surface-800 dark:border-white dark:text-white'
                : 'border-transparent text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
            }`}
          >
            <Users size={16} />
            Agents
            {pendingAgents.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-md bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 text-[10px] font-bold">
                {pendingAgents.length}
              </span>
            )}
          </button>
          <button
            onClick={() => { setActiveTab('branches'); setSearch(''); setPage(1) }}
            className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'branches'
                ? 'border-surface-800 text-surface-800 dark:border-white dark:text-white'
                : 'border-transparent text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
            }`}
          >
            <Store size={16} />
            Branches
            {inactiveBranches.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-md bg-surface-100 dark:bg-surface-800 text-surface-700 dark:text-surface-300 text-[10px] font-bold">
                {inactiveBranches.length}
              </span>
            )}
          </button>
        </div>
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
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 text-sm">
                <p className="text-surface-500 dark:text-surface-400">Page {page} of {totalPages}</p>
                <div className="flex gap-2">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                    <ChevronLeft size={14} /> Prev
                  </button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                    Next <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
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
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 text-sm">
              <p className="text-surface-500 dark:text-surface-400">Page {page} of {totalPages}</p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                  <ChevronLeft size={14} /> Prev
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
