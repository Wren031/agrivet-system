import React, { useState } from "react";
import { View, FlatList, Alert, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useBookings } from "../hooks/useBookings";
import { BookingCard } from "../components/BookingCard";
import { BookingForm } from "../components/BookingForm";
import { StatusBadge } from "../components/StatusBadge";
import { PageHeader } from "../../../components/PageHeader";
import { EmptyState } from "../../../components/EmptyState";
import { Modal } from "../../../components/Modal";
import { Booking, BookingStatus } from "../../../types";

export function BookingListScreen({ navigation }: any) {
  const { bookings, loading, createBooking, updateBookingStatus, deleteBooking } = useBookings();
  const [showForm, setShowForm] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const handleUpdateStatus = (booking: Booking) => {
    setSelectedBooking(booking);
    setShowStatusModal(true);
  };

  const changeStatus = async (status: BookingStatus) => {
    if (!selectedBooking) return;
    try {
      await updateBookingStatus(selectedBooking.id, status);
    } catch {}
    setShowStatusModal(false);
    setSelectedBooking(null);
  };

  const handleDelete = (booking: Booking) => {
    Alert.alert("Delete Booking", `Delete booking for ${booking.customerName}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteBooking(booking.id);
          } catch {}
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-50 dark:bg-surface-950">
      <PageHeader
        title="Bookings"
        subtitle={`${bookings.length} order${bookings.length !== 1 ? "s" : ""}`}
        action={{ label: "+ New", onPress: () => setShowForm(true) }}
      />

      {bookings.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No Bookings"
          description="Create your first booking to get started."
        />
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <BookingCard
              booking={item}
              onPress={(b) => navigation.navigate("BookingDetail", { bookingId: b.id })}
              onUpdateStatus={handleUpdateStatus}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}

      <Modal visible={showForm} onClose={() => setShowForm(false)} title="New Booking">
        <BookingForm
          onSubmit={async (data) => {
            await createBooking(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <Modal
        visible={showStatusModal}
        onClose={() => setShowStatusModal(false)}
        title="Update Status"
      >
        <View className="gap-2 py-4">
          {(["Pending", "Ongoing", "Success", "Cancelled"] as BookingStatus[]).map((status) => (
            <View
              key={status}
              className={`rounded-xl border p-4 ${
                selectedBooking?.status === status
                  ? "border-primary-500 bg-primary-50 dark:bg-primary-900/20 dark:border-primary-400"
                  : "border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
              }`}
            >
              <View className="flex-row items-center justify-between">
                <StatusBadge status={status} />
                {selectedBooking?.status !== status && (
                  <Text
                    className="text-primary-600 dark:text-primary-400 text-sm font-medium"
                    onPress={() => changeStatus(status)}
                  >
                    Select
                  </Text>
                )}
                {selectedBooking?.status === status && (
                  <Text className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                    Current
                  </Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </Modal>
    </SafeAreaView>
  );
}
