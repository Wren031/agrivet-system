import { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Modal, FlatList, Dimensions, Alert } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ShoppingCart, Filter, Check } from 'lucide-react-native';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { SearchBar } from '../../../components/inputs/SearchBar';
import { ProductCard } from '../../../components/cards/ProductCard';
import { useCatalog } from '../hooks/useCatalog';
import { cartService } from '../services/cart.service';
import { ProductGridSkeleton } from '../../../components/loading/SkeletonLoader';
import { ErrorState } from '../../../components/ui/ErrorState';
import { EmptyState } from '../../../components/ui/EmptyState';

export default function CatalogScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useColorTheme();
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const {
    filteredProducts, categories, selectedCategory, searchQuery,
    isLoading, error, loadProducts, filterByCategory, search,
  } = useCatalog();

  const fetchCartCount = useCallback(async () => {
    try {
      const data = await cartService.getAll();
      setCartItemCount(data.reduce((sum, i) => sum + i.quantity, 0));
    } catch {}
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchCartCount();
    }, [fetchCartCount])
  );

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const onRefresh = useCallback(() => {
    loadProducts();
  }, [loadProducts]);

  if (error && !isLoading) {
    return <ErrorState message={error} onRetry={loadProducts} />;
  }

  const allCategories = ['All', ...categories];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ paddingHorizontal: 16, paddingTop: 60, paddingBottom: 4 }}>
        <Text style={{ fontSize: 26, fontWeight: '800', color: colors.text, letterSpacing: -0.5 }}>Items</Text>
        <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} available
        </Text>
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, marginBottom: 12, gap: 10 }}>
        <View style={{ flex: 1 }}>
          <SearchBar value={searchQuery} onChangeText={search} />
        </View>
        <TouchableOpacity
          onPress={() => setShowCategoryModal(true)}
          activeOpacity={0.7}
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            backgroundColor: colors.surfaceVariant,
            borderWidth: 1,
            borderColor: colors.border,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Filter size={20} color={colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 16, marginBottom: 12 }}>
        <View style={{ paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, backgroundColor: '#05966915', alignSelf: 'flex-start' }}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: '#059669' }}>{selectedCategory}</Text>
        </View>
      </View>

      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} colors={['#059669']} tintColor="#059669" />}
      >
        {isLoading ? (
          <ProductGridSkeleton />
        ) : filteredProducts.length === 0 ? (
          <EmptyState title="No Products Found" message="Try adjusting your search or filter." />
        ) : (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 4 }}>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={() => navigation.navigate('ProductDetail', { productId: product.id })}
                onAddToCart={async () => {
                  try {
                    await cartService.create({ inventoryId: product.id, quantity: 1, status: 'NOT_CHECKOUT' });
                    setCartItemCount((prev) => prev + 1);
                  } catch (e: any) {
                    Alert.alert('Error', e.message || 'Failed to add to cart');
                  }
                }}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {cartItemCount > 0 && (
        <TouchableOpacity
          onPress={() => navigation.navigate('CartScreen')}
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

      <Modal visible={showCategoryModal} transparent animationType="fade">
        <TouchableOpacity
          style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' }}
          activeOpacity={1}
          onPress={() => setShowCategoryModal(false)}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {}}
            style={{
              backgroundColor: colors.surface,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              paddingBottom: 32,
              maxHeight: Dimensions.get('window').height * 0.55,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
              <Text style={{ fontSize: 17, fontWeight: '700', color: colors.text }}>Filter by Category</Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <Text style={{ fontSize: 15, fontWeight: '600', color: '#059669' }}>Done</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={allCategories}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    filterByCategory(item);
                    setShowCategoryModal(false);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 20,
                    paddingVertical: 14,
                    backgroundColor: selectedCategory === item ? '#D1FAE5' : 'transparent',
                  }}
                >
                  <Text style={{ fontSize: 15, color: selectedCategory === item ? '#047857' : colors.text, fontWeight: selectedCategory === item ? '600' : '400' }}>
                    {item}
                  </Text>
                  {selectedCategory === item && (
                    <Check size={18} color="#059669" />
                  )}
                </TouchableOpacity>
              )}
            />
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}
