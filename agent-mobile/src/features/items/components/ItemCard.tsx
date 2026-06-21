import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Plus, Minus } from "lucide-react-native";
import { Item } from "../../../types";
import { useTheme } from "../../../context/ThemeContext";
import { getImageUrl } from "@/config/api.config";

interface ItemCardProps {
  item: Item;
  onPress?: (item: Item) => void;
  cartQuantity?: number;
  onIncrement?: (itemId: string) => void;
  onDecrement?: (itemId: string) => void;
}

function getStockIndicator(stock: number) {
  if (stock <= 20) return { opacity: "bg-brand/50", label: "Low Stock" };
  if (stock <= 50) return { opacity: "bg-brand/70", label: "Medium" };
  return { opacity: "bg-brand", label: "In Stock" };
}

export function ItemCard({ item, onPress, cartQuantity = 0, onIncrement, onDecrement }: ItemCardProps) {
  const { isDark } = useTheme();
  const stockInfo = getStockIndicator(item.stock);
  const [imageError, setImageError] = useState(false);

  const imageUri = getImageUrl(item.image);
  const showImage = !!imageUri && !imageError;

  const content = (
    <View className="bg-brand/5 rounded-2xl p-3 border border-brand/20">
      <View className="w-full h-24 bg-brand/5 rounded-xl mb-3 overflow-hidden">
        {showImage ? (
          <Image
            source={{ uri: imageUri }}
            className="w-full h-full"
            resizeMode="cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <View className="flex-1 items-center justify-center">
            <Text className="text-3xl opacity-40">📦</Text>
          </View>
        )}
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
      {cartQuantity > 0 && (
        <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-brand/10">
          <TouchableOpacity
            className="w-8 h-8 rounded-lg bg-brand/10 items-center justify-center"
            onPress={() => onDecrement?.(item.id)}
          >
            <Minus size={16} color="#2d6a4f" />
          </TouchableOpacity>
          <Text className={`text-base font-bold text-${isDark ? "white" : "black"}`}>
            {cartQuantity}
          </Text>
          <TouchableOpacity
            className="w-8 h-8 rounded-lg bg-brand/10 items-center justify-center"
            onPress={() => onIncrement?.(item.id)}
          >
            <Plus size={16} color="#2d6a4f" />
          </TouchableOpacity>
        </View>
      )}
      {cartQuantity === 0 && onPress && (
        <TouchableOpacity
          className="w-full mt-3 py-2 rounded-xl bg-brand items-center justify-center"
          onPress={() => onPress(item)}
        >
          <Text className="text-white text-sm font-bold">Add</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return content;
}
