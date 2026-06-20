import React from "react";
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Calendar, Package, Users, TrendingUp, ArrowRight, Plus, ListOrdered } from "lucide-react-native";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { useHomeData } from "../hooks/useHomeData";
import { StatCard } from "../components/StatCard";

export function HomeScreen({ navigation }: any) {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { homeData, recentBookings, refreshing, onRefresh } = useHomeData();

  const firstName = user?.fullName?.split(" ")[0] || "User";
  const initials = user?.fullName
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

  const statCards = [
    { icon: <Calendar size={20} color="#2d6a4f" />, label: "Total Bookings", value: homeData?.bookingCount ?? 0 },
    { icon: <Package size={20} color="#2d6a4f" />, label: "Total Products", value: homeData?.productCount ?? 0 },
    { icon: <Users size={20} color="#2d6a4f" />, label: "Total Customers", value: homeData?.customerCount ?? 0 },
    { icon: <TrendingUp size={20} color="#2d6a4f" />, label: "Today's Bookings", value: homeData?.todayBookingCount ?? 0 },
  ];

  const getStatusOpacity = (status: string) => {
    switch (status) {
      case "Pending": return `bg-brand/10 text-${isDark ? "white/70" : "black/70"}`;
      case "Processing": return `bg-brand/20 text-${isDark ? "white" : "black"}`;
      case "Approved": return `bg-brand/20 text-${isDark ? "white" : "black"}`;
      case "Delivered": return `bg-brand/30 text-${isDark ? "white" : "black"}`;
      default: return `bg-brand/5 text-${isDark ? "white/50" : "black/50"}`;
    }
  };

  return (
    <SafeAreaView className={`flex-1 bg-${isDark ? "[#1e293b]" : "[#f4f7f5]"}`}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2d6a4f" />}
      >
        <View className="px-6 pt-8 pb-6">
          <View className="flex-row items-center justify-between">
            <View className="flex-1">
              <Text className={`text-sm font-bold text-${isDark ? "white/60" : "black/60"} uppercase tracking-wider`}>
                Welcome back
              </Text>
              <Text className={`text-3xl font-bold text-${isDark ? "white" : "black"} mt-1`}>
                {firstName}
              </Text>
              <Text className={`text-sm text-${isDark ? "white/60" : "black/60"} mt-1`}>
                Here's your business overview today
              </Text>
            </View>
            <View className="w-14 h-14 rounded-full bg-brand items-center justify-center">
              <Text className="text-white text-lg font-bold">{initials}</Text>
            </View>
          </View>
        </View>

        <View className="px-6 mb-1">
          <Text className={`text-xs font-bold text-${isDark ? "white/40" : "black/40"} uppercase tracking-widest`}>
            Overview
          </Text>
        </View>
        <View className="flex-row flex-wrap px-6 mb-6">
          {statCards.map((card, index) => (
            <View key={index} className={`w-1/2 ${index % 2 === 0 ? "pr-1.5" : "pl-1.5"} mb-3`}>
              <StatCard icon={card.icon} label={card.label} value={card.value} />
            </View>
          ))}
        </View>

        <View className="px-6 mb-6">
          <Text className={`text-xs font-bold text-${isDark ? "white/40" : "black/40"} uppercase tracking-widest mb-3`}>
            Quick Actions
          </Text>
          <View className="flex-row gap-3">
            <TouchableOpacity
              className="flex-1 bg-brand rounded-2xl py-4 px-4 flex-row items-center gap-3"
              activeOpacity={0.85}
              onPress={() => navigation.navigate("CreateBooking")}
            >
              <View className="w-9 h-9 rounded-xl bg-white/20 items-center justify-center">
                <Plus size={20} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-bold text-sm">New Booking</Text>
                <Text className="text-white/60 text-xs mt-0.5">Create an order</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              className={`flex-1 bg-${isDark ? "[#1e293b]" : "[#f4f7f5]"} rounded-2xl py-4 px-4 flex-row items-center gap-3 border border-black/10 shadow-sm`}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("MyBookings")}
            >
              <View className="w-9 h-9 rounded-xl bg-brand/10 items-center justify-center">
                <ListOrdered size={20} color="#2d6a4f" />
              </View>
              <View className="flex-1">
                <Text className={`text-${isDark ? "white" : "black"} font-bold text-sm`}>My Bookings</Text>
                <Text className={`text-${isDark ? "white/50" : "black/50"} text-xs mt-0.5`}>View all orders</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View className="px-6 mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className={`text-sm font-bold text-${isDark ? "white/60" : "black/60"} uppercase tracking-wider`}>
              Recent Transactions
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("MyBookings")}
              className="flex-row items-center gap-1"
            >
              <Text className={`text-sm text-${isDark ? "white" : "black"} font-bold`}>See All</Text>
              <ArrowRight size={14} color="#2d6a4f" />
            </TouchableOpacity>
          </View>

          {recentBookings.length === 0 ? (
            <View className="bg-brand/5 rounded-2xl py-12 border border-brand/20 items-center">
              <Calendar size={40} color="rgba(45,106,79,0.3)" />
              <Text className={`text-${isDark ? "white/50" : "black/50"} mt-3 text-base font-medium`}>No transactions yet</Text>
              <Text className={`text-${isDark ? "white/40" : "black/40"} text-xs mt-1`}>Create your first booking to get started</Text>
            </View>
          ) : (
            <View className="gap-2.5">
              {recentBookings.map((booking) => {
                const statusStyle = getStatusOpacity(booking.status);
                return (
                  <TouchableOpacity
                    key={booking.id}
                    className="bg-brand/5 rounded-2xl p-4 border border-brand/20"
                    activeOpacity={0.7}
                    onPress={() =>
                      navigation.navigate("BookingDetail", { bookingId: booking.id })
                    }
                  >
                    <View className="flex-row items-center justify-between mb-2">
                      <View className="flex-row items-center gap-2.5 flex-1">
                        <View className="w-9 h-9 rounded-full bg-brand/10 items-center justify-center">
                          <Text className={`text-${isDark ? "white" : "black"} text-xs font-bold`}>
                            {booking.customerName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                          </Text>
                        </View>
                        <View className="flex-1">
                          <Text className={`font-bold text-${isDark ? "white" : "black"} text-base`} numberOfLines={1}>
                            {booking.customerName}
                          </Text>
                          <Text className={`text-xs text-${isDark ? "white/50" : "black/50"} mt-0.5`}>
                            {booking.items.length} item{booking.items.length !== 1 ? "s" : ""} · #{booking.id.slice(-4).toUpperCase()}
                          </Text>
                        </View>
                      </View>
                      <View className={`px-2.5 py-1 rounded-full border border-brand/20 ${statusStyle}`}>
                        <Text className={`text-xs font-bold ${statusStyle}`}>
                          {booking.status}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row items-center justify-between pt-2.5 border-t border-brand/10">
                      <Text className={`text-xs text-${isDark ? "white/50" : "black/50"}`}>
                        {new Date(booking.createdAt).toLocaleDateString("en-PH", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </Text>
                      <Text className={`text-base font-bold text-${isDark ? "white" : "black"}`}>
                        ₱{booking.total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
