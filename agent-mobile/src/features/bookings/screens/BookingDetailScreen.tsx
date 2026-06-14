import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Minus, Plus, X } from "lucide-react-native";
import { useTheme } from "../../../context/ThemeContext";
import { StatusBadge } from "../components/StatusBadge";
import { bookingApi } from "../services/bookingApi";
import { customerApi } from "../../customers/services/customerApi";
import { itemApi } from "../../items/services/itemApi";
import { Booking, BookingItem, Customer, Item } from "../../../types";
import { getCityName, getProvinceName } from "../../../data/philippineAddress";
import { Button } from "../../../components/Button";

const STEPS = [
  { key: "Pending", label: "Pending", description: "Awaiting approval" },
  { key: "Ongoing", label: "Approved", description: "Confirmed" },
  { key: "Success", label: "Delivered", description: "Completed" },
];

function getCurrentStep(status: string): number {
  if (status === "Pending") return 0;
  if (status === "Accepted" || status === "Ongoing") return 1;
  if (status === "Success") return 2;
  return -1;
}

export function BookingDetailScreen({ route, navigation }: any) {
  const { isDark } = useTheme();
  const { bookingId } = route.params;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editItems, setEditItems] = useState<BookingItem[]>([]);
  const [allItems, setAllItems] = useState<Item[]>([]);
  const [addItemModal, setAddItemModal] = useState(false);

  useEffect(() => {
    loadBooking();
  }, []);

  const loadBooking = async () => {
    const data = await bookingApi.getById(bookingId);
    if (data) {
      setBooking(data);
      const c = await customerApi.getById(data.customerId);
      if (c) setCustomer(c);
    }
  };

  const handleDeliver = async () => {
    if (!booking) return;
    setLoading(true);
    await bookingApi.updateStatus(booking.id, "Success");
    await loadBooking();
    setLoading(false);
  };

  const handleCancel = async () => {
    if (!booking) return;
    setLoading(true);
    await bookingApi.updateStatus(booking.id, "Cancelled");
    await loadBooking();
    setLoading(false);
  };

  const handleOpenEditItems = async () => {
    if (!booking) return;
    setEditItems(booking.items.map((i) => ({ ...i })));
    const items = await itemApi.getAll();
    setAllItems(items);
    setEditModalVisible(true);
  };

  const handleQuantityChange = (itemId: string, delta: number) => {
    setEditItems((prev) =>
      prev.map((i) => {
        if (i.itemId !== itemId) return i;
        const qty = Math.max(1, i.quantity + delta);
        return { ...i, quantity: qty, subtotal: i.price * qty };
      })
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setEditItems((prev) => prev.filter((i) => i.itemId !== itemId));
  };

  const handleAddItem = (item: Item) => {
    const existing = editItems.find((i) => i.itemId === item.id);
    if (existing) {
      handleQuantityChange(item.id, 1);
    } else {
      setEditItems((prev) => [
        ...prev,
        { itemId: item.id, name: item.name, price: item.price, quantity: 1, subtotal: item.price },
      ]);
    }
    setAddItemModal(false);
  };

  const handleSaveItems = async () => {
    if (!booking || editItems.length === 0) return;
    setLoading(true);
    await bookingApi.updateItems(booking.id, editItems);
    await loadBooking();
    setEditModalVisible(false);
    setLoading(false);
  };

  if (!booking) {
    return (
      <SafeAreaView className={`flex-1 bg-${isDark ? "[#1e293b]" : "[#f4f7f5]"} items-center justify-center`}>
        <Text className={`text-${isDark ? "white/60" : "black/60"}`}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const currentStep = getCurrentStep(booking.status);
  const isPending = booking.status === "Pending";
  const isOngoing = booking.status === "Accepted" || booking.status === "Ongoing";
  const isSuccess = booking.status === "Success";
  const isCancelled = booking.status === "Cancelled";

  const editTotal = editItems.reduce((sum, i) => sum + i.subtotal, 0);

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
          Booking Details
        </Text>
      </View>

      <ScrollView contentContainerClassName="p-6">
        <View className="flex-row items-center justify-between mb-6">
          <View>
            <Text className={`text-2xl font-bold text-${isDark ? "white" : "black"}`}>
              Booking Receipt
            </Text>
            <Text className={`text-sm text-${isDark ? "white/60" : "black/60"}`}>
              #{booking.id}
            </Text>
          </View>
          <StatusBadge status={booking.status} />
        </View>

        {!isCancelled && (
          <View className="bg-brand/5 rounded-2xl p-5 mb-4 border border-brand/20">
            <View className="flex-row items-center justify-between mb-4">
              {STEPS.map((step, index) => (
                <React.Fragment key={step.key}>
                  <View className="items-center flex-1">
                    <View
                      className={`w-8 h-8 rounded-full items-center justify-center ${
                        index < currentStep
                          ? "bg-brand"
                          : index === currentStep
                          ? "bg-brand/40"
                          : "bg-brand/20"
                      }`}
                    >
                      {index < currentStep ? (
                        <Text className="text-white text-xs font-bold">✓</Text>
                      ) : (
                        <Text
                          className={`text-xs font-bold ${
                            index === currentStep
                              ? "text-white"
                              : `text-${isDark ? "white/50" : "black/50"}`
                          }`}
                        >
                          {index + 1}
                        </Text>
                      )}
                    </View>
                    <Text
                      className={`text-xs font-semibold mt-1 ${
                        index <= currentStep
                          ? `text-${isDark ? "white" : "black"}`
                          : `text-${isDark ? "white/50" : "black/50"}`
                      }`}
                    >
                      {step.label}
                    </Text>
                  </View>
                  {index < STEPS.length - 1 && (
                    <View
                      className={`flex-1 h-0.5 mx-1 ${
                        index < currentStep
                          ? "bg-brand"
                          : "bg-brand/20"
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </View>

            {isPending && (
              <View className="bg-brand/5 rounded-xl p-4">
                <Text className={`text-sm font-medium text-${isDark ? "white/80" : "black/80"}`}>
                  Please wait until the admin accepts this booking.
                </Text>
              </View>
            )}
            {isOngoing && (
              <View className="bg-brand/5 rounded-xl p-4">
                <Text className={`text-sm font-medium text-${isDark ? "white/80" : "black/80"}`}>
                  Your booking has been approved!
                </Text>
              </View>
            )}
            {isSuccess && (
              <View className="bg-brand/5 rounded-xl p-4">
                <Text className={`text-sm font-medium text-${isDark ? "white/80" : "black/80"}`}>
                  This booking has been delivered successfully.
                </Text>
              </View>
            )}
          </View>
        )}

        {isCancelled && (
          <View className="bg-brand/3 rounded-xl p-4 mb-4 border border-brand/20">
            <Text className={`text-sm font-medium text-${isDark ? "white/60" : "black/60"}`}>
              This booking has been cancelled.
            </Text>
          </View>
        )}

        <View className="bg-brand/5 rounded-2xl p-5 mb-4 border border-brand/20">
          <Text className={`text-xs text-${isDark ? "white/60" : "black/60"} uppercase tracking-wider mb-2`}>
            Customer
          </Text>
          <Text className={`text-lg font-bold text-${isDark ? "white" : "black"}`}>
            {booking.customerName}
          </Text>
          {customer?.address && (
            <View className="flex-row items-center gap-2 mt-2">
              <Text className={`text-sm text-${isDark ? "white/60" : "black/60"} flex-1`}>
                {customer.address}
                {customer.address ? ", " : ""}
                {getCityName(customer.city)}
                {customer.city ? ", " : ""}
                {getProvinceName(customer.province)}
              </Text>
            </View>
          )}
        </View>

        <View className="bg-brand/5 rounded-2xl p-5 mb-4 border border-brand/20">
          <View className="flex-row items-center justify-between mb-3">
            <Text className={`text-xs text-${isDark ? "white/60" : "black/60"} uppercase tracking-wider`}>
              Items Purchased
            </Text>
            {isPending && (
              <TouchableOpacity onPress={handleOpenEditItems}>
                <Text className={`text-xs font-bold text-${isDark ? "white" : "black"}`}>
                  Update Items
                </Text>
              </TouchableOpacity>
            )}
          </View>
          {booking.items.map((item, index) => (
            <View
              key={index}
              className="flex-row items-center justify-between py-2 border-b border-brand/10 last:border-b-0"
            >
              <View className="flex-1">
                <Text className={`text-sm font-medium text-${isDark ? "white" : "black"}`}>
                  {item.name}
                </Text>
                <Text className={`text-xs text-${isDark ? "white/60" : "black/60"}`}>
                  {item.quantity} x ₱{item.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                </Text>
              </View>
              <Text className={`text-sm font-semibold text-${isDark ? "white/80" : "black/80"}`}>
                ₱{item.subtotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </Text>
            </View>
          ))}
          <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-brand/20">
            <Text className={`text-lg font-bold text-${isDark ? "white" : "black"}`}>
              Total
            </Text>
            <Text className={`text-xl font-bold text-${isDark ? "white" : "black"}`}>
              ₱{booking.total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        <View className="bg-brand/5 rounded-2xl p-5 border border-brand/20">
          <Text className={`text-xs text-${isDark ? "white/60" : "black/60"} uppercase tracking-wider mb-2`}>
            Timestamps
          </Text>
          <View className="gap-2">
            <View className="flex-row justify-between">
              <Text className={`text-sm text-${isDark ? "white/60" : "black/60"}`}>Created</Text>
              <Text className={`text-sm text-${isDark ? "white" : "black"}`}>
                {new Date(booking.createdAt).toLocaleString("en-PH")}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className={`text-sm text-${isDark ? "white/60" : "black/60"}`}>Last Updated</Text>
              <Text className={`text-sm text-${isDark ? "white" : "black"}`}>
                {new Date(booking.updatedAt).toLocaleString("en-PH")}
              </Text>
            </View>
          </View>
          {booking.notes && (
            <View className="mt-3 pt-3 border-t border-brand/10">
              <Text className={`text-xs text-${isDark ? "white/60" : "black/60"} uppercase tracking-wider mb-1`}>
                Notes
              </Text>
              <Text className={`text-sm text-${isDark ? "white/80" : "black/80"}`}>
                {booking.notes}
              </Text>
            </View>
          )}
        </View>

        <View className="mt-6 gap-3 pb-4">
          {isPending && (
            <>
              <Button
                title="Update Items"
                variant="secondary"
                onPress={handleOpenEditItems}
              />
              <Button
                title="Cancel Booking"
                variant="ghost"
                onPress={handleCancel}
                loading={loading}
              />
            </>
          )}
          {isOngoing && (
            <TouchableOpacity
              className="bg-brand rounded-2xl py-4 px-6 flex-row items-center justify-center gap-3"
              activeOpacity={0.85}
              onPress={handleDeliver}
              disabled={loading}
            >
              <Text className="text-white font-bold text-base">
                {loading ? "Processing..." : "Mark as Delivered"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <Modal visible={editModalVisible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView className={`flex-1 bg-${isDark ? "[#1e293b]" : "[#f4f7f5]"}`}>
          <View className="flex-row items-center justify-between px-4 py-3 border-b border-brand/20">
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <Text className={`text-${isDark ? "white" : "black"} font-bold`}>Cancel</Text>
            </TouchableOpacity>
            <Text className={`text-lg font-bold text-${isDark ? "white" : "black"}`}>
              Edit Items
            </Text>
            <TouchableOpacity onPress={handleSaveItems} disabled={editItems.length === 0}>
              <Text
                className={`font-bold ${
                  editItems.length === 0 ? `text-${isDark ? "white/40" : "black/40"}` : `text-${isDark ? "white" : "black"}`
                }`}
              >
                Save
              </Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={editItems}
            keyExtractor={(item) => item.itemId}
            contentContainerClassName="p-4"
            ListHeaderComponent={
              <TouchableOpacity
                className="flex-row items-center gap-2 bg-brand/5 rounded-xl p-4 mb-3 border border-dashed border-brand/40"
                onPress={() => setAddItemModal(true)}
              >
                <Text className={`text-${isDark ? "white" : "black"} font-bold text-sm`}>
                  + Add Item
                </Text>
              </TouchableOpacity>
            }
            renderItem={({ item }) => (
              <View className="bg-brand/5 rounded-xl p-4 mb-2 border border-brand/20">
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className={`text-sm font-bold text-${isDark ? "white" : "black"}`}>
                      {item.name}
                    </Text>
                    <Text className={`text-xs text-${isDark ? "white/60" : "black/60"}`}>
                      ₱{item.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })} each
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleRemoveItem(item.itemId)}
                    className="w-7 h-7 items-center justify-center rounded-full bg-brand/5"
                  >
                    <X size={14} color="#2d6a4f" />
                  </TouchableOpacity>
                </View>
                <View className="flex-row items-center justify-between mt-3">
                  <View className="flex-row items-center gap-3">
                    <TouchableOpacity
                      className="w-8 h-8 rounded-lg bg-brand/10 items-center justify-center"
                      onPress={() => handleQuantityChange(item.itemId, -1)}
                    >
                      <Minus size={16} color="#2d6a4f" />
                    </TouchableOpacity>
                    <Text className={`text-base font-bold text-${isDark ? "white" : "black"} min-w-[24px] text-center`}>
                      {item.quantity}
                    </Text>
                    <TouchableOpacity
                      className="w-8 h-8 rounded-lg bg-brand/10 items-center justify-center"
                      onPress={() => handleQuantityChange(item.itemId, 1)}
                    >
                      <Plus size={16} color="#2d6a4f" />
                    </TouchableOpacity>
                  </View>
                  <Text className={`text-sm font-bold text-${isDark ? "white" : "black"}`}>
                    ₱{item.subtotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              </View>
            )}
            ListFooterComponent={
              editItems.length > 0 ? (
                <View className="flex-row items-center justify-between mt-2 pt-3 border-t border-brand/20">
                  <Text className={`text-base font-bold text-${isDark ? "white" : "black"}`}>
                    Total
                  </Text>
                  <Text className={`text-lg font-bold text-${isDark ? "white" : "black"}`}>
                    ₱{editTotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              ) : null
            }
          />
        </SafeAreaView>
      </Modal>

      <Modal visible={addItemModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView className={`flex-1 bg-${isDark ? "[#1e293b]" : "[#f4f7f5]"}`}>
          <View className="flex-row items-center px-4 py-3 border-b border-brand/20">
            <TouchableOpacity onPress={() => setAddItemModal(false)}>
              <Text className={`text-${isDark ? "white" : "black"} font-bold`}>Back</Text>
            </TouchableOpacity>
            <Text className={`flex-1 text-lg font-bold text-${isDark ? "white" : "black"} text-center mr-10`}>
              Add Item
            </Text>
          </View>
          <FlatList
            data={allItems}
            keyExtractor={(item) => item.id}
            contentContainerClassName="p-4"
            renderItem={({ item }) => {
              const alreadyAdded = editItems.some((i) => i.itemId === item.id);
              return (
                <TouchableOpacity
                  className={`bg-brand/5 rounded-xl p-4 mb-2 border ${
                    alreadyAdded
                      ? "border-brand/50"
                      : "border-brand/20"
                  }`}
                  onPress={() => handleAddItem(item)}
                >
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className={`text-sm font-bold text-${isDark ? "white" : "black"}`}>
                        {item.name}
                      </Text>
                      <Text className={`text-xs text-${isDark ? "white/60" : "black/60"} mt-0.5`}>
                        {item.category}
                      </Text>
                    </View>
                    <Text className={`text-sm font-bold text-${isDark ? "white" : "black"}`}>
                      ₱{item.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </Text>
                  </View>
                  {alreadyAdded && (
                    <View className="mt-2">
                      <Text className={`text-xs font-medium text-${isDark ? "white/70" : "black/70"}`}>
                        Already in list (tap to add more)
                      </Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}
