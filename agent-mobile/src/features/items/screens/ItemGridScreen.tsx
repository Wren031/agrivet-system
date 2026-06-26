import React, { useState, useMemo, useCallback } from "react";
import { View, FlatList, TextInput, Text, TouchableOpacity, ActivityIndicator, RefreshControl, Image } from "react-native";
import { Search, Package, X } from "lucide-react-native";
import { useTheme } from "../../../context/ThemeContext";
import { useItems } from "../hooks/useItems";
import { EmptyState } from "../../../components/EmptyState";
import { ScreenLayout } from "../../../components/ScreenLayout";
import { PageHeader } from "../../../components/PageHeader";
import { getImageUrl } from "../../../config/api.config";

export function ItemGridScreen({ navigation }: any) {
  const { isDark } = useTheme();
  const { items, loading, searchQuery, searchItems, fetchItems } = useItems();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(items.map((i) => i.category));
    return Array.from(cats).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    let result = items;
    if (selectedCategory) {
      result = result.filter((i) => i.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, selectedCategory, searchQuery]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchItems();
    setRefreshing(false);
  }, [fetchItems]);

  const keyExtractor = useCallback((item: any) => item.id, []);

  const renderItem = useCallback(({ item }: { item: any }) => {
    const imageUri = getImageUrl(item.image);
    const stockColor =
      item.stock <= 20 ? "bg-red-400" : item.stock <= 50 ? "bg-yellow-400" : "bg-brand";
    return (
      <View className="flex-1 max-w-[50%]">
        <TouchableOpacity
          className="bg-brand/5 rounded-2xl p-3 border border-brand/20"
          activeOpacity={0.7}
          onPress={() => navigation.navigate("ItemDetail", { item })}
        >
          <View className="w-full h-[180px] bg-brand/5 rounded-xl mb-2 overflow-hidden">
            {imageUri ? (
              <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
            ) : (
              <View className="flex-1 items-center justify-center">
                <Package size={32} color="rgba(45,106,79,0.3)" />
              </View>
            )}
          </View>
          <View className="self-start px-2 py-0.5 rounded-full bg-brand/10 mb-1">
            <Text className={`text-[10px] font-bold text-${isDark ? "white" : "black"}`}>
              {item.category}
            </Text>
          </View>
          <Text className={`text-sm font-bold text-${isDark ? "white" : "black"} mb-1`} numberOfLines={1}>
            {item.name}
          </Text>
          <View className="flex-row items-center justify-between">
            <Text className={`text-base font-bold text-${isDark ? "white" : "black"}`}>
              ₱{item.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
            </Text>
            <View className="flex-row items-center gap-1">
              <View className={`w-2 h-2 rounded-full ${stockColor}`} />
              <Text className={`text-[10px] text-${isDark ? "white/60" : "black/60"}`}>
                {item.stock}
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }, [navigation, isDark]);

  return (
    <ScreenLayout edges={["top", "left", "right"]}>
      <PageHeader title="Items Directory" subtitle="Browse product catalog" compact />

      <View className="px-5 mb-4">
        <TextInput
          className={`w-full px-4 py-3.5 rounded-xl text-base text-${isDark ? "white" : "black"} bg-brand/5 border border-brand/20`}
          placeholder="Search items..."
          placeholderTextColor="rgba(45,106,79,0.4)"
          value={searchQuery}
          onChangeText={searchItems}
          clearButtonMode="while-editing"
        />
      </View>

      <View className="flex-row items-center justify-between px-6 mb-4">
        <TouchableOpacity
          className="flex-row items-center gap-2 px-4 py-2 rounded-xl bg-brand/5 border border-brand/20"
          onPress={() => setShowCategoryModal(true)}
          activeOpacity={0.7}
        >
          <Search size={16} color="#2d6a4f" />
          <Text className={`text-sm font-bold text-${isDark ? "white" : "black"}`}>
            {selectedCategory || "All"}
          </Text>
          {selectedCategory && (
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={14} color="rgba(45,106,79,0.5)" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        <View className="bg-brand/10 rounded-lg px-2.5 py-1">
          <Text className={`text-${isDark ? "white" : "black"} text-xs font-bold tracking-wide`}>
            {filteredItems.length} ITEM{filteredItems.length !== 1 ? "S" : ""}
          </Text>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2d6a4f" />
          <Text className={`text-${isDark ? "white/50" : "black/50"} mt-3 font-medium`}>
            Loading catalog data...
          </Text>
        </View>
      ) : filteredItems.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No Items Found"
          description="Try a different search term or change your active category filter."
        />
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          numColumns={2}
          columnWrapperClassName="gap-3"
          contentContainerClassName="gap-3 px-5 pb-4"
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2d6a4f" />}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={7}
        />
      )}

      {showCategoryModal && (
        <View className={`absolute inset-0 ${isDark ? "bg-black/70" : "bg-black/40"}`}>
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={() => setShowCategoryModal(false)}
          />
          <View className={`rounded-t-3xl p-6 bg-${isDark ? "[#1e293b]" : "[#f4f7f5]"}`}>
            <View className="flex-row items-center justify-between mb-4">
              <Text className={`text-lg font-bold text-${isDark ? "white" : "black"}`}>
                Select Category
              </Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <X size={22} color={isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)"} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              className={`flex-row items-center px-4 py-3.5 rounded-xl mb-1 ${
                selectedCategory === null ? "bg-brand/10" : ""
              }`}
              onPress={() => {
                setSelectedCategory(null);
                setShowCategoryModal(false);
              }}
              activeOpacity={0.7}
            >
              <View className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${
                selectedCategory === null ? "border-brand bg-brand" : "border-brand/30"
              }`}>
                {selectedCategory === null && <View className="w-2.5 h-2.5 rounded-full bg-white" />}
              </View>
              <Text className={`text-base font-medium text-${isDark ? "white" : "black"}`}>
                All Items
              </Text>
            </TouchableOpacity>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                className={`flex-row items-center px-4 py-3.5 rounded-xl mb-1 ${
                  selectedCategory === cat ? "bg-brand/10" : ""
                }`}
                onPress={() => {
                  setSelectedCategory(cat);
                  setShowCategoryModal(false);
                }}
                activeOpacity={0.7}
              >
                <View className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${
                  selectedCategory === cat ? "border-brand bg-brand" : "border-brand/30"
                }`}>
                  {selectedCategory === cat && <View className="w-2.5 h-2.5 rounded-full bg-white" />}
                </View>
                <Text className={`text-base font-medium text-${isDark ? "white" : "black"}`}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              onPress={() => setShowCategoryModal(false)}
              className="w-full mt-4 py-3.5 rounded-xl bg-brand items-center active:bg-brand/90"
              activeOpacity={0.85}
            >
              <Text className="text-white text-base font-bold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScreenLayout>
  );
}
