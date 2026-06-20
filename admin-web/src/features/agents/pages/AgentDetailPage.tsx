import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Calendar, Loader2, Trash2, ChevronDown, Building2, MapPin, DollarSign, ShoppingCart, PhilippinePeso } from 'lucide-react'
import { fetchAgent, fetchAgentCustomersWithOrders, updateStatus, deleteAgent } from '../services/agentService'
import type { Agent, AgentCustomer } from '../services/types'
import Modal from '../../../components/Modal'
import { useApp } from '../../../context/AppContext'

type AgentStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

const statusTheme: Record<AgentStatus, { label: string; dot: string; bg: string; text: string; border: string }> = {
  PENDING: { label: 'Pending', dot: 'bg-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/20', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200/60 dark:border-amber-900/50' },
  APPROVED: { label: 'Approved', dot: 'bg-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/20', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200/60 dark:border-emerald-900/50' },
  REJECTED: { label: 'Rejected', dot: 'bg-rose-500', bg: 'bg-rose-50 dark:bg-rose-950/20', text: 'text-rose-700 dark:text-rose-400', border: 'border-rose-200/60 dark:border-rose-900/50' },
}

export default function AgentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addNotification } = useApp()

  const [agent, setAgent] = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [customers, setCustomers] = useState<AgentCustomer[]>([])
  const [customersLoading, setCustomersLoading] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([
      fetchAgent(id).then(setAgent),
      fetchAgentCustomersWithOrders(id).then(setCustomers).finally(() => setCustomersLoading(false)),
    ]).catch(() => {
      addNotification({ message: 'Failed to load agent', type: 'error' })
    }).finally(() => setLoading(false))
  }, [id, addNotification])

  async function handleStatusChange(status: AgentStatus) {
    if (!agent) return
    setUpdating('status')
    try {
      const updated = await updateStatus(agent.id, { status })
      setAgent(updated)
      addNotification({ message: `Agent status updated to ${statusTheme[status].label}`, type: 'success' })
    } catch {
      addNotification({ message: 'Failed to update status', type: 'error' })
    } finally {
      setUpdating(null)
    }
  }

  async function handleDelete() {
    if (!agent) return
    setDeleting(true)
    try {
      await deleteAgent(agent.id)
      addNotification({ message: 'Agent deleted', type: 'success' })
      navigate('/agents')
    } catch {
      addNotification({ message: 'Failed to delete agent', type: 'error' })
      setDeleting(false)
    }
  }

  if (loading) {
    return <div className="text-center py-16 text-slate-400">Loading...</div>
  }

  if (!agent) {
    return (
      <div className="text-center py-16 text-slate-400 dark:text-slate-500">
        <p className="text-lg font-medium">Agent not found</p>
        <button onClick={() => navigate('/agents')}
          className="mt-4 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
          Back to Agents
        </button>
      </div>
    )
  }

  const theme = statusTheme[agent.status]

  return (
    <div>
      <button onClick={() => navigate('/agents')}
        className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Agents
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-indigo-950 dark:to-indigo-900 flex items-center justify-center text-white font-bold text-xl uppercase shadow-lg">
                {agent.fullName.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-white">{agent.fullName}</h1>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Agent Profile</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <select
                  value={agent.status}
                  onChange={e => handleStatusChange(e.target.value as AgentStatus)}
                  disabled={updating === 'status'}
                  className={`appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-bold border bg-white dark:bg-slate-800 shadow-sm focus:outline-none focus:ring-4 transition-all duration-200 disabled:opacity-40 cursor-pointer ${theme.border} ${theme.text}`}
                >
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              <button onClick={() => setShowDelete(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>

        {/* Content: two columns */}
        <div className="flex flex-col lg:flex-row">
          {/* Left Column - Profile Info */}
          <div className="lg:w-[380px] shrink-0 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
            <div className="p-6 space-y-6">
              <h3 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1 h-3 rounded-full bg-indigo-500" />
                Account Information
              </h3>

              <div className="space-y-2.5">
                <div className="flex items-center gap-3.5 px-4 py-3 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-sm shadow-slate-100/50 dark:shadow-none">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0">
                    <Mail size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email Address</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{agent.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 px-4 py-3 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-sm shadow-slate-100/50 dark:shadow-none">
                  <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0">
                    <Phone size={15} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Contact Number</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{agent.contactNumber}</p>
                  </div>
                </div>

                {agent.createdAt && (
                  <div className="flex items-center gap-3.5 px-4 py-3 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-sm shadow-slate-100/50 dark:shadow-none">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0">
                      <Calendar size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Registration Date</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                        {new Date(agent.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* ID Verification */}
              {agent.idVerificationUrl && (
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-1 h-3 rounded-full bg-indigo-500" />
                    ID Verification Asset
                  </p>
                  <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 p-2 shadow-inner">
                    <img
                      src={agent.idVerificationUrl}
                      alt="ID Verification"
                      className="w-full max-h-48 object-contain rounded-lg transition-transform duration-300 hover:scale-[1.02]"
                      onError={e => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                    <p className="hidden text-xs text-slate-400 dark:text-slate-500 py-12 text-center font-medium">Failed to process imagery asset</p>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* Right Column - Assigned Customer Accounts */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center gap-3.5 mb-6">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100/30 dark:border-indigo-900/20">
                <Building2 size={18} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-50 tracking-tight">Assigned Customer Accounts</h3>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  {agent.status === 'APPROVED' ? `${customers.length} registered partner accounts` : 'Operational limits restricted for unapproved agents.'}
                </p>
              </div>
            </div>

            {agent.status === 'APPROVED' ? (
              customersLoading ? (
                <div className="flex items-center justify-center py-24">
                  <Loader2 size={24} className="animate-spin text-indigo-500/80" />
                </div>
              ) : customers.length === 0 ? (
                <div className="text-center py-20 border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl">
                  <Building2 size={32} className="mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm font-semibold text-slate-400 dark:text-slate-500">No customers assigned</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {customers.map(c => (
                    <div key={c.id} className="bg-white dark:bg-slate-800/40 rounded-xl border border-slate-100 dark:border-slate-800/80 p-4 hover:border-indigo-500/20 dark:hover:border-indigo-400/20 hover:shadow-md hover:shadow-slate-100/40 dark:hover:shadow-none transition-all duration-200 group">
                      <div className="flex items-start gap-2 mb-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">{c.fullName}</p>
                          <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                            <MapPin size={11} className="shrink-0" /> {c.address}
                          </p>
                        </div>
                      </div>

                      {/* Order totals */}
                      <div className="flex gap-3 mb-3">
                        <div className="flex-1 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-lg px-3 py-2 border border-indigo-100/30 dark:border-indigo-900/20">
                          <p className="text-[10px] font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                            <ShoppingCart size={11} /> Orders
                          </p>
                          <p className="text-base font-bold text-slate-800 dark:text-slate-100">{c.totalOrders}</p>
                        </div>
                        <div className="flex-1 bg-emerald-50/50 dark:bg-emerald-950/20 rounded-lg px-3 py-2 border border-emerald-100/30 dark:border-emerald-900/20">
                          <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                            <PhilippinePeso size={11} /> Total
                          </p>
                          <p className="text-base font-bold text-slate-800 dark:text-slate-100">₱{c.totalOrderAmount.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 border-t border-slate-50 dark:border-slate-800/50 pt-3">
                        <p className="truncate text-[11px] flex items-center gap-1.5">
                          <Mail size={11} className="shrink-0" /> {c.email || 'N/A'}
                        </p>
                        <p className="text-[11px] flex items-center gap-1.5">
                          <Phone size={11} className="shrink-0" /> {c.phone}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-20 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/30 dark:bg-slate-900/10">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3.5">
                  <Building2 size={20} className="text-slate-400 dark:text-slate-500" />
                </div>
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Portfolio Hidden</p>
                <p className="text-xs text-slate-400 dark:text-slate-500 text-center max-w-[240px] mt-1 leading-relaxed">Approve registration criteria to authorize account pipeline assignment mapping.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Delete Agent" size="sm">
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">Are you sure you want to delete this agent? This action cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={handleDelete} disabled={deleting}
              className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium disabled:opacity-50">
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
            <button onClick={() => setShowDelete(false)}
              className="flex-1 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-sm font-medium">Cancel</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}