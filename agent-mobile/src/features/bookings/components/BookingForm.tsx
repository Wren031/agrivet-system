import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Customer, Item, BookingItem } from "../../../types";
import { customerApi } from "../../customers/services/customerApi";
import { itemApi } from "../../items/services/itemApi";
import { Button } from "../../../components/Button";
import { useTheme } from "../../../context/ThemeContext";

interface BookingFormProps {
  onSubmit: (data: {
    customerId: string;
    customerName: string;
    items: BookingItem[];
    notes?: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export function BookingForm({ onSubmit, onCancel }: BookingFormProps) {
  const { isDark } = useTheme();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");
  const [review, setReview] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const [c, i] = await Promise.all([customerApi.getAll(), itemApi.getAll()]);
      setCustomers(c);
      setItems(i);
    };
    loadData();
  }, []);

  const toggleItem = (itemId: string) => {
    setSelectedItems((prev) => {
      const next = new Map(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.set(itemId, 1);
      }
      return next;
    });
  };

  const updateQuantity = (itemId: string, qty: number) => {
    if (qty <= 0) {
      toggleItem(itemId);
      return;
    }
    setSelectedItems((prev) => {
      const next = new Map(prev);
      next.set(itemId, qty);
      return next;
    });
  };

  const total = Array.from(selectedItems.entries()).reduce((sum, [id, qty]) => {
    const item = items.find((i) => i.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const handleSubmit = () => {
    if (!selectedCustomer) {
      setError("Please select a customer");
      return;
    }
    if (selectedItems.size === 0) {
      setError("Please select at least one item");
      return;
    }
    setError("");
    setReview(true);
  };

  const handleConfirm = async () => {
    setLoading(true);
    setError("");
    try {
      const bookingItems: BookingItem[] = Array.from(selectedItems.entries()).map(([id, qty]) => {
        const item = items.find((i) => i.id === id)!;
        return {
          itemId: id,
          name: item.name,
          price: item.price,
          quantity: qty,
          subtotal: item.price * qty,
        };
      });
      await onSubmit({
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        items: bookingItems,
        notes,
      });
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (review) {
    const bookingItems: BookingItem[] = Array.from(selectedItems.entries()).map(([id, qty]) => {
      const item = items.find((i) => i.id === id)!;
      return {
        itemId: id,
        name: item.name,
        price: item.price,
        quantity: qty,
        subtotal: item.price * qty,
      };
    });
    const total = bookingItems.reduce((sum, i) => sum + i.subtotal, 0);

    return (
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text className={`text-lg font-bold text-${isDark ? "white" : "black"} mb-4`}>
          Review Booking
        </Text>

        <View className="bg-brand/5 rounded-2xl p-4 mb-4 border border-brand/20">
          <Text className={`text-xs text-${isDark ? "white/60" : "black/60"} uppercase tracking-wider mb-2`}>
            Customer
          </Text>
          <Text className={`text-base font-bold text-${isDark ? "white" : "black"}`}>
            {selectedCustomer?.name}
          </Text>
        </View>

        <View className="bg-brand/5 rounded-2xl p-4 mb-4 border border-brand/20">
          <Text className={`text-xs text-${isDark ? "white/60" : "black/60"} uppercase tracking-wider mb-3`}>
            Items
          </Text>
          {bookingItems.map((item, index) => (
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
          <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-brand/20">
            <Text className={`text-base font-bold text-${isDark ? "white" : "black"}`}>
              Total
            </Text>
            <Text className={`text-lg font-bold text-${isDark ? "white" : "black"}`}>
              ₱{total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        {notes ? (
          <View className="bg-brand/5 rounded-2xl p-4 mb-4 border border-brand/20">
            <Text className={`text-xs text-${isDark ? "white/60" : "black/60"} uppercase tracking-wider mb-1`}>
              Notes
            </Text>
            <Text className={`text-sm text-${isDark ? "white/80" : "black/80"}`}>{notes}</Text>
          </View>
        ) : null}

        {error ? (
          <View className="bg-brand/5 rounded-xl p-3 mb-3 border border-brand/20">
            <Text className={`text-${isDark ? "white/80" : "black/80"} text-sm`}>{error}</Text>
          </View>
        ) : null}

        <View className="flex-row gap-3 mb-4">
          <View className="flex-1">
            <Button title="Cancel" variant="secondary" onPress={() => setReview(false)} />
          </View>
          <View className="flex-1">
            <Button title="Create Booking" onPress={handleConfirm} loading={loading} />
          </View>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {error ? (
        <View className="bg-brand/5 rounded-xl p-3 mb-3 border border-brand/20">
          <Text className={`text-${isDark ? "white/80" : "black/80"} text-sm`}>{error}</Text>
        </View>
      ) : null}

      <Text className={`text-sm font-bold text-${isDark ? "white/80" : "black/80"} mb-2`}>
        Select Customer
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <View className="flex-row gap-2">
          {customers.map((customer) => (
            <TouchableOpacity
              key={customer.id}
              className={`px-4 py-2 rounded-xl border ${
                selectedCustomer?.id === customer.id
                  ? "bg-brand/20 border-brand/50"
                  : "bg-brand/5 border-brand/20"
              }`}
              onPress={() => setSelectedCustomer(customer)}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedCustomer?.id === customer.id
                    ? `text-${isDark ? "white" : "black"}`
                    : `text-${isDark ? "white/70" : "black/70"}`
                }`}
              >
                {customer.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Text className={`text-sm font-bold text-${isDark ? "white/80" : "black/80"} mb-2`}>
        Select Items
      </Text>
      <View className="gap-2 mb-4">
        {items.map((item) => {
          const qty = selectedItems.get(item.id) || 0;
          const isSelected = selectedItems.has(item.id);
          return (
            <View
              key={item.id}
              className={`flex-row items-center p-3 rounded-xl border ${
                isSelected
                  ? "bg-brand/20 border-brand/50"
                  : "bg-brand/5 border-brand/20"
              }`}
            >
              <TouchableOpacity
                className={`w-5 h-5 rounded-md border-2 mr-3 ${
                  isSelected
                    ? "bg-brand border-brand"
                    : "border-brand/40"
                }`}
                onPress={() => toggleItem(item.id)}
              >
                {isSelected && (
                  <Text className="text-white text-xs text-center leading-5">✓</Text>
                )}
              </TouchableOpacity>
              <View className="flex-1">
                <Text className={`text-sm font-medium text-${isDark ? "white" : "black"}`}>
                  {item.name}
                </Text>
                <Text className={`text-xs text-${isDark ? "white/60" : "black/60"}`}>
                  ₱{item.price.toLocaleString("en-PH")} - Stock: {item.stock}
                </Text>
              </View>
              {isSelected && (
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    className="w-7 h-7 rounded-lg bg-brand/10 items-center justify-center"
                    onPress={() => updateQuantity(item.id, qty - 1)}
                  >
                    <Text className={`text-${isDark ? "white" : "black"} text-sm`}>−</Text>
                  </TouchableOpacity>
                  <Text className={`w-8 text-center text-sm font-bold text-${isDark ? "white" : "black"}`}>
                    {qty}
                  </Text>
                  <TouchableOpacity
                    className="w-7 h-7 rounded-lg bg-brand/10 items-center justify-center"
                    onPress={() => updateQuantity(item.id, qty + 1)}
                  >
                    <Text className={`text-${isDark ? "white" : "black"} text-sm`}>+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </View>

      <View className="bg-brand/5 rounded-xl p-4 mb-4 border border-brand/20">
        <Text className={`text-sm text-${isDark ? "white/60" : "black/60"} mb-1`}>Total Amount</Text>
        <Text className={`text-2xl font-bold text-${isDark ? "white" : "black"}`}>
          ₱{total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
        </Text>
      </View>

      <View className="flex-row gap-3 mb-4">
        <View className="flex-1">
          <Button title="Cancel" variant="secondary" onPress={onCancel} />
        </View>
        <View className="flex-1">
          <Button title="Create Booking" onPress={handleSubmit} loading={loading} />
        </View>
      </View>
    </ScrollView>
  );
}
