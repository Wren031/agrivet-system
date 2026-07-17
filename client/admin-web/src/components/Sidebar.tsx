import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Package, Users, Users2, UserCircle, Settings,
  Tags, LogOut, Store, ClipboardCheck, ShieldCheck,
  TrendingUp, CalendarDays, Sliders, ChevronDown
} from 'lucide-react' 
import { useApp } from '../context/AppContext'
import { useAuth } from '../features/auth/context/AuthContext'
import { logout as apiLogout } from '../features/auth/services/authService'
import Modal from './Modal'

interface NavItem {
  to: string
  label: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  badge?: 'newOrders' | 'newAgents' | 'newBranches' | 'pendingTasks'
}

interface NavGroup {
  id: string
  label: string
  items: NavItem[]
}

const navigationConfig: NavGroup[] = [
  {
    id: 'operations',
    label: 'Operations',
    items: [
      { to: '/', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/orders', label: 'Orders & Sales', icon: TrendingUp, badge: 'newOrders' },      
      { to: '/bookings', label: 'Receiving Orders', icon: CalendarDays }, 
      { to: '/inventory', label: 'Inventory Items', icon: Package },
    ]
  },
  {
    id: 'users_management',
    label: 'Users & Branches',
    items: [
      { to: '/agents', label: 'Agents', icon: Users2, badge: 'newAgents' },                  
      { to: '/staff', label: 'Admin Staff', icon: Users },            
      { to: '/branches', label: 'Branches', icon: Store, badge: 'newBranches' },
    ]
  },
  {
    id: 'transactions',
    label: 'Transactions',
    items: [
      { to: '/customers', label: 'Customers', icon: UserCircle },
      { to: '/tasks', label: 'My Task', icon: ClipboardCheck, badge: 'pendingTasks' },
      { to: '/verification', label: 'Verification', icon: ShieldCheck },
    ]
  },
  {
    id: 'administration',
    label: 'Administration',
    items: [
      { to: '/categories', label: 'Categories', icon: Tags },
      { to: '/settings', label: 'Settings', icon: Sliders },              
    ]
  }
]

export default function Sidebar() {
  const navigate = useNavigate()
  const { settings, addNotification, sidebarOpen, setSidebarOpen, counts } = useApp()
  const { signOut } = useAuth()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  
  // Track open/collapsed status of navigation categories
  // CHANGED: users_management is now false so it starts closed
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    operations: true,
    users_management: false,
    transactions: true,
    administration: true,
  })

  const toggleGroup = (groupId: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [groupId]: !prev[groupId],
    }))
  }

  function confirmLogout() {
    setShowLogoutModal(false)
    apiLogout().finally(() => {
      signOut()
      addNotification({ message: 'Logged out successfully', type: 'info' })
      setSidebarOpen(false)
      navigate('/login')
    })
  }

  return (
    <>
    <aside
      className={`
        fixed lg:sticky top-0 left-0 h-screen w-64 bg-white dark:bg-surface-950 text-surface-600 dark:text-surface-400 flex flex-col shrink-0
        border-r border-surface-200 dark:border-surface-800 select-none
        z-50 lg:z-[41] transition-transform duration-200 ease-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}
    >
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-surface-100 dark:border-surface-800 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-surface-900 dark:bg-white flex items-center justify-center shrink-0">
          <Package size={16} className="text-white dark:text-surface-900" />
        </div>
        <div className="min-w-0">
          <h1 className="text-sm font-semibold text-surface-900 dark:text-white truncate leading-tight">
            {settings?.storeName || 'Enterprise OS'}
          </h1>
          <p className="text-[11px] text-surface-400 dark:text-surface-500 font-medium">Inventory System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-4">
        {navigationConfig.map((group) => {
          const isOpen = !!openGroups[group.id]
          
          return (
            <div key={group.id} className="space-y-1">
              {/* Dropdown Category Trigger Button */}
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full flex items-center justify-between px-3 py-1.5 text-left rounded-md hover:bg-surface-50 dark:hover:bg-surface-800/30 transition-colors group"
              >
                <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-surface-400 dark:text-surface-500 group-hover:text-surface-600 dark:group-hover:text-surface-300">
                  {group.label}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-surface-400 dark:text-surface-500 transition-transform duration-200 ${
                    isOpen ? 'transform rotate-0' : 'transform -rotate-90'
                  }`}
                />
              </button>

              {/* Collapsible Dropdown Items Container */}
              <div
                className={`space-y-0.5 overflow-hidden transition-all duration-200 origin-top ${
                  isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
                }`}
              >
                {group.items.map((link) => {
                  const Icon = link.icon
                  const count = link.badge ? counts[link.badge] : 0
                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      onClick={() => setSidebarOpen(false)}
                      className={({ isActive }) => `
                        group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 w-full text-sm
                        ${isActive
                          ? 'bg-surface-100 dark:bg-surface-800 text-surface-900 dark:text-white font-medium'
                          : 'text-surface-500 dark:text-surface-400 hover:bg-surface-50 dark:hover:bg-surface-800/50 hover:text-surface-700 dark:hover:text-surface-200'
                        }
                      `}
                    >
                      {({ isActive }) => (
                        <>
                          <Icon
                            size={18}
                            className={`shrink-0 transition-colors duration-150 ${
                              isActive
                                ? 'text-surface-700 dark:text-surface-200'
                                : 'text-surface-400 dark:text-surface-500 group-hover:text-surface-500 dark:group-hover:text-surface-300'
                            }`}
                          />
                          <span className="truncate">{link.label}</span>
                          {count > 0 && (
                            <span className="ml-auto min-w-[20px] h-5 px-1.5 flex items-center justify-center rounded-full bg-surface-900 dark:bg-white text-white dark:text-surface-900 text-[10px] font-bold leading-none">
                              {count > 99 ? '99+' : count}
                            </span>
                          )}
                        </>
                      )}
                    </NavLink>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {/* Profile */}
      <div className="shrink-0 border-t border-surface-100 dark:border-surface-800">
        <div className="flex items-center justify-between px-4 py-3.5">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center shrink-0">
              <UserCircle size={14} className="text-surface-400 dark:text-surface-500" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-surface-800 dark:text-surface-200 truncate leading-tight">
                Administrator
              </p>
              <p className="text-[11px] text-surface-400 dark:text-surface-500">System Admin</p>
            </div>
          </div>
          <button
            onClick={() => setShowLogoutModal(true)}
            aria-label="Log Out"
            className="p-1.5 rounded-lg text-surface-400 dark:text-surface-500 hover:text-surface-600 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 transition-all duration-150"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </aside>

    <Modal open={showLogoutModal} onClose={() => setShowLogoutModal(false)} title="Sign out" size="sm">
      <div className="text-center">
        <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-950/30 flex items-center justify-center mx-auto mb-4">
          <LogOut size={24} className="text-red-500" />
        </div>
        <p className="text-sm text-surface-600 dark:text-surface-400 mb-6">
          Are you sure you want to sign out?
        </p>
        <div className="flex gap-3">
          <button onClick={() => setShowLogoutModal(false)}
            className="flex-1 py-2.5 border border-surface-200 dark:border-surface-700 text-surface-700 dark:text-surface-300 rounded-lg text-sm font-medium hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors">
            Cancel
          </button>
          <button onClick={confirmLogout}
            className="flex-1 py-2.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors">
            Sign out
          </button>
        </div>
      </div>
    </Modal>
    </>
  )
}