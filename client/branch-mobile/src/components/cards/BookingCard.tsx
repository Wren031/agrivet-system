import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useMemo } from 'react';
import { useColorTheme } from '../../hooks/useColorTheme';
import { StatusBadge } from '../ui/StatusBadge';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { Booking, BookingProduct } from '../../types';

function mergeProducts(products: BookingProduct[]): BookingProduct[] {
  const map = new Map<string, BookingProduct>();
  for (const p of products) {
    const existing = map.get(p.productId);
    if (existing) {
      existing.quantity += p.quantity;
      existing.subtotal += p.subtotal;
    } else {
      map.set(p.productId, { ...p });
    }
  }
  return Array.from(map.values());
}

interface BookingCardProps {
  booking: Booking;
  onPress: () => void;
}

export function BookingCard({ booking, onPress }: BookingCardProps) {
  const { colors } = useColorTheme();
  const mergedProducts = useMemo(() => mergeProducts(booking.products || []), [booking.products]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ width: 4, height: 26, borderRadius: 2, backgroundColor: '#059669', marginRight: 10 }} />
          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>{booking.bookingNumber}</Text>
        </View>
        <StatusBadge status={booking.status} />
      </View>
      <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 4, marginLeft: 14 }}>
        {formatDate(booking.createdAt)}
      </Text>

      <View style={{ marginTop: 12 }}>
        {mergedProducts.slice(0, 2).map((p, idx) => (
          <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <Image
              source={{ uri: p.productImage }}
              style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: colors.surfaceVariant }}
            />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: '600', color: colors.text }} numberOfLines={1}>{p.productName}</Text>
              <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 2 }}>Qty: {p.quantity}</Text>
            </View>
          </View>
        ))}
        {mergedProducts.length > 2 && (
          <Text style={{ fontSize: 11, color: colors.textTertiary, marginTop: 6, marginLeft: 52 }}>
            +{mergedProducts.length - 2} more item(s)
          </Text>
        )}
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
        <Text style={{ fontSize: 16, fontWeight: '800', color: '#059669' }}>
          {formatCurrency(booking.totalAmount)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}