import { useState } from 'react'
import { Users, UserCheck, UserX, Search } from 'lucide-react'
import { useCustomers } from '../hooks/useCustomers'
import { updateCustomer } from '../services/customerService'
import { useApp } from '../../../context/AppContext'
import { SkeletonTable } from '../../../components/Skeleton'

export default function CustomersPage() {
  const { customers, loading, reload } = useCustomers()
  const { addNotification } = useApp()
  const [search, setSearch] = useState('')

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  )

  const total = customers.length
  const active = customers.filter(c => c.status === 'Active').length
  const terminated = customers.filter(c => c.status === 'Terminated').length

  async function handleToggleStatus(id: string, current: 'Active' | 'Terminated') {
    const next = current === 'Active' ? 'Terminated' : 'Active'
    try {
      await updateCustomer(id, { status: next })
      addNotification({ message: `Customer ${next.toLowerCase()}`, type: 'success' })
      reload()
    } catch {
      addNotification({ message: 'Failed to update customer', type: 'error' })
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Customers</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">View customer records</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 flex items-center justify-center"><Users size={22} className="text-indigo-600" /></div>
          <div><p className="text-sm text-slate-500 dark:text-slate-400">Total Customers</p><p className="text-2xl font-bold text-slate-800 dark:text-white">{total}</p></div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-green-50 dark:bg-green-950/30 flex items-center justify-center"><UserCheck size={22} className="text-green-600" /></div>
          <div><p className="text-sm text-slate-500 dark:text-slate-400">Active</p><p className="text-2xl font-bold text-slate-800 dark:text-white">{active}</p></div>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-red-50 dark:bg-red-950/30 flex items-center justify-center"><UserX size={22} className="text-red-600" /></div>
          <div><p className="text-sm text-slate-500 dark:text-slate-400">Terminated</p><p className="text-2xl font-bold text-slate-800 dark:text-white">{terminated}</p></div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-700">
          <input type="text" placeholder="Search customers..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full max-w-xs px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400 dark:placeholder:text-slate-500" />
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-5"><SkeletonTable rows={6} /></div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <th className="px-5 py-3">Name</th><th className="px-5 py-3">Contact Person</th><th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Phone</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400 dark:text-slate-500">
                    <p>No customers found</p>
                  </td></tr>
                ) : (
                  filtered.map(customer => (
                    <tr key={customer.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-slate-200">{customer.name}</td>
                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{customer.contactPerson}</td>
                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{customer.email}</td>
                      <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{customer.phone}</td>
                      <td className="px-5 py-3.5">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          customer.status === 'Active'
                            ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400'
                            : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400'
                        }`}>
                          {customer.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => handleToggleStatus(customer.id, customer.status)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                            customer.status === 'Active'
                              ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-950/50'
                              : 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30 hover:bg-green-100 dark:hover:bg-green-950/50'
                          }`}>
                          {customer.status === 'Active' ? <><UserX size={14} /> Terminate</> : <><UserCheck size={14} /> Reactivate</>}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
