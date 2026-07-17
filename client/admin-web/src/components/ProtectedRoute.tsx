import { Navigate } from 'react-router-dom'
import { useAuth } from '../features/auth/context/AuthContext'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  roles?: string[]
}

export default function ProtectedRoute({ children, roles }: Props) {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-surface-950">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-surface-300 dark:border-surface-600 border-t-surface-900 dark:border-t-white rounded-full animate-spin" />
          <p className="text-sm text-surface-400 dark:text-surface-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}
