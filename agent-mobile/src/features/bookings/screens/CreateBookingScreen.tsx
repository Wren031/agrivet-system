import React, { useState, useEffect, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, Plus, Minus, ShoppingCart, ArrowRight, ArrowLeft, X, PackageCheck } from "lucide-react-native";
import { useTheme } from "../../../context/ThemeContext";
import { Customer, Item, BookingItem } from "../../../types";
import { customerApi } from "../../customers/services/customerApi";
import { getCityName, getProvinceName } from "../../../data/philippineAddress";
import { itemApi } from "../../items/services/itemApi";
import { bookingApi } from "../services/bookingApi";
import { Button } from "../../../components/Button";

type Step = "customer" | "items" | "cart" | "review";

export function CreateBookingScreen({ navigation }: any) {
  const { isDark } = useTheme();
  const [step, setStep] = useState<Step>("customer");
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [cart, setCart] = useState<Map<string, number>>(new Map());
  const [customerSearch, setCustomerSearch] = useState("");
  const [itemSearch, setItemSearch] = useState("");

  const [creating, setCreating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      const [c, i] = await Promise.all([customerApi.getAll(), itemApi.getAll()]);
      setCustomers(c);
      setItems(i);
    })();
  }, []);

  const filteredCustomers = useMemo(() => {
    if (!customerSearch.trim()) return customers;
    const q = customerSearch.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.phone.toLowerCase().includes(q)
    );
  }, [customers, customerSearch]);

  const filteredItems = useMemo(() => {
    let result = items;
    if (itemSearch.trim()) {
      const q = itemSearch.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, itemSearch]);

  const cartItems = useMemo(() => {
    return Array.from(cart.entries()).map(([id, qty]) => {
      const item = items.find((i) => i.id === id)!;
      return { ...item, quantity: qty, subtotal: item.price * qty };
    });
  }, [cart, items]);

  const total = cartItems.reduce((sum, i) => sum + i.subtotal, 0);

  const addToCart = (itemId: string) => {
    setCart((prev) => {
      const next = new Map(prev);
      next.set(itemId, (next.get(itemId) || 0) + 1);
      return next;
    });
  };

  const updateQty = (itemId: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart((prev) => {
      const next = new Map(prev);
      next.set(itemId, qty);
      return next;
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const next = new Map(prev);
      next.delete(itemId);
      return next;
    });
  };

  const handleProceed = () => {
    if (cart.size === 0) {
      setError("Please add at least one item to cart");
      return;
    }
    setError("");
    goToStep("review");
  };

  const isStepAccessible = (s: Step) => {
    if (s === "customer") return true;
    if (s === "items") return !!selectedCustomer;
    if (s === "cart") return !!selectedCustomer && cart.size > 0;
    if (s === "review") return !!selectedCustomer && cart.size > 0;
    return false;
  };

  const goToStep = (s: Step) => {
    if (isStepAccessible(s)) {
      setStep(s);
      setError("");
    }
  };

  const handleCreateBooking = async () => {
    if (!selectedCustomer) return;
    setCreating(true);
    setError("");
    try {
      const bookingItems: BookingItem[] = cartItems.map((i) => ({
        itemId: i.id,
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        subtotal: i.subtotal,
      }));
      await bookingApi.create({
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        items: bookingItems,
      });
      setShowSuccess(true);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setCreating(false);
    }
  };

  const renderCustomerStep = () => (
    <View className="flex-1 px-6 pt-4">
      <Text className={`text-lg font-bold text-${isDark ? "white" : "black"} mb-2`}>
        Select Customer
      </Text>
      <Text className={`text-sm text-${isDark ? "white/60" : "black/60"} mb-4`}>
        Search and select a customer for this booking
      </Text>

      <View className="flex-row items-center bg-brand/5 rounded-xl px-4 border border-brand/20 mb-4">
        <Search size={18} color="rgba(24,119,242,0.4)" />
        <TextInput
          className={`flex-1 ml-2 py-3 text-base text-${isDark ? "white" : "black"}`}
          placeholder="Search customers..."
          placeholderTextColor="rgba(24,119,242,0.4)"
          value={customerSearch}
          onChangeText={setCustomerSearch}
        />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {filteredCustomers.length === 0 ? (
          <View className="items-center py-12">
            <Text className={`text-${isDark ? "white/50" : "black/50"} text-base`}>No customers found</Text>
          </View>
        ) : (
          <View className="gap-2 pb-6">
            {filteredCustomers.map((customer) => {
              const isSelected = selectedCustomer?.id === customer.id;
              return (
                <TouchableOpacity
                  key={customer.id}
                  className={`flex-row items-center p-4 rounded-2xl border ${
                    isSelected
                      ? "bg-brand/20 border-brand/50"
                      : "bg-brand/5 border-brand/20"
                  }`}
                  activeOpacity={0.7}
                  onPress={() => setSelectedCustomer(customer)}
                >
                  <View className="w-12 h-12 rounded-full bg-brand/10 items-center justify-center mr-3">
                    <Text className={`text-${isDark ? "white" : "black"} font-bold text-sm`}>
                      {customer.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className={`text-base font-bold text-${isDark ? "white" : "black"}`}>
                      {customer.name}
                    </Text>
                    <Text className={`text-sm text-${isDark ? "white/70" : "black/70"}`}>{customer.email}</Text>
                    <Text className={`text-xs text-${isDark ? "white/50" : "black/50"} mt-0.5`}>{customer.phone}</Text>
                  </View>
                  {isSelected && (
                    <View className="w-7 h-7 rounded-full bg-brand items-center justify-center">
                      <X size={16} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View className="py-4">
        <Button
          title="Next: Select Items"
          disabled={!selectedCustomer}
          onPress={() => goToStep("items")}
        />
      </View>
    </View>
  );

  const renderItemsStep = () => (
    <View className="flex-1 px-6 pt-4">
      <View className="flex-row items-center justify-between mb-2">
        <Text className={`text-lg font-bold text-${isDark ? "white" : "black"}`}>
          Select Items
        </Text>
        <TouchableOpacity
          className="flex-row items-center gap-1"
          onPress={() => goToStep("cart")}
        >
          <ShoppingCart size={18} color="#1877F2" />
          <Text className={`text-${isDark ? "white" : "black"} font-bold`}>{cart.size}</Text>
        </TouchableOpacity>
      </View>
      <Text className={`text-sm text-${isDark ? "white/60" : "black/60"} mb-4`}>
        Customer: {selectedCustomer?.name}
      </Text>

      <View className="flex-row items-center bg-brand/5 rounded-xl px-4 border border-brand/20 mb-3">
        <Search size={18} color="rgba(24,119,242,0.4)" />
        <TextInput
          className={`flex-1 ml-2 py-3 text-base text-${isDark ? "white" : "black"}`}
          placeholder="Search items..."
          placeholderTextColor="rgba(24,119,242,0.4)"
          value={itemSearch}
          onChangeText={setItemSearch}
        />
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {filteredItems.length === 0 ? (
          <View className="items-center py-12">
            <Text className={`text-${isDark ? "white/50" : "black/50"} text-base`}>No items found</Text>
          </View>
        ) : (
          <View className="gap-2 pb-6">
            {filteredItems.map((item) => {
              const qty = cart.get(item.id) || 0;
              return (
                <View
                  key={item.id}
                  className="bg-brand/5 rounded-2xl p-4 border border-brand/20"
                >
                  <View className="flex-row items-center">
                    <View className="flex-1">
                      <Text className={`text-base font-bold text-${isDark ? "white" : "black"}`}>
                        {item.name}
                      </Text>
                      <Text className={`text-xs text-${isDark ? "white/60" : "black/60"} mt-0.5`}>{item.description}</Text>
                      <View className="flex-row items-center gap-3 mt-2">
                        <Text className={`text-sm font-bold text-${isDark ? "white" : "black"}`}>
                          ₱{item.price.toLocaleString("en-PH")}
                        </Text>
                        <Text className={`text-xs text-${isDark ? "white/50" : "black/50"}`}>Stock: {item.stock}</Text>
                      </View>
                    </View>
                    {qty > 0 ? (
                      <View className="flex-row items-center gap-2">
                        <TouchableOpacity
                          className="w-8 h-8 rounded-lg bg-brand/10 items-center justify-center"
                          onPress={() => updateQty(item.id, qty - 1)}
                        >
                          <Minus size={16} color="#1877F2" />
                        </TouchableOpacity>
                        <Text className={`w-8 text-center text-base font-bold text-${isDark ? "white" : "black"}`}>
                          {qty}
                        </Text>
                        <TouchableOpacity
                          className="w-8 h-8 rounded-lg bg-brand/10 items-center justify-center"
                          onPress={() => updateQty(item.id, qty + 1)}
                        >
                          <Plus size={16} color="#1877F2" />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <TouchableOpacity
                        className="w-20 h-9 rounded-xl bg-brand items-center justify-center"
                        onPress={() => addToCart(item.id)}
                      >
                        <Text className="text-white text-sm font-bold">Add</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      <View className="flex-row gap-3 py-4">
        <View className="flex-1">
          <Button title="Back" variant="secondary" onPress={() => goToStep("customer")} />
        </View>
        <View className="flex-1">
          <Button
            title="View Cart"
            disabled={cart.size === 0}
            onPress={() => goToStep("cart")}
          />
        </View>
      </View>
    </View>
  );

  const renderCartStep = () => (
    <View className="flex-1 px-6 pt-4">
      <Text className={`text-lg font-bold text-${isDark ? "white" : "black"} mb-2`}>
        Shopping Cart
      </Text>
      <Text className={`text-sm text-${isDark ? "white/60" : "black/60"} mb-4`}>
        {cart.size} item{cart.size !== 1 ? "s" : ""} · Customer: {selectedCustomer?.name}
      </Text>

      {cartItems.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ShoppingCart size={48} color="rgba(24,119,242,0.3)" />
          <Text className={`text-${isDark ? "white/50" : "black/50"} mt-3 text-base`}>Your cart is empty</Text>
        </View>
      ) : (
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <View className="gap-2 pb-4">
            {cartItems.map((item) => (
              <View
                key={item.id}
                className="bg-brand/5 rounded-2xl p-4 border border-brand/20"
              >
                <View className="flex-row items-center">
                  <View className="flex-1">
                    <Text className={`text-base font-bold text-${isDark ? "white" : "black"}`}>
                      {item.name}
                    </Text>
                    <Text className={`text-xs text-${isDark ? "white/60" : "black/60"}`}>
                      ₱{item.price.toLocaleString("en-PH")} x {item.quantity}
                    </Text>
                  </View>
                  <Text className={`text-base font-bold text-${isDark ? "white" : "black"} mr-3`}>
                    ₱{item.subtotal.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                  </Text>
                  <TouchableOpacity
                    className="w-8 h-8 rounded-lg bg-brand/5 items-center justify-center"
                    onPress={() => removeFromCart(item.id)}
                  >
                    <X size={16} color="#1877F2" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      )}

      <View className="bg-brand/5 rounded-2xl p-4 border border-brand/20 mb-4">
        <View className="flex-row items-center justify-between">
          <Text className={`text-base font-bold text-${isDark ? "white" : "black"}`}>
            Total
          </Text>
          <Text className={`text-xl font-bold text-${isDark ? "white" : "black"}`}>
            ₱{total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
          </Text>
        </View>
      </View>

      {error ? (
        <View className="bg-brand/5 rounded-xl p-3 mb-3 border border-brand/20">
          <Text className={`text-${isDark ? "white/80" : "black/80"} text-sm`}>{error}</Text>
        </View>
      ) : null}

      <View className="flex-row gap-3 py-4">
        <View className="flex-1">
          <Button title="Back to Items" variant="secondary" onPress={() => goToStep("items")} />
        </View>
        <View className="flex-1">
          <Button
            title="Proceed"
            disabled={cart.size === 0}
            onPress={handleProceed}
          />
        </View>
      </View>
    </View>
  );

  const renderReviewStep = () => (
    <View className="flex-1 px-6 pt-4">
      <Text className={`text-lg font-bold text-${isDark ? "white" : "black"} mb-2`}>
        Booking Details
      </Text>
      <Text className={`text-sm text-${isDark ? "white/60" : "black/60"} mb-4`}>
        Please review before continuing
      </Text>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="bg-brand/5 rounded-2xl p-4 mb-3 border border-brand/20">
          <Text className={`text-xs text-${isDark ? "white/60" : "black/60"} uppercase tracking-wider mb-2`}>
            Customer
          </Text>
          <Text className={`text-base font-bold text-${isDark ? "white" : "black"}`}>
            {selectedCustomer?.name}
          </Text>
          <Text className={`text-sm text-${isDark ? "white/70" : "black/70"}`}>{selectedCustomer?.email}</Text>
          <Text className={`text-xs text-${isDark ? "white/50" : "black/50"} mt-0.5`}>
            {selectedCustomer?.address}
            {selectedCustomer?.address ? ", " : ""}
            {getCityName(selectedCustomer?.city || "")}
            {selectedCustomer?.city ? ", " : ""}
            {getProvinceName(selectedCustomer?.province || "")}
          </Text>
        </View>

        <View className="bg-brand/5 rounded-2xl p-4 mb-3 border border-brand/20">
          <Text className={`text-xs text-${isDark ? "white/60" : "black/60"} uppercase tracking-wider mb-3`}>
            Products ({cartItems.length})
          </Text>
          {cartItems.map((item, index) => (
            <View
              key={item.id}
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
            <Text className={`text-lg font-bold text-${isDark ? "white" : "black"}`}>Total</Text>
            <Text className={`text-xl font-bold text-${isDark ? "white" : "black"}`}>
              ₱{total.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
            </Text>
          </View>
        </View>
      </ScrollView>

      {error ? (
        <View className="bg-brand/5 rounded-xl p-3 mb-3 border border-brand/20">
          <Text className={`text-${isDark ? "white/80" : "black/80"} text-sm`}>{error}</Text>
        </View>
      ) : null}

      <View className="flex-row gap-3 py-4">
        <View className="flex-1">
          <Button title="Cancel" variant="secondary" onPress={() => navigation.goBack()} />
        </View>
        <View className="flex-1">
          <Button
            title="Continue Booking"
            onPress={handleCreateBooking}
            loading={creating}
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView className={`flex-1 bg-${isDark ? "[#1A1A1A]" : "white"}`}>
      <View className="flex-row items-center px-4 py-3 border-b border-brand/20">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center -ml-2"
        >
          <ArrowLeft size={22} color="#1877F2" />
        </TouchableOpacity>
        <Text className={`flex-1 text-lg font-bold text-${isDark ? "white" : "black"} text-center mr-6`}>
          Create Booking
        </Text>
      </View>
      <View className="flex-row items-center justify-center px-6 pt-4 pb-2">
        <View className="flex-row items-center gap-2">
          {(["customer", "items", "cart", "review"] as Step[]).map((s, i) => {
            const stepIndex = ["customer", "items", "cart", "review"].indexOf(step);
            const isActive = stepIndex >= i;
            const accessible = isStepAccessible(s);
            return (
              <TouchableOpacity
                key={s}
                disabled={!accessible}
                onPress={() => goToStep(s)}
                className="flex-row items-center active:opacity-70"
              >
                <View
                  className={`w-7 h-7 rounded-full items-center justify-center ${
                    isActive ? "bg-brand" : "bg-brand/20"
                  }`}
                >
                  <Text className={`text-xs font-bold ${isActive ? "text-white" : `text-${isDark ? "white/50" : "black/50"}`}`}>{i + 1}</Text>
                </View>
                {i < 3 && (
                  <View
                    className={`w-8 h-0.5 mx-1 ${
                      stepIndex > i ? "bg-brand" : "bg-brand/20"
                    }`}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {step === "customer" && renderCustomerStep()}
      {step === "items" && renderItemsStep()}
      {step === "cart" && renderCartStep()}
      {step === "review" && renderReviewStep()}

      {showSuccess && (
        <View className="absolute inset-0 bg-black/40 items-center justify-center p-4">
          <View className={`w-full max-w-sm bg-${isDark ? "[#1A1A1A]" : "white"} rounded-2xl p-6 border border-brand/20 items-center`}>
            <View className="w-16 h-16 rounded-full bg-brand/10 items-center justify-center mb-4">
              <PackageCheck size={32} color="#1877F2" />
            </View>
            <Text className={`text-xl font-bold text-${isDark ? "white" : "black"} text-center tracking-tight`}>
              Booking Submitted
            </Text>
            <Text className={`text-sm leading-relaxed text-${isDark ? "white/60" : "black/60"} text-center mt-2 px-2`}>
              Your request has been successfully received and is currently pending approval.
            </Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}
              className="w-full mt-6 py-3.5 rounded-xl bg-brand active:bg-brand/90 items-center justify-center"
            >
              <Text className="text-white font-bold text-base tracking-wide">
                Done
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}
