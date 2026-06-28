import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarDays, Clock, MapPin, CreditCard, Building2, Truck, Store } from 'lucide-react-native';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { FormInput } from '../../../components/inputs/FormInput';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';
import { branches } from '../../../constants/branches';
import { useCheckout } from '../hooks/useCheckout';
import { checkoutSchema, CheckoutFormData } from '../../../utils/validation';
import { formatCurrency } from '../../../utils/helpers';

export default function CheckoutScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useColorTheme();
  const { items, subtotal, serviceFee, totalAmount, isLoading, submitBooking } = useCheckout();

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      pickupMethod: 'pickup',
      preferredBranch: '',
      preferredDate: '',
      preferredTime: '',
      specialInstructions: '',
      paymentMethod: 'cash',
    },
  });

  const pickupMethod = watch('pickupMethod');
  const paymentMethod = watch('paymentMethod');

  const onSubmit = async (data: CheckoutFormData) => {
    try {
      const booking = await submitBooking(data);
      if (booking) {
        navigation.replace('BookingConfirmation', { bookingId: booking.id });
      }
    } catch {}
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }} showsVerticalScrollIndicator={false}>
      <View style={{ padding: 16, paddingTop: 60 }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: colors.text }}>Checkout</Text>
      </View>

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 12 }}>Pickup Method</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            onPress={() => setValue('pickupMethod', 'pickup')}
            style={{
              flex: 1, padding: 14, borderRadius: 12, alignItems: 'center',
              backgroundColor: pickupMethod === 'pickup' ? colors.primary + '15' : colors.surface,
              borderWidth: 1.5,
              borderColor: pickupMethod === 'pickup' ? colors.primary : colors.border,
            }}
          >
            <Store size={24} color={pickupMethod === 'pickup' ? colors.primary : colors.textSecondary} />
            <Text style={{ fontSize: 13, fontWeight: '600', color: pickupMethod === 'pickup' ? colors.primary : colors.text, marginTop: 6 }}>Pickup</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setValue('pickupMethod', 'delivery')}
            style={{
              flex: 1, padding: 14, borderRadius: 12, alignItems: 'center',
              backgroundColor: pickupMethod === 'delivery' ? colors.primary + '15' : colors.surface,
              borderWidth: 1.5,
              borderColor: pickupMethod === 'delivery' ? colors.primary : colors.border,
            }}
          >
            <Truck size={24} color={pickupMethod === 'delivery' ? colors.primary : colors.textSecondary} />
            <Text style={{ fontSize: 13, fontWeight: '600', color: pickupMethod === 'delivery' ? colors.primary : colors.text, marginTop: 6 }}>Delivery</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 12 }}>Preferred Branch</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {branches.map((branch) => (
            <TouchableOpacity
              key={branch.id}
              onPress={() => setValue('preferredBranch', branch.name)}
              style={{
                paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
                backgroundColor: watch('preferredBranch') === branch.name ? colors.primary : colors.surfaceVariant,
              }}
            >
              <Text style={{
                fontSize: 12, fontWeight: '600',
                color: watch('preferredBranch') === branch.name ? '#fff' : colors.text,
              }}>{branch.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.preferredBranch && (
          <Text style={{ fontSize: 12, color: colors.error, marginTop: 4 }}>{errors.preferredBranch.message}</Text>
        )}
      </View>

      <View style={{ padding: 16 }}>
        <Controller
          control={control}
          name="preferredDate"
          render={({ field: { onChange, value } }) => (
            <FormInput
              label="Preferred Date" value={value} onChangeText={onChange}
              placeholder="YYYY-MM-DD" error={errors.preferredDate?.message}
              icon={<CalendarDays size={18} color={colors.textSecondary} />}
            />
          )}
        />
        <Controller
          control={control}
          name="preferredTime"
          render={({ field: { onChange, value } }) => (
            <FormInput
              label="Preferred Time" value={value} onChangeText={onChange}
              placeholder="HH:MM (e.g., 09:00)" error={errors.preferredTime?.message}
              icon={<Clock size={18} color={colors.textSecondary} />}
            />
          )}
        />
        <Controller
          control={control}
          name="specialInstructions"
          render={({ field: { onChange, value } }) => (
            <FormInput
              label="Special Instructions (Optional)" value={value} onChangeText={onChange}
              placeholder="Any special requests..." multiline numberOfLines={3}
              icon={<MapPin size={18} color={colors.textSecondary} />}
            />
          )}
        />
      </View>

      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 12 }}>Payment Method</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <TouchableOpacity
            onPress={() => setValue('paymentMethod', 'cash')}
            style={{
              flex: 1, padding: 14, borderRadius: 12, alignItems: 'center',
              backgroundColor: paymentMethod === 'cash' ? colors.primary + '15' : colors.surface,
              borderWidth: 1.5,
              borderColor: paymentMethod === 'cash' ? colors.primary : colors.border,
            }}
          >
            <CreditCard size={24} color={paymentMethod === 'cash' ? colors.primary : colors.textSecondary} />
            <Text style={{ fontSize: 13, fontWeight: '600', color: paymentMethod === 'cash' ? colors.primary : colors.text, marginTop: 6 }}>Cash</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setValue('paymentMethod', 'gcash')}
            style={{
              flex: 1, padding: 14, borderRadius: 12, alignItems: 'center',
              backgroundColor: paymentMethod === 'gcash' ? colors.primary + '15' : colors.surface,
              borderWidth: 1.5,
              borderColor: paymentMethod === 'gcash' ? colors.primary : colors.border,
            }}
          >
            <Building2 size={24} color={paymentMethod === 'gcash' ? colors.primary : colors.textSecondary} />
            <Text style={{ fontSize: 13, fontWeight: '600', color: paymentMethod === 'gcash' ? colors.primary : colors.text, marginTop: 6 }}>GCash</Text>
          </TouchableOpacity>
        </View>
        {paymentMethod === 'gcash' && (
          <Text style={{ fontSize: 12, color: colors.textTertiary, marginTop: 8, textAlign: 'center' }}>
            GCash payment demo - no actual payment will be processed
          </Text>
        )}
      </View>

      <View style={{
        backgroundColor: colors.surface, margin: 16, borderRadius: 16, padding: 16,
        borderWidth: 1, borderColor: colors.border,
      }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 12 }}>Booking Summary</Text>
        {items.map((item) => (
          <View key={item.productId} style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ fontSize: 13, color: colors.text }} numberOfLines={1}>
              {item.productName} x{item.quantity}
            </Text>
            <Text style={{ fontSize: 13, color: colors.textSecondary }}>{formatCurrency(item.price * item.quantity)}</Text>
          </View>
        ))}
        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 8 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={{ fontSize: 13, color: colors.textSecondary }}>Subtotal</Text>
          <Text style={{ fontSize: 13, color: colors.text }}>{formatCurrency(subtotal)}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
          <Text style={{ fontSize: 13, color: colors.textSecondary }}>Service Fee</Text>
          <Text style={{ fontSize: 13, color: colors.text }}>{formatCurrency(serviceFee)}</Text>
        </View>
        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 8 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: colors.text }}>Total</Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.primary }}>{formatCurrency(totalAmount)}</Text>
        </View>
      </View>

      <View style={{ padding: 16, paddingBottom: 40 }}>
        <PrimaryButton title="Book Now" onPress={handleSubmit(onSubmit)} loading={isLoading} />
      </View>
    </ScrollView>
  );
}
