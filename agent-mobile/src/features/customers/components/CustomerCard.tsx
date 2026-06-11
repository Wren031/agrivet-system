import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Customer } from "../../../types";
import { getCityName, getProvinceName } from "../../../data/philippineAddress";
import { useTheme } from "../../../context/ThemeContext";

interface CustomerCardProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

function formatAddress(c: Customer): string {
  const parts = [c.address, getCityName(c.city), getProvinceName(c.province)].filter(Boolean);
  return parts.join(", ") || "No address";
}

export function CustomerCard({ customer, onEdit, onDelete }: CustomerCardProps) {
  const { isDark } = useTheme();
  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <View className="bg-brand/5 rounded-2xl p-4 mb-3 border border-brand/20">
      <View className="flex-row items-center">
        <View className="w-12 h-12 rounded-full bg-brand/10 items-center justify-center mr-3">
          <Text className={`text-${isDark ? "white" : "black"} font-bold text-sm`}>
            {initials}
          </Text>
        </View>
        <View className="flex-1">
          <Text className={`text-base font-bold text-${isDark ? "white" : "black"}`}>
            {customer.name}
          </Text>
          <Text className={`text-sm text-${isDark ? "white/70" : "black/70"}`}>
            {customer.email}
          </Text>
          <Text className={`text-xs text-${isDark ? "white/50" : "black/50"} mt-0.5`}>
            {customer.phone}
          </Text>
        </View>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => onEdit(customer)}
            className="w-8 h-8 rounded-lg bg-brand/10 items-center justify-center"
          >
            <Text className={`text-${isDark ? "white" : "black"} text-xs`}>✎</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDelete(customer)}
            className="w-8 h-8 rounded-lg bg-brand/5 items-center justify-center"
          >
            <Text className={`text-${isDark ? "white/70" : "black/70"} text-xs`}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="mt-3 pt-3 border-t border-brand/10">
        <Text className={`text-xs text-${isDark ? "white/50" : "black/50"}`}>
          {formatAddress(customer)}
        </Text>
      </View>
    </View>
  );
}
