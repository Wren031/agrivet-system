import { View, Text } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { CheckCircle } from 'lucide-react-native';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';
import { bookingFeatureService } from '../services/bookingFeature.service';
import { Booking } from '../../../types';
import { formatCurrency } from '../../../utils/helpers';

export default function BookingConfirmationScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors } = useColorTheme();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    (async () => {
      const b = await bookingFeatureService.getBookingById(route.params.bookingId);
      setBooking(b ?? null);
    })();
  }, [route.params.bookingId]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.success + '20', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
        <CheckCircle size={44} color={colors.success} />
      </View>
      <Text style={{ fontSize: 24, fontWeight: '800', color: colors.text, textAlign: 'center' }}>Booking Successful!</Text>
      <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 8, lineHeight: 20 }}>
        Your booking has been placed successfully.
      </Text>
      {booking && (
        <View style={{
          backgroundColor: colors.surface, width: '100%', borderRadius: 16, padding: 20, marginTop: 24,
          borderWidth: 1, borderColor: colors.border,
        }}>
          <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center' }}>Booking Number</Text>
          <Text style={{ fontSize: 20, fontWeight: '800', color: colors.primary, textAlign: 'center', marginTop: 4 }}>
            {booking.bookingNumber}
          </Text>
          <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 16 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 13, color: colors.textSecondary }}>Total Amount</Text>
            <Text style={{ fontSize: 16, fontWeight: '800', color: colors.text }}>{formatCurrency(booking.totalAmount)}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
            <Text style={{ fontSize: 13, color: colors.textSecondary }}>Payment Method</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text, textTransform: 'capitalize' }}>{booking.paymentMethod}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 13, color: colors.textSecondary }}>Pickup Method</Text>
            <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text, textTransform: 'capitalize' }}>{booking.pickupMethod}</Text>
          </View>
        </View>
      )}
      <View style={{ width: '100%', marginTop: 30, gap: 10 }}>
        <PrimaryButton title="View My Bookings" onPress={() => navigation.navigate('History')} />
        <PrimaryButton title="Back to Home" variant="outline" onPress={() => navigation.navigate('Home')} />
      </View>
    </View>
  );
}
