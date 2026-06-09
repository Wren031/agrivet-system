import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { Customer, Item, BookingItem } from "../../../types";
import { customerApi } from "../../customers/services/customerApi";
import { itemApi } from "../../items/services/itemApi";
import { Button } from "../../../components/Button";

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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedItems, setSelectedItems] = useState<Map<string, number>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState("");

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

  const handleSubmit = async () => {
    if (!selectedCustomer) {
      setError("Please select a customer");
      return;
    }
    if (selectedItems.size === 0) {
      setError("Please select at least one item");
      return;
    }
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

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      {error ? (
        <View className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 mb-3">
          <Text className="text-red-600 dark:text-red-400 text-sm">{error}</Text>
        </View>
      ) : null}

      <Text className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
        Select Customer
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <View className="flex-row gap-2">
          {customers.map((customer) => (
            <TouchableOpacity
              key={customer.id}
              className={`px-4 py-2 rounded-xl border ${
                selectedCustomer?.id === customer.id
                  ? "bg-primary-50 border-primary-500 dark:bg-primary-900/20 dark:border-primary-400"
                  : "bg-white border-surface-200 dark:bg-surface-800 dark:border-surface-700"
              }`}
              onPress={() => setSelectedCustomer(customer)}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedCustomer?.id === customer.id
                    ? "text-primary-600 dark:text-primary-400"
                    : "text-surface-700 dark:text-surface-300"
                }`}
              >
                {customer.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      <Text className="text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
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
                  ? "bg-primary-50 border-primary-300 dark:bg-primary-900/20 dark:border-primary-700"
                  : "bg-white border-surface-200 dark:bg-surface-800 dark:border-surface-700"
              }`}
            >
              <TouchableOpacity
                className={`w-5 h-5 rounded-md border-2 mr-3 ${
                  isSelected
                    ? "bg-primary-500 border-primary-500"
                    : "border-surface-300 dark:border-surface-600"
                }`}
                onPress={() => toggleItem(item.id)}
              >
                {isSelected && (
                  <Text className="text-white text-xs text-center leading-5">✓</Text>
                )}
              </TouchableOpacity>
              <View className="flex-1">
                <Text className="text-sm font-medium text-surface-900 dark:text-surface-100">
                  {item.name}
                </Text>
                <Text className="text-xs text-surface-500 dark:text-surface-400">
                  ₱{item.price.toLocaleString("en-PH")} - Stock: {item.stock}
                </Text>
              </View>
              {isSelected && (
                <View className="flex-row items-center gap-2">
                  <TouchableOpacity
                    className="w-7 h-7 rounded-lg bg-surface-200 dark:bg-surface-700 items-center justify-center"
                    onPress={() => updateQuantity(item.id, qty - 1)}
                  >
                    <Text className="text-surface-600 dark:text-surface-300 text-sm">−</Text>
                  </TouchableOpacity>
                  <Text className="w-8 text-center text-sm font-semibold text-surface-900 dark:text-surface-100">
                    {qty}
                  </Text>
                  <TouchableOpacity
                    className="w-7 h-7 rounded-lg bg-surface-200 dark:bg-surface-700 items-center justify-center"
                    onPress={() => updateQuantity(item.id, qty + 1)}
                  >
                    <Text className="text-surface-600 dark:text-surface-300 text-sm">+</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          );
        })}
      </View>

      <View className="bg-surface-50 dark:bg-surface-700/50 rounded-xl p-4 mb-4">
        <Text className="text-sm text-surface-500 dark:text-surface-400 mb-1">Total Amount</Text>
        <Text className="text-2xl font-bold text-surface-900 dark:text-surface-100">
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
