import React from "react";
import { View, Text } from "react-native";
import { Item } from "../../../types";

interface ItemCardProps {
  item: Item;
}

const categoryColors: Record<string, string> = {
  Poultry: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  Supplements: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  Medicine: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  Aquaculture: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  Feed: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Swine: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  Livestock: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
};

function getStockIndicator(stock: number) {
  if (stock <= 20) return { color: "bg-red-500", label: "Low Stock" };
  if (stock <= 50) return { color: "bg-amber-500", label: "Medium" };
  return { color: "bg-emerald-500", label: "In Stock" };
}

export function ItemCard({ item }: ItemCardProps) {
  const stockInfo = getStockIndicator(item.stock);
  const categoryClass =
    categoryColors[item.category] || "bg-surface-100 text-surface-700 dark:bg-surface-700 dark:text-surface-300";

  return (
    <View className="bg-white dark:bg-surface-800 rounded-2xl p-3 border border-surface-100 dark:border-surface-700">
      <View className="w-full h-24 bg-surface-100 dark:bg-surface-700 rounded-xl mb-3 items-center justify-center">
        <Text className="text-3xl">📦</Text>
      </View>
      <View className="flex-row items-center gap-1 mb-2">
        <View className={`px-2 py-0.5 rounded-full ${categoryClass}`}>
          <Text className="text-[10px] font-semibold">{item.category}</Text>
        </View>
      </View>
      <Text className="text-sm font-semibold text-surface-900 dark:text-surface-100 mb-1" numberOfLines={1}>
        {item.name}
      </Text>
      <Text className="text-xs text-surface-500 dark:text-surface-400 mb-2" numberOfLines={1}>
        {item.description}
      </Text>
      <View className="flex-row items-center justify-between">
        <Text className="text-base font-bold text-primary-600 dark:text-primary-400">
          ₱{item.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
        </Text>
        <View className="flex-row items-center gap-1.5">
          <View className={`w-2 h-2 rounded-full ${stockInfo.color}`} />
          <Text className="text-[10px] text-surface-500 dark:text-surface-400">
            {item.stock} units
          </Text>
        </View>
      </View>
    </View>
  );
}
