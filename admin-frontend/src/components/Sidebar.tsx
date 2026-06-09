import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, Users, UserCircle, ShoppingCart, Settings, Tags, LogOut, Store, ClipboardList
} from 'lucide-react'
import { useApp } from '../context/AppContext'

const navigationGroups = [
  {
    category: 'Overview',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard },
    ]
  },
  {
    category: 'Stock Management',
    items: [
      { to: '/inventory', label: 'Inventory Items', icon: Package },
      { to: '/categories', label: 'Categories', icon: Tags },
    ]
  },
  {
    category: 'CRM & Sales',
    items: [
      { to: '/customers', label: 'Customers', icon: UserCircle },
      { to: '/agents', label: 'Agents', icon: Users },
      { to: '/orders', label: 'Orders & Sales', icon: ShoppingCart },
      { to: '/bookings', label: 'Bookings', icon: ClipboardList },
    ]
  },
  {
    category: 'Locations',
    items: [
      { to: '/branches', label: 'Branches', icon: Store },
    ]
  },
  {
    category: 'System',
    items: [
      { to: '/settings', label: 'Settings', icon: Settings },
    ]
  }
]

export default function Sidebar() {
  const navigate = useNavigate()
  const { settings, setUser, addNotification } = useApp()

  function handleLogout() {
    setUser(null)
    localStorage.removeItem('auth_user')
    addNotification({ message: 'Logged out successfully', type: 'info' })
    navigate('/login')
  }

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 text-zinc-600 dark:text-slate-300 flex flex-col h-screen sticky top-0 shrink-0 font-sans antialiased border-r border-zinc-200 dark:border-slate-800 select-none">
      
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-zinc-100 dark:border-slate-800">
        <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/10 shrink-0">
          <Package size={18} className="text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
            {settings.storeName || 'Enterprise OS'}
          </h1>
          <p className="text-[10px] font-medium text-zinc-400 dark:text-slate-500 tracking-wider uppercase">
            Management Portal
          </p>
        </div>
      </div>

      {/* Main Navigation Scroll Space */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5 custom-scrollbar">
        {navigationGroups.map((group) => (
          <div key={group.category} className="space-y-1">
            {/* Category Header */}
            <h3 className="text-[10px] font-semibold tracking-wider text-zinc-400 dark:text-slate-500 uppercase px-3 pb-1">
              {group.category}
            </h3>

            <div className="space-y-0.5">
              {group.items.map((link) => {
                const Icon = link.icon
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className={({ isActive }) => `
                      group relative flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-150 w-full text-sm font-medium
                      ${isActive
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold'
                        : 'hover:bg-zinc-50 dark:hover:bg-slate-800 text-zinc-600 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-white'
                      }
                    `}
                  >
                    {({ isActive }) => (
                      <>
                        {/* Active indicator badge */}
                        {isActive && (
                          <span className="absolute left-0 top-3 bottom-3 w-0.5 bg-indigo-600 rounded-r-full" />
                        )}

                        <Icon
                          size={18}
                          className={`shrink-0 transition-colors ${
                            isActive 
                              ? 'text-indigo-600 dark:text-indigo-400' 
                              : 'text-zinc-400 dark:text-slate-500 group-hover:text-zinc-600 dark:group-hover:text-slate-200'
                          }`}
                        />

                        <span className="truncate">{link.label}</span>
                      </>
                    )}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Profile & Footer Action */}
      <div className="p-3 border-t border-zinc-100 dark:border-slate-800 bg-zinc-50/50 dark:bg-slate-800/50">
        <div className="flex items-center justify-between p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-slate-700/50 transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-slate-700 border border-zinc-200 dark:border-slate-600 flex items-center justify-center shrink-0 overflow-hidden">
              <UserCircle size={20} className="text-zinc-400 dark:text-slate-400" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-zinc-800 dark:text-slate-200 truncate">Administrator</span>
              <span className="text-[10px] text-zinc-400 dark:text-slate-500 truncate">Active Session</span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-1.5 rounded-md text-zinc-400 dark:text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all duration-150"
            aria-label="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

    </aside>
  )
}