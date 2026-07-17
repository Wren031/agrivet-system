import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'
import type { NotificationCounts } from '../services/notificationService'
import { fetchNotificationCounts } from '../services/notificationService'

interface Settings {
  storeName: string
  adminEmail: string
  currencySymbol: string
  lowStockThreshold: number
}

interface Notification {
  id: string
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

interface AuthUser {
  id: string
  email: string
  name: string
}

interface AppContextType {
  settings: Settings
  updateSettings: (s: Settings) => void
  notifications: Notification[]
  addNotification: (n: Omit<Notification, 'id'>) => void
  removeNotification: (id: string) => void
  loading: boolean
  setLoading: (v: boolean) => void
  user: AuthUser | null
  setUser: (u: AuthUser | null) => void
  darkMode: boolean
  setDarkMode: (v: boolean) => void
  sidebarOpen: boolean
  setSidebarOpen: (v: boolean) => void
  counts: NotificationCounts
  refreshCounts: () => Promise<void>
}

const defaultSettings: Settings = {
  storeName: 'Agrivet Supply',
  adminEmail: 'admin@agrivet.com',
  currencySymbol: 'Php',
  lowStockThreshold: 10,
}

const AppContext = createContext<AppContextType | null>(null)

export function AppProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem('appSettings')
    return stored ? JSON.parse(stored) : defaultSettings
  })
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<AuthUser | null>(() => {
    const stored = localStorage.getItem('auth_user')
    return stored ? JSON.parse(stored) : null
  })
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true'
  })
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [counts, setCounts] = useState<NotificationCounts>({
    newOrders: 0,
    newAgents: 0,
    newBranches: 0,
    pendingTasks: 0,
    agentBookingOrders: 0,
    branchBookingOrders: 0,
  })

  const refreshCounts = useCallback(async () => {
    try {
      const result = await fetchNotificationCounts()
      setCounts(result)
    } catch {
      // silently ignore errors
    }
  }, [])

  useEffect(() => {
    refreshCounts()
    const interval = setInterval(refreshCounts, 30000)
    return () => clearInterval(interval)
  }, [refreshCounts])

  useEffect(() => {
    localStorage.setItem('appSettings', JSON.stringify(settings))
  }, [settings])

  useEffect(() => {
    if (user) {
      localStorage.setItem('auth_user', JSON.stringify(user))
    } else {
      localStorage.removeItem('auth_user')
    }
  }, [user])

  useEffect(() => {
    localStorage.setItem('darkMode', String(darkMode))
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [darkMode])

  const updateSettings = (s: Settings) => setSettings(s)

  const addNotification = (n: Omit<Notification, 'id'>) => {
    const id = crypto.randomUUID()
    setNotifications(prev => [...prev, { ...n, id }])
    setTimeout(() => {
      setNotifications(prev => prev.filter(item => item.id !== id))
    }, 4000)
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(item => item.id !== id))
  }

  return (
    <AppContext.Provider value={{
      settings, updateSettings,
      notifications, addNotification, removeNotification,
      loading, setLoading,
      user, setUser,
      darkMode, setDarkMode,
      sidebarOpen, setSidebarOpen,
      counts, refreshCounts,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
