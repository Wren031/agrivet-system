import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Booking } from "../../../types";
import { StatusBadge } from "../../bookings/components/StatusBadge";

interface HistoryCardProps {
  booking: Booking;
  onViewOrder: (booking: Booking) => void;
}

export function HistoryCard({ booking, onViewOrder }: HistoryCardProps) {
  return (
    <View className="bg-white dark:bg-surface-800 rounded-2xl p-4 mb-3 border border-surface-100 dark:border-surface-700">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-1">
          <Text className="text-base font-semibold text-surface-900 dark:text-surface-100">
            {booking.customerName}
          </Text>
          <Text className="text-xs text-surface-400 dark:text-surface-500">
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
          <Text className="text-xs text-surface-400 dark:text-surface-500">
            {booking.items.length} item{booking.items.length !== 1 ? "s" : ""}
          </Text>
          <Text className="text-lg font-bold text-surface-900 dark:text-surface-100">
            ₱{booking.total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onViewOrder(booking)}
          className="bg-primary-50 dark:bg-primary-900/20 rounded-xl px-4 py-2 border border-primary-200 dark:border-primary-800"
        >
          <Text className="text-primary-600 dark:text-primary-400 text-sm font-semibold">
            View Order
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
