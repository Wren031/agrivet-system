import { useState, useEffect } from 'react'
import { Bell, X, LogOut, Sun, Moon, Clock } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { useNavigate } from 'react-router-dom'

export default function Navbar() {
  const { notifications, removeNotification, user, setUser, addNotification, darkMode, setDarkMode } = useApp()
  const navigate = useNavigate()
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Updates the clock automatically every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Modern dashboard string composition: e.g., "Thu, Jun 11, 2026 • 5:41 AM"
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

  function handleLogout() {
    setUser(null)
    localStorage.removeItem('auth_user')
    addNotification({ message: 'Logged out successfully', type: 'info' })
    navigate('/login')
  }

  return (
    <header className="bg-white/80 dark:bg-slate-900/80 border-b border-zinc-200/80 dark:border-slate-800/80 h-16 flex items-center justify-between px-6 sticky top-0 z-30 backdrop-blur-md">
      <div>
        <h2 className="text-base font-semibold text-zinc-900 dark:text-white tracking-tight">
          Welcome, {user?.name || 'Admin'}
        </h2>
        {/* Dynamic Live Date & Time Element */}
        <p className="text-xs text-zinc-400 dark:text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
          <span>{formattedDateTime}</span>
        </p>
      </div>

      <div className="flex items-center gap-4">
        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-slate-800/60 text-zinc-500 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-white transition-all duration-200"
          title={darkMode ? 'Disable dark mode' : 'Enable dark mode'}
        >
          {darkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-slate-800/60 text-zinc-500 dark:text-slate-400 hover:text-zinc-900 dark:hover:text-white transition-all duration-200"
          >
            <Bell size={18} />
            {notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-indigo-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
                {notifications.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-200/60 dark:border-slate-800 overflow-hidden z-50 transform origin-top-right transition-all duration-200">
                <div className="px-4 py-3 border-b border-zinc-100 dark:border-slate-800/60 bg-zinc-50/50 dark:bg-slate-900/50">
                  <p className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-slate-500">Notifications</p>
                </div>
                <div className="max-h-72 overflow-y-auto custom-scrollbar">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-zinc-400 dark:text-slate-500 text-sm font-medium">No notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n.id} className="flex items-start gap-3 px-4 py-3.5 hover:bg-zinc-50 dark:hover:bg-slate-800/40 border-b border-zinc-100 dark:border-slate-800/40 last:border-0 transition-colors duration-150">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
                          n.type === 'success' ? 'bg-emerald-500' :
                          n.type === 'warning' ? 'bg-amber-500' :
                          n.type === 'error' ? 'bg-rose-500' : 'bg-indigo-500'
                        }`} />
                        <p className="text-xs font-medium text-zinc-600 dark:text-slate-300 flex-1 leading-relaxed">{n.message}</p>
                        <button onClick={() => removeNotification(n.id)} className="text-zinc-300 dark:text-slate-600 hover:text-zinc-500 dark:hover:text-slate-400 shrink-0 transition-colors">
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

        {/* Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfile(!showProfile)}
            className="flex items-center pl-4 border-l border-zinc-200 dark:border-slate-800 py-1"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-indigo-600/10 transition-transform duration-200 hover:scale-105 active:scale-95">
              {user?.name?.charAt(0).toUpperCase() || 'A'}
            </div>
          </button>

          {showProfile && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowProfile(false)} />
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-zinc-200/50 dark:shadow-none border border-zinc-200/60 dark:border-slate-800 overflow-hidden z-50">
                <div className="px-4 py-3 border-b border-zinc-100 dark:border-slate-800/60 bg-zinc-50/50 dark:bg-slate-900/50">
                  <p className="text-xs font-bold text-zinc-400 dark:text-slate-500 uppercase tracking-wider">Account</p>
                  <p className="text-sm font-semibold text-zinc-800 dark:text-slate-200 truncate mt-0.5">{user?.name || 'Admin'}</p>
                </div>
                <div className="p-1.5">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors duration-150"
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
    </header>
  )
}