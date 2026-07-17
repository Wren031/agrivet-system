import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Users, Search, MoreVertical, CheckSquare, Square } from 'lucide-react'
import { useCustomers } from '../hooks/useCustomers'
import { sendAnnouncement } from '../services/customerService'
import { useApp } from '../../../context/AppContext'
import { SkeletonTable } from '../../../components/Skeleton'
import PageHeader from '../../../components/PageHeader'
import TabNav from '../../../components/TabNav'
import Modal from '../../../components/Modal'
import type { Customer } from '../services/types'

const tabs = [
  { key: 'list', label: 'List' },
  { key: 'announcement', label: 'Announcement' },
] as const

type TabKey = (typeof tabs)[number]['key']

export default function CustomersPage() {
  const navigate = useNavigate()
  const { customers, loading, changeStatus, reload } = useCustomers()
  const { addNotification } = useApp()
  const [search, setSearch] = useState('')
  const [storeFilter, setStoreFilter] = useState('')
  const [activeTab, setActiveTab] = useState<TabKey>('list')
  const [detailCustomer, setDetailCustomer] = useState<Customer | null>(null)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  
  // Track which customer item action row popover is currently active
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null)

  const storeNames = useMemo(() =>
    [...new Set(customers.map(c => c.storeName).filter(Boolean))].sort()
  , [customers])

  const filtered = useMemo(() =>
    customers.filter(c =>
      (c.fullName.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.toLowerCase().includes(search.toLowerCase())) &&
      (!storeFilter || c.storeName === storeFilter)
    ), [customers, search, storeFilter]
  )

  const allSelected = filtered.length > 0 && filtered.every(c => selectedIds.has(c.id))

  function toggleAll() {
    if (allSelected) setSelectedIds(new Set())
    else setSelectedIds(new Set(filtered.map(c => c.id)))
  }

  function toggleOne(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function confirmTerminate(customer: Customer) {
    setDetailCustomer(customer)
  }

  async function handleTerminate() {
    if (!detailCustomer) return
    try {
      await changeStatus(detailCustomer.id, 'TERMINATED')
      addNotification({ message: 'Customer terminated', type: 'success' })
      setDetailCustomer(null)
      reload()
    } catch {
      addNotification({ message: 'Failed to terminate customer', type: 'error' })
    }
  }

  const statusStyle = (status?: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400'
      case 'REJECTED': return 'bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400'
      case 'TERMINATED': return 'bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400'
      default: return 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400'
    }
  }

  return (
    <div>
      <PageHeader title="Customers" subtitle={`${customers.length} customer${customers.length !== 1 ? 's' : ''} registered`} />

      <TabNav
        tabs={tabs.map(t => ({ key: t.key, label: t.label }))}
        activeKey={activeTab}
        onTabChange={key => setActiveTab(key as TabKey)}
      />

      {activeTab === 'list' && (
        <>
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative w-full sm:max-w-xs">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500 dark:text-surface-400" />
              <input type="text" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 placeholder:text-surface-400 dark:placeholder:text-surface-500" />
            </div>
            <select value={storeFilter} onChange={e => setStoreFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600">
              <option value="">All Stores</option>
              {storeNames.map(name => <option key={name} value={name}>{name}</option>)}
            </select>
          </div>

          {loading ? (
            <SkeletonTable rows={6} />
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-surface-500 dark:text-surface-400">
              <Users size={48} className="mx-auto mb-3 opacity-40" />
              <p>No customers found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-50 dark:bg-surface-800/50 text-left text-xs font-semibold text-surface-500 uppercase tracking-wider">
                    <th className="py-3.5 px-4 w-10">
                      <button onClick={toggleAll} className="flex items-center justify-center">
                        {allSelected ? <CheckSquare size={15} className="text-surface-500" /> : <Square size={15} className="text-surface-400" />}
                      </button>
                    </th>
                    <th className="py-3.5 px-4">ID</th>
                    <th className="py-3.5 px-4">Customer</th>
                    <th className="py-3.5 px-4">Contact</th>
                    <th className="py-3.5 px-4">Store</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right pr-6">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(customer => {
                    const checked = selectedIds.has(customer.id);
                    const isMenuOpen = activeMenuId === customer.id;
                    
                    return (
                      <tr key={customer.id} className={`border-b border-surface-100 dark:border-surface-800 transition-colors ${checked ? 'bg-surface-50/50 dark:bg-surface-950/20' : ''}`}>
                        <td className="py-3 px-4">
                          <button onClick={() => toggleOne(customer.id)} className="flex items-center justify-center">
                            {checked ? <CheckSquare size={15} className="text-surface-600" /> : <Square size={15} className="text-surface-400" />}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-xs font-mono text-surface-500 dark:text-surface-400">#{customer.id.slice(0, 6)}</td>
                        <td className="py-3 px-4 font-medium text-surface-800 dark:text-surface-200">{customer.fullName}</td>
                        <td className="py-3 px-4 text-surface-600 dark:text-surface-300">{customer.phone}</td>
                        <td className="py-3 px-4 text-surface-600 dark:text-surface-300">{customer.storeName ?? '—'}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-medium ${statusStyle(customer.status)}`}>
                            {customer.status ?? 'ACTIVE'}
                          </span>
                        </td>
                        
                        {/* Dropdown Container Column */}
                        <td className="py-3 px-4 text-right pr-6 relative">
                          <div className="inline-block text-left">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveMenuId(isMenuOpen ? null : customer.id);
                              }}
                              className={`p-1.5 text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200 rounded-lg transition-colors border ${isMenuOpen ? 'bg-surface-100 border-surface-300/60 dark:bg-surface-800 dark:border-surface-700' : 'bg-transparent border-transparent'}`}
                            >
                              <MoreVertical size={16} />
                            </button>

                            {isMenuOpen && (
                              <>
                                {/* Click Outside Target to close menu safely */}
                                <div className="fixed inset-0 z-30" onClick={() => setActiveMenuId(null)} />
                                
                                <div className="absolute right-6 mt-1 w-40 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-800 rounded-lg p-1 z-40 origin-top-right">
                                  <button
                                    onClick={() => {
                                      navigate(`/customers/${customer.id}`);
                                      setActiveMenuId(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-xs font-medium text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800/60 rounded-md transition-colors"
                                  >
                                    View Details
                                  </button>
                                  <button
                                    onClick={() => {
                                      confirmTerminate(customer);
                                      setActiveMenuId(null);
                                    }}
                                    className="w-full text-left px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-md transition-colors border-t border-surface-100 dark:border-surface-800/80 mt-1 pt-1.5"
                                  >
                                    Terminate
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {activeTab === 'announcement' && <AnnouncementTab customers={customers} loading={loading} />}

      <Modal open={detailCustomer !== null} onClose={() => setDetailCustomer(null)} title="Terminate Customer" size="sm">
        {detailCustomer && (
          <div className="text-center">
            <p className="text-sm text-surface-600 dark:text-surface-300 mb-6">Are you sure you want to terminate <strong>{detailCustomer.fullName}</strong>?</p>
            <div className="flex gap-3">
              <button onClick={handleTerminate}
                className="flex-1 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium">
                Terminate
              </button>
              <button onClick={() => setDetailCustomer(null)}
                className="flex-1 py-2.5 border border-surface-200 dark:border-surface-700 text-surface-600 dark:text-surface-300 rounded-lg hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors text-sm font-medium">Cancel</button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

function AnnouncementTab({ customers, loading }: { customers: Customer[]; loading: boolean }) {
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
        <div className="p-5">
          <h3 className="text-sm font-bold text-surface-700 dark:text-surface-300 mb-4">Compose Announcement</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1">Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)}
                placeholder="e.g. Promo Alert"
                className="w-full px-3 py-2 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 placeholder:text-surface-400" />
            </div>
            <div>
              <label className="block text-xs font-medium text-surface-500 dark:text-surface-400 mb-1">Message</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5}
                placeholder="Write your announcement..."
                className="w-full px-3 py-2 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 placeholder:text-surface-400 resize-none" />
            </div>
            <button onClick={handleSend} disabled={sending || selectedIds.size === 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-surface-900 dark:bg-white text-white dark:text-surface-900 rounded-lg hover:bg-surface-800 dark:hover:bg-surface-200 transition-colors text-sm font-medium disabled:opacity-50">
              {sending ? 'Sending...' : <>Send to {selectedIds.size > 0 ? `${selectedIds.size} customer${selectedIds.size !== 1 ? 's' : ''}` : '...'}</>}
            </button>
          </div>
        </div>
      </div>

      {/* Customer Selection */}
      <div className="lg:col-span-2">
        <div className="overflow-hidden">
          <div className="px-4 sm:px-5 py-4 border-b border-surface-100 dark:border-surface-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative w-full sm:max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
              <input type="text" placeholder="Search recipients..." value={search} onChange={e => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-800 dark:text-surface-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-surface-300 dark:focus:ring-surface-600 placeholder:text-surface-400" />
            </div>
            <button onClick={toggleAll}
              className="flex items-center gap-2 text-xs font-medium text-surface-600 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300 transition-colors">
              {allSelected ? <CheckSquare size={15} /> : <Square size={15} />}
              {allSelected ? 'Deselect All' : 'Select All'}
            </button>
          </div>
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-5"><SkeletonTable rows={6} /></div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12 text-surface-500 dark:text-surface-400">
                <Users size={32} className="mx-auto mb-2 opacity-40" />
                <p>No customers found</p>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-surface-50 dark:bg-surface-950/30 text-left text-xs font-semibold text-surface-500 dark:text-surface-400 uppercase tracking-wider">
                    <th className="px-5 py-3 w-12">
                      <button onClick={toggleAll} className="flex items-center justify-center">
                        {allSelected ? <CheckSquare size={15} className="text-surface-600" /> : <Square size={15} className="text-surface-400" />}
                      </button>
                    </th>
                    <th className="px-5 py-3">Full Name</th>
                    <th className="px-5 py-3">Contact Number</th>
                    <th className="px-5 py-3">Address</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
                  {filtered.map(customer => {
                    const checked = selectedIds.has(customer.id)
                    return (
                      <tr key={customer.id}
                        onClick={() => toggleOne(customer.id)}
                        className={`hover:bg-surface-50 dark:hover:bg-surface-700/30 transition-colors cursor-pointer ${checked ? 'bg-surface-50/50 dark:bg-surface-950/20' : ''}`}>
                        <td className="px-5 py-3.5">
                          <button onClick={e => { e.stopPropagation(); toggleOne(customer.id) }} className="flex items-center justify-center">
                            {checked ? <CheckSquare size={15} className="text-surface-600" /> : <Square size={15} className="text-surface-400" />}
                          </button>
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-surface-800 flex items-center justify-center text-surface-600 dark:text-surface-400 font-semibold text-xs">
                              {customer.fullName.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-surface-800 dark:text-surface-200">{customer.fullName}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-surface-600 dark:text-surface-300">{customer.phone}</td>
                        <td className="px-5 py-3.5 text-surface-600 dark:text-surface-300">{customer.address}</td>
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