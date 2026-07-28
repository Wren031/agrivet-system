interface BarChartProps {
  data: { label: string; value: number }[]
  height?: number
  currency?: string
}

export default function BarChart({ data, height = 200, currency }: BarChartProps) {
  const max = Math.max(...data.map(d => d.value), 1)

  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((item, i) => {
        const pct = (item.value / max) * 100
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400">
              {currency ? `${currency}${item.value.toLocaleString()}` : item.value}
            </span>
            <div className="w-full rounded-lg bg-gradient-to-t from-indigo-500 to-indigo-400 dark:from-indigo-500 dark:to-indigo-400/80 transition-all duration-500 hover:from-indigo-600 hover:to-indigo-500 relative group cursor-pointer"
              style={{ height: `${pct}%`, minHeight: pct > 0 ? 4 : 0 }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 dark:bg-slate-700 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-white/10">
                {currency && `${currency}`}{item.value.toLocaleString()}
              </div>
            </div>
            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium truncate w-full text-center">
              {item.label}
            </span>
          </div>
        )
      })}
    </div>
  )
}
