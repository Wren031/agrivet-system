import React from "react";
import { View, Text } from "react-native";
import { Item } from "../../../types";
import { useTheme } from "../../../context/ThemeContext";

interface ItemCardProps {
  item: Item;
}

function getStockIndicator(stock: number) {
  if (stock <= 20) return { opacity: "bg-brand/50", label: "Low Stock" };
  if (stock <= 50) return { opacity: "bg-brand/70", label: "Medium" };
  return { opacity: "bg-brand", label: "In Stock" };
}

export function ItemCard({ item }: ItemCardProps) {
  const { isDark } = useTheme();
  const stockInfo = getStockIndicator(item.stock);

  return (
    <View className="bg-brand/5 rounded-2xl p-3 border border-brand/20">
      <View className="w-full h-24 bg-brand/5 rounded-xl mb-3 items-center justify-center">
        <Text className="text-3xl opacity-40">📦</Text>
      </View>
      <View className="flex-row items-center gap-1 mb-2">
        <View className="px-2 py-0.5 rounded-full bg-brand/10">
          <Text className={`text-[10px] font-bold text-${isDark ? "white" : "black"}`}>{item.category}</Text>
        </View>
      </View>
      <Text className={`text-sm font-bold text-${isDark ? "white" : "black"} mb-1`} numberOfLines={1}>
        {item.name}
      </Text>
      <Text className={`text-xs text-${isDark ? "white/60" : "black/60"} mb-2`} numberOfLines={1}>
        {item.description}
      </Text>
      <View className="flex-row items-center justify-between">
        <Text className={`text-base font-bold text-${isDark ? "white" : "black"}`}>
          ₱{item.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
        </Text>
        <View className="flex-row items-center gap-1.5">
          <View className={`w-2 h-2 rounded-full ${stockInfo.opacity}`} />
          <Text className={`text-[10px] text-${isDark ? "white/60" : "black/60"}`}>
            {item.stock} units
          </Text>
        </View>
      </View>
    </View>
  );
}
