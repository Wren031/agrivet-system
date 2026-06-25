import { useState, useEffect } from 'react'
import { Mail, Phone, Calendar, Loader2, Trash2, ChevronDown, Building2, MapPin, X } from 'lucide-react'
import { fetchAgentCustomers } from '../services/agentService'
import type { Agent, AgentCustomer, AgentStatus } from '../services/types'

const statusTheme: Record<AgentStatus, { label: string; dot: string; bg: string; text: string; border: string; selectBorder: string }> = {
  PENDING: { label: 'Pending', dot: 'bg-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/20', text: 'text-amber-700 dark:text-amber-400', border: 'border-amber-200/60 dark:border-amber-900/50', selectBorder: 'focus:ring-amber-500/30 focus:border-amber-500 border-slate-200 dark:border-slate-700' },
  APPROVED: { label: 'Approved', dot: 'bg-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/20', text: 'text-emerald-700 dark:text-emerald-400', border: 'border-emerald-200/60 dark:border-emerald-900/50', selectBorder: 'focus:ring-emerald-500/30 focus:border-emerald-500 border-slate-200 dark:border-slate-700' },
  REJECTED: { label: 'Rejected', dot: 'bg-red-500', bg: 'bg-red-50 dark:bg-red-950/20', text: 'text-red-700 dark:text-red-400', border: 'border-red-200/60 dark:border-red-900/50', selectBorder: 'focus:ring-red-500/30 focus:border-red-500 border-slate-200 dark:border-slate-700' },
  TERMINATED: { label: 'Terminated', dot: 'bg-slate-500', bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-600 dark:text-slate-400', border: 'border-slate-200/60 dark:border-slate-700', selectBorder: 'focus:ring-slate-500/30 focus:border-slate-500 border-slate-200 dark:border-slate-700' },
  ONLINE: { label: 'Online', dot: 'bg-green-500', bg: 'bg-green-50 dark:bg-green-950/20', text: 'text-green-700 dark:text-green-400', border: 'border-green-200/60 dark:border-green-900/50', selectBorder: 'focus:ring-green-500/30 focus:border-green-500 border-slate-200 dark:border-slate-700' },
  OFFLINE: { label: 'Offline', dot: 'bg-slate-400', bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-500 dark:text-slate-400', border: 'border-slate-200/60 dark:border-slate-700', selectBorder: 'focus:ring-slate-400/30 focus:border-slate-400 border-slate-200 dark:border-slate-700' },
}

interface AgentDrawerProps {
  agent: Agent | null
  open: boolean
  onClose: () => void
  onStatusChange: (id: string, status: AgentStatus) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

export default function AgentDrawer({ agent, open, onClose, onStatusChange, onDelete }: AgentDrawerProps) {
  const [updating, setUpdating] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [customers, setCustomers] = useState<AgentCustomer[]>([])
  const [customersLoading, setCustomersLoading] = useState(false)

  // Cache the last available agent details to prevent visual glitches/emptying layout content while sliding shut
  const [activeAgent, setActiveAgent] = useState<Agent | null>(null)

  useEffect(() => {
    if (agent) {
      setActiveAgent(agent)
    }
  }, [agent])

  useEffect(() => {
    if (open && activeAgent?.status === 'APPROVED') {
      setCustomersLoading(true)
      fetchAgentCustomers(activeAgent.id).then(setCustomers).finally(() => setCustomersLoading(false))
    } else if (!open) {
      const timer = setTimeout(() => setCustomers([]), 300) // Clear out content after transition finishes
      return () => clearTimeout(timer)
    }
  }, [open, activeAgent?.id, activeAgent?.status])

  if (!activeAgent) return null

  const theme = statusTheme[activeAgent.status]

  async function handleStatusChange(status: AgentStatus) {
    if (!activeAgent) return
    setUpdating('status')
    try {
      await onStatusChange(activeAgent.id, status)
    } finally {
      setUpdating(null)
    }
  }

  async function handleDelete() {
    if (!activeAgent) return
    setUpdating('delete')
    try {
      await onDelete(activeAgent.id)
    } finally {
      setUpdating(null)
    }
  }

  function handleClose() {
    setConfirmDelete(false)
    onClose()
  }

  return (
    <>
      {/* Backdrop overlay */}
      <div 
        className={`fixed inset-0 z-40 transition-all duration-500 ease-in-out ${
          open 
            ? 'backdrop-blur-md bg-slate-900/40 opacity-100 pointer-events-auto' 
            : 'backdrop-blur-none bg-slate-900/0 opacity-0 pointer-events-none'
        }`} 
        onClick={handleClose} 
      />

      {/* Main Slideout Container */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-5xl bg-white dark:bg-slate-900 shadow-[0_0_50px_-12px_rgba(0,0,0,0.3)] z-50 transform transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          
          {/* Header Panel */}
          <div className="flex items-center justify-between px-4 sm:px-6 py-5 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-50 tracking-tight">Agent Profile Management</h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">Review credentials and adjust operational criteria parameters.</p>
            </div>
            <button onClick={handleClose} className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all duration-200">
              <X size={18} />
            </button>
          </div>

          {/* Interactive Core */}
          <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
            
            {/* Left Column Profile Section */}
            <div className="w-full lg:w-[380px] shrink-0 overflow-y-auto border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
              <div className="p-4 sm:p-6 space-y-6">
                
                {/* Visual Identity Hero Card */}
                <div className="bg-gradient-to-br from-indigo-600 to-indigo-800 dark:from-indigo-950 dark:to-indigo-900 rounded-2xl p-6 shadow-xl shadow-indigo-500/10 dark:shadow-none border border-indigo-200/10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white font-bold text-xl shadow-inner border border-white/20 uppercase">
                      {activeAgent.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-bold text-white truncate leading-snug">{activeAgent.fullName}</h3>
                      <div className={`inline-flex items-center gap-1.5 mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${theme.bg} ${theme.text} ${theme.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${theme.dot}`} />
                        {theme.label}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Primary Data Points Container */}
                <div className="space-y-2.5">
                  <div className="flex items-center gap-3.5 px-4 py-3 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-sm shadow-slate-100/50 dark:shadow-none">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0">
                      <Mail size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Email Address</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{activeAgent.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3.5 px-4 py-3 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-sm shadow-slate-100/50 dark:shadow-none">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0">
                      <Phone size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Contact Number</p>
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{activeAgent.contactNumber}</p>
                    </div>
                  </div>

                  {activeAgent.createdAt && (
                    <div className="flex items-center gap-3.5 px-4 py-3 bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800/60 shadow-sm shadow-slate-100/50 dark:shadow-none">
                      <div className="w-9 h-9 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 shrink-0">
                        <Calendar size={15} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Registration Date</p>
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                          {new Date(activeAgent.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Identity Document Verification Wrapper */}
                {activeAgent.idVerificationUrl && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1 h-3 rounded-full bg-indigo-500" />
                      ID Verification Asset
                    </p>
                    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/40 p-2 shadow-inner">
                      <img 
                        src={activeAgent.idVerificationUrl} 
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

                {/* Status Assignment & Record Management Block */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80 flex gap-3 items-end">
                  <div className="flex-1">
                    <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider">Account Action Status</p>
                    <div className="relative">
                      <select 
                        value={activeAgent.status}
                        onChange={e => handleStatusChange(e.target.value as AgentStatus)}
                        disabled={updating === 'status'}
                        className={`w-full appearance-none pl-3 pr-9 py-2.5 rounded-xl text-xs font-bold border bg-white dark:bg-slate-800 shadow-sm focus:outline-none focus:ring-4 transition-all duration-200 disabled:opacity-40 cursor-pointer ${theme.selectBorder} ${theme.text}`}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="TERMINATED">Terminated</option>
                        <option value="ONLINE">Online</option>
                        <option value="OFFLINE">Offline</option>
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  <div className="w-[120px] shrink-0">
                    {!confirmDelete ? (
                      <button 
                        onClick={() => setConfirmDelete(true)}
                        className="w-full flex items-center justify-center gap-1.5 h-[38px] text-xs font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30 rounded-xl hover:bg-indigo-100 dark:hover:bg-indigo-950/40 transition-all duration-200"
                      >
                        <Trash2 size={13} /> Terminate
                      </button>
                    ) : (
                      <div className="flex gap-1">
                        <button 
                          onClick={() => setConfirmDelete(false)}
                          className="flex-1 h-[38px] text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={handleDelete} 
                          disabled={updating === 'delete'}
                          className="flex-1 flex items-center justify-center h-[38px] text-[11px] font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50 shadow-sm shadow-indigo-600/20"
                        >
                          {updating === 'delete' ? <Loader2 size={12} className="animate-spin" /> : 'Confirm'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Right Column Contextual Dynamic Space */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="flex items-center gap-3.5 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center text-indigo-600 dark:text-indigo-400 border border-indigo-100/30 dark:border-indigo-900/20">
                  <Building2 size={18} />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-slate-50 tracking-tight">Assigned Customer Accounts</h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    {activeAgent.status === 'APPROVED' ? `${customers.length} registered partners link accounts` : 'Operational limits restricted for unapproved agents.'}
                  </p>
                </div>
              </div>

              {activeAgent.status === 'APPROVED' ? (
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
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors truncate">{c.fullName}</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium mt-0.5 flex items-center gap-1">
                              <MapPin size={11} className="shrink-0" /> {c.address}
                            </p>
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
      </div>
    </>
  )
}