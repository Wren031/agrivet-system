import { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ArrowLeft, Trash2, Square, CheckSquare, Search } from 'lucide-react-native';
import { useColorTheme } from '../../../hooks/useColorTheme';
import { PrimaryButton } from '../../../components/buttons/PrimaryButton';
import { QuantitySelector } from '../../../components/inputs/QuantitySelector';
import { EmptyState } from '../../../components/ui/EmptyState';
import { formatCurrency } from '../../../utils/helpers';
import { cartService, CartItemResponse } from '../services/cart.service';
import { getImageUrl } from '../../../config/api.config';

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

export default function CartScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useColorTheme();
  const [items, setItems] = useState<CartItemResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedInventoryIds, setSelectedInventoryIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCart = useCallback(async () => {
    try {
      const data = await cartService.getAll();
      setItems(data);
    } catch {} finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      setIsLoading(true);
      fetchCart();
    }, [fetchCart])
  );

  const mergedItems = useMemo(() => mergeItems(items), [items]);

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return mergedItems;
    const q = searchQuery.toLowerCase();
    return mergedItems.filter((item) => item.inventory.productName.toLowerCase().includes(q));
  }, [mergedItems, searchQuery]);

  const subtotal = mergedItems.reduce((sum, i) => sum + Number(i.inventory.sellingPrice) * i.quantity, 0);
  const allSelected = filteredItems.length > 0 && filteredItems.every((i) => selectedInventoryIds.has(i.inventoryId));

  const toggleSelect = (inventoryId: string) => {
    const next = new Set(selectedInventoryIds);
    if (next.has(inventoryId)) next.delete(inventoryId);
    else next.add(inventoryId);
    setSelectedInventoryIds(next);
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      const next = new Set(selectedInventoryIds);
      filteredItems.forEach((i) => next.delete(i.inventoryId));
      setSelectedInventoryIds(next);
    } else {
      const next = new Set(selectedInventoryIds);
      filteredItems.forEach((i) => next.add(i.inventoryId));
      setSelectedInventoryIds(next);
    }
  };

  const handleDeleteSelected = () => {
    if (selectedInventoryIds.size === 0) return;
    const count = selectedInventoryIds.size;
    Alert.alert(
      'Remove Items',
      `Are you sure you want to remove ${count} item(s) from your cart?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove', style: 'destructive',
          onPress: async () => {
            const allCartIds = items.filter((i) => selectedInventoryIds.has(i.inventoryId)).map((i) => i.id);
            for (const id of allCartIds) {
              try { await cartService.remove(id); } catch {}
            }
            setSelectedInventoryIds(new Set());
            fetchCart();
          },
        },
      ]
    );
  };

  const handleQuantityChange = async (inventoryId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      const cartIds = items.filter((i) => i.inventoryId === inventoryId).map((i) => i.id);
      const perItem = Math.floor(newQuantity / cartIds.length);
      const remainder = newQuantity % cartIds.length;
      for (let i = 0; i < cartIds.length; i++) {
        await cartService.update(cartIds[i], { quantity: perItem + (i < remainder ? 1 : 0) });
      }
      fetchCart();
    } catch {}
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.textSecondary }}>Loading...</Text>
      </View>
    );
  }

  if (mergedItems.length === 0) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <View style={{ padding: 16, paddingTop: 60 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.surfaceVariant, alignItems: 'center', justifyContent: 'center' }}>
            <ArrowLeft size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
        <EmptyState title="Your Cart is Empty" message="Browse our catalog and add items to your cart" />
        <View style={{ padding: 16 }}>
          <PrimaryButton title="Browse Products" onPress={() => navigation.goBack()} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, paddingTop: 60 }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: colors.surfaceVariant, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
          <ArrowLeft size={20} color={colors.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 24, fontWeight: '800', color: colors.text }}>My Cart</Text>
          <Text style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>{filteredItems.length}{filteredItems.length !== mergedItems.length ? ` of ${mergedItems.length}` : ''} item(s)</Text>
        </View>
        {selectedInventoryIds.size > 0 && (
          <TouchableOpacity onPress={handleDeleteSelected} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 7, borderRadius: 8, gap: 5 }}>
            <Trash2 size={15} color="#DC2626" />
            <Text style={{ fontSize: 13, fontWeight: '600', color: '#DC2626' }}>{selectedInventoryIds.size}</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 10 }}>
        <TouchableOpacity onPress={toggleSelectAll} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          {allSelected ? (
            <CheckSquare size={20} color="#059669" />
          ) : (
            <Square size={20} color={colors.textTertiary} />
          )}
          <Text style={{ fontSize: 13, fontWeight: '500', color: colors.textSecondary }}>Select All</Text>
        </TouchableOpacity>
      </View>

      <View style={{ paddingHorizontal: 16, marginBottom: 10 }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: colors.surfaceVariant,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: 12,
          }}
        >
          <Search size={18} color={colors.textTertiary} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search in cart..."
            placeholderTextColor={colors.textTertiary}
            style={{
              flex: 1,
              paddingVertical: 10,
              paddingHorizontal: 10,
              fontSize: 14,
              color: colors.text,
            }}
          />
        </View>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {filteredItems.length === 0 && mergedItems.length > 0 ? (
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: colors.textSecondary }}>No items match your search</Text>
          </View>
        ) : null}
        {filteredItems.map((item) => {
          const isSelected = selectedInventoryIds.has(item.inventoryId);
          const imageUrl = getImageUrl(item.inventory.imageUrl ?? undefined) || '';
          return (
            <View
              key={item.inventoryId}
              style={{
                flexDirection: 'row',
                backgroundColor: isSelected ? '#F0FDF4' : colors.surface,
                marginHorizontal: 16,
                marginBottom: 10,
                borderRadius: 12,
                padding: 12,
                borderWidth: 1,
                borderColor: isSelected ? '#86EFAC' : colors.border,
              }}
            >
              <TouchableOpacity onPress={() => toggleSelect(item.inventoryId)} style={{ justifyContent: 'center', marginRight: 10 }}>
                {isSelected ? (
                  <CheckSquare size={22} color="#059669" />
                ) : (
                  <Square size={22} color={colors.textTertiary} />
                )}
              </TouchableOpacity>
              <Image source={{ uri: imageUrl }} style={{ width: 70, height: 70, borderRadius: 10, backgroundColor: colors.surfaceVariant }} />
              <View style={{ marginLeft: 10, flex: 1 }}>
                <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text, lineHeight: 18 }} numberOfLines={2}>{item.inventory.productName}</Text>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#059669', marginTop: 4 }}>
                  {formatCurrency(Number(item.inventory.sellingPrice))}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <QuantitySelector
                    size="sm"
                    quantity={item.quantity}
                    onIncrease={() => handleQuantityChange(item.inventoryId, item.quantity + 1)}
                    onDecrease={() => handleQuantityChange(item.inventoryId, item.quantity - 1)}
                  />
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={{ backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, padding: 16, borderRadius: 16, margin: 16, marginBottom: 30 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
          <Text style={{ fontSize: 14, color: colors.textSecondary }}>Subtotal</Text>
          <Text style={{ fontSize: 14, fontWeight: '700', color: colors.text }}>{formatCurrency(subtotal)}</Text>
        </View>
        <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 8 }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: colors.text }}>Total</Text>
          <Text style={{ fontSize: 18, fontWeight: '800', color: '#059669' }}>{formatCurrency(subtotal)}</Text>
        </View>
        <PrimaryButton title="Proceed to Booking" onPress={() => navigation.navigate('CheckoutScreen')} />
      </View>
    </View>
  );
}
