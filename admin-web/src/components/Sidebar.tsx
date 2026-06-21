import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, Users, UserCircle, ShoppingCart, Settings,
  Tags, LogOut, Store, ClipboardList, ClipboardCheck, BadgeCheck, ShieldCheck
} from 'lucide-react'
import { useApp } from '../context/AppContext'

interface NavItem {
  to: string
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}

interface NavGroup {
  id: string | number
  label: string
  items: NavItem[]
}

const navigationConfig: NavGroup[] = [
  {
    id: 'core',
    label: 'Main',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/orders', label: 'Orders & Sales', icon: ShoppingCart },
      { to: '/bookings', label: 'Bookings', icon: ClipboardList },
      { to: '/inventory', label: 'Inventory Items', icon: Package },
    ]
  },
  {
    id: 'management',
    label: 'Management',
    items: [
      { to: '/customers', label: 'Customers', icon: UserCircle },
      { to: '/agents', label: 'Agents', icon: Users },
      { to: '/staff', label: 'Admin Staff', icon: BadgeCheck },
      { to: '/tasks', label: 'Staff Punch', icon: ClipboardCheck },
      { to: '/verification', label: 'Verification', icon: ShieldCheck },
    ]
  },
  {
    id: 'system',
    label: 'System',
    items: [
      { to: '/categories', label: 'Categories', icon: Tags },
      { to: '/branches', label: 'Branches', icon: Store },
      { to: '/settings', label: 'Settings', icon: Settings },
    ]
  }
]

export default function Sidebar() {
  const navigate = useNavigate()
  const { settings, setUser, addNotification, sidebarOpen, setSidebarOpen } = useApp()

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('auth_user')
    addNotification({ message: 'Logged out successfully', type: 'info' })
    setSidebarOpen(false)
    navigate('/login')
  }

  return (
    <aside
      className={`
        fixed lg:sticky top-0 left-0 h-screen w-64 bg-zinc-900 text-zinc-400 flex flex-col shrink-0
        border-r border-zinc-800 select-none dark:bg-slate-950 dark:border-slate-900
        z-50 lg:z-[41] transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-zinc-800/60 dark:border-slate-900 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center shrink-0">
          <Package size={16} className="text-white" />
        </div>
        <h1 className="text-sm font-semibold text-zinc-100 dark:text-white truncate">
          {settings?.storeName || 'Enterprise OS'}
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {navigationConfig.map((group) => (
          <div key={group.id}>
            <div className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-slate-600">
              {group.label}
            </div>
            <div className="space-y-0.5">
            {group.items.map((link) => {
              const Icon = link.icon
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) => `
                    group flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-150 w-full text-sm
                    ${isActive
                      ? 'bg-zinc-800 text-zinc-100 dark:bg-slate-900 dark:text-indigo-400'
                      : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200 dark:text-slate-500 dark:hover:bg-slate-900/40 dark:hover:text-slate-300'
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={18}
                        className={`shrink-0 ${
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
          </div>
        ))}
      </nav>

      {/* Profile */}
      <div className="shrink-0 border-t border-zinc-800/60 dark:border-slate-900">
        <div className="flex items-center justify-between px-5 py-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-zinc-800 dark:bg-slate-800 flex items-center justify-center shrink-0">
              <UserCircle size={16} className="text-zinc-400 dark:text-slate-500" />
            </div>
            <span className="text-sm font-medium text-zinc-200 dark:text-slate-300 truncate">
              Administrator
            </span>
          </div>
          <button
            onClick={handleLogout}
            aria-label="Log Out"
            className="p-1.5 rounded-md text-zinc-500 hover:text-indigo-400 hover:bg-indigo-950/20 transition-all duration-150"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  )
}
