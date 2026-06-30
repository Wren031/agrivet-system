import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Heart, ShoppingCart } from 'lucide-react-native';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { EmptyState } from '../../../components/ui/EmptyState';
import { useFavoritesStore } from '../../../store/favoritesStore';
import { cartService } from '../../booking/services/cart.service';
import { bookingFeatureService } from '../../booking/services/bookingFeature.service';
import { formatCurrency } from '../../../utils/helpers';
import { Product } from '../../../types';

export default function FavoritesScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useColorTheme();
  const { favoriteIds, toggleFavorite } = useFavoritesStore();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const all = await bookingFeatureService.getProducts();
        setProducts(all.filter((p) => favoriteIds.includes(p.id)));
      } catch {} finally {
        setIsLoading(false);
      }
    })();
  }, [favoriteIds]);

  const handleRemove = (id: string) => {
    toggleFavorite(id);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 60, paddingBottom: 8 }}>
        <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text, letterSpacing: -0.5 }}>Favorites</Text>
        <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>
          {products.length} saved item{products.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {isLoading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: colors.textSecondary }}>Loading...</Text>
        </View>
      ) : products.length === 0 ? (
        <EmptyState title="No Favorites Yet" message="Tap the heart icon on any product to save it here." />
      ) : (
        <ScrollView style={{ flex: 1, paddingHorizontal: 16 }} showsVerticalScrollIndicator={false}>
          {products.map((product) => (
            <View
              key={product.id}
              style={{
                flexDirection: 'row',
                backgroundColor: colors.surface,
                borderRadius: 14,
                padding: 12,
                marginBottom: 10,
                borderWidth: 1,
                borderColor: colors.border,
                gap: 12,
              }}
            >
              <TouchableOpacity
                onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
                activeOpacity={0.7}
              >
                <Image
                  source={{ uri: product.imageUrl }}
                  style={{ width: 80, height: 80, borderRadius: 10, backgroundColor: colors.surfaceVariant }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
                style={{ flex: 1 }}
                activeOpacity={0.7}
              >
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, lineHeight: 18 }} numberOfLines={2}>
                  {product.name}
                </Text>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#059669', marginTop: 4 }}>
                  {formatCurrency(product.price)}
                </Text>
                <Text style={{ fontSize: 11, color: colors.textTertiary, marginTop: 2 }}>
                  {product.stock} {product.unit} available
                </Text>
              </TouchableOpacity>
              <View style={{ justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <TouchableOpacity onPress={() => handleRemove(product.id)} style={{ padding: 4 }}>
                  <Heart size={18} color="#DC2626" fill="#DC2626" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    try {
                      await cartService.create({ inventoryId: product.id, quantity: 1, status: 'NOT_CHECKOUT' });
                      navigation.navigate('CartScreen');
                    } catch (e: any) {
                      Alert.alert('Error', e.message || 'Failed to add to cart');
                    }
                  }}
                  activeOpacity={0.8}
                  style={{
                    backgroundColor: '#059669',
                    borderRadius: 8,
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <ShoppingCart size={13} color="#fff" />
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#fff' }}>Cart</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
