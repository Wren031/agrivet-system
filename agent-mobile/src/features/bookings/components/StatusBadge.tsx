import React from "react";
import { View, Text } from "react-native";
import { BookingStatus } from "../../../types";
import { useTheme } from "../../../context/ThemeContext";

interface StatusBadgeProps {
  status: BookingStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const { isDark } = useTheme();

  const statusStyles: Record<BookingStatus, { bg: string; text: string; dot: string; label: string }> = {
    Pending: {
      bg: "bg-brand/10",
      text: `text-${isDark ? "white/70" : "black/70"}`,
      dot: "bg-brand/40",
      label: "Pending",
    },
    Accepted: {
      bg: "bg-brand/20",
      text: `text-${isDark ? "white" : "black"}`,
      dot: "bg-brand/70",
      label: "Accepted",
    },
    Ongoing: {
      bg: "bg-brand/20",
      text: `text-${isDark ? "white" : "black"}`,
      dot: "bg-brand",
      label: "Ongoing",
    },
    Success: {
      bg: "bg-brand/30",
      text: `text-${isDark ? "white" : "black"}`,
      dot: "bg-brand",
      label: "Success",
    },
    Cancelled: {
      bg: "bg-brand/5",
      text: `text-${isDark ? "white/50" : "black/50"}`,
      dot: "bg-brand/30",
      label: "Cancelled",
    },
  };

  const style = statusStyles[status];

  return (
    <View className={`flex-row items-center gap-1.5 px-3 py-1 rounded-full border border-brand/20 ${style.bg}`}>
      <View className={`w-2 h-2 rounded-full ${style.dot}`} />
      <Text
        className={`font-semibold ${
          size === "sm" ? "text-[10px]" : "text-xs"
        } ${style.text}`}
      >
        {style.label}
      </Text>
    </View>
  );
}
