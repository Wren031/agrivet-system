import { View, Text, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Package, Heart, ArrowLeft } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';
import { QuantitySelector } from '../../../components/inputs/QuantitySelector';
import { useCartStore } from '../../../store/cartStore';
import { useFavoritesStore } from '../../../store/favoritesStore';
import { bookingFeatureService } from '../services/bookingFeature.service';
import { cartService } from '../services/cart.service';
import { formatCurrency } from '../../../utils/helpers';
import { Product } from '../../../types';

export default function ProductDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { colors } = useColorTheme();
  const addItem = useCartStore((s) => s.addItem);
  const clearCart = useCartStore((s) => s.clearCart);
  const { isFavorite, toggleFavorite, loadFavorites } = useFavoritesStore();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

  useEffect(() => {
    (async () => {
      const p = await bookingFeatureService.getProductById(route.params.productId);
      setProduct(p || null);
      setIsLoading(false);
    })();
  }, [route.params.productId]);

  useEffect(() => {
    if (product) setFavorite(isFavorite(product.id));
  }, [product, isFavorite]);

  const handleToggleFavorite = async () => {
    if (!product) return;
    const next = !isFavorite(product.id);
    setFavorite(next);
    await toggleFavorite(product.id);
  };

  if (isLoading || !product) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.textSecondary }}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: product.imageUrl }}
            style={{ width: '100%', height: 300, backgroundColor: colors.surfaceVariant }}
            resizeMode="cover"
          />
          <View style={{ position: 'absolute', top: 50, left: 16, flexDirection: 'row', gap: 10 }}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' }}
            >
              <ArrowLeft size={20} color="#fff" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            onPress={handleToggleFavorite}
            style={{ position: 'absolute', top: 50, right: 16, width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(0,0,0,0.4)', alignItems: 'center', justifyContent: 'center' }}
          >
            <Heart size={20} color={favorite ? '#DC2626' : '#fff'} fill={favorite ? '#DC2626' : 'transparent'} />
          </TouchableOpacity>
        </View>
        <View style={{ padding: 20, paddingBottom: 0 }}>
          <Text style={{ fontSize: 12, color: '#059669', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 }}>
            {product.category}
          </Text>
          <Text style={{ fontSize: 22, fontWeight: '800', color: colors.text, marginTop: 6 }}>{product.name}</Text>
          <Text style={{ fontSize: 26, fontWeight: '800', color: '#059669', marginTop: 12 }}>
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
        </View>
      </ScrollView>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: Platform.OS === 'ios' ? 34 : 16,
        gap: 16,
        backgroundColor: colors.background,
        borderTopWidth: 1,
        borderTopColor: colors.border,
      }}>
        <TouchableOpacity
          onPress={async () => {
            addItem({ productId: product.id, productName: product.name, productImage: product.imageUrl, quantity, price: product.price });
            try { await cartService.create({ inventoryId: product.id, quantity, status: 'active' }); } catch {}
            navigation.navigate('CartScreen');
          }}
          activeOpacity={0.7}
          style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: colors.textSecondary }}>Add to Cart</Text>
          <View style={{ height: 1.5, backgroundColor: colors.textSecondary, marginTop: 4, width: '100%' }} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <PrimaryButton
            title="Buy Now"
            onPress={() => {
              clearCart();
              addItem({ productId: product.id, productName: product.name, productImage: product.imageUrl, quantity, price: product.price });
              navigation.navigate('CheckoutScreen');
            }}
          />
        </View>
      </View>
    </View>
  );
}
