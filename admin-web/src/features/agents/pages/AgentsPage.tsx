import { useState, useMemo, useRef, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Mail, Phone, ChevronLeft, ChevronRight, Search, Eye, MapPin, List, Navigation, MapPinned, Clock } from 'lucide-react'
import { useAgents } from '../hooks/useAgents'
import { useApp } from '../../../context/AppContext'
import { SkeletonCards } from '../../../components/Skeleton'
import type { Agent, AgentWithLocation, AgentStatus } from '../services/types'
import { fetchAgentsWithLocations } from '../services/agentService'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const PAGE_SIZE = 8

const statusConfig: Record<AgentStatus, { label: string; card: string }> = {
  PENDING: { label: 'Pending', card: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20' },
  APPROVED: { label: 'Approved', card: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/20' },
  REJECTED: { label: 'Rejected', card: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20' },
  TERMINATED: { label: 'Terminated', card: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800' },
  ONLINE: { label: 'Online', card: 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20' },
  OFFLINE: { label: 'Offline', card: 'text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800' },
}

const tabs = [
  { key: 'list', label: 'List', icon: List },
  { key: 'map', label: 'Map View', icon: MapPin },
  { key: 'location', label: 'Agent Current Location', icon: MapPinned },
] as const

type TabKey = (typeof tabs)[number]['key']

// Fix Leaflet default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function AgentMap({ locations }: { locations: AgentWithLocation[] }) {
  const navigate = useNavigate()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)

  const markers = useMemo(() =>
    locations.map(agent => ({
      agent,
      lat: agent.location.latitude,
      lng: agent.location.longitude,
    })),
    [locations]
  )

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    const map = L.map(mapRef.current, {
      zoom: 12,
      zoomControl: true,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map)

    markers.forEach(({ agent, lat, lng }) => {
      const address = agent.location.address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`
      const lastUpdate = new Date(agent.location.updatedAt).toLocaleString()
      const marker = L.marker([lat, lng]).addTo(map)
      marker.bindPopup(`
        <div style="font-family: system-ui, sans-serif; min-width: 260px;">
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e2e8f0;">
            <div style="width: 36px; height: 36px; border-radius: 10px; background: #eef2ff; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 14px; color: #4f46e5; text-transform: uppercase; flex-shrink: 0;">
              ${agent.fullName.charAt(0)}
            </div>
            <div>
              <p style="font-weight: 700; margin: 0; font-size: 14px; color: #1e293b;">${agent.fullName}</p>
              <p style="margin: 2px 0 0; font-size: 11px; color: #64748b;">${agent.email}</p>
            </div>
          </div>
          <div style="display: flex; gap: 6px; margin-bottom: 10px;">
            <span style="padding: 2px 10px; border-radius: 9999px; font-size: 11px; font-weight: 600; background: #eef2ff; color: #4f46e5;">${agent.status}</span>
            <span style="padding: 2px 10px; border-radius: 9999px; font-size: 11px; font-weight: 600; background: #f1f5f9; color: #64748b;">${agent.contactNumber}</span>
          </div>
          <div style="display: flex; align-items: flex-start; gap: 8px; margin-bottom: 10px; padding: 8px; background: #f8fafc; border-radius: 8px;">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-top: 1px; flex-shrink: 0;"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
            <div>
              <p style="margin: 0; font-size: 12px; font-weight: 600; color: #1e293b;">Current Location</p>
              <p style="margin: 2px 0 0; font-size: 11px; color: #64748b; line-height: 1.4;">${address}</p>
              <p style="margin: 4px 0 0; font-size: 10px; color: #94a3b8;">Updated: ${lastUpdate}</p>
            </div>
          </div>
          <a href="/agents/${agent.id}" style="display: block; text-align: center; padding: 7px 16px; background: #4f46e5; color: white; border-radius: 8px; text-decoration: none; font-size: 12px; font-weight: 600;">View Profile</a>
        </div>
      `)
    })

    mapInstance.current = map

    if (markers.length > 0) {
      const group = L.featureGroup(markers.map(m => L.marker([m.lat, m.lng])))
      map.fitBounds(group.getBounds().pad(0.1))
    }

    return () => {
      map.remove()
      mapInstance.current = null
    }
  }, [markers])

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Navigation size={16} className="text-indigo-600" />
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300">Agent Locations</h3>
        </div>
        <span className="text-xs text-slate-400 dark:text-slate-500">{locations.length} agent{locations.length !== 1 ? 's' : ''} on map</span>
      </div>
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
        <div ref={mapRef} className="w-full h-[600px]" />
      </div>

    </div>
  )
}

function AgentLocationTab({ locations }: { locations: AgentWithLocation[] }) {
  const navigate = useNavigate()

  if (locations.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400 dark:text-slate-500">
        <MapPinned size={48} className="mx-auto mb-3 opacity-40" />
        <p>No location data available</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
            <th className="text-left py-3.5 px-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Full Name</th>
            <th className="text-left py-3.5 px-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Current Location</th>
            <th className="text-left py-3.5 px-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Last Location Update</th>
          </tr>
        </thead>
        <tbody>
          {locations.map(agent => (
            <tr key={agent.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors last:border-b-0 cursor-pointer"
              onClick={() => navigate(`/agents/${agent.id}`)}>
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-xs shrink-0">
                    {agent.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span className="font-medium text-slate-800 dark:text-slate-200">{agent.fullName}</span>
                    <span className={`ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium ${statusConfig[agent.status]?.card || ''}`}>
                      {statusConfig[agent.status]?.label || agent.status}
                    </span>
                  </div>
                </div>
              </td>
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <MapPin size={14} className="shrink-0 text-slate-400" />
                  <span>{agent.location.address || `${agent.location.latitude.toFixed(4)}, ${agent.location.longitude.toFixed(4)}`}</span>
                </div>
              </td>
              <td className="py-3.5 px-4">
                <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                  <Clock size={14} className="shrink-0" />
                  <span>{new Date(agent.location.updatedAt).toLocaleString()}</span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="px-4 py-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-400 dark:text-slate-500">
        Showing {locations.length} agent{locations.length !== 1 ? 's' : ''} with location data
      </div>
    </div>
  )
}

export default function AgentsPage() {
  const navigate = useNavigate()
  const { agents, loading, changeStatus, remove, reload } = useAgents()
  const { addNotification } = useApp()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [activeTab, setActiveTab] = useState<TabKey>('list')
  const [agentsWithLocations, setAgentsWithLocations] = useState<AgentWithLocation[]>([])
  const [locationsLoading, setLocationsLoading] = useState(false)

  const loadLocations = useCallback(async () => {
    setLocationsLoading(true)
    try {
      const data = await fetchAgentsWithLocations()
      setAgentsWithLocations(data)
    } catch {
      setAgentsWithLocations([])
    } finally {
      setLocationsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (activeTab === 'map' || activeTab === 'location') {
      loadLocations()
    }
  }, [activeTab, loadLocations])

  const filtered = useMemo(() =>
    agents.filter(a =>
      a.fullName.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.contactNumber.toLowerCase().includes(search.toLowerCase())
    ),
    [agents, search]
  )

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  async function handleStatusChange(id: string, status: AgentStatus) {
    await changeStatus(id, { status })
    addNotification({ message: `Agent ${statusConfig[status].label.toLowerCase()}`, type: 'success' })
  }

  async function handleDelete(id: string) {
    await remove(id)
    addNotification({ message: 'Agent deleted', type: 'success' })
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Agents</h1>
          <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
            <span className="font-medium text-slate-600 dark:text-slate-300">{agents.length}</span> total agents
          </p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-200 dark:border-slate-700 mb-6">
        <nav className="flex gap-6">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors ${
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

      {activeTab === 'list' && (
        <>
          <div className="relative w-full sm:max-w-xs mb-6">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
            <input type="text" placeholder="Search agents..." value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
          </div>

          {loading ? (
            <SkeletonCards count={4} />
          ) : paginated.length === 0 ? (
            <div className="text-center py-16 text-slate-400 dark:text-slate-500">
              <Users size={48} className="mx-auto mb-3 opacity-40" />
              <p>No agents found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80">
                      <th className="text-left py-3.5 px-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Name</th>
                      <th className="text-left py-3.5 px-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Email</th>
                      <th className="text-left py-3.5 px-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Phone</th>
                      <th className="text-left py-3.5 px-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Status</th>
                      <th className="text-right py-3.5 px-4 font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map(agent => (
                      <tr key={agent.id} className="border-b border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors last:border-b-0">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-xs shrink-0">
                              {agent.fullName.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-slate-800 dark:text-slate-200 truncate">{agent.fullName}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <Mail size={14} className="shrink-0" /><span className="truncate">{agent.email}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                            <Phone size={14} className="shrink-0" /><span>{agent.contactNumber}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig[agent.status]?.card}`}>
                            {statusConfig[agent.status]?.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button onClick={() => navigate(`/agents/${agent.id}`)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                            <Eye size={14} /> View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 text-sm">
                  <p className="text-slate-400 dark:text-slate-500">
                    Page {page} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                      <ChevronLeft size={14} /> Prev
                    </button>
                    <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed">
                      Next <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {activeTab === 'map' && (
        locationsLoading ? (
          <SkeletonCards count={4} />
        ) : agentsWithLocations.length === 0 ? (
          <div className="text-center py-16 text-slate-400 dark:text-slate-500">
            <MapPin size={48} className="mx-auto mb-3 opacity-40" />
            <p>No location data available for any agent</p>
          </div>
        ) : (
          <AgentMap locations={agentsWithLocations} />
        )
      )}

      {activeTab === 'location' && (
        locationsLoading ? (
          <SkeletonCards count={4} />
        ) : (
          <AgentLocationTab locations={agentsWithLocations} />
        )
      )}
    </div>
  )
}
