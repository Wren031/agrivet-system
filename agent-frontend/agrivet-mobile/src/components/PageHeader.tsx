import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-6 py-4">
      <View className="flex-1">
        <Text className="text-2xl font-bold text-surface-900 dark:text-surface-100">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
            {subtitle}
          </Text>
        )}
      </View>
      {action && (
        <TouchableOpacity
          className="bg-primary-600 rounded-xl px-4 py-2"
          onPress={action.onPress}
          activeOpacity={0.8}
        >
          <Text className="text-white font-semibold text-sm">{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
