import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useEffect, useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { ShoppingCart } from 'lucide-react-native';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { SearchBar } from '../../../components/inputs/SearchBar';
import { ProductCard } from '../../../components/cards/ProductCard';
import { useCartStore } from '../../../store/cartStore';
import { useCatalog } from '../hooks/useCatalog';
import { ProductGridSkeleton } from '../../../components/loading/SkeletonLoader';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';

export default function CatalogScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useColorTheme();
  const cartItemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const {
    filteredProducts, categories, selectedCategory, searchQuery,
    isLoading, error, loadProducts, filterByCategory, search,
  } = useCatalog();

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const onRefresh = useCallback(() => {
    loadProducts();
  }, [loadProducts]);

  if (error && !isLoading) {
    return <ErrorState message={error} onRetry={loadProducts} />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ padding: 16, paddingTop: 60, paddingBottom: 0 }}>
        <Text style={{ fontSize: 24, fontWeight: '800', color: colors.text }}>Product Catalog</Text>
      </View>

      <SearchBar value={searchQuery} onChangeText={search} />

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ maxHeight: 44, marginBottom: 8 }}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat}
            onPress={() => filterByCategory(cat)}
            style={{
              paddingHorizontal: 16, paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: selectedCategory === cat ? colors.primary : colors.surfaceVariant,
              marginRight: 8,
            }}
          >
            <Text style={{
              fontSize: 13, fontWeight: '600',
              color: selectedCategory === cat ? '#fff' : colors.textSecondary,
            }}>
              {cat}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} colors={[colors.primary]} tintColor={colors.primary} />}
      >
        {isLoading ? (
          <ProductGridSkeleton />
        ) : filteredProducts.length === 0 ? (
          <EmptyState title="No Products Found" message="Try adjusting your search or filter." />
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', padding: 6 }}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={() => navigation.navigate('ProductDetail', { productId: product.id })}
                onAddToCart={() => {
                  useCartStore.getState().addItem({
                    productId: product.id,
                    productName: product.name,
                    productImage: product.imageUrl,
                    quantity: 1,
                    price: product.price,
                  });
                }}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {cartItemCount > 0 && (
        <TouchableOpacity
          onPress={() => navigation.navigate('Cart')}
          style={{
            position: 'absolute', bottom: 20, right: 20,
            backgroundColor: colors.primary,
            paddingHorizontal: 20, paddingVertical: 12,
            borderRadius: 30,
            flexDirection: 'row', alignItems: 'center',
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <ShoppingCart size={20} color="#fff" />
          <Text style={{ color: '#fff', fontSize: 14, fontWeight: '700', marginLeft: 8 }}>
            Cart ({cartItemCount})
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
