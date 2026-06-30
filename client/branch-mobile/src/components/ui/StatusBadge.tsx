import { View, Text } from 'react-native';
import { useColorTheme } from '../../hooks/useColorTheme';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  approved: 'Approved',
  processing: 'Processing',
  ready: 'Ready',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const colorMap: Record<string, string> = {
  pending: '#D97706',
  approved: '#2563EB',
  processing: '#7C3AED',
  ready: '#0891B2',
  completed: '#16A34A',
  cancelled: '#DC2626',
};

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const isSm = size === 'sm';
  const color = colorMap[status] || '#94A3B8';

  return (
    <View
      className={`${isSm ? 'px-2.5 py-1' : 'px-3.5 py-1.5'} rounded-lg self-start border`}
      style={{ backgroundColor: color + '18', borderColor: color + '30' }}
    >
      <Text
        className={`${isSm ? 'text-xs' : 'text-sm'} font-bold tracking-wide uppercase`}
        style={{ color, letterSpacing: 0.3 }}
      >
        {statusLabels[status] || status}
      </Text>
    </View>
  );
}
