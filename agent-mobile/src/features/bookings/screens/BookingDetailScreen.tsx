import React, { useCallback, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Modal, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  ArrowLeft, Minus, Plus, X,
  Clock, CheckCircle2, Circle,
  Package, Truck, XCircle,
} from "lucide-react-native";
import { useTheme } from "../../../context/ThemeContext";
import { StatusBadge } from "../components/StatusBadge";
import { bookingApi } from "../services/bookingApi";
import { customerApi } from "../../customers/services/customerApi";
import { itemApi } from "../../items/services/itemApi";
import { Booking, BookingItem, Customer, Item, BookingStatus } from "../../../types";
import { getCityName, getProvinceName } from "../../../data/philippineAddress";
import { Button } from "../../../components/Button";

const STATUS_CONFIG: Record<BookingStatus, { icon: React.ReactNode; color: string; bg: string; label: string }> = {
  Pending: {
    icon: <Clock size={20} color="#f59e0b" />,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    label: "Awaiting approval",
  },
  Approved: {
    icon: <CheckCircle2 size={20} color="#16a34a" />,
    color: "text-green-600",
    bg: "bg-green-500/10",
    label: "Ready for delivery",
  },
  Delivered: {
    icon: <Truck size={20} color="#16a34a" />,
    color: "text-green-600",
    bg: "bg-green-500/10",
    label: "Completed successfully",
  },
};

const STEPS = [
  { key: "PENDING", label: "Pending" },
  { key: "APPROVED", label: "Approved" },
  { key: "COMPLETED", label: "Delivered" },
];

function getCurrentStep(status: string): number {
  if (status === "PENDING" || status === "Pending") return 0;
  if (status === "APPROVED" || status === "Approved") return 1;
  if (status === "COMPLETED" || status === "Delivered") return 2;
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

  const loadBooking = useCallback(async () => {
    const data = await bookingApi.getById(bookingId);
    if (data) {
      setBooking(data);
      const c = await customerApi.getById(data.customerId);
      if (c) setCustomer(c);
    }
  }, [bookingId]);

  useFocusEffect(
    useCallback(() => {
      loadBooking();
    }, [loadBooking])
  );

  const handleDeliver = async () => {
    if (!booking) return;
    setLoading(true);
    await bookingApi.updateStatus(booking.id, "Delivered");
    await loadBooking();
    setLoading(false);
  };

  const handleCancel = async () => {
    if (!booking) return;
    setLoading(true);
    await bookingApi.updateStatus(booking.id, "Pending");
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

  const statusCfg = STATUS_CONFIG[booking.status];
  const currentStep = getCurrentStep(booking.status);
  const isPending = booking.status === "Pending";
  const isApproved = booking.status === "Approved";
  const isDelivered = booking.status === "Delivered";

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

      <ScrollView contentContainerClassName="p-4 pb-8">
        <View className={`rounded-2xl p-4 mb-4 ${statusCfg.bg} border border-brand/10`}>
          <View className="flex-row items-center gap-3">
            <View className={`w-10 h-10 rounded-full items-center justify-center ${statusCfg.bg}`}>
              {statusCfg.icon}
            </View>
            <View className="flex-1">
              <Text className={`text-lg font-bold ${statusCfg.color}`}>
                {booking.status}
              </Text>
              <Text className={`text-sm ${isDark ? "text-white/60" : "text-black/60"}`}>
                {statusCfg.label}
              </Text>
            </View>
            <StatusBadge status={booking.status} size="sm" />
          </View>
        </View>

        <View className={`rounded-2xl p-5 mb-4 border ${isDark ? "bg-[#1e293b] border-white/10" : "bg-white border-black/5 shadow-sm"}`}>
          <View className="flex-row items-center justify-between mb-4">
            <Text className={`text-xs uppercase tracking-widest font-semibold ${isDark ? "text-white/50" : "text-black/40"}`}>
              Order Progress
            </Text>
          </View>
          <View className="flex-row items-center">
            {STEPS.map((step, index) => (
              <React.Fragment key={step.key}>
                <View className="items-center flex-1">
                  <View
                    className={`w-9 h-9 rounded-full items-center justify-center ${
                      index < currentStep
                        ? "bg-brand"
                        : index === currentStep
                        ? "bg-brand"
                        : `${isDark ? "bg-white/10" : "bg-black/5"}`
                    }`}
                  >
                    {index < currentStep ? (
                      <CheckCircle2 size={16} color="#fff" />
                    ) : (
                      <Circle
                        size={16}
                        color={index === currentStep ? "#fff" : isDark ? "#ffffff50" : "#00000050"}
                      />
                    )}
                  </View>
                  <Text
                    className={`text-[10px] font-semibold mt-1.5 ${
                      index <= currentStep
                        ? "text-brand"
                        : isDark ? "text-white/40" : "text-black/40"
                    }`}
                  >
                    {step.label}
                  </Text>
                </View>
                {index < STEPS.length - 1 && (
                  <View
                    className={`flex-1 h-[2px] mx-1 rounded-full ${
                      index < currentStep
                        ? "bg-brand"
                        : isDark ? "bg-white/10" : "bg-black/10"
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>

        <View className={`rounded-2xl p-5 mb-4 border ${isDark ? "bg-[#1e293b] border-white/10" : "bg-white border-black/5 shadow-sm"}`}>
          <View className="flex-row items-center gap-3 mb-1">
            <View className={`w-1 h-10 rounded-full bg-brand`} />
            <View>
              <Text className={`text-xs uppercase tracking-widest font-semibold ${isDark ? "text-white/50" : "text-black/40"}`}>
                Customer
              </Text>
              <Text className={`text-base font-bold text-${isDark ? "white" : "black"} mt-0.5`}>
                {booking.customerName}
              </Text>
            </View>
          </View>
          {customer?.address && (
            <View className="ml-4 mt-2">
              <Text className={`text-sm ${isDark ? "text-white/60" : "text-black/60"} leading-5`}>
                {customer.address}
                {customer.address ? ", " : ""}
                {getCityName(customer.city)}
                {customer.city ? ", " : ""}
                {getProvinceName(customer.province)}
              </Text>
            </View>
          )}
        </View>

        <View className={`rounded-2xl border ${isDark ? "bg-[#1e293b] border-white/10" : "bg-white border-black/5 shadow-sm"}`}>
          <View className="p-5">
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row items-center gap-3">
                <View className={`w-1 h-10 rounded-full bg-brand`} />
                <Text className={`text-xs uppercase tracking-widest font-semibold ${isDark ? "text-white/50" : "text-black/40"}`}>
                  Items
                </Text>
              </View>
              {isPending && (
                <TouchableOpacity
                  onPress={handleOpenEditItems}
                  className="bg-brand/10 px-3 py-1.5 rounded-lg"
                >
                  <Text className="text-xs font-bold text-brand">Edit</Text>
                </TouchableOpacity>
              )}
            </View>

            <View className="gap-0">
              {booking.items.map((item, index) => (
                <View
                  key={index}
                  className={`flex-row items-center py-3 ${
                    index < booking.items.length - 1 ? `border-b ${isDark ? "border-white/5" : "border-black/5"}` : ""
                  }`}
                >
                  <View className="flex-1">
                    <Text className={`text-sm font-semibold text-${isDark ? "white" : "black"}`}>
                      {item.name}
                    </Text>
                    <Text className={`text-xs ${isDark ? "text-white/50" : "text-black/50"} mt-0.5`}>
                      {item.quantity} x ₱{item.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </Text>
                  </View>
                  <Text className={`text-sm font-bold text-${isDark ? "white/90" : "black/90"}`}>
                    ₱{item.subtotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              ))}
            </View>

            <View className={`flex-row items-center justify-between pt-4 mt-2 border-t ${isDark ? "border-white/10" : "border-black/10"}`}>
              <Text className={`text-base font-bold text-${isDark ? "white" : "black"}`}>
                Total
              </Text>
              <Text className={`text-lg font-bold text-brand`}>
                ₱{booking.total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>
        </View>

        <View className={`rounded-2xl p-5 mt-4 border ${isDark ? "bg-[#1e293b] border-white/10" : "bg-white border-black/5 shadow-sm"}`}>
          <View className="flex-row items-center gap-3 mb-3">
            <View className={`w-1 h-10 rounded-full bg-brand`} />
            <Text className={`text-xs uppercase tracking-widest font-semibold ${isDark ? "text-white/50" : "text-black/40"}`}>
              Timeline
            </Text>
          </View>
          <View className="gap-3">
            <View className="flex-row justify-between items-center">
              <Text className={`text-sm ${isDark ? "text-white/50" : "text-black/50"}`}>Created</Text>
              <Text className={`text-sm font-medium text-${isDark ? "white/80" : "black/80"}`}>
                {new Date(booking.createdAt).toLocaleString("en-PH")}
              </Text>
            </View>
            <View className={`h-px ${isDark ? "bg-white/5" : "bg-black/5"}`} />
            <View className="flex-row justify-between items-center">
              <Text className={`text-sm ${isDark ? "text-white/50" : "text-black/50"}`}>Last Updated</Text>
              <Text className={`text-sm font-medium text-${isDark ? "white/80" : "black/80"}`}>
                {new Date(booking.updatedAt).toLocaleString("en-PH")}
              </Text>
            </View>
          </View>
          {booking.notes && (
            <View className="mt-4 pt-4 border-t border-brand/10">
              <Text className={`text-xs uppercase tracking-widest font-semibold ${isDark ? "text-white/50" : "text-black/40"} mb-2`}>
                Notes
              </Text>
              <View className={`rounded-xl p-3 ${isDark ? "bg-white/5" : "bg-black/5"}`}>
                <Text className={`text-sm leading-5 ${isDark ? "text-white/80" : "text-black/80"}`}>
                  {booking.notes}
                </Text>
              </View>
            </View>
          )}
        </View>

        <View className="mt-6 gap-3">
          {isPending && (
            <Button
              title="Update Items"
              variant="secondary"
              onPress={handleOpenEditItems}
            />
          )}
          {isApproved && (
            <View className="gap-3">
              <Button
                title={loading ? "Processing..." : "Mark as Delivered"}
                variant="primary"
                onPress={handleDeliver}
                loading={loading}
              />
              <Button
                title={loading ? "Processing..." : "Cancel"}
                variant="secondary"
                onPress={() => handleCancel()}
              />
            </View>
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
