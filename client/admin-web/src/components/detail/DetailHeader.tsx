import { type ReactNode } from 'react'

interface DetailHeaderProps {
  title: string
  subtitle?: string
  avatar?: string
  avatarSrc?: string
  avatarIcon?: ReactNode
  children?: ReactNode
}

export default function DetailHeader({
  title,
  subtitle,
  avatar,
  avatarSrc,
  avatarIcon,
  children,
}: DetailHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-4 min-w-0">
        {avatarSrc ? (
          <div className="w-12 h-12 rounded-xl overflow-hidden border border-surface-200 dark:border-surface-700 shrink-0 bg-surface-100 dark:bg-surface-800">
            <img
              src={avatarSrc}
              alt={title}
              className="w-full h-full object-cover"
              onError={e => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
        ) : avatar ? (
          <div className="w-12 h-12 rounded-xl bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 flex items-center justify-center text-surface-600 dark:text-surface-400 font-bold text-lg shrink-0 uppercase">
            {avatar}
          </div>
        ) : avatarIcon ? (
          <div className="w-12 h-12 rounded-xl bg-surface-100 dark:bg-surface-800 border border-surface-200 dark:border-surface-700 flex items-center justify-center shrink-0">
            {avatarIcon}
          </div>
        ) : null}
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-surface-900 dark:text-white tracking-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-surface-500 dark:text-surface-400 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
      </div>
      {children && (
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          {children}
        </div>
      )}
    </div>
  )
}
