import React from "react";
import { View, Text } from "react-native";
import { BookingStatus } from "../../../types";

interface StatusBadgeProps {
  status: BookingStatus;
  size?: "sm" | "md";
}

const statusStyles: Record<BookingStatus, { bg: string; text: string; dot: string }> = {
  Pending: {
    bg: "bg-amber-50 dark:bg-amber-900/20",
    text: "text-amber-700 dark:text-amber-400",
    dot: "bg-amber-500",
  },
  Ongoing: {
    bg: "bg-blue-50 dark:bg-blue-900/20",
    text: "text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  Success: {
    bg: "bg-emerald-50 dark:bg-emerald-900/20",
    text: "text-emerald-700 dark:text-emerald-400",
    dot: "bg-emerald-500",
  },
  Cancelled: {
    bg: "bg-red-50 dark:bg-red-900/20",
    text: "text-red-700 dark:text-red-400",
    dot: "bg-red-500",
  },
};

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const style = statusStyles[status];

  return (
    <View className={`flex-row items-center gap-1.5 px-3 py-1 rounded-full ${style.bg}`}>
      <View className={`w-2 h-2 rounded-full ${style.dot}`} />
      <Text
        className={`font-semibold ${
          size === "sm" ? "text-[10px]" : "text-xs"
        } ${style.text}`}
      >
        {status}
      </Text>
    </View>
  );
}
