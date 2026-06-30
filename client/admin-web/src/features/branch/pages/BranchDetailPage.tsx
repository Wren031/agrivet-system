import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Store, Mail, Phone, MapPin, Calendar, CheckCircle, XCircle, Clock, AlertTriangle, Ban, BadgeCheck, UserX } from 'lucide-react'
import { fetchBranch, updateBranchStatus } from '../../../data/branch/branchService'
import type { Branch, BranchStatus } from '../../../data/branch/types'
import { useApp } from '../../../context/AppContext'
import Modal from '../../../components/Modal'

const statusStyles: Record<string, string> = {
  PENDING: 'bg-yellow-50 dark:bg-yellow-950/30 text-yellow-700 dark:text-yellow-400',
  APPROVED: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400',
  REJECTED: 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400',
  TERMINATED: 'bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400',
  ONLINE: 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400',
  OFFLINE: 'bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400',
}

const statusIcons: Record<string, typeof Clock> = {
  PENDING: Clock,
  APPROVED: CheckCircle,
  REJECTED: XCircle,
  TERMINATED: Ban,
  ONLINE: CheckCircle,
  OFFLINE: AlertTriangle,
}

export default function BranchDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addNotification } = useApp()

  const [branch, setBranch] = useState<Branch | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [showImage, setShowImage] = useState(false)

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
    return <div className="text-center py-16 text-surface-400">Loading...</div>
  }

  if (!branch) {
    return (
      <div className="text-center py-16 text-surface-500 dark:text-surface-400">
        <p className="text-lg font-medium">Branch not found</p>
        <button onClick={() => navigate('/branches')}
          className="mt-4 text-sm text-surface-600 dark:text-surface-400 hover:underline">
          Back to Branches
        </button>
      </div>
    )
  }

  const StatusIcon = statusIcons[branch.status] || Clock

  return (
    <div>
      <button onClick={() => navigate('/branches')}
        className="flex items-center gap-1.5 text-sm text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-200 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Branches
      </button>

      <div>
        {/* Header */}
        <div className="px-4 sm:px-6 py-5 border-b border-surface-100 dark:border-surface-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-600 dark:text-surface-400 font-bold text-lg shrink-0 uppercase">
                {branch.fullName.charAt(0)}
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-surface-900 dark:text-white">{branch.fullName}</h1>
                <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">{branch.storeBranch}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative">
                <select
                  value={branch.status}
                  onChange={e => handleStatusChange(e.target.value as BranchStatus)}
                  disabled={updating === 'status'}
                  className="appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-medium border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 disabled:opacity-40 cursor-pointer"
                >
                  <option value="APPROVED">Approve</option>
                  <option value="REJECTED">Reject</option>
                  <option value="TERMINATED">Terminate</option>
                </select>
              </div>
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium ${statusStyles[branch.status]}`}>
                <StatusIcon size={12} />
                {branch.status.charAt(0) + branch.status.slice(1).toLowerCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 sm:px-6 py-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Verification ID */}
              <div>
                <h3 className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">Verification</h3>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0 mt-0.5">
                    <BadgeCheck size={16} className="text-surface-600 dark:text-surface-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">Verification ID</p>
                    <p className="text-sm font-mono font-semibold text-surface-600 dark:text-surface-400 bg-surface-50 dark:bg-surface-950/30 px-3 py-1.5 rounded-lg inline-block">{branch.verificationId}</p>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h3 className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">Contact Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Mail size={16} className="text-surface-600 dark:text-surface-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">Email Address</p>
                      <p className="text-sm font-medium text-surface-800 dark:text-surface-200 break-all">{branch.email}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0 mt-0.5">
                      <Phone size={16} className="text-surface-600 dark:text-surface-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">Contact Number</p>
                      <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{branch.contactNumber}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">Address</h3>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin size={16} className="text-surface-600 dark:text-surface-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-surface-500 dark:text-surface-400 mb-0.5">Registered Address</p>
                    <p className="text-sm font-medium text-surface-800 dark:text-surface-200">{branch.address || 'No address on record'}</p>
                  </div>
                </div>
              </div>

              {/* Verification Image */}
              {branch.verificationImage && (
                <div>
                  <h3 className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">Verification Image</h3>
                  <div className="rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700 bg-surface-50 dark:bg-surface-900/50 p-2 max-w-md cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => setShowImage(true)}>
                    <img
                      src={branch.verificationImage}
                      alt="Verification"
                      className="w-full max-h-48 object-contain rounded-lg"
                      onError={e => {
                        (e.target as HTMLImageElement).style.display = 'none'
                        ;(e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                    <p className="hidden text-xs text-surface-500 dark:text-surface-400 py-12 text-center font-medium">Failed to load verification image</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Info */}
            <div className="space-y-6">
              {/* Store Info */}
              <div>
                <h3 className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">Store Information</h3>
                <div className="p-6 text-center">
                  <Store size={32} className="mx-auto mb-3 text-surface-400" />
                  <p className="text-lg font-bold text-surface-900 dark:text-white">{branch.storeBranch}</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">Store Name</p>
                </div>
              </div>

              {/* Account Details */}
              <div>
                <h3 className="text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-4">Account Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2.5 px-4">
                    <span className="text-xs font-medium text-surface-500 dark:text-surface-400">Status</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold ${statusStyles[branch.status]}`}>
                      <StatusIcon size={10} />
                      {branch.status.charAt(0) + branch.status.slice(1).toLowerCase()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2.5 px-4">
                    <span className="text-xs font-medium text-surface-500 dark:text-surface-400">Registered</span>
                    <span className="text-xs font-semibold text-surface-700 dark:text-surface-300">
                      {branch.date ? new Date(branch.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2.5 px-4">
                    <span className="text-xs font-medium text-surface-500 dark:text-surface-400">Branch ID</span>
                    <span className="text-xs font-mono font-semibold text-surface-700 dark:text-surface-300">{branch.id.slice(0, 12)}...</span>
                  </div>
                  <div className="flex items-center justify-between py-2.5 px-4">
                    <span className="text-xs font-medium text-surface-500 dark:text-surface-400">Verification ID</span>
                    <span className="text-xs font-mono font-semibold text-surface-600 dark:text-surface-400">{branch.verificationId}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal open={showImage} onClose={() => setShowImage(false)} title="Verification Image" size="lg">
        <div className="flex items-center justify-center">
          <img
            src={branch.verificationImage}
            alt="Verification"
            className="max-w-full max-h-[70vh] object-contain rounded-lg"
            onError={e => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>
      </Modal>
    </div>
  )
}
