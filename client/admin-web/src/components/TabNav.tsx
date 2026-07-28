import type { ReactNode } from 'react'

export interface TabItem {
  key: string
  label: string
  icon?: ReactNode
  badge?: number
}

interface TabNavProps {
  tabs: TabItem[]
  activeKey: string
  onTabChange: (key: string) => void
  className?: string
}

export default function TabNav({ tabs, activeKey, onTabChange, className = '' }: TabNavProps) {
  return (
    <div className={`border-b border-surface-200 dark:border-surface-800 mb-6 ${className}`}>
      <nav className="flex gap-1 overflow-x-auto scrollbar-none">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`relative flex items-center gap-2 px-3 pb-3 pt-1 text-[13px] font-medium transition-colors whitespace-nowrap after:absolute after:inset-x-2 after:-bottom-px after:h-0.5 after:rounded-full after:transition-colors ${
              activeKey === tab.key
                ? 'text-surface-900 dark:text-white after:bg-surface-900 dark:after:bg-white'
                : 'text-surface-500 dark:text-surface-400 hover:text-surface-800 dark:hover:text-surface-200 after:bg-transparent'
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className={`min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-[10px] font-bold leading-none tabular-nums ${
                activeKey === tab.key
                  ? 'bg-surface-900 dark:bg-white text-white dark:text-surface-900'
                  : 'bg-surface-100 dark:bg-surface-800 text-surface-500 dark:text-surface-400'
              }`}>
                {tab.badge > 99 ? '99+' : tab.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}
