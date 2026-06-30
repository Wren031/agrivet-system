import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import type { VerificationAgent } from '../services/types'

interface VerificationAgentRowProps {
  agent: VerificationAgent
  onApprove: (id: string) => Promise<void>
  onReject: (id: string) => Promise<void>
  updating: string | null
  setUpdating: (id: string | null) => void
}

export default function VerificationAgentRow({ agent, onApprove, onReject, updating, setUpdating }: VerificationAgentRowProps) {
  async function handleApprove() {
    setUpdating(`approve-${agent.id}`)
    try { await onApprove(agent.id) } finally { setUpdating(null) }
  }

  async function handleReject() {
    setUpdating(`reject-${agent.id}`)
    try { await onReject(agent.id) } finally { setUpdating(null) }
  }

  return (
    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-600 dark:text-slate-400 font-semibold text-xs uppercase">
            {agent.fullName.charAt(0)}
          </div>
          <span className="text-sm font-medium text-slate-800 dark:text-slate-200">{agent.fullName}</span>
        </div>
      </td>
      <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400">{agent.email}</td>
      <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400">{agent.contactNumber}</td>
      <td className="px-4 py-3.5 text-sm text-slate-500 dark:text-slate-400">
        {agent.createdAt
          ? new Date(agent.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
          : '-'}
      </td>
      <td className="px-4 py-3.5">
        {agent.idVerificationUrl ? (
          <img
            src={agent.idVerificationUrl}
            alt="ID"
            className="w-10 h-10 rounded object-cover border border-slate-200 dark:border-slate-700"
            onError={e => { (e.target as HTMLImageElement).style.display = 'none' }}
          />
        ) : (
          <span className="text-xs text-slate-400">-</span>
        )}
      </td>
      <td className="px-4 py-3.5">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-900/50">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          Pending
        </span>
      </td>
      <td className="px-4 py-3.5 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={handleApprove}
            disabled={updating !== null}
            className="p-1.5 rounded-lg text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Approve"
          >
            {updating === `approve-${agent.id}` ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <CheckCircle size={16} />
            )}
          </button>
          <button
            onClick={handleReject}
            disabled={updating !== null}
            className="p-1.5 rounded-lg text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Reject"
          >
            {updating === `reject-${agent.id}` ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <XCircle size={16} />
            )}
          </button>
        </div>
      </td>
    </tr>
  )
}
