import React, { useState } from "react";
import { View, FlatList, TextInput, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useItems } from "../hooks/useItems";
import { ItemCard } from "../components/ItemCard";
import { EmptyState } from "../../../components/EmptyState";

export function ItemGridScreen() {
  const { items, loading, searchQuery, searchItems } = useItems();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  return (
    <SafeAreaView className="flex-1 bg-surface-50 dark:bg-surface-950">
      <View className="px-6 pt-4 pb-3">
        <Text className="text-2xl font-bold text-surface-900 dark:text-surface-100">
          Items Directory
        </Text>
        <Text className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
          Browse product catalog
        </Text>
      </View>

      <View className="px-6 mb-4">
        <TextInput
          className="w-full px-4 py-3 rounded-xl text-base text-surface-900 dark:text-surface-100 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700"
          placeholder="Search items..."
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={searchItems}
        />
      </View>

      <View className="flex-row px-6 mb-4 gap-2">
        <View className="bg-primary-50 dark:bg-primary-900/20 rounded-xl px-3 py-2 flex-row items-center">
          <Text className="text-primary-600 dark:text-primary-400 text-sm font-medium">
            📦 {items.length} items
          </Text>
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-surface-400">Loading items...</Text>
        </View>
      ) : items.length === 0 ? (
        <EmptyState
          icon="📦"
          title="No Items Found"
          description="Try a different search term."
        />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ItemCard item={item} />}
          numColumns={2}
          columnWrapperClassName="gap-3 px-6"
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}
