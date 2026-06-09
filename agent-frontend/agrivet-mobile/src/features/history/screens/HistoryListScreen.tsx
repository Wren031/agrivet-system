import React from "react";
import { View, FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useHistory } from "../hooks/useHistory";
import { HistoryCard } from "../components/HistoryCard";
import { EmptyState } from "../../../components/EmptyState";

export function HistoryListScreen({ navigation }: any) {
  const { history, loading } = useHistory();

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-surface-50 dark:bg-surface-950 items-center justify-center">
        <Text className="text-surface-400">Loading history...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface-50 dark:bg-surface-950">
      <View className="px-6 pt-4 pb-3">
        <Text className="text-2xl font-bold text-surface-900 dark:text-surface-100">
          Order History
        </Text>
        <Text className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
          Completed and cancelled orders
        </Text>
      </View>

      {history.length === 0 ? (
        <EmptyState
          icon="📜"
          title="No History"
          description="Completed or cancelled orders will appear here."
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
        />
      )}
    </SafeAreaView>
  );
}
