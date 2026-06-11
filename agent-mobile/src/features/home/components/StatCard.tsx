import React from "react";
import { View, Text } from "react-native";
import { useTheme } from "../../../context/ThemeContext";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}

export function StatCard({ icon, label, value }: StatCardProps) {
  const { isDark } = useTheme();

  return (
    <View className={`bg-${isDark ? "[#1A1A1A]" : "white"} rounded-2xl p-4 flex-1 shadow-sm border border-${isDark ? "white/5" : "black/5"}`}>
      <View className="flex-row items-start">
        <View className="w-[3px] h-10 rounded-full bg-brand mr-3 mt-1" />
        <View className="flex-1">
          <Text className={`text-3xl font-bold text-${isDark ? "white" : "black"} tracking-tight`}>
            {value}
          </Text>
          <View className="flex-row items-center gap-1.5 mt-0.5">
            <View className="opacity-40">{icon}</View>
            <Text className={`text-xs text-${isDark ? "white/50" : "black/50"} font-medium`}>{label}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
