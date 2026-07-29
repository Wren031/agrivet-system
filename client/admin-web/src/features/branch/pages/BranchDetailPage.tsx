import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Store, BadgeCheck, CheckCircle, XCircle, Clock, AlertTriangle, Ban, MoreVertical, Trash2, Check, X } from 'lucide-react'
import { fetchBranch, updateBranchStatus, deleteBranch } from '../../../data/branch/branchService'
import type { Branch, BranchStatus } from '../../../data/branch/types'
import { useApp } from '../../../context/AppContext'
import Modal from '../../../components/Modal'
import {
  DetailLayout,
  DetailHeader,
  DetailSection,
  DetailField,
  DetailGrid,
  DetailImage,
  DetailEmptyState,
} from '../../../components/detail'

const statusIcons: Record<string, typeof Clock> = {
  PENDING: Clock,
  APPROVED: CheckCircle,
  REJECTED: XCircle,
  TERMINATED: Ban,
  ONLINE: CheckCircle,
  OFFLINE: AlertTriangle,
}

const statusStyles: Record<string, string> = {
  PENDING: 'bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400',
  APPROVED: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400',
  REJECTED: 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400',
  TERMINATED: 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400',
  ONLINE: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400',
  OFFLINE: 'bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400',
}

export default function BranchDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addNotification } = useApp()

  const [branch, setBranch] = useState<Branch | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [showDelete, setShowDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showStatusMenu, setShowStatusMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchBranch(id)
      .then(setBranch)
      .catch(() => addNotification({ message: 'Failed to load branch', type: 'error' }))
      .finally(() => setLoading(false))
  }, [id, addNotification])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false)
        setShowStatusMenu(false)
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  async function handleDelete() {
    if (!branch) return
    setDeleting(true)
    try {
      await deleteBranch(branch.id)
      addNotification({ message: 'Branch deleted', type: 'success' })
      navigate('/branches')
    } catch {
      addNotification({ message: 'Failed to delete branch', type: 'error' })
      setDeleting(false)
    }
  }

  async function handleStatusChange(status: BranchStatus) {
    if (!branch) return
    setUpdating('status')
    try {
      const updated = await updateBranchStatus(branch.id, status)
      setBranch(updated)
      addNotification({ message: `Branch status updated to ${status}`, type: 'success' })
    } catch {
      addNotification({ message: 'Failed to update status', type: 'error' })
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <DetailLayout loading backTo="/branches" backLabel="Back to Branches" />
    )
  }

  if (!branch) {
    return (
      <DetailLayout backTo="/branches" backLabel="Back to Branches">
        <DetailEmptyState
          
          title="Branch Not Found"
          message="The branch record you are looking for could not be found."
          backLabel="Back to Branches"
          onBack={() => navigate('/branches')}
        />
      </DetailLayout>
    )
  }

  const StatusIcon = statusIcons[branch.status] || Clock

  return (
    <DetailLayout backTo="/branches" backLabel="Back to Branches">
      <DetailHeader
        title={branch.fullName}
        subtitle={branch.storeBranch}
        avatar={branch.fullName.charAt(0)}
      >
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium ${statusStyles[branch.status]}`}>
          <StatusIcon size={12} />
          {branch.status.charAt(0) + branch.status.slice(1).toLowerCase()}
        </span>
        <div className="relative" ref={menuRef}>
          <button onClick={() => { setMenuOpen(!menuOpen); setShowStatusMenu(false) }}
            className="flex items-center justify-center w-8 h-8 rounded-lg text-surface-500 dark:text-surface-400 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors">
            <MoreVertical size={15} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-xl shadow-lg shadow-surface-950/10 z-50 py-1.5 animate-fade-in origin-top-right">
              <button
                onClick={() => setShowStatusMenu(!showStatusMenu)}
                className="w-full flex items-center justify-between px-3.5 py-2 text-sm text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-700/50 transition-colors"
              >
                <span className="flex items-center gap-2.5">
                  <svg className="w-4 h-4 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                  </svg>
                  Update Status
                </span>
                <svg className={`w-3.5 h-3.5 text-surface-400 transition-transform ${showStatusMenu ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              {showStatusMenu && (
                <div className="mx-2 mb-1 bg-surface-50 dark:bg-surface-900/50 rounded-lg overflow-hidden">
                  {(['APPROVED', 'REJECTED', 'TERMINATED'] as BranchStatus[]).map(s => (
                    <button
                      key={s}
                      onClick={() => { handleStatusChange(s); setMenuOpen(false); setShowStatusMenu(false) }}
                      disabled={updating === 'status' || s === branch.status}
                      className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium transition-colors ${
                        s === branch.status
                          ? 'text-surface-400 dark:text-surface-500 cursor-not-allowed'
                          : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
                      }`}
                    >
                      {s === 'APPROVED' && <Check size={13} className="text-emerald-500" />}
                      {s === 'REJECTED' && <X size={13} className="text-red-500" />}
                      {s === 'TERMINATED' && <Ban size={13} className="text-surface-500" />}
                      <span>{s.charAt(0) + s.slice(1).toLowerCase()}</span>
                    </button>
                  ))}
                </div>
              )}
              <div className="h-px bg-surface-100 dark:bg-surface-700 mx-3 my-1" />
              <button
                onClick={() => { setShowDelete(true); setMenuOpen(false) }}
                className="w-full flex items-center gap-2.5 px-3.5 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <Trash2 size={15} />
                Delete Branch
              </button>
            </div>
          )}
        </div>
      </DetailHeader>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DetailSection title="Verification" >
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-surface-50 dark:bg-surface-800 flex items-center justify-center shrink-0 mt-0.5">
                <BadgeCheck size={16} className="text-surface-500 dark:text-surface-400" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">Verification ID</p>
                <p className="text-sm font-mono font-semibold text-surface-600 dark:text-surface-400 bg-surface-50 dark:bg-surface-950/30 px-3 py-1.5 rounded-lg inline-block">{branch.verificationId}</p>
              </div>
            </div>
          </DetailSection>

          <DetailSection title="Contact Information" >
            <DetailGrid cols={2}>
              <DetailField  label="Email Address" value={branch.email} />
              <DetailField label="Contact Number" value={branch.contactNumber} />
            </DetailGrid>
          </DetailSection>

          <DetailSection title="Address" >
            <DetailField  label="Registered Address" value={branch.address} />
          </DetailSection>

          {branch.verificationImage && (
            <DetailSection title="Verification Image" >
              <DetailImage
                src={branch.verificationImage}
                alt="Verification"
                label="Verification Image"
              />
            </DetailSection>
          )}
        </div>

        <div className="space-y-6">
          <DetailSection title="Store Information" >
            <div className="text-center py-2">
              <Store size={36} className="mx-auto mb-3 text-surface-300 dark:text-surface-600" />
              <p className="text-lg font-bold text-surface-900 dark:text-white">{branch.storeBranch}</p>
              <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Store Name</p>
            </div>
          </DetailSection>

          <DetailSection title="Account Details" >
            <div className="flex items-center justify-between py-2.5">
              <span className="text-xs font-medium text-surface-500 dark:text-surface-400">Status</span>
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${statusStyles[branch.status]}`}>
                <StatusIcon size={10} />
                {branch.status.charAt(0) + branch.status.slice(1).toLowerCase()}
              </span>
            </div>
            <DetailField inline label="Registered" value={
              branch.date
                ? new Date(branch.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                : null
            } />
          </DetailSection>
        </div>
      </div>

      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Delete Branch" size="sm">
        <div className="text-center">
          <p className="text-sm text-surface-600 dark:text-surface-300 mb-6">Are you sure you want to delete this branch? This action cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={handleDelete} disabled={deleting}
              className="flex-1 py-2.5 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-lg hover:bg-surface-800 dark:hover:bg-surface-200 transition-colors text-sm font-medium disabled:opacity-50">
              {deleting ? 'Deleting...' : 'Delete'}
            </button>
            <button onClick={() => setShowDelete(false)}
              className="flex-1 py-2.5 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors text-sm font-medium">Cancel</button>
          </div>
        </div>
      </Modal>
    </DetailLayout>
  )
}
