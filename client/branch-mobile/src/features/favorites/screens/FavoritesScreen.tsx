import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Heart, ShoppingCart } from 'lucide-react-native';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';
import { formatCurrency } from '../../../utils/helpers';
import { useFavorites } from '../hooks/useFavorites';
import { cartService } from '../../booking/services/cart.service';

export default function FavoritesScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useColorTheme();
  const { favorites, isLoading, loadFavorites, removeFavorite } = useFavorites();

  useFocusEffect(
    useCallback(() => {
      loadFavorites();
    }, [loadFavorites]),
  );

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.textSecondary }}>Loading...</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ paddingHorizontal: 16, paddingTop: 60, paddingBottom: 8 }}>
          <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text, letterSpacing: -0.5 }}>Favorites</Text>
        </View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
          <View style={{ width: 88, height: 88, borderRadius: 44, backgroundColor: '#FCE7F3', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
            <Heart size={40} color="#EC4899" />
          </View>
          <Text style={{ fontSize: 20, fontWeight: '700', color: colors.text, textAlign: 'center', marginBottom: 8 }}>
            No favorite items yet
          </Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary, textAlign: 'center', lineHeight: 22, marginBottom: 32 }}>
            Tap the heart icon on any product to save it here and shop later.
          </Text>
          <PrimaryButton title="Browse Products" onPress={() => navigation.navigate('Items')} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 60, paddingBottom: 8 }}>
        <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text, letterSpacing: -0.5 }}>Favorites</Text>
        <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>
          {favorites.length} saved item{favorites.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 4 }}>
          {favorites.map((item) => {
            const inStock = item.stock > 0;
            const stockLabel = !inStock ? 'Out of Stock' : item.stock <= 5 ? 'Low Stock' : 'In Stock';
            const stockColor = !inStock ? '#DC2626' : item.stock <= 5 ? '#D97706' : '#16A34A';

            return (
              <View
                key={item.id}
                style={{
                  width: '48%',
                  backgroundColor: colors.surface,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                  overflow: 'hidden',
                  marginBottom: 14,
                }}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate('ProductDetail', { productId: item.inventoryId })}
                  activeOpacity={0.7}
                >
                  <View style={{ position: 'relative' }}>
                    <Image
                      source={{ uri: item.productImage }}
                      style={{ width: '100%', height: 150, backgroundColor: colors.surfaceVariant }}
                      resizeMode="cover"
                    />
                    <View style={{ position: 'absolute', top: 10, left: 10, backgroundColor: '#059669', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: '#fff', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                        {item.category}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => removeFavorite(item.id)}
                      activeOpacity={0.7}
                      style={{ position: 'absolute', top: 10, right: 10, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 20, padding: 6 }}
                    >
                      <Heart size={16} color="#fff" fill="#DC2626" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => navigation.navigate('ProductDetail', { productId: item.inventoryId })}
                  activeOpacity={0.7}
                  style={{ padding: 14, gap: 8 }}
                >
                  <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, lineHeight: 19 }} numberOfLines={2}>
                    {item.productName}
                  </Text>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: '#059669', letterSpacing: -0.5 }}>
                      {formatCurrency(item.price)}
                    </Text>
                    <Text style={{ fontSize: 12, color: colors.textTertiary, marginLeft: 3 }}>
                      /{item.unit}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <View style={{ width: 7, height: 7, borderRadius: 4, backgroundColor: stockColor }} />
                    <Text style={{ fontSize: 11, color: stockColor, fontWeight: '500' }}>{stockLabel}</Text>
                  </View>
                </TouchableOpacity>

                <View style={{ paddingHorizontal: 14, paddingBottom: 14 }}>
                  <TouchableOpacity
                    onPress={async () => {
                      try {
                        await cartService.create({ inventoryId: item.inventoryId, quantity: 1, status: 'NOT_CHECKOUT' });
                        Alert.alert('Added to Cart', `${item.productName} has been added to your cart.`);
                      } catch (e: any) {
                        Alert.alert('Error', e.message || 'Failed to add to cart');
                      }
                    }}
                    activeOpacity={0.8}
                    disabled={!inStock}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      paddingVertical: 10,
                      borderRadius: 12,
                      backgroundColor: inStock ? '#059669' : colors.surfaceVariant,
                      gap: 6,
                      opacity: inStock ? 1 : 0.5,
                    }}
                  >
                    {inStock ? (
                      <>
                        <ShoppingCart size={15} color="#fff" />
                        <Text style={{ fontSize: 12, fontWeight: '700', color: '#fff' }}>Add to Cart</Text>
                      </>
                    ) : (
                      <Text style={{ fontSize: 12, fontWeight: '600', color: colors.textTertiary }}>Unavailable</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
