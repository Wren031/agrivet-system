import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  compact?: boolean;
}

export function PageHeader({ title, subtitle, action, compact = false }: PageHeaderProps) {
  const { isDark } = useTheme();

  return (
    <View className={`px-5 ${compact ? "pt-3 pb-2" : "pt-4 pb-3"}`}>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 pr-4">
          <Text
            className={`font-bold tracking-tight ${isDark ? "text-white" : "text-black"} ${
              compact ? "text-xl" : "text-2xl"
            }`}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              className={`text-sm mt-0.5 ${isDark ? "text-white/55" : "text-black/55"}`}
              numberOfLines={2}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
        {action ? (
          <TouchableOpacity
            className="bg-brand rounded-xl px-4 py-2.5"
            onPress={action.onPress}
            activeOpacity={0.85}
            style={Platform.OS === "ios" ? { shadowColor: "#1b4332", shadowOpacity: 0.2, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } } : { elevation: 3 }}
          >
            <Text className="text-white font-bold text-sm">{action.label}</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
}
