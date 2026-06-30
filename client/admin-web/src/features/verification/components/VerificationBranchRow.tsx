import { useState, useRef, useEffect } from 'react'
import { Store, MoreVertical, Loader2 } from 'lucide-react'
import type { VerificationBranch } from '../services/types'

interface VerificationBranchRowProps {
  branch: VerificationBranch
  onActivate: (id: string) => Promise<void>
  onDeactivate: (id: string) => Promise<void>
  onViewDetails: (id: string) => void
  updating: string | null
  setUpdating: (id: string | null) => void
}

export default function VerificationBranchRow({ branch, onActivate, onDeactivate, onViewDetails, updating, setUpdating }: VerificationBranchRowProps) {
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleActivate() {
    setOpen(false)
    setUpdating(`activate-${branch.id}`)
    try { await onActivate(branch.id) } finally { setUpdating(null) }
  }

  async function handleDeactivate() {
    setOpen(false)
    setUpdating(`deactivate-${branch.id}`)
    try { await onDeactivate(branch.id) } finally { setUpdating(null) }
  }

  return (
    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400">
            <Store size={15} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{branch.fullName}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400">{branch.storeBranch}</td>
      <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400">{branch.email}</td>
      <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400">{branch.contactNumber}</td>
      <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400 max-w-[180px] truncate">{branch.address}</td>
      <td className="px-4 py-3.5">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/50">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Pending
        </span>
      </td>
      <td className="px-4 py-3.5 text-right">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            disabled={updating !== null}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors disabled:opacity-30"
          >
            {updating === `activate-${branch.id}` || updating === `deactivate-${branch.id}` ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <MoreVertical size={16} />
            )}
          </button>
          {open && (
            <div
              className="absolute right-0 top-full mt-1 z-20 w-40 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden py-1 origin-top-right">
              <button onClick={handleActivate}
                className="w-full flex items-center px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                Approve
              </button>
              <button onClick={handleDeactivate}
                className="w-full flex items-center px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                Reject
              </button>
              <div className="my-1 border-t border-slate-100 dark:border-slate-700" />
              <button onClick={() => { setOpen(false); onViewDetails(branch.id) }}
                className="w-full flex items-center px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
                View Details
              </button>
            </div>
          )}
        </div>
      </td>
    </tr>
  )
}
