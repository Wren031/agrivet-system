import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Store, Search, Eye, ChevronLeft, ChevronRight, CheckSquare, Square, Ban, X } from 'lucide-react'
import { useBranches } from '../hooks/useBranches'
import { updateBranchStatus } from '../../../data/branch/branchService'
import { SkeletonCards } from '../../../components/Skeleton'
import Modal from '../../../components/Modal'
import { useApp } from '../../../context/AppContext'
import type { Branch, BranchStatus } from '../../../data/branch/types'

const PAGE_SIZE = 8

const statusConfig: Record<BranchStatus, { label: string; card: string }> = {
  PENDING: { label: 'Pending', card: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20' },
  APPROVED: { label: 'Approved', card: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20' },
  REJECTED: { label: 'Rejected', card: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20' },
  TERMINATED: { label: 'Terminated', card: 'text-surface-600 dark:text-surface-400 bg-surface-100 dark:bg-surface-800' },
  ONLINE: { label: 'Online', card: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20' },
  OFFLINE: { label: 'Offline', card: 'text-surface-500 dark:text-surface-400 bg-surface-100 dark:bg-surface-800' },
}

const statusFilterOptions = [
  { value: '', label: 'All Status' },
  { value: 'PENDING', label: 'Pending' },
  { value: 'APPROVED', label: 'Approved' },
  { value: 'REJECTED', label: 'Rejected' },
  { value: 'TERMINATED', label: 'Terminated' },
]

export default function BranchPage() {
  const { branches, loading, reload } = useBranches()
  const navigate = useNavigate()
  const { addNotification } = useApp()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [terminateTarget, setTerminateTarget] = useState<Branch | null>(null)

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter])

  const filtered = useMemo(() => {
    let result = branches
    if (statusFilter) {
      result = result.filter(b => b.status === statusFilter)
    }
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(b =>
        b.fullName.toLowerCase().includes(q) ||
        b.storeBranch.toLowerCase().includes(q) ||
        b.email.toLowerCase().includes(q) ||
        b.address.toLowerCase().includes(q) ||
        b.contactNumber.includes(q)
      )
    }
    return result
  }, [branches, search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const allSelected = paginated.length > 0 && paginated.every(b => selectedIds.has(b.id))

  function toggleAll() {
    if (allSelected) setSelectedIds(new Set())
    else setSelectedIds(new Set(paginated.map(b => b.id)))
  }

  function toggleOne(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Branches</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
            <span className="font-medium text-surface-600 dark:text-surface-300">{branches.length}</span> total branches
          </p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center mb-6">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 cursor-pointer">
          {statusFilterOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <div className="relative w-full sm:max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 dark:text-surface-400" />
          <input type="text" placeholder="Search branches..." value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-3 py-2 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 placeholder:text-surface-400 dark:placeholder:text-surface-500" />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <SkeletonCards count={4} />
      ) : paginated.length === 0 ? (
        <div className="text-center py-16 text-surface-500 dark:text-surface-400">
          <Store size={48} className="mx-auto mb-3 opacity-40" />
          <p>No branches found</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-50 dark:bg-surface-800/50 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4 w-10">
                    <button onClick={toggleAll} className="flex items-center justify-center">
                      {allSelected ? <CheckSquare size={15} className="text-surface-500" /> : <Square size={15} className="text-surface-400" />}
                    </button>
                  </th>
                  <th className="py-3.5 px-4">ID</th>
                  <th className="py-3.5 px-4">Owner</th>
                  <th className="py-3.5 px-4">Store</th>
                  <th className="py-3.5 px-4">Contact</th>
                  <th className="py-3.5 px-4">Join Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map(branch => {
                  const checked = selectedIds.has(branch.id)
                  return (
                    <tr key={branch.id} className={`border-b border-surface-100 dark:border-surface-800 transition-colors ${checked ? 'bg-surface-50/50 dark:bg-surface-950/20' : ''}`}>
                      <td className="py-3 px-4">
                        <button onClick={() => toggleOne(branch.id)} className="flex items-center justify-center">
                          {checked ? <CheckSquare size={15} className="text-surface-600" /> : <Square size={15} className="text-surface-400" />}
                        </button>
                      </td>
                      <td className="py-3 px-4 text-xs font-mono text-surface-500 dark:text-surface-400">#{branch.id.slice(0, 6)}</td>
                      <td className="py-3 px-4 font-medium text-surface-800 dark:text-surface-200">{branch.fullName}</td>
                      <td className="py-3 px-4 text-surface-600 dark:text-surface-300">{branch.storeBranch}</td>
                      <td className="py-3 px-4 text-surface-600 dark:text-surface-300">{branch.contactNumber}</td>
                      <td className="py-3 px-4 text-surface-500 dark:text-surface-400">{branch.date ? new Date(branch.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${statusConfig[branch.status]?.card}`}>
                          {statusConfig[branch.status]?.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button onClick={() => navigate(`/branches/${branch.id}`)}
                            className="p-1.5 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors" title="View Details">
                            <Eye size={16} />
                          </button>
                          {(branch.status === 'APPROVED' || branch.status === 'ONLINE' || branch.status === 'OFFLINE') && (
                            <button onClick={() => setTerminateTarget(branch)}
                              className="p-1.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors" title="Terminate">
                              <X size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 text-sm">
              <p className="text-surface-500 dark:text-surface-400">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  <ChevronLeft size={14} /> Prev
                </button>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                  Next <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      <Modal open={terminateTarget !== null} onClose={() => setTerminateTarget(null)} title="Terminate Branch" size="sm">
        {terminateTarget && (
          <div className="text-center">
            <p className="text-sm text-surface-600 dark:text-surface-300 mb-6">Are you sure you want to terminate <strong>{terminateTarget.fullName}</strong>?</p>
            <div className="flex gap-3">
              <button onClick={async () => {
                try {
                  await updateBranchStatus(terminateTarget.id, 'TERMINATED')
                  addNotification({ message: 'Branch terminated', type: 'success' })
                  setTerminateTarget(null)
                  reload()
                } catch {
                  addNotification({ message: 'Failed to terminate branch', type: 'error' })
                }
              }}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                Terminate
              </button>
              <button onClick={() => setTerminateTarget(null)}
                className="flex-1 py-2.5 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors text-sm font-medium">Cancel</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
