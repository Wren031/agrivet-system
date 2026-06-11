import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  const { isDark } = useTheme();
  return (
    <View className="flex-row items-center justify-between px-6 py-4">
      <View className="flex-1">
        <Text className={`text-2xl font-bold text-${isDark ? "white" : "black"}`}>
          {title}
        </Text>
        {subtitle && (
          <Text className={`text-sm text-${isDark ? "white/60" : "black/60"} mt-0.5`}>
            {subtitle}
          </Text>
        )}
      </View>
      {action && (
        <TouchableOpacity
          className="bg-brand rounded-xl px-4 py-2.5"
          onPress={action.onPress}
          activeOpacity={0.8}
        >
          <Text className="text-white font-bold text-sm">{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
