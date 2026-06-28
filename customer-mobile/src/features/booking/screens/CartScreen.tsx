import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Trash2 } from 'lucide-react-native';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';
import { QuantitySelector } from '../../../components/inputs/QuantitySelector';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useCartStore } from '../../../store/cartStore';
import { formatCurrency } from '../../../utils/helpers';

export default function CartScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useColorTheme();
  const { items, removeItem, updateQuantity, getSubtotal } = useCartStore();

  const subtotal = getSubtotal();
  const serviceFee = 150;
  const total = subtotal + serviceFee;

  if (items.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <EmptyState
          title="Your Cart is Empty"
          message="Browse our catalog and add items to your cart"
        />
        <View style={{ padding: 16 }}>
          <PrimaryButton title="Browse Products" onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 16, paddingTop: 60 }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: colors.text }}>Shopping Cart</Text>
        <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>{items.length} item(s)</Text>
      </View>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {items.map((item) => (
          <View
            key={item.productId}
            style={{
              flexDirection: 'row', backgroundColor: colors.surface,
              marginHorizontal: 16, marginBottom: 10, borderRadius: 12, padding: 12,
              shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 2,
              borderWidth: 1, borderColor: colors.border,
            }}
          >
            <Image source={{ uri: item.productImage }} style={{ width: 70, height: 70, borderRadius: 10, backgroundColor: colors.surfaceVariant }} />
            <View style={{ marginLeft: 12, flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }} numberOfLines={2}>{item.productName}</Text>
              <Text style={{ fontSize: 16, fontWeight: '800', color: colors.primary, marginTop: 4 }}>
                {formatCurrency(item.price)}
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                <QuantitySelector
                  size="sm"
                  quantity={item.quantity}
                  onIncrease={() => updateQuantity(item.productId, item.quantity + 1)}
                  onDecrease={() => updateQuantity(item.productId, item.quantity - 1)}
                />
                <TouchableOpacity onPress={() => removeItem(item.productId)} style={{ padding: 4 }}>
                  <Trash2 size={18} color={colors.error} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={{
        backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border,
        padding: 16, borderRadius: 16, margin: 16, marginBottom: 30,
        shadowColor: '#000', shadowOffset: { width: 0, height: -2 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 4,
      }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 13, color: colors.textSecondary }}>Subtotal</Text>
          <Text style={{ fontSize: 13, color: colors.text }}>{formatCurrency(subtotal)}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 13, color: colors.textSecondary }}>Service Fee</Text>
          <Text style={{ fontSize: 13, color: colors.text }}>{formatCurrency(serviceFee)}</Text>
        </View>
        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 8 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: colors.text }}>Total</Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: colors.primary }}>{formatCurrency(total)}</Text>
        </View>
        <PrimaryButton title="Proceed to Booking" onPress={() => navigation.navigate('Checkout')} />
      </View>
    </View>
  );
}
