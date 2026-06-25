import React, { useCallback, useState } from "react";
import { View, FlatList, Text, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../context/ThemeContext";
import { useHistory } from "../hooks/useHistory";
import { HistoryCard } from "../components/HistoryCard";
import { EmptyState } from "../../../components/EmptyState";

export function HistoryListScreen({ navigation }: any) {
  const { isDark } = useTheme();
  const { history, loading, error, fetchHistory } = useHistory();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  }, [fetchHistory]);

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 bg-${isDark ? "[#1e293b]" : "[#f4f7f5]"} items-center justify-center`}>
        <Text className={`text-${isDark ? "white/60" : "black/60"}`}>Loading history...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 bg-${isDark ? "[#1e293b]" : "[#f4f7f5]"}`}>
      <View className="px-6 pt-4 pb-3">
        <Text className={`text-2xl font-bold text-${isDark ? "white" : "black"}`}>
          Order History
        </Text>
        <Text className={`text-sm text-${isDark ? "white/60" : "black/60"} mt-0.5`}>
          Completed orders
        </Text>
      </View>

      {error ? (
        <View className="px-6">
          <View className="bg-red-500/10 rounded-xl p-4 border border-red-500/20">
            <Text className="text-red-500 text-sm">{error}</Text>
          </View>
        </View>
      ) : history.length === 0 ? (
        <EmptyState
          icon="📜"
          title="No History"
          description="Completed orders will appear here."
        />
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HistoryCard
              booking={item}
              onViewOrder={(b) => navigation.navigate("BookingDetail", { bookingId: b.id })}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2d6a4f" />}
        />
      )}
    </SafeAreaView>
  );
}
