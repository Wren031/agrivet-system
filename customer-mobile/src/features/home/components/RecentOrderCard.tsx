import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { formatCurrency, formatDate } from '../../../utils/helpers';
import { Booking } from '../../../types';

interface RecentOrderCardProps {
  booking: Booking;
  onPress: () => void;
}

export function RecentOrderCard({ booking, onPress }: RecentOrderCardProps) {
  const { colors } = useColorTheme();
  const product = booking.products[0];

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        flexDirection: 'row',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <Image
        source={{ uri: product.productImage }}
        style={{ width: 60, height: 60, borderRadius: 10, backgroundColor: colors.surfaceVariant }}
      />
      <View style={{ marginLeft: 12, flex: 1 }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }} numberOfLines={1}>
          {booking.bookingNumber}
        </Text>
        <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2 }}>
          {formatDate(booking.createdAt)}
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
          <StatusBadge status={booking.status} />
          <Text style={{ fontSize: 14, fontWeight: '800', color: colors.primary }}>
            {formatCurrency(booking.totalAmount)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
