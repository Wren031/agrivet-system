import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, Users, UserCircle, ShoppingCart, Settings, 
  Tags, LogOut, Store, ClipboardList, ClipboardCheck, BadgeCheck
} from 'lucide-react'
import { useApp } from '../context/AppContext'

// Fully flattened, sequentially itemized navigation architecture split by categorical labels
const navigationConfig = [
  { 
    groupLabel: 'Core Business',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/orders', label: 'Orders & Sales', icon: ShoppingCart },
      { to: '/bookings', label: 'Bookings', icon: ClipboardList },
      { to: '/inventory', label: 'Inventory Items', icon: Package },
    ]
  },
  {
    groupLabel: 'Team & Operations',
    items: [
      { to: '/customers', label: 'Customers', icon: UserCircle },
      { to: '/agents', label: 'Agents', icon: Users },
      { to: '/staff', label: 'Admin Staff', icon: BadgeCheck },
      { to: '/tasks', label: 'Staff Punch', icon: ClipboardCheck },
    ]
  },
  {
    groupLabel: 'System Setup',
    items: [
      { to: '/categories', label: 'Categories', icon: Tags },
      { to: '/branches', label: 'Branches', icon: Store },
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
    <aside className="w-64 bg-zinc-50/80 dark:bg-slate-900/90 text-zinc-600 dark:text-slate-300 flex flex-col h-screen sticky top-0 shrink-0 font-sans antialiased border-r border-zinc-200/80 dark:border-slate-800/80 backdrop-blur-md select-none">
      
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-zinc-200/50 dark:border-slate-800/50">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-600/20 shrink-0">
          <Package size={18} className="text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-zinc-900 dark:text-white truncate tracking-tight">
            {settings.storeName || 'Enterprise OS'}
          </h1>
          <p className="text-[10px] font-semibold text-zinc-400 dark:text-slate-500 tracking-wider uppercase">
            Management Portal
          </p>
        </div>
      </div>

      {/* Main Navigation Scroll Space */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 custom-scrollbar">
        {navigationConfig.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1.5">
            {/* Structural Group Label */}
            <p className="px-3.5 text-[10px] font-bold text-zinc-400 dark:text-slate-500 uppercase tracking-wider">
              {group.groupLabel}
            </p>

            {group.items.map((link) => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `
                    group relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 w-full text-sm font-medium
                    hover:translate-x-0.5
                    ${isActive
                      ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm shadow-zinc-200/50 dark:shadow-none'
                      : 'hover:bg-zinc-200/50 dark:hover:bg-slate-800/60 text-zinc-500 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-white'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      {/* Floating Modern Active Line Badge */}
                      <span className={`absolute left-0 w-1 bg-indigo-600 dark:bg-indigo-500 rounded-r-full transition-all duration-200 ${
                        isActive ? 'top-3.5 bottom-3.5 opacity-100' : 'top-1/2 bottom-1/2 opacity-0'
                      }`} />

                      <Icon
                        size={18}
                        className={`shrink-0 transition-colors duration-200 ${
                          isActive 
                            ? 'text-indigo-600 dark:text-indigo-400' 
                            : 'text-zinc-400 dark:text-slate-500 group-hover:text-zinc-700 dark:group-hover:text-slate-300'
                        }`}
                      />

                      <span className="truncate">{link.label}</span>
                    </>
                  )}
                </NavLink>
              )
            })}
          </div>
        ))}
      </div>

      {/* Profile & Footer Action */}
      <div className="p-3 border-t border-zinc-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
        <div className="flex items-center justify-between p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-slate-800/50 transition-colors duration-200">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-slate-800 border border-zinc-200 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
              <UserCircle size={20} className="text-zinc-400 dark:text-slate-400" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-semibold text-zinc-800 dark:text-slate-200 truncate">Administrator</span>
              <span className="text-[10px] font-medium text-emerald-600 dark:text-emerald-400 truncate flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                Active Session
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 rounded-lg text-zinc-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all duration-200"
            aria-label="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

    </aside>
  )
}