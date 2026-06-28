import { View, Text, ScrollView, Image } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Star, Package } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';
import { QuantitySelector } from '../../../components/inputs/QuantitySelector';
import { useCartStore } from '../../../store/cartStore';
import { bookingFeatureService } from '../services/bookingFeature.service';
import { formatCurrency } from '../../../utils/helpers';
import { Product } from '../../../types';

export default function ProductDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors } = useColorTheme();
  const addItem = useCartStore((s) => s.addItem);
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const p = await bookingFeatureService.getProductById(route.params.productId);
      setProduct(p || null);
      setIsLoading(false);
    })();
  }, [route.params.productId]);

  if (isLoading || !product) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.textSecondary }}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <Image
        source={{ uri: product.imageUrl }}
        style={{ width: '100%', height: 300, backgroundColor: colors.surfaceVariant }}
        resizeMode="cover"
      />
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 12, color: colors.primary, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>
          {product.category}
        </Text>
        <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 6 }}>{product.name}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <Star size={16} color={colors.accent} fill={colors.accent} />
          <Text style={{ fontSize: 14, color: colors.textSecondary, marginLeft: 6 }}>
            {product.rating} ({product.reviews} reviews)
          </Text>
        </View>
        <Text style={{ fontSize: 26, fontWeight: '800', color: colors.primary, marginTop: 12 }}>
          {formatCurrency(product.price)} <Text style={{ fontSize: 14, fontWeight: '400', color: colors.textSecondary }}>/ {product.unit}</Text>
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
          <Package size={16} color={colors.textSecondary} />
          <Text style={{ fontSize: 13, color: colors.textSecondary, marginLeft: 6 }}>
            Stock: {product.stock} {product.unit}
          </Text>
        </View>
        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 16 }} />
        <Text style={{ fontSize: 16, fontWeight: '700', color: colors.text, marginBottom: 8 }}>Description</Text>
        <Text style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 22 }}>{product.description}</Text>
        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 16 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 15, fontWeight: '600', color: colors.text }}>Quantity</Text>
          <QuantitySelector quantity={quantity} onIncrease={() => setQuantity((q) => Math.min(q + 1, product.stock))} onDecrease={() => setQuantity((q) => Math.max(q - 1, 1))} max={product.stock} />
        </View>
        <PrimaryButton
          title="Add to Cart"
          onPress={() => {
            addItem({ productId: product.id, productName: product.name, productImage: product.imageUrl, quantity, price: product.price });
            navigation.navigate('Cart');
          }}
        />
        <View style={{ marginTop: 8 }}>
          <PrimaryButton
            title="Buy Now"
            variant="outline"
            onPress={() => {
              addItem({ productId: product.id, productName: product.name, productImage: product.imageUrl, quantity, price: product.price });
              navigation.navigate('Cart');
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
}
