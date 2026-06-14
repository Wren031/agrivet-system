import { useState } from 'react'
import { ShieldCheck, Users, Store, Search, CheckCircle, XCircle, Building2 } from 'lucide-react'
import { useVerification } from '../hooks/useVerification'
import { useApp } from '../../../context/AppContext'
import { SkeletonCards } from '../../../components/Skeleton'
import VerificationAgentCard from '../components/VerificationAgentCard'
import VerificationBranchCard from '../components/VerificationBranchCard'
import type { VerificationTab } from '../services/types'

export default function VerificationPage() {
  const {
    pendingAgents,
    inactiveBranches,
    loading,
    approve,
    reject,
    activate,
    deactivate,
    reload,
  } = useVerification()
  const { addNotification } = useApp()
  const [activeTab, setActiveTab] = useState<VerificationTab>('agents')
  const [search, setSearch] = useState('')
  const [updating, setUpdating] = useState<string | null>(null)

  const filteredAgents = pendingAgents.filter(a =>
    a.fullName.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  )

  const filteredBranches = inactiveBranches.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.email.toLowerCase().includes(search.toLowerCase()) ||
    b.address.toLowerCase().includes(search.toLowerCase())
  )

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

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Verification</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            Review and verify pending agents and branch registrations
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Pending Agents</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">{pendingAgents.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400">
            <Store size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Inactive Branches</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">{inactiveBranches.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Pending</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">{pendingAgents.length + inactiveBranches.length}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700">
          <div className="flex">
            <button
              onClick={() => { setActiveTab('agents'); setSearch('') }}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'agents'
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Users size={16} />
              Agents
              {pendingAgents.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 text-[10px] font-bold">
                  {pendingAgents.length}
                </span>
              )}
            </button>
            <button
              onClick={() => { setActiveTab('branches'); setSearch('') }}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'branches'
                  ? 'border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <Store size={16} />
              Branches
              {inactiveBranches.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-400 text-[10px] font-bold">
                  {inactiveBranches.length}
                </span>
              )}
            </button>
          </div>
          <div className="px-4">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-56 pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              />
            </div>
          </div>
        </div>

        <div className="p-5">
          {loading ? (
            <SkeletonCards count={4} />
          ) : activeTab === 'agents' ? (
            filteredAgents.length === 0 ? (
              <div className="text-center py-16 text-slate-400 dark:text-slate-500">
                <CheckCircle size={48} className="mx-auto mb-3 opacity-40" />
                <p className="font-semibold text-slate-500 dark:text-slate-400">No pending agents</p>
                <p className="text-sm mt-1">All agents have been verified</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAgents.map(agent => (
                  <VerificationAgentCard
                    key={agent.id}
                    agent={agent}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    updating={updating}
                    setUpdating={setUpdating}
                  />
                ))}
              </div>
            )
          ) : filteredBranches.length === 0 ? (
            <div className="text-center py-16 text-slate-400 dark:text-slate-500">
              <Building2 size={48} className="mx-auto mb-3 opacity-40" />
              <p className="font-semibold text-slate-500 dark:text-slate-400">No inactive branches</p>
              <p className="text-sm mt-1">All branches are active</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredBranches.map(branch => (
                <VerificationBranchCard
                  key={branch.id}
                  branch={branch}
                  onActivate={handleActivate}
                  onDeactivate={handleDeactivate}
                  updating={updating}
                  setUpdating={setUpdating}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
