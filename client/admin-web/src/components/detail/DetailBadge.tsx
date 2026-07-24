import StatusBadge from '../StatusBadge'

interface DetailBadgeProps {
  status: string
  children?: string
}

export default function DetailBadge({ status, children }: DetailBadgeProps) {
  return <StatusBadge status={status} className="px-3 py-1 text-xs font-semibold" />
}
