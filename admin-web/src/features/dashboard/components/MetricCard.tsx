import type { ReactNode } from 'react'

interface MetricCardProps {
  title: string
  value: string | number
  icon: ReactNode
  color: string
  trend?: { value: string; positive: boolean }
}

interface PaletteEntry {
  cardBg: string
  iconBg: string
  iconColor: string
  barColor: string
  badgeBg: string
  badgeText: string
}

const palette: Record<string, PaletteEntry> = {
  'bg-indigo-50 dark:bg-indigo-950/30': {
    cardBg: 'bg-indigo-50 dark:bg-indigo-950/20',
    iconBg: 'bg-indigo-200/50 dark:bg-indigo-800/50',
    iconColor: 'text-indigo-600 dark:text-indigo-400',
    barColor: 'bg-indigo-500',
    badgeBg: 'bg-indigo-100 dark:bg-indigo-900/40',
    badgeText: 'text-indigo-700 dark:text-indigo-300',
  },
}

export default function MetricCard({ title, value, icon, color, trend }: MetricCardProps) {
  const p = palette[color] || palette['bg-indigo-50 dark:bg-indigo-950/30']

  return (
    <div
      className={`group w-full ${p.cardBg} rounded-2xl border border-slate-200/70 dark:border-slate-700/60 overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-slate-200/60 dark:hover:shadow-slate-900/40 hover:-translate-y-0.5 hover:border-slate-300/80 dark:hover:border-slate-600/80`}
    >
      <div className="flex flex-col h-full p-5 gap-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-[0.1em]">{title}</span>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${p.iconBg} shrink-0`}>
            <div className={p.iconColor}>
              {icon}
            </div>
          </div>
        </div>

        <div className="flex items-end justify-between gap-2 mt-auto">
          <p className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight leading-none">
            {value}
          </p>
          {trend && (
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold ${p.badgeBg} ${p.badgeText} shrink-0`}>
              <svg className={`w-3 h-3 ${trend.positive ? '' : 'rotate-180'}`} viewBox="0 0 12 12" fill="none">
                <path d="M6 2L10 8H2L6 2Z" fill="currentColor" />
              </svg>
              <span>{trend.value}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
