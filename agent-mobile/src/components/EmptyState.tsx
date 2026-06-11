import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
}

export function EmptyState({ icon, title, description }: EmptyStateProps) {
  const { isDark } = useTheme();
  return (
    <View className="flex-1 items-center justify-center py-16 px-8">
      <Text className="text-5xl mb-4 opacity-40">{icon}</Text>
      <Text className={`text-lg font-bold text-${isDark ? "white" : "black"} text-center mb-2`}>
        {title}
      </Text>
      <Text className={`text-sm text-${isDark ? "white/60" : "black/60"} text-center`}>
        {description}
      </Text>
    </View>
  );
}
