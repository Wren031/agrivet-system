import React, { useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft, Clock } from 'lucide-react-native';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { FormInput } from '../../../components/inputs/FormInput';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';
import { useCheckout } from '../hooks/useCheckout';
import { formatCurrency } from '../../../utils/helpers';
import { getImageUrl } from '../../../config/api.config';
import { CartItemResponse } from '../services/cart.service';

interface MergedItem {
  inventoryId: string;
  ids: string[];
  quantity: number;
  inventory: CartItemResponse['inventory'];
}

function mergeItems(items: CartItemResponse[]): MergedItem[] {
  const map = new Map<string, MergedItem>();
  for (const item of items) {
    const existing = map.get(item.inventoryId);
    if (existing) {
      existing.ids.push(item.id);
      existing.quantity += item.quantity;
    } else {
      map.set(item.inventoryId, {
        inventoryId: item.inventoryId,
        ids: [item.id],
        quantity: item.quantity,
        inventory: item.inventory,
      });
    }
  }
  return Array.from(map.values());
}

export default function CheckoutScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useColorTheme();
  const { items, subtotal, totalAmount, isLoading, submitBooking } = useCheckout();
  const mergedItems = useMemo(() => mergeItems(items), [items]);
  const [specialInstructions, setSpecialInstructions] = React.useState('');

  const handleBookNow = async () => {
    try {
      const booking = await submitBooking({ specialInstructions });
      if (booking) {
        navigation.navigate('BookingConfirmationScreen', { bookingId: booking.id });
      }
    } catch (e: any) {
      Alert.alert('Booking Failed', e.message || 'Something went wrong. Please try again.');
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking? Your cart items will be kept.',
      [
        { text: 'Keep Editing', style: 'cancel' },
        { text: 'Cancel Booking', style: 'destructive', onPress: () => navigation.goBack() },
      ]
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 60, paddingBottom: 16, gap: 12 }}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.surfaceVariant, alignItems: 'center', justifyContent: 'center' }}
          >
            <ArrowLeft size={20} color={colors.text} />
          </TouchableOpacity>
          <Text style={{ fontSize: 20, fontWeight: '800', color: colors.text }}>Booking Details</Text>
        </View>

        <View style={{ paddingHorizontal: 16 }}>
          <FormInput
            label="Special Instructions (Optional)"
            value={specialInstructions}
            onChangeText={setSpecialInstructions}
            placeholder="Any special requests..."
            multiline
            numberOfLines={3}
            icon={<Clock size={18} color={colors.textSecondary} />}
          />
        </View>

        <View style={{
          backgroundColor: colors.surface,
          margin: 16,
          marginTop: 20,
          borderRadius: 16,
          padding: 16,
          borderWidth: 1,
          borderColor: colors.border,
        }}>
          <Text style={{ fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 14 }}>Items</Text>
          {mergedItems.map((item) => {
            const imageUrl = getImageUrl(item.inventory.imageUrl ?? undefined) || '';
            const lineTotal = Number(item.inventory.sellingPrice) * item.quantity;
            return (
              <View
                key={item.inventoryId}
                style={{
                  flexDirection: 'row',
                  gap: 12,
                  marginBottom: 14,
                  alignItems: 'center',
                }}
              >
                <Image
                  source={{ uri: imageUrl }}
                  style={{ width: 56, height: 56, borderRadius: 10, backgroundColor: colors.surfaceVariant }}
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, lineHeight: 18 }} numberOfLines={2}>
                    {item.inventory.productName}
                  </Text>
                  <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
                    Qty: {item.quantity}
                  </Text>
                </View>
                <Text style={{ fontSize: 15, fontWeight: '700', color: '#059669' }}>
                  {formatCurrency(lineTotal)}
                </Text>
              </View>
            );
          })}
          <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 8 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ fontSize: 13, color: colors.textSecondary }}>Subtotal</Text>
            <Text style={{ fontSize: 13, color: colors.text }}>{formatCurrency(subtotal)}</Text>
          </View>
          <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 8 }} />
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: colors.text }}>Total</Text>
            <Text style={{ fontSize: 18, fontWeight: '800', color: '#059669' }}>{formatCurrency(totalAmount)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 34 : 16,
        gap: 10,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      }}>
        <TouchableOpacity
          onPress={handleCancel}
          activeOpacity={0.7}
          style={{
            flex: 1,
            paddingVertical: 14,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: '600', color: colors.error }}>Cancel</Text>
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <PrimaryButton title="Book Now" onPress={handleBookNow} loading={isLoading} />
        </View>
      </View>
    </View>
  );
}
