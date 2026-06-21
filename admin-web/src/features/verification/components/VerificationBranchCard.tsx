import { Store, Mail, Phone, MapPin, UserCheck, UserX, Loader2 } from 'lucide-react'
import type { VerificationBranch } from '../services/types'

interface VerificationBranchCardProps {
  branch: VerificationBranch
  onActivate: (id: string) => Promise<void>
  onDeactivate: (id: string) => Promise<void>
  updating: string | null
  setUpdating: (id: string | null) => void
}

export default function VerificationBranchCard({ branch, onActivate, onDeactivate, updating, setUpdating }: VerificationBranchCardProps) {
  async function handleActivate() {
    setUpdating(`activate-${branch.id}`)
    try { await onActivate(branch.id) } finally { setUpdating(null) }
  }

  async function handleDeactivate() {
    setUpdating(`deactivate-${branch.id}`)
    try { await onDeactivate(branch.id) } finally { setUpdating(null) }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-400">
            <Store size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">{branch.name}</p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-200/50 dark:bg-indigo-800/50 text-indigo-800 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-900/50">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Inactive
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Mail size={14} />
            <span className="truncate text-xs">{branch.email}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Phone size={14} />
            <span className="text-xs">{branch.contactNumber}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <MapPin size={14} />
            <span className="text-xs truncate">{branch.address}</span>
          </div>
        </div>
      </div>

      <div className="flex border-t border-slate-100 dark:border-slate-700 divide-x divide-slate-100 dark:divide-slate-700">
        <button
          onClick={handleActivate}
          disabled={updating !== null}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {updating === `activate-${branch.id}` ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <UserCheck size={15} />
          )}
          Activate
        </button>
        <button
          onClick={handleDeactivate}
          disabled={updating !== null}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {updating === `deactivate-${branch.id}` ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <UserX size={15} />
          )}
          Decline
        </button>
      </div>
    </div>
  )
}
