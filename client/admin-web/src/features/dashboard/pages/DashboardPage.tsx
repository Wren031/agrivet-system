import { useState, useEffect, useRef, useMemo } from 'react'
import { Link } from 'react-router-dom'
import {
  Users, UserCircle, ShoppingCart, Landmark, Clock, TrendingUp,
  ChevronDown, Navigation, MapPin, RefreshCw, Search, Package,
  Store, Eye,
} from 'lucide-react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useAgents } from '../../agents/hooks/useAgents'
import { useCustomers } from '../../customers/hooks/useCustomers'
import { useOrders } from '../../orders/hooks/useOrders'
import { useBranches } from '../../branch/hooks/useBranches'
import { useApp } from '../../../context/AppContext'
import { fetchAgentsWithLocations } from '../../agents/services/agentService'
import type { AgentWithLocation } from '../../agents/services/types'
import PageHeader from '../../../components/PageHeader'
import StatusBadge from '../../../components/StatusBadge'
import TabNav from '../../../components/TabNav'
import Pagination from '../../../components/Pagination'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const PAGE_SIZE = 8

delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

function createAgentIcon(status: string) {
  const isOnline = status === 'ONLINE'
  const bgColor = isOnline ? '#10b981' : '#f43f5e'
  const glow = isOnline ? 'rgba(16, 185, 129, 0.5)' : 'rgba(244, 63, 94, 0.5)'
  return L.divIcon({
    className: '',
    html: `<div style="position:relative;width:26px;height:26px;">
      <div style="position:absolute;inset:0;background:${glow};border-radius:50%;filter:blur(4px);"></div>
      <div style="position:relative;width:22px;height:22px;margin:2px;background:${bgColor};border:2.5px solid #fff;border-radius:50%;display:flex;align-items:center;justify-content:center;color:#fff;font-size:9px;font-weight:700;text-transform:uppercase;">${isOnline ? 'O' : 'F'}</div>
    </div>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
  })
}

interface StatCardProps {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
  bgColor: string
}

function StatCard({ title, value, icon, color, bgColor }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-xl p-4 flex flex-col justify-between transition-colors duration-200 hover:border-surface-300 dark:hover:border-surface-700">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-surface-400 dark:text-surface-500 uppercase tracking-wider">{title}</span>
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${bgColor} ${color}`}>
          {icon}
        </div>
      </div>
      <div className="mt-2">
        <h3 className="text-xl font-bold text-surface-900 dark:text-white tracking-tight leading-none tabular-nums">
          {value}
        </h3>
      </div>
    </div>
  )
}

const statCards = [
  { title: 'Total Agents', icon: Users, color: 'text-indigo-600 dark:text-indigo-400', bgColor: 'bg-indigo-50 dark:bg-indigo-950/20' },
  { title: 'Total Customers', icon: UserCircle, color: 'text-emerald-600 dark:text-emerald-400', bgColor: 'bg-emerald-50 dark:bg-emerald-950/20' },
  { title: 'Total Branches', icon: Landmark, color: 'text-amber-600 dark:text-amber-400', bgColor: 'bg-amber-50 dark:bg-amber-950/20' },
  { title: 'Pending Orders', icon: Clock, color: 'text-rose-600 dark:text-rose-400', bgColor: 'bg-rose-50 dark:bg-rose-950/20' },
]

function MapSection() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const markersRef = useRef<L.Marker[]>([])
  const [agentsWithLoc, setAgentsWithLoc] = useState<AgentWithLocation[]>([])
  const [loading, setLoading] = useState(true)
  const [latestUpdate, setLatestUpdate] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    fetchAgentsWithLocations()
      .then(data => {
        if (cancelled) return
        setAgentsWithLoc(data)
        const timestamps = data
          .map(a => new Date(a.location.updatedAt).getTime())
          .filter(t => !isNaN(t))
        if (timestamps.length > 0) {
          setLatestUpdate(new Date(Math.max(...timestamps)).toLocaleString())
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    const map = L.map(mapRef.current, {
      zoom: 12,
      zoomControl: true,
      attributionControl: false,
    })

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; <a href="https://www.esri.com/">Esri</a> &mdash; Source: Esri, Maxar, Earthstar Geographics',
      maxZoom: 19,
    }).addTo(map)

    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 19,
      pane: 'overlayPane',
    }).addTo(map)

    L.control.attribution({ position: 'bottomleft' }).addTo(map)
    mapInstance.current = map

    return () => {
      map.remove()
      mapInstance.current = null
      if (mapRef.current) mapRef.current.innerHTML = ''
    }
  }, [])

  useEffect(() => {
    const map = mapInstance.current
    if (!map) return

    markersRef.current.forEach(m => map.removeLayer(m))
    markersRef.current = []

    if (agentsWithLoc.length === 0) return
    const markers: L.Marker[] = []

      agentsWithLoc.forEach(agent => {
      const { latitude, longitude } = agent.location
      const isOnline = agent.status === 'ONLINE'
      const statusLabel = isOnline ? 'Online' : 'Offline'
      const statusDot = isOnline ? '#10b981' : '#f43f5e'
      const lastUpdate = new Date(agent.location.updatedAt).toLocaleString()
      const locationAddress = agent.location.address
      const addressDisplay = locationAddress && locationAddress.trim() ? locationAddress : null

      const marker = L.marker([latitude, longitude], { icon: createAgentIcon(agent.status) }).addTo(map)
      marker.bindPopup(`
        <div style="font-family:'Inter',system-ui,-apple-system,sans-serif;min-width:220px;padding:2px;color:#e2e8f0;">
          <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px;padding-bottom:10px;border-bottom:1px solid rgba(148,163,184,0.15);">
            <div style="width:34px;height:34px;border-radius:8px;background:linear-gradient(135deg,${isOnline ? '#10b981' : '#f43f5e'},${isOnline ? '#059669' : '#e11d48'});display:flex;align-items:center;justify-content:center;font-weight:700;font-size:14px;color:#fff;text-transform:uppercase;flex-shrink:0;">
              ${agent.fullName.charAt(0)}
            </div>
            <div style="min-width:0;flex:1;">
              <p style="font-weight:600;margin:0;font-size:13px;color:#f1f5f9;line-height:1.2;">${agent.fullName}</p>
              <p style="margin:2px 0 0;font-size:10px;color:#94a3b8;word-break:break-all;">${agent.email}</p>
            </div>
          </div>
          <div style="display:flex;align-items:center;margin-bottom:8px;">
            <span style="display:inline-flex;align-items:center;gap:5px;padding:2px 8px;border-radius:999px;font-size:9px;font-weight:700;background:${isOnline ? 'rgba(16,185,129,0.15)' : 'rgba(244,63,94,0.15)'};color:${isOnline ? '#34d399' : '#fb7185'};text-transform:uppercase;letter-spacing:0.5px;border:1px solid ${isOnline ? 'rgba(16,185,129,0.3)' : 'rgba(244,63,94,0.3)'};">
              <span style="width:5px;height:5px;border-radius:50%;background:${statusDot};display:inline-block;"></span>
              ${statusLabel}
            </span>
          </div>
          <div style="display:flex;flex-direction:column;gap:8px;padding:8px 10px;background:rgba(15,23,42,0.5);border-radius:6px;border:1px solid rgba(148,163,184,0.1);">
            ${addressDisplay ? `
            <div>
              <p style="margin:0;font-size:9px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Location</p>
              <p style="margin:2px 0 0;font-size:11px;color:#cbd5e1;font-weight:500;line-height:1.3;">${addressDisplay}</p>
            </div>
            ` : ''}
            <div>
              <p style="margin:0;font-size:9px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.5px;">Last Update</p>
              <p style="margin:2px 0 0;font-size:11px;color:#cbd5e1;font-weight:500;">${lastUpdate}</p>
            </div>
          </div>
        </div>
      `)
      markers.push(marker)
    })

    markersRef.current = markers
    const group = L.featureGroup(markers)
    map.fitBounds(group.getBounds().pad(0.15))
  }, [agentsWithLoc])

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden bg-slate-950">
      {latestUpdate && (
        <div className="absolute top-2 left-2 z-[999] flex items-center gap-1.5 bg-slate-900/80 backdrop-blur-md rounded-md px-2.5 py-1 border border-indigo-500/20 text-[10px] font-medium text-slate-200">
          <span className="relative flex items-center">
            <span className="absolute inline-flex w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping-soft opacity-75" />
            <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-400" />
          </span>
          <RefreshCw size={10} className="shrink-0 text-indigo-300" />
          <span>Sync: {latestUpdate}</span>
        </div>
      )}
      <div ref={mapRef} className="satellite-map w-full h-full" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm z-[1000]">
          <div className="text-center">
            <div className="relative inline-flex mb-3">
              <div className="absolute inset-0 bg-indigo-500/30 rounded-full blur-xl animate-pulse" />
              <Navigation size={28} className="relative mx-auto text-indigo-300 animate-pulse" />
            </div>
            <p className="text-[11px] font-semibold text-slate-300 tracking-wide">Acquiring Satellite Telemetry...</p>
            <p className="text-[9px] text-slate-500 mt-1 tracking-wider uppercase">Establishing Uplink</p>
          </div>
        </div>
      )}
      {!loading && agentsWithLoc.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-950/85 backdrop-blur-sm z-[1000]">
          <div className="text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-slate-800/50 border border-slate-700/50 flex items-center justify-center">
              <MapPin size={20} className="text-slate-500" />
            </div>
            <p className="text-[11px] font-semibold text-slate-300 tracking-wide">No Spatial Data</p>
            <p className="text-[9px] text-slate-500 mt-1 tracking-wider uppercase">No Agents in Sector</p>
          </div>
        </div>
      )}
    </div>
  )
}

interface SearchResult {
  type: 'order' | 'customer' | 'agent' | 'branch' | 'task'
  label: string
  subtitle: string
  link: string
}

function GlobalSearchBar() {
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const { agentOrders, branchOrders } = useOrders()
  const { customers } = useCustomers()
  const { agents } = useAgents()
  const { branches } = useBranches()

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    const res: SearchResult[] = []

    agentOrders.forEach(o => {
      if (o.id.toLowerCase().includes(q) || o.customerName.toLowerCase().includes(q) || o.agentName.toLowerCase().includes(q)) {
        res.push({ type: 'order', label: `#${o.id.slice(0, 8)}`, subtitle: `${o.customerName} - ${o.agentName}`, link: `/orders/${o.id}` })
      }
    })

    branchOrders.forEach(o => {
      if (o.id.toLowerCase().includes(q) || o.branchName.toLowerCase().includes(q)) {
        res.push({ type: 'order', label: `#${o.id.slice(0, 8)}`, subtitle: `${o.branchName} - ${o.address}`, link: `/orders/branch/${o.id}` })
      }
    })

    customers.forEach(c => {
      if (c.fullName.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q)) {
        res.push({ type: 'customer', label: c.fullName, subtitle: c.phone || '', link: `/customers/${c.id}` })
      }
    })

    agents.forEach(a => {
      if (a.fullName.toLowerCase().includes(q) || a.email.toLowerCase().includes(q) || a.contactNumber.toLowerCase().includes(q)) {
        res.push({ type: 'agent', label: a.fullName, subtitle: a.email || a.contactNumber || '', link: `/agents/${a.id}` })
      }
    })

    branches.forEach(b => {
      if (b.fullName.toLowerCase().includes(q) || b.storeBranch.toLowerCase().includes(q) || b.address.toLowerCase().includes(q) || b.contactNumber.includes(q)) {
        res.push({ type: 'branch', label: b.storeBranch, subtitle: b.address || b.contactNumber || '', link: `/branches/${b.id}` })
      }
    })

    return res.slice(0, 8)
  }, [query, agentOrders, branchOrders, customers, agents, branches])

  const typeIcons: Record<string, React.ReactNode> = {
    order: <ShoppingCart size={14} />,
    customer: <UserCircle size={14} />,
    agent: <Users size={14} />,
    branch: <Store size={14} />,
    task: <Package size={14} />,
  }

  const typeColors: Record<string, string> = {
    order: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/20',
    customer: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20',
    agent: 'text-blue-500 bg-blue-50 dark:bg-blue-950/20',
    branch: 'text-amber-500 bg-amber-50 dark:bg-amber-950/20',
    task: 'text-rose-500 bg-rose-50 dark:bg-rose-950/20',
  }

  return (
    <div className="relative w-full max-w-xl">
      <div className={`relative flex items-center bg-white dark:bg-surface-900 border rounded-xl transition-all duration-200 ${
        focused ? 'border-surface-400 dark:border-surface-500 ring-2 ring-surface-200 dark:ring-surface-700' : 'border-surface-200 dark:border-surface-800'
      }`}>
        <Search size={16} className="absolute left-3.5 text-surface-400 dark:text-surface-500 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 200)}
          placeholder="Search orders, customers, agents, branches..."
          className="w-full pl-10 pr-4 py-2.5 bg-transparent text-surface-800 dark:text-surface-200 text-sm focus:outline-none placeholder:text-surface-400 dark:placeholder:text-surface-500"
        />
        {query && (
          <button onClick={() => setQuery('')} className="pr-3 text-surface-300 dark:text-surface-600 hover:text-surface-500 transition-colors">
            <span className="text-xs font-medium">ESC</span>
          </button>
        )}
      </div>
      {focused && query && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl z-50 overflow-hidden animate-fade-in-up">
          <div className="px-4 py-2 border-b border-surface-100 dark:border-surface-800">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-surface-400 dark:text-surface-500">
              {results.length} result{results.length !== 1 ? 's' : ''} found
            </p>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {results.map((r, i) => (
              <Link
                key={`${r.type}-${r.label}-${i}`}
                to={r.link}
                className="flex items-center gap-3 px-4 py-3 hover:bg-surface-50 dark:hover:bg-surface-800/40 transition-colors border-b border-surface-100 dark:border-surface-800/40 last:border-0"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${typeColors[r.type]}`}>
                  {typeIcons[r.type]}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate">{r.label}</p>
                  <p className="text-xs text-surface-500 dark:text-surface-400 truncate">{r.subtitle}</p>
                </div>
                <span className="text-[10px] font-semibold uppercase text-surface-400 dark:text-surface-500 shrink-0">{r.type}</span>
              </Link>
            ))}
          </div>
        </div>
      )}
      {focused && query && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl z-50 overflow-hidden animate-fade-in-up">
          <div className="px-4 py-6 text-center">
            <Search size={24} className="mx-auto mb-2 text-surface-300 dark:text-surface-600" />
            <p className="text-sm text-surface-500 dark:text-surface-400">No results found for "{query}"</p>
          </div>
        </div>
      )}
    </div>
  )
}
function OrderManagementSection() {
  const { agentOrders, branchOrders } = useOrders()
  const { settings, counts } = useApp()
  const currency = settings.currencySymbol
  const [activeTab, setActiveTab] = useState<'agent' | 'branch'>('agent')

  const [agentPage, setAgentPage] = useState(1)
  const [branchPage, setBranchPage] = useState(1)

  const agentPaginated = useMemo(() =>
    agentOrders.slice((agentPage - 1) * PAGE_SIZE, agentPage * PAGE_SIZE),
    [agentOrders, agentPage]
  )

  const branchPaginated = useMemo(() =>
    branchOrders.slice((branchPage - 1) * PAGE_SIZE, branchPage * PAGE_SIZE),
    [branchOrders, branchPage]
  )

  const agentTotalPages = Math.max(1, Math.ceil(agentOrders.length / PAGE_SIZE))
  const branchTotalPages = Math.max(1, Math.ceil(branchOrders.length / PAGE_SIZE))

  return (
    <div className="border border-surface-200 dark:border-surface-800 rounded-xl bg-white dark:bg-surface-900 overflow-hidden">
      <div className="px-5 pt-4 pb-0">
        <div className="flex items-center gap-3 mb-2">

          <div>
            <h2 className="text-xs font-bold text-surface-800 dark:text-surface-100 tracking-tight">Order Management</h2>
            <p className="text-[10px] font-medium text-surface-400 dark:text-surface-500">Track and manage all orders</p>
          </div>
        </div>
        <TabNav
          tabs={[
            { key: 'agent', label: 'Agent Orders', badge: counts.agentBookingOrders },
            { key: 'branch', label: 'Branch Orders', badge: counts.branchBookingOrders },
          ]}
          activeKey={activeTab}
          onTabChange={key => { setActiveTab(key as 'agent' | 'branch'); key === 'agent' ? setAgentPage(1) : setBranchPage(1) }}
          className="mb-0"
        />
      </div>

      {activeTab === 'agent' ? (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-50 dark:bg-surface-800/50 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Customer</th>
                  <th className="py-3.5 px-4">Agent</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {agentPaginated.length === 0 ? (
                  <tr><td colSpan={7} className="px-5 py-12 text-center text-surface-500 dark:text-surface-400">
                    <ShoppingCart size={32} className="mx-auto mb-2 opacity-40" /><p>No agent orders found</p>
                  </td></tr>
                ) : (
                  agentPaginated.map(order => (
                    <tr key={order.id} className="border-b border-surface-100 dark:border-surface-800 transition-colors hover:bg-surface-50/50 dark:hover:bg-surface-800/20">
                      <td className="py-3 px-4 text-xs font-mono text-surface-500 dark:text-surface-400">#{order.id.slice(0, 8)}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-surface-800 dark:text-surface-200">{order.customerName}</div>
                        <div className="text-xs text-surface-500 dark:text-surface-400">{order.customerPhone}</div>
                      </td>
                      <td className="py-3 px-4 text-surface-600 dark:text-surface-300">{order.agentName || 'â€”'}</td>
                      <td className="py-3 px-4 text-surface-500 dark:text-surface-400">
                        {new Date(order.orderDate + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-4"><StatusBadge status={order.status} /></td>
                      <td className="py-3 px-4 text-surface-700 dark:text-surface-200 font-medium">{currency}{order.totalAmount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center">
                        <Link to={`/orders/${order.id}`}
                          className="inline-flex p-1.5 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                          title="View Details"><Eye size={16} /></Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-surface-100 dark:border-surface-800">
            <Pagination page={agentPage} totalPages={agentTotalPages} onPageChange={setAgentPage} />
          </div>
        </div>
      ) : (
        <div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-surface-50 dark:bg-surface-800/50 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                  <th className="py-3.5 px-4">Order ID</th>
                  <th className="py-3.5 px-4">Branch</th>
                  <th className="py-3.5 px-4">Branch Address</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Items</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {branchPaginated.length === 0 ? (
                  <tr><td colSpan={8} className="px-5 py-12 text-center text-surface-500 dark:text-surface-400">
                    <Store size={32} className="mx-auto mb-2 opacity-40" /><p>No branch orders found</p>
                  </td></tr>
                ) : (
                  branchPaginated.map(order => (
                    <tr key={order.id} className="border-b border-surface-100 dark:border-surface-800 transition-colors hover:bg-surface-50/50 dark:hover:bg-surface-800/20">
                      <td className="py-3 px-4 text-xs font-mono text-surface-500 dark:text-surface-400">#{order.id.slice(0, 8)}</td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-surface-800 dark:text-surface-200">{order.branchName}</div>
                        <div className="text-xs text-surface-500 dark:text-surface-400">{order.branchContact}</div>
                      </td>
                      <td className="py-3 px-4 text-surface-600 dark:text-surface-300">{order.address}</td>
                      <td className="py-3 px-4 text-surface-500 dark:text-surface-400">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-4"><StatusBadge status={order.status} /></td>
                      <td className="py-3 px-4 text-surface-500 dark:text-surface-400">{order.itemCount} item{order.itemCount !== 1 ? 's' : ''}</td>
                      <td className="py-3 px-4 text-surface-700 dark:text-surface-200 font-medium">{currency}{order.totalAmount.toLocaleString()}</td>
                      <td className="py-3 px-4 text-center">
                        <Link to={`/orders/branch/${order.id}`}
                          className="inline-flex p-1.5 text-surface-600 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 rounded-lg transition-colors"
                          title="View Details"><Eye size={16} /></Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-surface-100 dark:border-surface-800">
            <Pagination page={branchPage} totalPages={branchTotalPages} onPageChange={setBranchPage} />
          </div>
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const { agents } = useAgents()
  const { customers } = useCustomers()
  const { agentOrders: orders } = useOrders()
  const { branches } = useBranches()
  const { settings } = useApp()

  const currency = settings.currencySymbol
  const pendingOrders = orders.filter(o => o.status === 'Pending').length

  const years = useMemo(() => {
    const y = new Set(orders.map(o => o.orderDate.slice(0, 4)))
    return Array.from(y).sort().reverse()
  }, [orders])

  const [selectedYear, setSelectedYear] = useState<string>('')

  useEffect(() => {
    if (!selectedYear && years.length > 0) {
      setSelectedYear(years[0])
    }
  }, [years, selectedYear])

  const yearlySales = useMemo(() => {
    if (!selectedYear) return []
    return MONTHS.map((label, i) => {
      const prefix = `${selectedYear}-${String(i + 1).padStart(2, '0')}`
      const total = orders
        .filter(o => o.orderDate.startsWith(prefix))
        .reduce((s, o) => s + o.totalAmount, 0)
      return { label, value: Math.round(total * 100) / 100 }
    })
  }, [orders, selectedYear])

  const yearTotal = yearlySales.reduce((s, m) => s + m.value, 0)

  const [hoveredMonth, setHoveredMonth] = useState<number | null>(null)

  const formatCompact = (v: number) => {
    if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
    if (v >= 1_000) return `${(v / 1_000).toFixed(1).replace(/\.0$/, '')}k`
    return v.toFixed(0)
  }

  // Chart geometry
  const W = 800
  const H = 220
  const PAD = { top: 16, right: 16, bottom: 28, left: 56 }
  const innerW = W - PAD.left - PAD.right
  const innerH = H - PAD.top - PAD.bottom

  const niceMax = (v: number) => {
    if (v <= 0) return 100
    const mag = Math.pow(10, Math.floor(Math.log10(v)))
    const norm = v / mag
    const nice = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 5 ? 5 : 10
    return nice * mag
  }
  const yMax = niceMax(Math.max(...yearlySales.map(m => m.value), 0))
  const ySteps = 4

  const xFor = (i: number) => PAD.left + (yearlySales.length === 1 ? innerW / 2 : (i / (yearlySales.length - 1)) * innerW)
  const yFor = (v: number) => PAD.top + innerH - (v / yMax) * innerH

  function buildSmoothPath(values: number[]): string {
    if (values.length === 0) return ''
    const pts = values.map((v, i) => ({ x: xFor(i), y: yFor(v) }))
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`
    let d = `M ${pts[0].x} ${pts[0].y}`
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i]
      const p1 = pts[i]
      const p2 = pts[i + 1]
      const p3 = pts[i + 2] || p2
      const tension = 0.35
      const cp1x = p1.x + (p2.x - p0.x) * tension
      const cp1y = p1.y + (p2.y - p0.y) * tension
      const cp2x = p2.x - (p3.x - p1.x) * tension
      const cp2y = p2.y - (p3.y - p1.y) * tension
      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`
    }
    return d
  }

  const linePath = buildSmoothPath(yearlySales.map(m => m.value))
  const lastX = xFor(yearlySales.length - 1)
  const firstX = xFor(0)
  const baseY = PAD.top + innerH
  const areaPath = linePath ? `${linePath} L ${lastX} ${baseY} L ${firstX} ${baseY} Z` : ''

  const yAxisTicks = Array.from({ length: ySteps + 1 }, (_, i) => (yMax / ySteps) * i)

  const handleChartMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (yearlySales.length === 0) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * W
    const idx = Math.round(((x - PAD.left) / innerW) * (yearlySales.length - 1))
    setHoveredMonth(Math.max(0, Math.min(yearlySales.length - 1, idx)))
  }

  const statsValues = [agents.length, customers.length, branches.length, pendingOrders]

  return (
    <div className="space-y-6">
      <PageHeader title="Dashboard" subtitle="Real-time logistics analytics and asset dashboard" />

      <GlobalSearchBar />

      <div className="grid grid-cols-1 lg:grid-cols-[2.6fr_1.4fr] gap-5 lg:items-stretch">
        <div className="min-h-[220px] lg:h-auto rounded-xl border border-surface-200 dark:border-surface-800 overflow-hidden bg-surface-100 dark:bg-surface-900 relative z-0">
          <MapSection />
        </div>

        <div className="grid grid-cols-2 gap-4">
          {statCards.map((card, i) => {
            const Icon = card.icon
            return (
              <StatCard
                key={card.title}
                title={card.title}
                value={statsValues[i]}
                icon={<Icon size={14} />}
                color={card.color}
                bgColor={card.bgColor}
              />
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[2.6fr_1.4fr] gap-5">
<div className="border border-surface-200 dark:border-surface-800 rounded-xl p-6 bg-white dark:bg-surface-900 flex flex-col justify-between tracking-tight">
  {/* Header Section */}
  <div className="flex items-start justify-between mb-8">
    <div>
      <h2 className="text-sm font-semibold text-surface-900 dark:text-surface-100">Revenue Metrics</h2>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-xl font-bold font-mono text-surface-900 dark:text-white">
          {currency}{yearTotal.toLocaleString()}
        </span>
        <span className="text-[11px] font-medium text-surface-400 dark:text-surface-500">YTD Total</span>
      </div>
    </div>
    
    <div className="relative">
      <select
        value={selectedYear}
        onChange={e => setSelectedYear(e.target.value)}
        className="appearance-none bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-800 text-surface-700 dark:text-surface-300 text-xs font-medium rounded-lg pl-3 pr-8 py-1.5 hover:bg-surface-100 dark:hover:bg-surface-800 focus:outline-none focus:ring-1 focus:ring-surface-400 dark:focus:ring-surface-500 transition-all cursor-pointer"
      >
        {years.map(y => (
          <option key={y} value={y}>{y}</option>
        ))}
      </select>
      <ChevronDown size={12} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-surface-400" />
    </div>
  </div>

  {/* Chart Section */}
  {yearlySales.length > 0 ? (
    <div className="relative h-[240px] pb-2">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
        className="w-full h-[220px] overflow-visible"
        onMouseMove={handleChartMove}
        onMouseLeave={() => setHoveredMonth(null)}
      >
        <defs>
          <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.32" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="revenueLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
        </defs>

        {/* Y grid */}
        {yAxisTicks.map((tick, i) => {
          const y = yFor(tick)
          return (
            <g key={i}>
              <line
                x1={PAD.left}
                x2={W - PAD.right}
                y1={y}
                y2={y}
                stroke="currentColor"
                className="text-surface-200 dark:text-surface-800"
                strokeWidth={1}
                strokeDasharray={i === 0 ? '0' : '3 4'}
              />
              <text
                x={PAD.left - 10}
                y={y + 4}
                textAnchor="end"
                className="fill-surface-400 dark:fill-surface-500 text-[10px] font-mono"
              >
                {currency}{formatCompact(tick)}
              </text>
            </g>
          )
        })}

        {/* X axis labels */}
        {yearlySales.map((m, i) => (
          <text
            key={m.label}
            x={xFor(i)}
            y={H - PAD.bottom + 18}
            textAnchor="middle"
            className="fill-surface-400 dark:fill-surface-500 text-[10px] font-medium"
          >
            {m.label}
          </text>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="url(#revenueGrad)" className="animate-fade-area" />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="url(#revenueLine)"
          strokeWidth={2.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-draw-line"
          style={{ '--line-length': 2000 } as React.CSSProperties}
        />

        {/* Data points */}
        {yearlySales.map((m, i) => {
          const isHover = hoveredMonth === i
          return (
            <circle
              key={m.label}
              cx={xFor(i)}
              cy={yFor(m.value)}
              r={isHover ? 5 : 3}
              fill="#6366f1"
              stroke="white"
              strokeWidth={isHover ? 2.5 : 1.5}
              className="transition-all duration-150 dark:stroke-surface-900"
            />
          )
        })}

        {/* Crosshair */}
        {hoveredMonth !== null && yearlySales[hoveredMonth] && (
          <line
            x1={xFor(hoveredMonth)}
            x2={xFor(hoveredMonth)}
            y1={PAD.top}
            y2={H - PAD.bottom}
            stroke="currentColor"
            className="text-surface-400 dark:text-surface-500"
            strokeWidth={1}
            strokeDasharray="2 3"
          />
        )}
      </svg>

      {/* Tooltip */}
      {hoveredMonth !== null && yearlySales[hoveredMonth] && (
        <div
          className="absolute pointer-events-none z-10 animate-fade-in"
          style={{
            left: `${(xFor(hoveredMonth) / W) * 100}%`,
            top: `${(yFor(yearlySales[hoveredMonth].value) / H) * 100}%`,
            transform: 'translate(-50%, calc(-100% - 12px))',
          }}
        >
          <div className="bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-lg px-3 py-2 min-w-[140px]">
            <p className="text-[10px] font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider mb-1">
              {yearlySales[hoveredMonth].label} {selectedYear}
            </p>
            <p className="text-sm font-bold font-mono text-surface-900 dark:text-white">
              {currency}{yearlySales[hoveredMonth].value.toLocaleString()}
            </p>
          </div>
          <div className="absolute left-1/2 -bottom-1 -translate-x-1/2 w-2 h-2 rotate-45 bg-white dark:bg-surface-900 border-r border-b border-surface-200 dark:border-surface-700" />
        </div>
      )}
    </div>
  ) : (
    <div className="h-[220px] flex items-center justify-center border border-dashed border-surface-200 dark:border-surface-800 rounded-xl">
      <p className="text-xs font-medium text-surface-400 dark:text-surface-500">No logs found for {selectedYear}</p>
    </div>
  )}
</div>

        <div className="border border-surface-200 dark:border-surface-800 rounded-xl overflow-hidden bg-white dark:bg-surface-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 px-5 pt-5 pb-3">
              <div className="w-8 h-8 rounded-lg bg-surface-50 dark:bg-surface-800 border border-surface-100 dark:border-surface-700 flex items-center justify-center text-surface-500 dark:text-surface-400">
                <Clock size={14} />
              </div>
              <div>
                <h2 className="text-xs font-bold text-surface-800 dark:text-surface-100 tracking-tight">Active Operations Pipeline</h2>
                <p className="text-[10px] font-medium text-surface-400 dark:text-surface-500">{agents.length} personnel monitored</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-xs font-bold text-surface-400 dark:text-surface-500 bg-surface-50/50 dark:bg-surface-800/30 border-y border-surface-100 dark:border-surface-800">
                    <th className="px-4 py-2 text-[9px] uppercase tracking-wider">Identity</th>
                    <th className="px-4 py-2 text-[9px] uppercase tracking-wider">State</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-800">
                  {agents.length === 0 ? (
                    <tr>
                      <td colSpan={2} className="px-4 py-8 text-center text-surface-400 dark:text-surface-500">
                        <p className="text-xs font-semibold">Zero agents</p>
                      </td>
                    </tr>
                  ) : (
                    [...agents]
                      .sort((a, b) => (a.status === 'ONLINE' ? -1 : 1))
                      .slice(0, 4)
                      .map(agent => (
                        <tr key={agent.id} className="hover:bg-surface-50/40 dark:hover:bg-surface-800/20 transition-colors">
                          <td className="px-4 py-2.5">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 rounded bg-surface-100 dark:bg-surface-800 flex items-center justify-center font-bold text-[10px] text-surface-600 dark:text-surface-300 uppercase shrink-0">
                                {agent.fullName.charAt(0)}
                              </div>
                              <span className="text-xs font-semibold text-surface-700 dark:text-surface-200 truncate max-w-[100px]">{agent.fullName}</span>
                            </div>
                          </td>
                          <td className="px-4 py-2.5">
                            <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase ${
                              agent.status === 'ONLINE'
                                ? 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/30'
                                : 'bg-surface-50 dark:bg-surface-800 text-surface-400 dark:text-surface-500 border-surface-200 dark:border-surface-700'
                            }`}>
                              {agent.status === 'ONLINE' ? 'Online' : 'Offline'}
                            </span>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <OrderManagementSection />
    </div>
  )
}
