import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBadge } from "../components/StatusBadge";
import { bookingApi } from "../services/bookingApi";
import { Booking } from "../../../types";

export function BookingDetailScreen({ route, navigation }: any) {
  const { bookingId } = route.params;
  const [booking, setBooking] = useState<Booking | null>(null);

  useEffect(() => {
    loadBooking();
  }, []);

  const loadBooking = async () => {
    const data = await bookingApi.getById(bookingId);
    if (data) setBooking(data);
  };

  if (!booking) {
    return (
      <SafeAreaView className="flex-1 bg-surface-50 dark:bg-surface-950 items-center justify-center">
        <Text className="text-surface-400">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface-50 dark:bg-surface-950">
      <ScrollView contentContainerClassName="p-6">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className="text-2xl font-bold text-surface-900 dark:text-surface-100">
              Booking Receipt
            </Text>
            <Text className="text-sm text-surface-500 dark:text-surface-400">
              #{booking.id}
            </Text>
          </View>
          <StatusBadge status={booking.status} />
        </View>

        <View className="bg-white dark:bg-surface-800 rounded-2xl p-5 mb-4 border border-surface-100 dark:border-surface-700">
          <Text className="text-xs text-surface-400 dark:text-surface-500 uppercase tracking-wider mb-2">
            Customer
          </Text>
          <Text className="text-lg font-semibold text-surface-900 dark:text-surface-100">
            {booking.customerName}
          </Text>
        </View>

        <View className="bg-white dark:bg-surface-800 rounded-2xl p-5 mb-4 border border-surface-100 dark:border-surface-700">
          <Text className="text-xs text-surface-400 dark:text-surface-500 uppercase tracking-wider mb-3">
            Items Purchased
          </Text>
          {booking.items.map((item, index) => (
            <View key={index} className="flex-row items-center justify-between py-2 border-b border-surface-100 dark:border-surface-700 last:border-b-0">
              <View className="flex-1">
                <Text className="text-sm font-medium text-surface-900 dark:text-surface-100">
                  {item.name}
                </Text>
                <Text className="text-xs text-surface-500 dark:text-surface-400">
                  {item.quantity} x ₱{item.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </Text>
              </View>
              <Text className="text-sm font-semibold text-surface-700 dark:text-surface-300">
                ₱{item.subtotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </Text>
            </View>
          ))}
          <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-surface-200 dark:border-surface-600">
            <Text className="text-lg font-bold text-surface-900 dark:text-surface-100">
              Total
            </Text>
            <Text className="text-xl font-bold text-primary-600 dark:text-primary-400">
              ₱{booking.total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        <View className="bg-white dark:bg-surface-800 rounded-2xl p-5 border border-surface-100 dark:border-surface-700">
          <Text className="text-xs text-surface-400 dark:text-surface-500 uppercase tracking-wider mb-2">
            Timestamps
          </Text>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className="text-sm text-surface-600 dark:text-surface-400">Created</Text>
              <Text className="text-sm text-surface-900 dark:text-surface-100">
                {new Date(booking.createdAt).toLocaleString("en-PH")}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-surface-600 dark:text-surface-400">Last Updated</Text>
              <Text className="text-sm text-surface-900 dark:text-surface-100">
                {new Date(booking.updatedAt).toLocaleString("en-PH")}
              </Text>
            </View>
          </View>
          {booking.notes && (
            <View className="mt-3 pt-3 border-t border-surface-100 dark:border-surface-700">
              <Text className="text-xs text-surface-400 dark:text-surface-500 uppercase tracking-wider mb-1">
                Notes
              </Text>
              <Text className="text-sm text-surface-700 dark:text-surface-300">
                {booking.notes}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
