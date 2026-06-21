import { useState } from 'react'
import { Users, Search, Phone, MapPin, ShoppingCart, User } from 'lucide-react'
import { useCustomers } from '../hooks/useCustomers'
import { SkeletonTable } from '../../../components/Skeleton'

export default function CustomersPage() {
  const { customers, loading } = useCustomers()
  const [search, setSearch] = useState('')

  const filtered = customers.filter(c =>
    c.fullName.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.toLowerCase().includes(search.toLowerCase()) ||
    c.address.toLowerCase().includes(search.toLowerCase()) ||
    (c.agent?.toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div>
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Customers</h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{customers.length} customer{customers.length !== 1 ? 's' : ''} registered</p>
      </div>

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
    </div>
  )
}
