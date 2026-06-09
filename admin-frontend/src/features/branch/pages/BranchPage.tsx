import { useState, useMemo } from 'react'
import { Store, Search, Building2, CheckCircle, XCircle, Trash2, UserX, UserCheck } from 'lucide-react'
import { useBranches } from '../hooks/useBranches'
import { useApp } from '../../../context/AppContext'
import { updateBranch } from '../../../data/branch/branchService'
import { SkeletonTable } from '../../../components/Skeleton'
import Modal from '../../../components/Modal'
import type { Branch } from '../../../data/branch/types'

const statusStyles: Record<string, string> = {
  Active: 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400',
  Inactive: 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400',
}

export default function BranchPage() {
  const { branches, loading, remove, reload } = useBranches()
  const { addNotification } = useApp()
  const [search, setSearch] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filtered = useMemo(() =>
    branches.filter(b =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase()) ||
      b.address.toLowerCase().includes(search.toLowerCase()) ||
      b.contactNumber.includes(search)
    ),
    [branches, search]
  )

  const activeCount = branches.filter(b => b.status === 'Active').length
  const inactiveCount = branches.filter(b => b.status === 'Inactive').length

  async function handleStatusToggle(id: string, current: 'Active' | 'Inactive') {
    const next = current === 'Active' ? 'Inactive' : 'Active'
    try {
      await updateBranch(id, { status: next })
      addNotification({ message: `Branch ${next === 'Active' ? 'reactivated' : 'terminated'}`, type: 'success' })
      reload()
    } catch {
      addNotification({ message: 'Failed to update branch status', type: 'error' })
    }
  }

  async function handleDelete() {
    if (!deleteId) return
    try {
      await remove(deleteId)
      addNotification({ message: 'Branch deleted', type: 'success' })
      setDeleteId(null)
    } catch {
      addNotification({ message: 'Failed to delete branch', type: 'error' })
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Branches</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Manage your business branches</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400">
            <Building2 size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Total Branches</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">{branches.length}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Active</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">{activeCount}</p>
          </div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Not Active</p>
            <p className="text-2xl font-bold text-slate-800 dark:text-white mt-0.5">{inactiveCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <div className="relative max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input type="text" placeholder="Search branches..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-5"><SkeletonTable rows={6} /></div>
          ) : filtered.length === 0 ? (
            <div className="px-5 py-14 text-center text-slate-400 dark:text-slate-500">
              <Store size={40} className="mx-auto mb-2 opacity-40" />
              <p>No branches found</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Address</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.map(branch => (
                  <tr key={branch.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-slate-200">{branch.name}</td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{branch.email}</td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{branch.contactNumber}</td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300 max-w-[200px] truncate">{branch.address}</td>
                    <td className="px-5 py-3.5 text-slate-400 dark:text-slate-500">{branch.date ? new Date(branch.date).toLocaleDateString() : '—'}</td>
                    <td className="px-5 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[branch.status]}`}>
                        {branch.status === 'Active' ? 'Approved' : 'Declined'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleStatusToggle(branch.id, branch.status)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                            branch.status === 'Active'
                              ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50'
                              : 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-950/50'
                          }`}>
                          {branch.status === 'Active' ? <><UserX size={14} /> Terminate</> : <><UserCheck size={14} /> Reactivate</>}
                        </button>
                        <button onClick={() => setDeleteId(branch.id)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                          title="Delete"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Delete Branch" size="sm">
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">Are you sure you want to delete this branch? This action cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={handleDelete}
              className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">Delete</button>
            <button onClick={() => setDeleteId(null)}
              className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
