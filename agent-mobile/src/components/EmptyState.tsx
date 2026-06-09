import React from "react";
import { View, Text } from "react-native";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center py-16 px-8">
      <Text className="text-5xl mb-4">{icon}</Text>
      <Text className="text-lg font-semibold text-surface-900 dark:text-surface-100 text-center mb-2">
        {title}
      </Text>
      <Text className="text-sm text-surface-500 dark:text-surface-400 text-center">
        {description}
      </Text>
    </View>
  );
}
