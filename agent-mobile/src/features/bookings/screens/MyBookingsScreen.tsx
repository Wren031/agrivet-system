import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { ArrowLeft, Calendar } from "lucide-react-native";
import { useTheme } from "../../../context/ThemeContext";
import { Booking } from "../../../types";
import { bookingApi } from "../services/bookingApi";
import { StatusBadge } from "../components/StatusBadge";

export function MyBookingsScreen({ navigation }: any) {
  const { isDark } = useTheme();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadBookings = useCallback(async () => {
    const data = await bookingApi.getAll();
    setBookings(data);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadBookings();
    }, [loadBookings])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadBookings();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className={`flex-1 bg-${isDark ? "[#1e293b]" : "[#f4f7f5]"}`}>
      <View className="flex-row items-center px-4 py-3 border-b border-brand/20">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center -ml-2"
        >
          <ArrowLeft size={22} color="#2d6a4f" />
        </TouchableOpacity>
        <Text className={`flex-1 text-lg font-bold text-${isDark ? "white" : "black"} text-center mr-6`}>
          My Bookings
        </Text>
      </View>
      <ScrollView
        className="flex-1 px-4 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2d6a4f" />}
      >
        {bookings.length === 0 ? (
          <View className="flex-1 items-center justify-center pt-20">
            <Calendar size={48} color="rgba(45,106,79,0.3)" />
            <Text className={`text-${isDark ? "white/50" : "black/50"} text-base mt-4`}>No bookings yet</Text>
          </View>
        ) : (
          bookings.map((booking) => (
            <TouchableOpacity
              key={booking.id}
              className="bg-brand/5 rounded-2xl p-4 mb-3 border border-brand/20"
              activeOpacity={0.7}
              onPress={() => navigation.navigate("BookingDetail", { bookingId: booking.id })}
            >
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-1">
                  <Text className={`text-base font-bold text-${isDark ? "white" : "black"}`}>
                    {booking.customerName}
                  </Text>
                  <Text className={`text-xs text-${isDark ? "white/50" : "black/50"} mt-0.5`}>
                    #{booking.id} · {new Date(booking.createdAt).toLocaleDateString("en-PH", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </Text>
                </View>
                <StatusBadge status={booking.status} size="sm" />
              </View>

              <View className="bg-brand/3 rounded-xl p-3 mb-3">
                {booking.items.slice(0, 3).map((item, index) => (
                  <View key={index} className="flex-row items-center justify-between mb-1 last:mb-0">
                    <Text className={`text-xs text-${isDark ? "white/70" : "black/70"} flex-1`} numberOfLines={1}>
                      {item.name} x{item.quantity}
                    </Text>
                    <Text className={`text-xs text-${isDark ? "white/50" : "black/50"} ml-2`}>
                      ₱{item.subtotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </Text>
                  </View>
                ))}
                {booking.items.length > 3 && (
                  <Text className={`text-xs text-${isDark ? "white/40" : "black/40"} mt-1`}>+{booking.items.length - 3} more items</Text>
                )}
              </View>

              <View className="flex-row items-center justify-between">
                <Text className={`text-[10px] text-${isDark ? "white/50" : "black/50"} uppercase tracking-wider`}>
                  Total
                </Text>
                <Text className={`text-lg font-bold text-${isDark ? "white" : "black"}`}>
                  ₱{booking.total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
