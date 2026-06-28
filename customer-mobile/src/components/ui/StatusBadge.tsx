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

export function StatusBadge({ status, size = 'sm' }: StatusBadgeProps) {
  const { colors } = useColorTheme();

  const statusColors: Record<string, string> = {
    pending: colors.statusPending,
    approved: colors.statusApproved,
    processing: colors.statusProcessing,
    ready: colors.statusReady,
    completed: colors.statusCompleted,
    cancelled: colors.statusCancelled,
  };

  const bgColor = statusColors[status] || colors.textTertiary;
  const isSm = size === 'sm';

  return (
    <View
      style={{
        backgroundColor: bgColor + '20',
        paddingHorizontal: isSm ? 8 : 12,
        paddingVertical: isSm ? 3 : 6,
        borderRadius: 20,
        alignSelf: 'flex-start',
      }}
    >
      <Text
        style={{
          color: bgColor,
          fontSize: isSm ? 11 : 13,
          fontWeight: '600',
          textTransform: 'capitalize',
        }}
      >
        {statusLabels[status] || status}
      </Text>
    </View>
  );
}
