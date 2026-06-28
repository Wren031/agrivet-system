import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useColorTheme } from '../../hooks/useColorTheme';
import { StatusBadge } from '../ui/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { Booking } from '../../types';

interface BookingCardProps {
  booking: Booking;
  onPress: () => void;
}

export function BookingCard({ booking, onPress }: BookingCardProps) {
  const { colors } = useColorTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        backgroundColor: colors.surface,
        borderRadius: 14,
        padding: 14,
        marginHorizontal: 16,
        marginVertical: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 3,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text }}>
          {booking.bookingNumber}
        </Text>
        <StatusBadge status={booking.status} />
      </View>
      <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4 }}>
        {formatDate(booking.createdAt)}
      </Text>
      <View style={{ marginTop: 10 }}>
        {booking.products.slice(0, 2).map((p, idx) => (
          <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
            <Image
              source={{ uri: p.productImage }}
              style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: colors.surfaceVariant }}
            />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <Text style={{ fontSize: 12, color: colors.text }} numberOfLines={1}>{p.productName}</Text>
              <Text style={{ fontSize: 11, color: colors.textSecondary }}>x{p.quantity}</Text>
            </View>
          </View>
        ))}
        {booking.products.length > 2 && (
          <Text style={{ fontSize: 11, color: colors.textTertiary, marginTop: 4 }}>
            +{booking.products.length - 2} more item(s)
          </Text>
        )}
      </View>
      <View
        style={{
          flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border,
        }}
      >
        <Text style={{ fontSize: 11, color: colors.textSecondary }}>
          {booking.pickupMethod === 'pickup' ? 'Pickup' : 'Delivery'}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: '800', color: colors.primary }}>
          {formatCurrency(booking.totalAmount)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
