import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Store, BadgeCheck, CheckCircle, XCircle, Clock, AlertTriangle, Ban } from 'lucide-react'
import { fetchBranch, updateBranchStatus } from '../../../data/branch/branchService'
import type { Branch, BranchStatus } from '../../../data/branch/types'
import { useApp } from '../../../context/AppContext'
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

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchBranch(id)
      .then(setBranch)
      .catch(() => addNotification({ message: 'Failed to load branch', type: 'error' }))
      .finally(() => setLoading(false))
  }, [id, addNotification])

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
        <div className="relative">
          <select
            value={branch.status}
            onChange={e => handleStatusChange(e.target.value as BranchStatus)}
            disabled={updating === 'status'}
            className="appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-medium border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 disabled:opacity-40 cursor-pointer"
          >
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="TERMINATED">Terminated</option>
          </select>
        </div>
        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium ${statusStyles[branch.status]}`}>
          <StatusIcon size={12} />
          {branch.status.charAt(0) + branch.status.slice(1).toLowerCase()}
        </span>
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
    </DetailLayout>
  )
}
