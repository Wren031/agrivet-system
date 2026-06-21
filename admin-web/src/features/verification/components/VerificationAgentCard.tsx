import { Mail, Phone, Calendar, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import type { VerificationAgent } from '../services/types'

interface VerificationAgentCardProps {
  agent: VerificationAgent
  onApprove: (id: string) => Promise<void>
  onReject: (id: string) => Promise<void>
  updating: string | null
  setUpdating: (id: string | null) => void
}

export default function VerificationAgentCard({ agent, onApprove, onReject, updating, setUpdating }: VerificationAgentCardProps) {
  async function handleApprove() {
    setUpdating(`approve-${agent.id}`)
    try { await onApprove(agent.id) } finally { setUpdating(null) }
  }

  async function handleReject() {
    setUpdating(`reject-${agent.id}`)
    try { await onReject(agent.id) } finally { setUpdating(null) }
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase">
            {agent.fullName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm truncate">{agent.fullName}</p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-900/50">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
              Pending
            </span>
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Mail size={14} />
            <span className="truncate text-xs">{agent.email}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Phone size={14} />
            <span className="text-xs">{agent.contactNumber}</span>
          </div>
          {agent.createdAt && (
            <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
              <Calendar size={14} />
              <span className="text-xs">
                {new Date(agent.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
            </div>
          )}
        </div>

        {agent.idVerificationUrl && (
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700">
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">ID Verification</p>
            <div className="rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
              <img
                src={agent.idVerificationUrl}
                alt="ID Verification"
                className="w-full max-h-36 object-contain"
                onError={e => {
                  (e.target as HTMLImageElement).style.display = 'none'
                }}
              />
            </div>
          </div>
        )}
      </div>

      <div className="flex border-t border-slate-100 dark:border-slate-700 divide-x divide-slate-100 dark:divide-slate-700">
        <button
          onClick={handleApprove}
          disabled={updating !== null}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {updating === `approve-${agent.id}` ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <CheckCircle size={15} />
          )}
          Approve
        </button>
        <button
          onClick={handleReject}
          disabled={updating !== null}
          className="flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {updating === `reject-${agent.id}` ? (
            <Loader2 size={14} className="animate-spin" />
          ) : (
            <XCircle size={15} />
          )}
          Reject
        </button>
      </div>
    </div>
  )
}
