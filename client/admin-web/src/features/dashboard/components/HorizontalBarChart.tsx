interface HorizontalBarItem {
  label: string
  value: number
  color?: string
}

interface HorizontalBarChartProps {
  data: HorizontalBarItem[]
  currency?: string
}

const defaultColors = [
  'from-indigo-500 to-indigo-400',
  'from-indigo-600 to-indigo-500',
  'from-indigo-400 to-indigo-300',
  'from-indigo-700 to-indigo-600',
  'from-indigo-500 to-indigo-400',
]

const rankBadges = ['bg-indigo-500', 'bg-indigo-600', 'bg-indigo-400', 'bg-indigo-700', 'bg-indigo-500']

export default function HorizontalBarChart({ data, currency }: HorizontalBarChartProps) {
  const max = Math.max(...data.map(d => d.value), 1)

  return (
    <div className="space-y-4">
      {data.map((item, i) => {
        const pct = (item.value / max) * 100
        const gradient = item.color || defaultColors[i % defaultColors.length]
        return (
          <div key={i} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold text-white ${rankBadges[i % rankBadges.length]} shrink-0 shadow-sm`}>
                  {i + 1}
                </span>
                <span className="text-slate-600 dark:text-slate-300 font-medium truncate">{item.label}</span>
              </div>
              <span className="text-slate-500 dark:text-slate-400 font-semibold shrink-0 ml-2 tabular-nums">
                {currency}{item.value.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-700/60 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full bg-gradient-to-r ${gradient} animate-[bar-grow_0.8s_ease-out_forwards]`}
                style={{
                  width: `${pct}%`,
                  minWidth: pct > 0 ? 4 : 0,
                }}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
