import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Booking } from "../../../types";
import { StatusBadge } from "./StatusBadge";

interface BookingCardProps {
  booking: Booking;
  onPress: (booking: Booking) => void;
  onUpdateStatus: (booking: Booking) => void;
}

export function BookingCard({ booking, onPress, onUpdateStatus }: BookingCardProps) {
  return (
    <TouchableOpacity
      className="bg-white dark:bg-surface-800 rounded-2xl p-4 mb-3 border border-surface-100 dark:border-surface-700"
      onPress={() => onPress(booking)}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View className="flex-1">
          <Text className="text-base font-semibold text-surface-900 dark:text-surface-100">
            {booking.customerName}
          </Text>
          <Text className="text-xs text-surface-400 dark:text-surface-500 mt-0.5">
            {new Date(booking.createdAt).toLocaleDateString("en-PH", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </Text>
        </View>
        <StatusBadge status={booking.status} size="sm" />
      </View>

      <View className="bg-surface-50 dark:bg-surface-700/50 rounded-xl p-3 mb-3">
        {booking.items.map((item, index) => (
          <View key={index} className="flex-row items-center justify-between mb-1">
            <Text className="text-xs text-surface-600 dark:text-surface-300 flex-1" numberOfLines={1}>
              {item.name} x{item.quantity}
            </Text>
            <Text className="text-xs text-surface-500 dark:text-surface-400 ml-2">
              ₱{item.subtotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
            </Text>
          </View>
        ))}
      </View>

      <View className="flex-row items-center justify-between">
        <View>
          <Text className="text-[10px] text-surface-400 dark:text-surface-500 uppercase tracking-wider">
            Total
          </Text>
          <Text className="text-lg font-bold text-surface-900 dark:text-surface-100">
            ₱{booking.total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onUpdateStatus(booking)}
          className="bg-surface-100 dark:bg-surface-700 rounded-lg px-3 py-1.5"
        >
          <Text className="text-xs font-medium text-surface-600 dark:text-surface-300">
            Update Status
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}
