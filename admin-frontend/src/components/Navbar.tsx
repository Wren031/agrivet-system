import { useState } from 'react'
import { Bell, X, ChevronDown, LogOut, Sun, Moon } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { notifications, removeNotification, user, setUser, addNotification, darkMode, setDarkMode } = useApp()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  function handleLogout() {
    setUser(null)
    localStorage.removeItem('auth_user')
    addNotification({ message: 'Logged out successfully', type: 'info' })
    navigate('/login')
  }

  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 h-16 flex items-center justify-between px-6 sticky top-0 z-30">
      <div>
        <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
          Welcome, {user?.name || 'Admin'}
        </h2>
        <p className="text-xs text-slate-400 dark:text-slate-500">Manage your inventory system</p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={darkMode ? 'Disable dark mode' : 'Enable dark mode'}
        >
          {darkMode ? (
            <Sun size={20} className="text-slate-400" />
          ) : (
            <Moon size={20} className="text-slate-500" />
          )}
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell size={20} className="text-slate-500 dark:text-slate-400" />
            {notifications.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">Notifications</p>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 dark:text-slate-500 text-sm">No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-50 dark:border-slate-800/50 last:border-0">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          n.type === 'success' ? 'bg-green-500' :
                          n.type === 'warning' ? 'bg-amber-500' :
                          n.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                        }`} />
                        <p className="text-sm text-slate-600 dark:text-slate-300 flex-1">{n.message}</p>
                        <button onClick={() => removeNotification(n.id)} className="text-slate-300 dark:text-slate-600 hover:text-slate-500 shrink-0">
                          <X size={14} />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center gap-2.5 pl-4 border-l border-slate-200 dark:border-slate-700 py-1"
          >
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{user?.name || 'Admin'}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{user?.email || 'admin@agrivet.com'}</p>
            </div>
            <ChevronDown size={14} className="text-slate-400 dark:text-slate-500" />
          </button>

          {showProfile && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{user?.name || 'Admin'}</p>
                  <p className="text-xs text-slate-400 dark:text-slate-500">{user?.email || 'admin@agrivet.com'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
