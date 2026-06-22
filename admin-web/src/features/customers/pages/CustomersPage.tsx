import { useState, useMemo } from 'react'
import { Users, Search, Phone, MapPin, ShoppingCart, User, List, Megaphone, Send, CheckSquare, Square } from 'lucide-react'
import { useCustomers } from '../hooks/useCustomers'
import { sendAnnouncement } from '../services/customerService'
import { useApp } from '../../../context/AppContext'
import { SkeletonTable } from '../../../components/Skeleton'

const tabs = [
  { key: 'list', label: 'List', icon: List },
  { key: 'announcement', label: 'Announcement', icon: Megaphone },
] as const

type TabKey = (typeof tabs)[number]['key']

export default function CustomersPage() {
  const { customers, loading, reload } = useCustomers()
  const { addNotification } = useApp()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState<TabKey>('list')

  const filtered = useMemo(() =>
    customers.filter(c =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase()) ||
      c.address.toLowerCase().includes(search.toLowerCase()) ||
      (c.agent?.toLowerCase().includes(search.toLowerCase()))
    ), [customers, search]
  )

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Customers</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{customers.length} customer{customers.length !== 1 ? 's' : ''} registered</p>
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
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-4 sm:px-5 py-4 border-b border-slate-100 dark:border-slate-700">
            <input type="text" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full sm:max-w-xs px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-5"><SkeletonTable rows={6} /></div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="px-5 py-3">Full Name</th>
                    <th className="px-5 py-3">Contact Number</th>
                    <th className="px-5 py-3">Address</th>
                    <th className="px-5 py-3">Total Orders</th>
                    <th className="px-5 py-3">Agent</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filtered.length === 0 ? (
                    <tr><td colSpan={5} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500">
                      <p>No customers found</p>
                    </td></tr>
                  ) : (
                    filtered.map(customer => (
                      <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-xs">
                              {customer.fullName.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-slate-800 dark:text-slate-200">{customer.fullName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <Phone size={14} className="text-slate-400 shrink-0" />
                            {customer.phone}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <MapPin size={14} className="text-slate-400 shrink-0" />
                            {customer.address}
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <ShoppingCart size={14} className="text-slate-400 shrink-0" />
                            <span className="font-medium text-slate-800 dark:text-slate-200">{customer.totalOrders}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          {customer.agent ? (
                            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                              <User size={14} className="text-slate-400 shrink-0" />
                              {customer.agent}
                            </div>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {activeTab === 'announcement' && <AnnouncementTab customers={customers} loading={loading} />}
    </div>
  )
}

function AnnouncementTab({ customers, loading }: { customers: import('../services/types').Customer[]; loading: boolean }) {
  const { addNotification } = useApp()
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [sending, setSending] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() =>
    customers.filter(c =>
      c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase())
    ), [customers, search]
  )

  const allSelected = filtered.length > 0 && filtered.every(c => selectedIds.has(c.id))
  const someSelected = filtered.some(c => selectedIds.has(c.id))

  function toggleAll() {
    if (allSelected) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(filtered.map(c => c.id)))
    }
  }

  function toggleOne(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  async function handleSend() {
    if (!title.trim() || !message.trim()) {
      addNotification({ message: 'Please enter a title and message', type: 'error' })
      return
    }
    if (selectedIds.size === 0) {
      addNotification({ message: 'Please select at least one customer', type: 'error' })
      return
    }
    setSending(true)
    try {
      await sendAnnouncement({ title: title.trim(), message: message.trim(), customerIds: Array.from(selectedIds) })
      addNotification({ message: `Announcement sent to ${selectedIds.size} customer${selectedIds.size !== 1 ? 's' : ''}`, type: 'success' })
      setTitle('')
      setMessage('')
      setSelectedIds(new Set())
    } catch {
      addNotification({ message: 'Failed to send announcement', type: 'error' })
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Compose Area */}
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5">
          <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2 mb-4">
            <Megaphone size={16} className="text-indigo-600" />
            Compose Announcement
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Promo Alert"
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Message</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5}
                placeholder="Write your announcement..."
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 resize-none" />
            </div>
            <button onClick={handleSend} disabled={sending || selectedIds.size === 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium disabled:opacity-50">
              {sending ? 'Sending...' : <><Send size={15} /> Send to {selectedIds.size > 0 ? `${selectedIds.size} customer${selectedIds.size !== 1 ? 's' : ''}` : '...'}</>}
            </button>
          </div>
        </div>
      </div>

      {/* Customer Selection */}
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
          <div className="px-4 sm:px-5 py-4 border-b border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search recipients..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400" />
            </div>
            <button onClick={toggleAll}
              className="flex items-center gap-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors">
              {allSelected ? <CheckSquare size={15} /> : <Square size={15} />}
              {allSelected ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-5"><SkeletonTable rows={6} /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-slate-400 dark:text-slate-500">
                <Users size={32} className="mx-auto mb-2 opacity-40" />
                <p>No customers found</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                    <th className="px-5 py-3 w-12">
                      <button onClick={toggleAll} className="flex items-center justify-center">
                        {allSelected ? <CheckSquare size={15} className="text-indigo-600" /> : <Square size={15} className="text-slate-400" />}
                      </button>
                    </th>
                    <th className="px-5 py-3">Full Name</th>
                    <th className="px-5 py-3">Contact Number</th>
                    <th className="px-5 py-3">Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                  {filtered.map(customer => {
                    const checked = selectedIds.has(customer.id)
                    return (
                      <tr key={customer.id}
                        onClick={() => toggleOne(customer.id)}
                        className={`hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors cursor-pointer ${checked ? 'bg-indigo-50/50 dark:bg-indigo-950/20' : ''}`}>
                        <td className="px-5 py-3.5">
                          <button onClick={e => { e.stopPropagation(); toggleOne(customer.id) }} className="flex items-center justify-center">
                            {checked ? <CheckSquare size={15} className="text-indigo-600" /> : <Square size={15} className="text-slate-400" />}
                          </button>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-semibold text-xs">
                              {customer.fullName.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-slate-800 dark:text-slate-200">{customer.fullName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-slate-600 dark:text-slate-300">{customer.phone}</span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="text-slate-600 dark:text-slate-300">{customer.address}</span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
