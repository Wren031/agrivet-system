import { useState, useMemo } from 'react'
import { Users, Mail, Phone, MapPin, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { useAgents } from '../hooks/useAgents'
import { updateAgent } from '../services/agentService'
import { useApp } from '../../../context/AppContext'
import { SkeletonCards } from '../../../components/Skeleton'

const PAGE_SIZE = 8

export default function AgentsPage() {
  const { agents, loading, reload } = useAgents()
  const { addNotification } = useApp()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() =>
    agents.filter(a =>
      a.name.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.region.toLowerCase().includes(search.toLowerCase())
    ),
    [agents, search]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  async function handleStatusChange(id: string, status: 'Pending' | 'Approved' | 'Rejected') {
    try {
      await updateAgent(id, { status })
      const label = { Pending: 'set to pending', Approved: 'approved', Rejected: 'rejected' }[status]
      addNotification({ message: `Agent ${label}`, type: 'success' })
      reload()
    } catch {
      addNotification({ message: 'Failed to update agent status', type: 'error' })
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Agents</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            <span className="font-medium text-slate-600 dark:text-slate-300">{agents.length}</span> total agents
          </p>
        </div>
      </div>

      <div className="relative max-w-xs mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        <input type="text" placeholder="Search agents..." value={search}
          onChange={e => { setSearch(e.target.value); setPage(1) }}
          className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
      </div>

      {loading ? (
        <SkeletonCards count={4} />
      ) : paginated.length === 0 ? (
        <div className="text-center py-16 text-slate-400 dark:text-slate-500">
          <Users size={48} className="mx-auto mb-3 opacity-40" />
          <p>No agents found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {paginated.map(agent => (
              <div key={agent.id} className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-sm">
                    {agent.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-800 dark:text-slate-200 text-sm truncate">{agent.name}</p>
                    <p className={`text-xs font-medium ${agent.status === 'Approved' ? 'text-green-600 dark:text-green-400' : agent.status === 'Rejected' ? 'text-red-600 dark:text-red-400' : 'text-amber-600 dark:text-amber-400'}`}>
                      {agent.status}
                    </p>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Mail size={14} /><span className="truncate">{agent.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Phone size={14} /><span>{agent.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <MapPin size={14} /><span>{agent.region}</span>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
                  <select value={agent.status}
                    onChange={e => handleStatusChange(agent.id, e.target.value as 'Pending' | 'Approved' | 'Rejected')}
                    className="w-full px-3 py-1.5 rounded-lg text-xs font-medium border focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer bg-transparent text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-600"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 text-sm">
              <p className="text-slate-400 dark:text-slate-500">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronLeft size={14} /> Prev
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
