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
    <div className={`border-b border-surface-200 dark:border-surface-700 mb-6 ${className}`}>
      <nav className="flex gap-6 overflow-x-auto scrollbar-none">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center gap-2 pb-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeKey === tab.key
                ? 'border-surface-900 dark:border-white text-surface-900 dark:text-white'
                : 'border-transparent text-surface-500 dark:text-surface-400 hover:text-surface-700 dark:hover:text-surface-300'
            }`}
          >
            {tab.icon && <span className="shrink-0">{tab.icon}</span>}
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span className="min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-surface-900 dark:bg-white text-white dark:text-surface-900 text-[10px] font-bold leading-none">
                {tab.badge > 99 ? '99+' : tab.badge}
              </span>
            )}
          </button>
        ))}
      </nav>
    </div>
  )
}
