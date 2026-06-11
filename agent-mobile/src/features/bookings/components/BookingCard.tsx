import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Booking } from "../../../types";
import { StatusBadge } from "./StatusBadge";
import { useTheme } from "../../../context/ThemeContext";

interface BookingCardProps {
  booking: Booking;
  onPress: (booking: Booking) => void;
  onUpdateStatus: (booking: Booking) => void;
}

export function BookingCard({ booking, onPress, onUpdateStatus }: BookingCardProps) {
  const { isDark } = useTheme();

  return (
    <TouchableOpacity
      className="bg-brand/5 rounded-2xl p-4 mb-3 border border-brand/20"
      onPress={() => onPress(booking)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1">
          <Text className={`text-base font-bold text-${isDark ? "white" : "black"}`}>
            {booking.customerName}
          </Text>
          <Text className={`text-xs text-${isDark ? "white/50" : "black/50"} mt-0.5`}>
            {new Date(booking.createdAt).toLocaleDateString("en-PH", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>
        <StatusBadge status={booking.status} size="sm" />
      </View>

      <View className="bg-brand/3 rounded-xl p-3 mb-3">
        {booking.items.map((item, index) => (
          <View key={index} className="flex-row items-center justify-between mb-1">
            <Text className={`text-xs text-${isDark ? "white/70" : "black/70"} flex-1`} numberOfLines={1}>
              {item.name} x{item.quantity}
            </Text>
            <Text className={`text-xs text-${isDark ? "white/50" : "black/50"} ml-2`}>
              ₱{item.subtotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
            </Text>
          </View>
        ))}
      </View>

      <View className="flex-row items-center justify-between">
        <View>
          <Text className={`text-[10px] text-${isDark ? "white/50" : "black/50"} uppercase tracking-wider`}>
            Total
          </Text>
          <Text className={`text-lg font-bold text-${isDark ? "white" : "black"}`}>
            ₱{booking.total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onUpdateStatus(booking)}
          className="bg-brand/10 rounded-lg px-3 py-1.5"
        >
          <Text className={`text-xs font-medium text-${isDark ? "white" : "black"}`}>
            Update Status
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
