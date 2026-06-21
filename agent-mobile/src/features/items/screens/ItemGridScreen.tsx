import React, { useState, useMemo, useCallback } from "react";
import { View, FlatList, TextInput, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../../../context/ThemeContext";
import { useItems } from "../hooks/useItems";
import { ItemCard } from "../components/ItemCard";
import { EmptyState } from "../../../components/EmptyState";

export function ItemGridScreen() {
  const { isDark } = useTheme();
  const { items, loading, searchQuery, searchItems, fetchItems } = useItems();

  useFocusEffect(
    useCallback(() => {
      fetchItems();
    }, [fetchItems])
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(items.map((i) => i.category));
    return Array.from(cats).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!selectedCategory) return items;
    return items.filter((i) => i.category === selectedCategory);
  }, [items, selectedCategory]);

  return (
    <SafeAreaView className={`flex-1 bg-${isDark ? "[#1e293b]" : "[#f4f7f5]"}`} edges={["top", "left", "right"]}>
      <View className="px-6 pt-5 pb-4">
        <Text className={`text-2xl font-bold text-${isDark ? "white" : "black"} tracking-tight`}>
          Items Directory
        </Text>
        <Text className={`text-sm font-medium text-${isDark ? "white/60" : "black/60"} mt-1`}>
          Browse product catalog
        </Text>
      </View>

      <View className="px-6 mb-5">
        <TextInput
          className={`w-full px-4 py-3.5 rounded-xl text-base text-${isDark ? "white" : "black"} bg-brand/5 border border-brand/20`}
          placeholder="Search items..."
          placeholderTextColor="rgba(45,106,79,0.4)"
          value={searchQuery}
          onChangeText={searchItems}
          clearButtonMode="while-editing"
        />
      </View>

      <View className="mb-5 h-11">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 24, gap: 10 }}
        >
          <TouchableOpacity
            className={`flex-row items-center gap-2 px-4 py-2 rounded-xl border ${
              selectedCategory === null
                ? "bg-brand border-brand"
                : "bg-brand/5 border-brand/20"
            }`}
            onPress={() => setSelectedCategory(null)}
            activeOpacity={0.7}
          >
            <View
              className={`w-2 h-2 rounded-full ${
                selectedCategory === null ? "bg-white" : "bg-brand/50"
              }`}
            />
            <Text
              className={`text-sm font-bold tracking-wide ${
                selectedCategory === null ? "text-white" : `text-${isDark ? "white" : "black"}`
              }`}
            >
              All Items
            </Text>
          </TouchableOpacity>

          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <TouchableOpacity
                key={cat}
                className={`flex-row items-center gap-2 px-4 py-2 rounded-xl border ${
                  isActive
                    ? "bg-brand border-brand"
                    : "bg-brand/5 border-brand/20"
                }`}
                onPress={() => setSelectedCategory(cat)}
                activeOpacity={0.7}
              >
                <View
                  className={`w-2 h-2 rounded-full ${isActive ? "bg-white" : "bg-brand/50"}`}
                />
                <Text
                  className={`text-sm font-bold tracking-wide ${
                    isActive ? "text-white" : `text-${isDark ? "white" : "black"}`
                  }`}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <View className="flex-row items-center px-6 mb-4">
        <View className="flex-row items-center gap-2">
          <View className="bg-brand/10 rounded-lg px-2.5 py-1">
            <Text className={`text-${isDark ? "white" : "black"} text-xs font-bold tracking-wide`}>
              {filteredItems.length} ITEM{filteredItems.length !== 1 ? "S" : ""}
            </Text>
          </View>
          {selectedCategory && (
            <View className="bg-brand/5 rounded-lg px-2.5 py-1">
              <Text className={`text-${isDark ? "white/70" : "black/70"} text-xs font-semibold`}>
                {selectedCategory}
              </Text>
            </View>
          )}
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
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="flex-1 max-w-[50%]">
              <ItemCard item={item} />
            </View>
          )}
          numColumns={2}
          columnWrapperClassName="justify-between px-6 gap-3"
          contentContainerClassName="gap-3 pb-8"
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
