import { View, Text, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useEffect, useState, useMemo } from 'react';
import { ArrowLeft } from 'lucide-react-native';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { StatusBadge } from '../../../components/ui/StatusBadge';
import { OrderTimeline } from '../../../components/cards/OrderTimeline';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';
import { useBookingHistory } from '../hooks/useBookingHistory';
import { Booking, BookingProduct } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/helpers';

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

export default function BookingDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors } = useColorTheme();
  const { cancelBooking } = useBookingHistory();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [buttonLoading, setButtonLoading] = useState(false); // Controls the 1-second button delay state

  useEffect(() => {
    const parent = navigation.getParent();
    parent?.setOptions({ tabBarStyle: { display: 'none' } });
    return () => {
      parent?.setOptions({ tabBarStyle: undefined });
    };
  }, [navigation]);

  const mergedProducts = useMemo(() => mergeProducts(booking?.products || []), [booking?.products]);

  useEffect(() => {
    (async () => {
      const { historyFeatureService } = await import('../services/historyFeature.service');
      const b = await historyFeatureService.getById(route.params.bookingId);
      setBooking(b || null);
      setLoading(false);
    })();
  }, [route.params.bookingId]);

  // Handles the cancel operation with a mandatory 1-second delay
  const handleCancel = async () => {
    if (buttonLoading) return;
    setButtonLoading(true);

    setTimeout(async () => {
      try {
        await cancelBooking(booking!.id);
        const { historyFeatureService } = await import('../services/historyFeature.service');
        const b = await historyFeatureService.getById(booking!.id);
        setBooking(b || null);
      } catch (error) {
        console.error(error);
      } finally {
        setButtonLoading(false);
      }
    }, 1000); // 1 Second Delay
  };

  // Handles the "Book Again" navigation with a mandatory 1-second delay
  const handleBookAgain = () => {
    if (buttonLoading) return;
    setButtonLoading(true);

    setTimeout(() => {
      setButtonLoading(false);
      navigation.navigate('Booking');
    }, 1000); // 1 Second Delay
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* HEADER BAR */}
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: Platform.OS === 'ios' ? 56 : 48,
        paddingBottom: 12,
      }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.surfaceVariant, alignItems: 'center', justifyContent: 'center' }}
        >
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.text }}>{booking?.bookingNumber || '---'}</Text>
          <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>{booking ? formatDate(booking.createdAt) : ''}</Text>
        </View>
        {booking && <StatusBadge status={booking.status} size="md" />}
      </View>

      {/* MAIN CONTENT AREA */}
      {loading || !booking ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 }}>
          <Text style={{ color: colors.textSecondary }}>Loading...</Text>
        </View>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false} 
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {/* Customer Information Card */}
          <View style={{
            backgroundColor: colors.surface, marginHorizontal: 16, borderRadius: 14, padding: 16,
            borderWidth: 1, borderColor: colors.border,
          }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 12 }}>Customer Information</Text>
            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
              <Text style={{ fontSize: 13, color: colors.textSecondary, width: 80 }}>Name:</Text>
              <Text style={{ fontSize: 13, color: colors.text, fontWeight: '500', flex: 1 }}>{booking.customerName}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
              <Text style={{ fontSize: 13, color: colors.textSecondary, width: 80 }}>Email:</Text>
              <Text style={{ fontSize: 13, color: colors.text, flex: 1 }}>{booking.customerEmail}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
              <Text style={{ fontSize: 13, color: colors.textSecondary, width: 80 }}>Phone:</Text>
              <Text style={{ fontSize: 13, color: colors.text, flex: 1 }}>{booking.customerPhone}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 6 }}>
              <Text style={{ fontSize: 13, color: colors.textSecondary, width: 80 }}>Address:</Text>
              <Text style={{ fontSize: 13, color: colors.text, flex: 1 }}>{booking.customerAddress || 'N/A'}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 13, color: colors.textSecondary, width: 80 }}>Branch:</Text>
              <Text style={{ fontSize: 13, color: colors.text, fontWeight: '500', flex: 1 }}>{booking.preferredBranch}</Text>
            </View>
          </View>

          {/* Ordered Products Card */}
          <View style={{
            backgroundColor: colors.surface, marginHorizontal: 16, borderRadius: 14, padding: 16,
            borderWidth: 1, borderColor: colors.border, marginTop: 16,
          }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 12 }}>Ordered Products</Text>
            {mergedProducts.map((p, idx) => (
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
              <Text style={{ fontSize: 13, color: colors.text }}>{formatCurrency(mergedProducts.reduce((s, p) => s + p.subtotal, 0))}</Text>
            </View>
            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 8 }} />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 16, fontWeight: '800', color: colors.text }}>Total</Text>
              <Text style={{ fontSize: 18, fontWeight: '800', color: colors.primary }}>{formatCurrency(booking.totalAmount)}</Text>
            </View>
          </View>

          {/* Order Timeline Card */}
          <View style={{
            backgroundColor: colors.surface, margin: 16, borderRadius: 14, padding: 16,
            borderWidth: 1, borderColor: colors.border,
          }}>
            <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 12 }}>Order Timeline</Text>
            <OrderTimeline timeline={booking.timeline} />
          </View>

          {/* Bottom Action Buttons */}
          <View style={{ marginHorizontal: 16, gap: 10, marginTop: 8 }}>
            {booking.status === 'pending' ? (
              <PrimaryButton 
                title="Cancel Booking" 
                variant="danger" 
                onPress={handleCancel} 
                loading={buttonLoading}
                disabled={buttonLoading}
              />
            ) : booking.status === 'completed' || booking.status === 'cancelled' ? (
              <PrimaryButton 
                title="Book Again" 
                onPress={handleBookAgain} 
                loading={buttonLoading}
                disabled={buttonLoading}
              />
            ) : null}
          </View>
        </ScrollView>
      )}
    </View>
  );
}