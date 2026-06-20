import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Mail, Phone, ChevronLeft, ChevronRight, Search, Eye } from 'lucide-react'
import { useAgents } from '../hooks/useAgents'
import { useApp } from '../../../context/AppContext'
import { SkeletonCards } from '../../../components/Skeleton'
import type { Agent } from '../services/types'

const PAGE_SIZE = 8

const statusConfig: Record<string, { label: string; card: string }> = {
  PENDING: { label: 'Pending', card: 'text-amber-600 dark:text-amber-400' },
  APPROVED: { label: 'Approved', card: 'text-green-600 dark:text-green-400' },
  REJECTED: { label: 'Rejected', card: 'text-red-600 dark:text-red-400' },
}

export default function AgentsPage() {
  const navigate = useNavigate()
  const { agents, loading, changeStatus, remove, reload } = useAgents()
  const { addNotification } = useApp()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() =>
    agents.filter(a =>
      a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.contactNumber.toLowerCase().includes(search.toLowerCase())
    ),
    [agents, search]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  async function handleStatusChange(id: string, status: 'PENDING' | 'APPROVED' | 'REJECTED') {
    await changeStatus(id, { status })
    addNotification({ message: `Agent ${statusConfig[status].label.toLowerCase()}`, type: 'success' })
  }

  async function handleDelete(id: string) {
    await remove(id)
    addNotification({ message: 'Agent deleted', type: 'success' })
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
          <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
                  <th className="text-left py-3.5 px-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Name</th>
                  <th className="text-left py-3.5 px-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Email</th>
                  <th className="text-left py-3.5 px-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Phone</th>
                  <th className="text-left py-3.5 px-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Status</th>
                  <th className="text-right py-3.5 px-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(agent => (
                  <tr key={agent.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors last:border-b-0">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-xs shrink-0">
                          {agent.fullName.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{agent.fullName}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Mail size={14} className="shrink-0" /><span className="truncate">{agent.email}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                        <Phone size={14} className="shrink-0" /><span>{agent.contactNumber}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[agent.status]?.card}`}>
                        {statusConfig[agent.status]?.label}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button onClick={() => navigate(`/agents/${agent.id}`)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
