import { type ReactNode } from 'react'

interface DetailGridProps {
  children: ReactNode
  cols?: 1 | 2 | 3 | 4
  className?: string
}

const gridCols: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 sm:grid-cols-2',
  3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
}

export default function DetailGrid({ children, cols = 2, className = '' }: DetailGridProps) {
  return (
    <div className={`grid ${gridCols[cols]} gap-4 ${className}`}>
      {children}
    </div>
  )
}
