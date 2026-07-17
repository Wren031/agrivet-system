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
      <View
        className={`w-20 h-20 rounded-2xl items-center justify-center mb-5 ${
          isDark ? "bg-white/5" : "bg-brand/5"
        }`}
      >
        <Text className="text-4xl">{icon}</Text>
      </View>
      <Text
        className={`text-lg font-bold text-center mb-2 ${
          isDark ? "text-white" : "text-slate-900"
        }`}
      >
        {title}
      </Text>
      <Text
        className={`text-sm text-center leading-5 max-w-[280px] ${
          isDark ? "text-white/50" : "text-slate-500"
        }`}
      >
        {description}
      </Text>
    </View>
  );
}
