import { useState, useId } from 'react'

interface LineChartProps {
  data: { label: string; value: number }[]
  height?: number
  currency?: string
}

export default function LineChart({ data, height = 220, currency = '$' }: LineChartProps) {
  const [hovered, setHovered] = useState<number | null>(null)
  const baseUid = useId()
  const cleanUid = baseUid.replace(/:/g, '') // Strips React 18 colons for micro-clean SVG references

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/40 rounded-xl border border-dashed border-slate-200 dark:border-slate-800" style={{ height }}>
        <p className="text-sm font-medium text-slate-400 dark:text-slate-500">No layout metrics data available</p>
      </div>
    )
  }

  // Linear Range Layout Framework
  const values = data.map(d => d.value)
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const range = max - min || 1

  // Standard high-fidelity canvas mapping
  const width = 600 
  const padding = { top: 32, right: 24, bottom: 32, left: 56 }
  const chartW = width - padding.left - padding.right
  const chartH = height - padding.top - padding.bottom
  const stepX = data.length > 1 ? chartW / (data.length - 1) : chartW

  const xPos = (i: number) => padding.left + i * stepX
  const yPos = (v: number) => padding.top + chartH - ((v - min) / range) * chartH

  // Bezier Interpolator Path Loop
  const linePath = data.map((d, i) => {
    const x = xPos(i)
    const y = yPos(d.value)
    if (i === 0) return `M ${x} ${y}`
    
    const prevX = xPos(i - 1)
    const prevY = yPos(data[i - 1].value)
    const cx1 = prevX + (x - prevX) / 2
    const cy1 = prevY
    const cx2 = prevX + (x - prevX) / 2
    const cy2 = y
    return `C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x} ${y}`
  }).join(' ')

  const areaPath = `${linePath} L ${xPos(data.length - 1)} ${padding.top + chartH} L ${xPos(0)} ${padding.top + chartH} Z`

  const yTicks = 4
  const tickValues = Array.from({ length: yTicks + 1 }, (_, i) => min + (range / yTicks) * i)

  return (
    <div className="relative select-none w-full" style={{ height }}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={`${cleanUid}-area`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(99,102,241)" stopOpacity="0.24" />
            <stop offset="50%" stopColor="rgb(139,92,246)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="rgb(99,102,241)" stopOpacity="0.00" />
          </linearGradient>
          <linearGradient id={`${cleanUid}-stroke`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgb(99,102,241)" />
            <stop offset="50%" stopColor="rgb(139,92,246)" />
            <stop offset="100%" stopColor="rgb(99,102,241)" />
          </linearGradient>
          <filter id={`${cleanUid}-line-glow`} x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="rgb(99,102,241)" floodOpacity="0.15" />
          </filter>
          <filter id={`${cleanUid}-tooltip-shadow`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="rgb(0,0,0)" floodOpacity="0.08" />
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="rgb(0,0,0)" floodOpacity="0.04" />
          </filter>
        </defs>

        {/* Grid Systems */}
        {tickValues.map((v, i) => (
          <g key={i} className="opacity-100 transition-opacity duration-200">
            <line
              x1={padding.left}
              y1={yPos(v)}
              x2={padding.left + chartW}
              y2={yPos(v)}
              stroke="currentColor"
              className="text-slate-100 dark:text-slate-800/70"
              strokeWidth="1"
              strokeDasharray={i === 0 ? undefined : '4 4'}
            />
            <text
              x={padding.left - 12}
              y={yPos(v) + 3}
              textAnchor="end"
              className="fill-slate-400 dark:fill-slate-500 text-[11px] font-medium tracking-tight tabular-nums"
            >
              {currency}{Math.round(v).toLocaleString()}
            </text>
          </g>
        ))}

        {/* Visual Line Paths */}
        <path d={areaPath} fill={`url(#${cleanUid}-area)`} />
        <path
          d={linePath}
          fill="none"
          stroke={`url(#${cleanUid}-stroke)`}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter={`url(#${cleanUid}-line-glow)`}
        />

        {/* Static Vector Structural Nodes */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={xPos(i)}
            cy={yPos(d.value)}
            r={hovered === i ? '5.5' : '4'}
            fill={hovered === i ? 'rgb(99,102,241)' : 'white'}
            stroke={hovered === i ? 'white' : 'rgb(99,102,241)'}
            strokeWidth={hovered === i ? '2.5' : '2'}
            className="transition-all duration-150 pointer-events-none"
            style={{
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          />
        ))}

        {/* X-Axis Meta Layout */}
        {data.map((d, i) => (
          <text
            key={i}
            x={xPos(i)}
            y={height - 8}
            textAnchor="middle"
            className={`fill-slate-400 dark:fill-slate-500 text-[11px] font-medium transition-colors duration-150 pointer-events-none ${
              hovered === i ? 'fill-indigo-600 dark:fill-indigo-400 font-semibold' : ''
            }`}
          >
            {d.label}
          </text>
        ))}

        {/* Guide-rails & Interactive Segment Matrix Mapping */}
        {data.map((_, i) => {
          const x = xPos(i)
          const sliceWidth = stepX
          const startX = i === 0 ? padding.left : x - sliceWidth / 2
          const endX = i === data.length - 1 ? padding.left + chartW : x + sliceWidth / 2

          return (
            <g key={i}>
              {hovered === i && (
                <line
                  x1={x}
                  y1={padding.top - 4}
                  x2={x}
                  y2={padding.top + chartH + 4}
                  stroke="rgb(99,102,241)"
                  strokeWidth="1.25"
                  strokeDasharray="4 3"
                  className="opacity-40 dark:opacity-60 pointer-events-none"
                />
              )}
              <rect
                x={startX}
                y={padding.top}
                width={endX - startX}
                height={chartH}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              />
            </g>
          )
        })}

        {/* Floating Tooltip Component */}
        {hovered !== null && (

          (() => {
            const tx = xPos(hovered)
            const ty = yPos(data[hovered].value)
            const bw = 110
            const bh = 36
            let bx = tx - bw / 2
            const by = ty - bh - 14

            // Safeguards to prevent clipping left/right walls of the viewport
            if (bx < padding.left - 10) bx = padding.left - 10
            if (bx + bw > width - padding.right + 10) bx = width - padding.right + 10 - bw

            return (
              <g transform={`translate(${bx}, ${by})`} className="pointer-events-none transition-transform duration-100 ease-out">
                <rect
                  width={bw}
                  height={bh}
                  rx="8"
                  className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="1.5"
                  filter={`url(#${cleanUid}-tooltip-shadow)`}
                />
                <text
                  x={bw / 2}
                  y={bh / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="fill-slate-900 dark:fill-slate-50 text-xs font-bold tracking-tight tabular-nums"
                >
                  {currency}{data[hovered].value.toLocaleString()}
                </text>
                {/* Visual Arrow Anchor */}
                <path
                  d="M -4 0 L 0 4 L 4 0 Z"
                  transform={`translate(${tx - bx}, ${bh})`}
                  className="fill-white dark:fill-slate-900 stroke-slate-200 dark:stroke-slate-800"
                  strokeWidth="1.5"
                />
                {/* Arrow Cover (hides overlapping top stroke line) */}
                <path
                  d="M -5 -0.75 L 0 3.25 L 5 -0.75 Z"
                  transform={`translate(${tx - bx}, ${bh})`}
                  className="fill-white dark:fill-slate-900"
                />
              </g>
            )
          })()
        )}
      </svg>
    </div>
  )
}