import React, { memo } from "react";
import { View, Text } from "react-native";
import { BookingStatus } from "../../../types";
import { useTheme } from "../../../context/ThemeContext";

interface StatusBadgeProps {
  status: BookingStatus;
  size?: "sm" | "md";
}

const STATUS_STYLES: Record<BookingStatus, { bg: string; dot: string; label: string }> = {
  Pending: { bg: "bg-accent/15", dot: "bg-accent", label: "Pending" },
  Approved: { bg: "bg-brand/15", dot: "bg-brand", label: "Approved" },
  Delivered: { bg: "bg-brand/30", dot: "bg-brand", label: "Delivered" },
};

export const StatusBadge = memo(function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const { isDark } = useTheme();
  const style = STATUS_STYLES[status];

  return (
    <View className={`flex-row items-center gap-1.5 px-3 py-1 rounded-full border border-brand/20 ${style.bg}`}>
      <View className={`w-2 h-2 rounded-full ${style.dot}`} />
      <Text
        className={`font-semibold ${
          size === "sm" ? "text-[10px]" : "text-xs"
        } ${isDark ? "text-white" : "text-black"}`}
      >
        {style.label}
      </Text>
    </View>
  );
});
