import { View, Text, TouchableOpacity } from 'react-native';
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
  const totalItems = mergedProducts.reduce((s, p) => s + p.quantity, 0);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        backgroundColor: colors.surface,
        borderRadius: 14,
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 6,
        borderWidth: 1,
        borderColor: colors.border,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View style={{ flex: 1, marginRight: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 4, height: 28, borderRadius: 2, backgroundColor: '#059669', marginRight: 10 }} />
            <Text style={{ fontSize: 15, fontWeight: '800', color: colors.text }}>{booking.bookingNumber}</Text>
          </View>
          <Text style={{ fontSize: 11, color: colors.textSecondary, marginTop: 4, marginLeft: 14 }}>
            {formatDate(booking.createdAt)}
          </Text>
        </View>
        <StatusBadge status={booking.status} />
      </View>

      <View style={{ marginTop: 12, paddingVertical: 10, paddingHorizontal: 12, backgroundColor: colors.background, borderRadius: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View>
            <Text style={{ fontSize: 10, fontWeight: '600', color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Items</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text, marginTop: 2 }}>{mergedProducts.length}</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 10, fontWeight: '600', color: colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5 }}>Total Qty</Text>
            <Text style={{ fontSize: 13, fontWeight: '700', color: colors.text, marginTop: 2 }}>{totalItems}</Text>
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
        <Text style={{ fontSize: 11, color: colors.textTertiary }}>
          {mergedProducts.length} item{mergedProducts.length !== 1 ? 's' : ''} · {totalItems} qty
        </Text>
        <Text style={{ fontSize: 17, fontWeight: '800', color: '#059669' }}>
          {formatCurrency(booking.totalAmount)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}