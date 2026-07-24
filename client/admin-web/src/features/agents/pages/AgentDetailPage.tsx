import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Loader2, Trash2, Building2, MapPin, Navigation, Users, Printer } from 'lucide-react'
import { fetchAgent, fetchAgentCustomers, updateStatus, deleteAgent } from '../services/agentService'
import { apiFetch } from '../../../config/apiClient'
import type { Agent, AgentStatus } from '../services/types'
import Modal from '../../../components/Modal'
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
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const statusStyles: Record<AgentStatus, string> = {
  PENDING: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400',
  APPROVED: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
  REJECTED: 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400',
  TERMINATED: 'bg-surface-100 text-surface-600 dark:bg-surface-800 dark:text-surface-400',
  ONLINE: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400',
  OFFLINE: 'bg-surface-100 text-surface-500 dark:bg-surface-800 dark:text-surface-400',
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

function LocationTabContent({ location, agentName }: { location: AgentLocationData | null; agentName?: string }) {
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
        <p style="font-weight: 700; margin: 0 0 4px; font-size: 14px; color: #1e293b;">${agentName || 'Agent'}</p>
        <p style="margin: 0; font-size: 12px; color: #64748b;">${address}</p>
        <p style="margin: 6px 0 0; font-size: 11px; color: #94a3b8;">Updated: ${new Date(location.updatedAt).toLocaleString()}</p>
      </div>
    `).openPopup()

    mapInstance.current = map
    return () => { map.remove(); mapInstance.current = null }
  }, [location])

  if (!location) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-surface-500 dark:text-surface-400">
        <MapPin size={48} className="mb-4 opacity-40" />
        <p className="text-sm font-semibold">No Location Data</p>
        <p className="text-xs mt-1">This agent has not reported any location yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Navigation size={16} className="text-surface-500" />
          <h3 className="text-sm font-semibold text-surface-700 dark:text-surface-300">Real-time Location</h3>
        </div>
        <span className="text-[11px] text-surface-500 dark:text-surface-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {new Date(location.updatedAt).toLocaleString()}
        </span>
      </div>
      <div className="border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden">
        <div ref={mapRef} className="w-full h-[500px]" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <p className="text-[11px] text-surface-500 dark:text-surface-400 font-semibold uppercase tracking-wider">Latitude</p>
          <p className="text-sm font-semibold text-surface-700 dark:text-surface-200 mt-0.5">{location.latitude.toFixed(4)}</p>
        </div>
        <div>
          <p className="text-[11px] text-surface-500 dark:text-surface-400 font-semibold uppercase tracking-wider">Longitude</p>
          <p className="text-sm font-semibold text-surface-700 dark:text-surface-200 mt-0.5">{location.longitude.toFixed(4)}</p>
        </div>
        <div>
          <p className="text-[11px] text-surface-500 dark:text-surface-400 font-semibold uppercase tracking-wider">Address</p>
          <p className="text-sm font-semibold text-surface-700 dark:text-surface-200 mt-0.5 truncate">{location.address || 'Not resolved'}</p>
        </div>
      </div>
    </div>
  )
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

  if (loading) {
    return <DetailLayout loading backTo="/agents" backLabel="Back to Agents" />
  }

  if (!agent) {
    return (
      <DetailLayout backTo="/agents" backLabel="Back to Agents">
        <DetailEmptyState
          
          title="Agent Not Found"
          message="The agent record you are looking for could not be found."
          backLabel="Back to Agents"
          onBack={() => navigate('/agents')}
        />
      </DetailLayout>
    )
  }

  return (
    <DetailLayout backTo="/agents" backLabel="Back to Agents">
      <DetailHeader
        title={agent.fullName}
        subtitle="Agent Profile"
        avatar={agent.fullName.charAt(0)}
      >
        <div className="relative">
          <select
            value={agent.status}
            onChange={e => handleStatusChange(e.target.value as AgentStatus)}
            disabled={updating === 'status'}
            className="appearance-none pl-3 pr-8 py-1.5 rounded-lg text-xs font-medium border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 disabled:opacity-40 cursor-pointer"
          >
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="TERMINATED">Terminated</option>
          </select>
        </div>
        <span className={`px-3 py-1 rounded-md text-xs font-medium ${statusStyles[agent.status]}`}>{agent.status}</span>
        <button onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-surface-600 dark:text-surface-400 border border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
          <Printer size={14} /> Print
        </button>
        <button onClick={() => setShowDelete(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 bg-white dark:bg-surface-800 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
          <Trash2 size={14} /> Delete
        </button>
      </DetailHeader>

      {/* Tab Navigation */}
      <div className="border-b border-surface-200 dark:border-surface-700 mb-6">
        <nav className="flex gap-6">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 pb-3 pt-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.key
                    ? 'border-surface-800 text-surface-800 dark:border-white dark:text-white'
                    : 'border-transparent text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <DetailSection title="Contact Information" >
              <DetailGrid cols={2}>
                <DetailField  label="Email Address" value={agent.email} />
                <DetailField label="Contact Number" value={agent.contactNumber} />
              </DetailGrid>
            </DetailSection>

            <DetailSection title="Address Information" >
              <DetailField  label="Registered Address" value={agent.address} />
            </DetailSection>

            {agent.idVerificationUrl && (
              <DetailSection title="ID Verification" >
                <DetailImage
                  src={agent.idVerificationUrl}
                  alt="ID Verification"
                  label="ID Verification"
                />
              </DetailSection>
            )}
          </div>

          <div className="space-y-6">
            <DetailSection title="Statistics" >
              {customerCount === null ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 size={24} className="animate-spin text-surface-400" />
                </div>
              ) : (
                <div className="text-center py-2">
                  <Users size={36} className="mx-auto mb-3 text-surface-300 dark:text-surface-600" />
                  <p className="text-3xl font-bold text-surface-900 dark:text-white">{customerCount}</p>
                  <p className="text-sm text-surface-500 dark:text-surface-400 mt-1">
                    {customerCount === 1 ? 'Customer' : 'Customers'}
                  </p>
                </div>
              )}
            </DetailSection>

            <DetailSection title="Account Details" >
              <div className="flex items-center justify-between py-2.5">
                <span className="text-xs font-medium text-surface-500 dark:text-surface-400">Status</span>
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${statusStyles[agent.status]}`}>{agent.status}</span>
              </div>
              <DetailField inline label="Registered" value={
                agent.createdAt
                  ? new Date(agent.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
                  : null
              } />
              <DetailField inline label="Agent ID" value={`${agent.id.slice(0, 12)}...`} mono />
            </DetailSection>
          </div>
        </div>
      )}

      {activeTab === 'location' && (
        <DetailSection padding={false}>
          <LocationTabContent location={location} agentName={agent.fullName} />
        </DetailSection>
      )}

      <Modal open={showDelete} onClose={() => setShowDelete(false)} title="Delete Agent" size="sm">
        <div className="text-center">
          <p className="text-sm text-surface-600 dark:text-surface-300 mb-6">Are you sure you want to delete this agent? This action cannot be undone.</p>
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
