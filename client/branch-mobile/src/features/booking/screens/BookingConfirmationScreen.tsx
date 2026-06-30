import { View, Text, ScrollView, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { CheckCircle, Package, MapPin, Clock } from 'lucide-react-native';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';
import { branchOrderService } from '../services/branchOrder.service';
import { Booking } from '../../../types';
import { formatCurrency, formatDate } from '../../../utils/helpers';

export default function BookingConfirmationScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors } = useColorTheme();
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    (async () => {
      const b = await branchOrderService.findById(route.params.bookingId);
      setBooking(b ?? null);
    })();
  }, [route.params.bookingId]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 60 }}>
        <View style={{ alignItems: 'center', paddingTop: 20 }}>
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: '#05966920', justifyContent: 'center', alignItems: 'center', marginBottom: 16 }}>
            <CheckCircle size={44} color="#059669" />
          </View>
          <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text, textAlign: 'center' }}>Booking Successful!</Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center', marginTop: 6, lineHeight: 20 }}>
            Your booking has been placed successfully.
          </Text>
        </View>

        {booking && (
          <View style={{
            backgroundColor: colors.surface, width: '100%', borderRadius: 14, padding: 20, marginTop: 24,
            borderWidth: 1, borderColor: colors.border,
          }}>
            <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center' }}>Booking Number</Text>
            <Text style={{ fontSize: 22, fontWeight: '800', color: '#059669', textAlign: 'center', marginTop: 4, letterSpacing: 0.5 }}>
              {booking.bookingNumber}
            </Text>
            <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 16 }} />

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
              <Text style={{ fontSize: 13, color: colors.textSecondary }}>Total Amount</Text>
              <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text }}>{formatCurrency(booking.totalAmount)}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
              <Package size={14} color={colors.textTertiary} style={{ marginRight: 6 }} />
              <Text style={{ fontSize: 13, color: colors.textSecondary, flex: 1 }}>Items</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text }}>{booking.products.length} product(s)</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <MapPin size={14} color={colors.textTertiary} style={{ marginRight: 6, marginTop: 2 }} />
              <Text style={{ fontSize: 13, color: colors.textSecondary, flex: 1 }}>Branch</Text>
              <Text style={{ fontSize: 13, fontWeight: '500', color: colors.text, flex: 1, textAlign: 'right' }}>{booking.preferredBranch}</Text>
            </View>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              <MapPin size={14} color={colors.textTertiary} style={{ marginRight: 6, marginTop: 2 }} />
              <Text style={{ fontSize: 13, color: colors.textSecondary, flex: 1 }}>Address</Text>
              <Text style={{ fontSize: 13, fontWeight: '500', color: colors.text, flex: 1, textAlign: 'right' }}>{booking.customerAddress || 'N/A'}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Clock size={14} color={colors.textTertiary} style={{ marginRight: 6 }} />
              <Text style={{ fontSize: 13, color: colors.textSecondary, flex: 1 }}>Created</Text>
              <Text style={{ fontSize: 13, fontWeight: '500', color: colors.text }}>{formatDate(booking.createdAt)}</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={{
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        borderRadius: 16,
        margin: 16,
        marginBottom: Platform.OS === 'ios' ? 34 : 16,
        gap: 10,
      }}>
        <PrimaryButton title="View My Bookings" onPress={() => navigation.navigate('Main', { screen: 'History' })} />
        <PrimaryButton title="Back to Home" variant="outline" onPress={() => navigation.navigate('Main', { screen: 'Home' })} />
      </View>
    </View>
  );
}
