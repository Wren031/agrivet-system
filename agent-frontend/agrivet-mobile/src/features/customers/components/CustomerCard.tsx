import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Customer } from "../../../types";

interface CustomerCardProps {
  customer: Customer;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
}

export function CustomerCard({ customer, onEdit, onDelete }: CustomerCardProps) {
  const initials = customer.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <View className="bg-white dark:bg-surface-800 rounded-2xl p-4 mb-3 border border-surface-100 dark:border-surface-700">
      <View className="flex-row items-center">
        <View className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 items-center justify-center mr-3">
          <Text className="text-primary-600 dark:text-primary-400 font-bold text-sm">
            {initials}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-base font-semibold text-surface-900 dark:text-surface-100">
            {customer.name}
          </Text>
          <Text className="text-sm text-surface-500 dark:text-surface-400">
            {customer.email}
          </Text>
          <Text className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">
            {customer.phone}
          </Text>
        </View>
        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={() => onEdit(customer)}
            className="w-8 h-8 rounded-lg bg-surface-100 dark:bg-surface-700 items-center justify-center"
          >
            <Text className="text-surface-600 dark:text-surface-300 text-xs">✎</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onDelete(customer)}
            className="w-8 h-8 rounded-lg bg-red-50 dark:bg-red-900/20 items-center justify-center"
          >
            <Text className="text-red-500 text-xs">✕</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="mt-3 pt-3 border-t border-surface-100 dark:border-surface-700">
        <Text className="text-xs text-surface-400 dark:text-surface-500">
          📍 {customer.address}
        </Text>
      </View>
    </View>
  );
}
