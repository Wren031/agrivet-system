import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Booking } from "../../../types";
import { StatusBadge } from "../../bookings/components/StatusBadge";
import { useTheme } from "../../../context/ThemeContext";

interface HistoryCardProps {
  booking: Booking;
  onViewOrder: (booking: Booking) => void;
}

export function HistoryCard({ booking, onViewOrder }: HistoryCardProps) {
  const { isDark } = useTheme();

  return (
    <View className="bg-brand/5 rounded-2xl p-4 mb-3 border border-brand/20">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-1">
          <Text className={`text-base font-bold text-${isDark ? "white" : "black"}`}>
            {booking.customerName}
          </Text>
          <Text className={`text-xs text-${isDark ? "white/50" : "black/50"}`}>
            {new Date(booking.updatedAt).toLocaleDateString("en-PH", {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
        <StatusBadge status={booking.status} size="sm" />
      </View>

      <View className="flex-row items-center justify-between mt-2">
        <View>
          <Text className={`text-xs text-${isDark ? "white/50" : "black/50"}`}>
            {booking.items.length} item{booking.items.length !== 1 ? "s" : ""}
          </Text>
          <Text className={`text-lg font-bold text-${isDark ? "white" : "black"}`}>
            ₱{booking.total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onViewOrder(booking)}
          className="bg-brand/10 rounded-xl px-4 py-2 border border-brand/20"
        >
          <Text className={`text-${isDark ? "white" : "black"} text-sm font-bold`}>
            View Order
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
