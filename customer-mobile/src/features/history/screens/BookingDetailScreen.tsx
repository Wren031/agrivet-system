import { View, Text, ScrollView, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { CalendarDays, MapPin, CreditCard, Package } from 'lucide-react-native';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { OrderTimeline } from '../../../components/cards/OrderTimeline';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';
import { useBookingHistory } from '../hooks/useBookingHistory';
import { Booking } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/helpers';

export default function BookingDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors } = useColorTheme();
  const { cancelBooking } = useBookingHistory();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { historyFeatureService } = await import('../services/historyFeature.service');
      const b = await historyFeatureService.getById(route.params.bookingId);
      setBooking(b || null);
      setLoading(false);
    })();
  }, [route.params.bookingId]);

  if (loading || !booking) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.textSecondary }}>Loading...</Text>
      </View>
    );
  }

  const handleCancel = async () => {
    await cancelBooking(booking.id);
    const { historyFeatureService } = await import('../services/historyFeature.service');
    const b = await historyFeatureService.getById(booking.id);
    setBooking(b || null);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} showsVerticalScrollIndicator={false}>
      <View style={{ padding: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text }}>{booking.bookingNumber}</Text>
          <StatusBadge status={booking.status} size="md" />
        </View>
        <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>{formatDate(booking.createdAt)}</Text>
      </View>

      <View style={{
        backgroundColor: colors.surface, marginHorizontal: 16, borderRadius: 14, padding: 16,
        borderWidth: 1, borderColor: colors.border,
      }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 12 }}>Customer Information</Text>
        <View style={{ flexDirection: 'row', marginBottom: 6 }}>
          <Text style={{ fontSize: 13, color: colors.textSecondary, width: 80 }}>Name:</Text>
          <Text style={{ fontSize: 13, color: colors.text, fontWeight: '500' }}>{booking.customerName}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 6 }}>
          <Text style={{ fontSize: 13, color: colors.textSecondary, width: 80 }}>Email:</Text>
          <Text style={{ fontSize: 13, color: colors.text }}>{booking.customerEmail}</Text>
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 6 }}>
          <Text style={{ fontSize: 13, color: colors.textSecondary, width: 80 }}>Phone:</Text>
          <Text style={{ fontSize: 13, color: colors.text }}>{booking.customerPhone}</Text>
        </View>
      </View>

      <View style={{
        backgroundColor: colors.surface, margin: 16, borderRadius: 14, padding: 16,
        borderWidth: 1, borderColor: colors.border,
      }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 12 }}>Booking Information</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <CalendarDays size={16} color={colors.textSecondary} />
          <Text style={{ fontSize: 13, color: colors.text, marginLeft: 8 }}>{booking.preferredDate} at {booking.preferredTime}</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <MapPin size={16} color={colors.textSecondary} />
          <Text style={{ fontSize: 13, color: colors.text, marginLeft: 8 }}>{booking.preferredBranch} ({booking.pickupMethod})</Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
          <CreditCard size={16} color={colors.textSecondary} />
          <Text style={{ fontSize: 13, color: colors.text, marginLeft: 8, textTransform: 'capitalize' }}>{booking.paymentMethod}</Text>
        </View>
        {booking.specialInstructions ? (
          <View style={{ marginTop: 4 }}>
            <Text style={{ fontSize: 13, color: colors.textSecondary }}>Instructions:</Text>
            <Text style={{ fontSize: 13, color: colors.text, marginTop: 2 }}>{booking.specialInstructions}</Text>
          </View>
        ) : null}
      </View>

      <View style={{
        backgroundColor: colors.surface, marginHorizontal: 16, borderRadius: 14, padding: 16,
        borderWidth: 1, borderColor: colors.border,
      }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 12 }}>Ordered Products</Text>
        {booking.products.map((p, idx) => (
          <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Image source={{ uri: p.productImage }} style={{ width: 50, height: 50, borderRadius: 10, backgroundColor: colors.surfaceVariant }} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>{p.productName}</Text>
              <Text style={{ fontSize: 12, color: colors.textSecondary }}>x{p.quantity} × {formatCurrency(p.price)}</Text>
            </View>
            <Text style={{ fontSize: 14, fontWeight: '700', color: colors.primary }}>{formatCurrency(p.subtotal)}</Text>
          </View>
        ))}
        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 8 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={{ fontSize: 13, color: colors.textSecondary }}>Subtotal</Text>
          <Text style={{ fontSize: 13, color: colors.text }}>{formatCurrency(booking.subtotal)}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={{ fontSize: 13, color: colors.textSecondary }}>Service Fee</Text>
          <Text style={{ fontSize: 13, color: colors.text }}>{formatCurrency(booking.serviceFee)}</Text>
        </View>
        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 8 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: colors.text }}>Total</Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.primary }}>{formatCurrency(booking.totalAmount)}</Text>
        </View>
      </View>

      <View style={{
        backgroundColor: colors.surface, margin: 16, borderRadius: 14, padding: 16,
        borderWidth: 1, borderColor: colors.border,
      }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 12 }}>Order Timeline</Text>
        <OrderTimeline timeline={booking.timeline} />
      </View>

      <View style={{ padding: 16, paddingBottom: 40, gap: 10 }}>
        {booking.status === 'pending' && (
          <PrimaryButton title="Cancel Booking" variant="danger" onPress={handleCancel} />
        )}
        {(booking.status === 'completed' || booking.status === 'cancelled') && (
          <PrimaryButton title="Book Again" onPress={() => navigation.navigate('Booking')} />
        )}
      </View>
    </ScrollView>
  );
}
