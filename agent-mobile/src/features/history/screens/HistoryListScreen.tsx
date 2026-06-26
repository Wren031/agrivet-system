import React, { useCallback, useState } from "react";
import { View, FlatList, Text, RefreshControl, ActivityIndicator } from "react-native";
import { useTheme } from "../../../context/ThemeContext";
import { useHistory } from "../hooks/useHistory";
import { HistoryCard } from "../components/HistoryCard";
import { EmptyState } from "../../../components/EmptyState";
import { ScreenLayout } from "../../../components/ScreenLayout";
import { PageHeader } from "../../../components/PageHeader";
import { getScrollBottomPadding } from "../../../theme/layout";

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
      <ScreenLayout>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#1b4332" />
          <Text className={`mt-3 ${isDark ? "text-white/55" : "text-black/55"}`}>Loading history...</Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <PageHeader title="Order History" subtitle="Completed orders" />

      {error ? (
        <View className="px-5">
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
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: getScrollBottomPadding() }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2d6a4f" />}
        />
      )}
    </ScreenLayout>
  );
}
