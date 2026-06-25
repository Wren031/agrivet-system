import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Mail, Phone, Calendar, Loader2, Trash2, ChevronDown, Building2, MapPin, Navigation, Users, MapPinned, BadgeCheck, XCircle, Clock, UserCheck, UserX } from 'lucide-react'
import { fetchAgent, fetchAgentCustomers, updateStatus, deleteAgent } from '../services/agentService'
import { apiFetch } from '../../../config/apiClient'
import type { Agent, AgentStatus } from '../services/types'
import Modal from '../../../components/Modal'
import { useApp } from '../../../context/AppContext'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const statusStyles: Record<AgentStatus, string> = {
  PENDING: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-400',
  APPROVED: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
  REJECTED: 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400',
  TERMINATED: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  ONLINE: 'bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400',
  OFFLINE: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400',
}

const tabs = [
  { key: 'profile', label: 'Profile', icon: Building2 },
  { key: 'location', label: 'Live Location', icon: MapPin },
] as const

type TabKey = (typeof tabs)[number]['key']

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

interface AgentLocationData {
  latitude: number
  longitude: number
  address: string | null
  updatedAt: string
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
  const [customerCount, setCustomerCount] = useState<number | null>(null)
  const [location, setLocation] = useState<AgentLocationData | null>(null)
  const [activeTab, setActiveTab] = useState<TabKey>('profile')

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchAgent(id)
      .then(setAgent)
      .catch(() => addNotification({ message: 'Failed to load agent', type: 'error' }))
      .finally(() => setLoading(false))
  }, [id, addNotification])

  useEffect(() => {
    if (!id) return
    fetchAgentCustomers(id)
      .then(customers => setCustomerCount(customers.length))
      .catch(() => setCustomerCount(0))
  }, [id])

  useEffect(() => {
    if (!id) return
    apiFetch<any>(`/agents/${id}/location`)
      .then(data => { if (data?.latitude) setLocation(data) })
      .catch(() => {})
  }, [id])

  async function handleStatusChange(status: AgentStatus) {
    if (!agent) return
    setUpdating('status')
    try {
      const updated = await updateStatus(agent.id, { status })
      setAgent(updated)
      addNotification({ message: `Agent status updated to ${status}`, type: 'success' })
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

  function LocationTab() {
    const mapRef = useRef<HTMLDivElement>(null)
    const mapInstance = useRef<L.Map | null>(null)

    useEffect(() => {
      if (!mapRef.current || mapInstance.current || !location) return

      const map = L.map(mapRef.current, {
        center: [location.latitude, location.longitude],
        zoom: 15,
        zoomControl: true,
      })

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map)

      const address = location.address || `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`
      const marker = L.marker([location.latitude, location.longitude]).addTo(map)
      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; text-align: center; min-width: 200px;">
          <p style="font-weight: 700; margin: 0 0 4px; font-size: 14px; color: #1e293b;">${agent?.fullName || 'Agent'}</p>
          <p style="margin: 0; font-size: 12px; color: #64748b;">${address}</p>
          <p style="margin: 6px 0 0; font-size: 11px; color: #94a3b8;">Updated: ${new Date(location.updatedAt).toLocaleString()}</p>
        </div>
      `).openPopup()

      mapInstance.current = map
      return () => { map.remove(); mapInstance.current = null }
    }, [location])

    if (!location) {
      return (
        <div className="p-4 sm:p-6">
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 dark:text-slate-500">
            <MapPin size={48} className="mb-4 opacity-40" />
            <p className="text-sm font-semibold">No Location Data</p>
            <p className="text-xs mt-1">This agent has not reported any location yet.</p>
          </div>
        </div>
      )
    }

    return (
      <div className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Navigation size={16} className="text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Real-time Location Tracking</h3>
          </div>
          <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Updated: {new Date(location.updatedAt).toLocaleString()}
          </span>
        </div>
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
          <div ref={mapRef} className="w-full h-[500px]" />
        </div>
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg px-4 py-3 border border-slate-100 dark:border-slate-700">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Latitude</p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-0.5">{location.latitude.toFixed(4)}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg px-4 py-3 border border-slate-100 dark:border-slate-700">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Longitude</p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-0.5">{location.longitude.toFixed(4)}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg px-4 py-3 border border-slate-100 dark:border-slate-700">
            <p className="text-[11px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">Address</p>
            <p className="text-sm font-bold text-slate-700 dark:text-slate-200 mt-0.5 truncate">{location.address || 'Address not resolved'}</p>
          </div>
        </div>
      </div>
    )
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

  return (
    <div>
      <button onClick={() => navigate('/agents')}
        className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 mb-6 transition-colors">
        <ArrowLeft size={16} /> Back to Agents
      </button>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-5 border-b border-slate-100 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold text-lg shrink-0 uppercase">
                {agent.fullName.charAt(0)}
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-white">{agent.fullName}</h1>
                <p className="text-sm text-slate-400 dark:text-slate-500 mt-0.5">Agent Profile</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="relative">
                <select
                  value={agent.status}
                  onChange={e => handleStatusChange(e.target.value as AgentStatus)}
                  disabled={updating === 'status'}
                  className="appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-40 cursor-pointer"
                >
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="TERMINATED">Terminated</option>
                  <option value="ONLINE">Online</option>
                  <option value="OFFLINE">Offline</option>
                </select>
                <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[agent.status]}`}>{agent.status}</span>
              <button onClick={() => setShowDelete(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/30 transition-colors">
                <Trash2 size={14} /> Delete
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-slate-200 dark:border-slate-700">
          <nav className="flex gap-6 px-4 sm:px-6">
            {tabs.map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex items-center gap-2 pb-3 pt-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400'
                      : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              )
            })}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="px-4 sm:px-6 py-5">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Contact & Personal Info */}
              <div className="lg:col-span-2 space-y-6">
                {/* Contact Information */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Contact Information</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Mail size={16} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Email Address</p>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200 break-all">{agent.email}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center shrink-0 mt-0.5">
                        <Phone size={16} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Contact Number</p>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{agent.contactNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Address Information</h3>
                  {agent.address ? (
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center shrink-0 mt-0.5">
                        <MapPin size={16} className="text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs text-slate-400 dark:text-slate-500 mb-0.5">Registered Address</p>
                        <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{agent.address}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 dark:text-slate-500">No address on record</p>
                  )}
                </div>

                {/* ID Verification */}
                {agent.idVerificationUrl && (
                  <div>
                    <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">ID Verification</h3>
                    <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 p-2 max-w-md">
                      <img
                        src={agent.idVerificationUrl}
                        alt="ID Verification"
                        className="w-full max-h-48 object-contain rounded-lg"
                        onError={e => {
                          (e.target as HTMLImageElement).style.display = 'none';
                          (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden')
                        }}
                      />
                      <p className="hidden text-xs text-slate-400 dark:text-slate-500 py-12 text-center font-medium">Failed to load verification document</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column - Stats & Info */}
              <div className="space-y-6">
                {/* Customer Count */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Statistics</h3>
                  <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 text-center shadow-sm">
                    <Users size={32} className="mx-auto mb-3 text-indigo-400" />
                    {customerCount === null ? (
                      <Loader2 size={28} className="mx-auto animate-spin text-indigo-400" />
                    ) : (
                      <>
                        <p className="text-3xl font-bold text-slate-800 dark:text-white">{customerCount}</p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                          {customerCount === 1 ? 'Customer' : 'Customers'}
                        </p>
                      </>
                    )}
                  </div>
                </div>

                {/* Account Info */}
                <div>
                  <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-4">Account Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2.5 px-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Status</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${statusStyles[agent.status]}`}>{agent.status}</span>
                    </div>
                    {agent.createdAt && (
                      <div className="flex items-center justify-between py-2.5 px-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Registered</span>
                        <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                          {new Date(agent.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-between py-2.5 px-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Agent ID</span>
                      <span className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">{agent.id.slice(0, 12)}...</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'location' && <LocationTab />}
      </div>

      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Delete Agent" size="sm">
        <div className="text-center">
          <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">Are you sure you want to delete this agent? This action cannot be undone.</p>
          <div className="flex gap-3">
            <button onClick={handleDelete} disabled={deleting}
              className="flex-1 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50">
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
