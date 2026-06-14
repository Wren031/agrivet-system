import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, Users, UserCircle, ShoppingCart, Settings, 
  Tags, LogOut, Store, ClipboardList, ClipboardCheck, BadgeCheck, ShieldCheck
} from 'lucide-react'
import { useApp } from '../context/AppContext'

// Fully flattened, sequentially itemized navigation architecture split by categorical labels
// Semantically mapped navigation architecture aligned to exact item scopes
const navigationConfig = [
  { 
    groupLabel: 'Sales & Inventory',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/orders', label: 'Orders & Sales', icon: ShoppingCart },
      { to: '/bookings', label: 'Bookings', icon: ClipboardList },
      { to: '/inventory', label: 'Inventory Items', icon: Package },
    ]
  },
  {
    groupLabel: 'Personnel & Compliance',
    items: [
      { to: '/customers', label: 'Customers', icon: UserCircle },
      { to: '/agents', label: 'Agents', icon: Users },
      { to: '/staff', label: 'Admin Staff', icon: BadgeCheck },
      { to: '/tasks', label: 'Staff Punch', icon: ClipboardCheck },
      { to: '/verification', label: 'Verification', icon: ShieldCheck },
    ]
  },
  {
    groupLabel: 'Infrastructure & Settings',
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
    <aside className="w-64 bg-zinc-900 text-zinc-400 flex flex-col h-screen sticky top-0 shrink-0 font-sans antialiased border-r border-zinc-800 select-none dark:bg-slate-950 dark:border-slate-900 z-[41]">
      
      {/* Brand Header */}
      <div className="p-6 flex items-center gap-3 border-b border-zinc-800/60 dark:border-slate-900">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md shadow-indigo-600/10 shrink-0">
          <Package size={16} className="text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-zinc-100 dark:text-white truncate tracking-tight">
            {settings.storeName || 'Enterprise OS'}
          </h1>
          <p className="text-[10px] font-medium text-zinc-500 dark:text-slate-500 tracking-wider uppercase">
            Management Portal
          </p>
        </div>
      </div>

      {/* Main Navigation - Scrollable but scrollbar hidden */}
      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-7 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {navigationConfig.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-1">
            {/* Structural Group Label */}
            <p className="px-3 text-[10px] font-semibold text-zinc-500 dark:text-slate-600 uppercase tracking-widest mb-2">
              {group.groupLabel}
            </p>

            {group.items.map((link) => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) => `
                    group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 w-full text-xs font-medium tracking-wide
                    ${isActive
                      ? 'bg-zinc-800 text-zinc-100 dark:bg-slate-900 dark:text-indigo-400'
                      : 'hover:bg-zinc-800/40 hover:text-zinc-200 dark:hover:bg-slate-900/40 dark:hover:text-slate-300 text-zinc-400 dark:text-slate-500'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={16}
                        className={`shrink-0 transition-colors duration-150 ${
                          isActive 
                            ? 'text-indigo-500 dark:text-indigo-400' 
                            : 'text-zinc-500 dark:text-slate-600 group-hover:text-zinc-400 dark:group-hover:text-slate-400'
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
      <div className="p-4 border-t border-zinc-800/60 dark:border-slate-900 bg-zinc-900/50 dark:bg-slate-950/50">
        <div className="flex items-center justify-between p-2 rounded-xl bg-zinc-800/30 dark:bg-slate-900/20 border border-zinc-800/50 dark:border-slate-900/60">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-zinc-800 dark:bg-slate-800 border border-zinc-700 dark:border-slate-700 flex items-center justify-center shrink-0 overflow-hidden">
              <UserCircle size={18} className="text-zinc-400 dark:text-slate-500" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-zinc-200 dark:text-slate-300 truncate">Administrator</span>
              <span className="text-[9px] font-medium text-emerald-500 dark:text-emerald-400 truncate flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                Active Session
              </span>
            </div>
          </div>

          <button
            onClick={handleLogout}
            title="Log Out"
            className="p-2 rounded-md text-zinc-500 dark:text-slate-500 hover:text-red-400 dark:hover:text-red-400 hover:bg-red-950/20 transition-all duration-150"
            aria-label="Log Out"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>

    </aside>
  )
}