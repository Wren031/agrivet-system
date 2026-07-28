import { useState, useEffect } from 'react'
import { Bell, X, LogOut, Sun, Moon, Menu } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useAuth } from '../features/auth/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { logout as apiLogout } from '../features/auth/services/authService'
import Modal from './Modal'

export default function Navbar() {
  const { notifications, removeNotification, addNotification, darkMode, setDarkMode, sidebarOpen, setSidebarOpen } = useApp()
  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  const formattedDateTime = currentTime.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }) + ' • ' + currentTime.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  function confirmLogout() {
    setShowLogoutModal(false)
    setShowProfile(false)
    apiLogout().finally(() => {
      signOut()
      addNotification({ message: 'Logged out successfully', type: 'info' })
      navigate('/login')
    })
  }

  return (
    <header className="bg-white dark:bg-surface-950 border-b border-surface-200 dark:border-surface-800 h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="lg:hidden p-2 rounded-lg border border-transparent hover:border-surface-200 dark:hover:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-900 text-surface-500 dark:text-surface-400 transition-all duration-150"
          aria-label="Toggle menu"
        >
          <Menu size={19} />
        </button>
        <div className="min-w-0">
          <h2 className="text-[14px] font-semibold text-surface-900 dark:text-white tracking-tight truncate">
            Welcome back, {user?.name || 'Admin'}
          </h2>
          <p className="text-[11px] text-surface-400 dark:text-surface-500 mt-0.5 tabular-nums">
            {formattedDateTime}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg border border-transparent hover:border-surface-200 dark:hover:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-900 text-surface-500 dark:text-surface-400 transition-all duration-150"
          title={darkMode ? 'Disable dark mode' : 'Enable dark mode'}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`relative p-2 rounded-lg border transition-all duration-150 ${
              showNotifications
                ? 'border-surface-200 dark:border-surface-800 bg-surface-50 dark:bg-surface-900 text-surface-700 dark:text-surface-200'
                : 'border-transparent hover:border-surface-200 dark:hover:border-surface-800 hover:bg-surface-50 dark:hover:bg-surface-900 text-surface-500 dark:text-surface-400'
            }`}
          >
            <Bell size={16} />
            {notifications.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-surface-900 dark:bg-white text-white dark:text-surface-900 text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-surface-950 tabular-nums">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden z-50 animate-scale-in">
                <div className="px-4 py-3 border-b border-surface-100 dark:border-surface-800 flex items-center justify-between">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-surface-500 dark:text-surface-400">Notifications</p>
                  {notifications.length > 0 && (
                    <span className="text-[10px] font-semibold text-surface-400 dark:text-surface-500 tabular-nums">{notifications.length} new</span>
                  )}
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center">
                      <Bell size={20} className="mx-auto mb-2 text-surface-300 dark:text-surface-600" />
                      <p className="text-sm text-surface-400 dark:text-surface-500">No notifications</p>
                    </div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-surface-50 dark:hover:bg-surface-800/50 border-b border-surface-100 dark:border-surface-800/60 last:border-0 transition-colors">
                        <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                          n.type === 'success' ? 'bg-success' :
                          n.type === 'warning' ? 'bg-warning' :
                          n.type === 'error' ? 'bg-error' : 'bg-info'
                        }`} />
                        <p className="text-xs text-surface-600 dark:text-surface-300 flex-1 leading-relaxed">{n.message}</p>
                        <button onClick={() => removeNotification(n.id)} className="p-0.5 rounded text-surface-300 dark:text-surface-600 hover:text-surface-500 dark:hover:text-surface-400 shrink-0 transition-colors">
                          <X size={13} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center ml-1.5 pl-3 border-l border-surface-200 dark:border-surface-800 py-1"
          >
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center text-xs font-semibold transition-all duration-150 ${
              showProfile
                ? 'bg-surface-900 dark:bg-white text-white dark:text-surface-900 border-surface-900 dark:border-white'
                : 'bg-surface-100 dark:bg-surface-800 text-surface-600 dark:text-surface-300 border-surface-200 dark:border-surface-700 hover:border-surface-300 dark:hover:border-surface-600'
            }`}>
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
          </button>

          {showProfile && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
              <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-surface-900 rounded-xl border border-surface-200 dark:border-surface-700 overflow-hidden z-50 animate-scale-in">
                <div className="px-4 py-3 border-b border-surface-100 dark:border-surface-800">
                  <p className="text-[10px] font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-[0.08em]">Signed in as</p>
                  <p className="text-sm font-semibold text-surface-800 dark:text-surface-200 truncate mt-0.5">{user?.name || 'Admin'}</p>
                </div>
                <div className="p-1.5">
                  <button
                    onClick={() => { setShowProfile(false); setShowLogoutModal(true) }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium rounded-lg text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-800 hover:text-surface-700 dark:hover:text-surface-200 transition-colors"
                  >
                    <LogOut size={14} />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

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
    </header>
  )
}
