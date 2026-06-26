import React, { useState, useEffect, useMemo } from "react";
import { View, Text, ScrollView, TouchableOpacity, TextInput, FlatList, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search, Plus, Minus, ShoppingCart, ArrowRight, ArrowLeft, X, PackageCheck, Package, Filter } from "lucide-react-native";
import { useTheme } from "../../../context/ThemeContext";
import { Customer, Item, BookingItem } from "../../../types";
import { customerApi } from "../../customers/services/customerApi";
import { getCityName, getProvinceName } from "../../../data/philippineAddress";
import { itemApi } from "../../items/services/itemApi";
import { bookingApi } from "../services/bookingApi";
import { Button } from "../../../components/Button";
import { getImageUrl } from "../../../config/api.config";

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

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

  const categories = useMemo(() => {
    const cats = new Set(items.map((i) => i.category));
    return Array.from(cats).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    let result = items;
    if (selectedCategory) {
      result = result.filter((i) => i.category === selectedCategory);
    }
    if (itemSearch.trim()) {
      const q = itemSearch.toLowerCase();
      result = result.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [items, itemSearch, selectedCategory]);

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
        <Search size={18} color="rgba(45,106,79,0.4)" />
        <TextInput
          className={`flex-1 ml-2 py-3 text-base text-${isDark ? "white" : "black"}`}
          placeholder="Search customers..."
          placeholderTextColor="rgba(45,106,79,0.4)"
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
                    <Text className={`text-sm text-${isDark ? "white/70" : "black/70"}`}>
                      {customer.storeName || "No store"}
                    </Text>
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
          <ShoppingCart size={18} color="#2d6a4f" />
          <Text className={`text-${isDark ? "white" : "black"} font-bold`}>{cart.size}</Text>
        </TouchableOpacity>
      </View>
      <Text className={`text-sm text-${isDark ? "white/60" : "black/60"} mb-4`}>
        Customer: {selectedCustomer?.name}
      </Text>

      <View className="mb-4">
        <TextInput
          className={`w-full px-4 py-3.5 rounded-xl text-base text-${isDark ? "white" : "black"} bg-brand/5 border border-brand/20`}
          placeholder="Search items..."
          placeholderTextColor="rgba(45,106,79,0.4)"
          value={itemSearch}
          onChangeText={setItemSearch}
          clearButtonMode="while-editing"
        />
      </View>

      <View className="flex-row items-center justify-between mb-3">
        <TouchableOpacity
          className="flex-row items-center gap-2 px-4 py-2 rounded-xl bg-brand/5 border border-brand/20"
          onPress={() => setShowCategoryModal(true)}
          activeOpacity={0.7}
        >
          <Filter size={16} color="#2d6a4f" />
          <Text className={`text-sm font-bold text-${isDark ? "white" : "black"}`}>
            {selectedCategory || "All"}
          </Text>
          {selectedCategory && (
            <TouchableOpacity
              onPress={() => setSelectedCategory(null)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={14} color="rgba(45,106,79,0.5)" />
            </TouchableOpacity>
          )}
        </TouchableOpacity>
        <View className="bg-brand/10 rounded-lg px-2.5 py-1">
          <Text className={`text-${isDark ? "white" : "black"} text-xs font-bold tracking-wide`}>
            {filteredItems.length} ITEM{filteredItems.length !== 1 ? "S" : ""}
          </Text>
        </View>
      </View>

      {filteredItems.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className={`text-${isDark ? "white/50" : "black/50"} text-base`}>No items found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperClassName="gap-3"
          renderItem={({ item }) => {
            const qty = cart.get(item.id) || 0;
            const imageUri = getImageUrl(item.image);
            const stockColor =
              item.stock <= 20 ? "bg-red-400" : item.stock <= 50 ? "bg-yellow-400" : "bg-brand";
            return (
              <View className="flex-1 max-w-[50%]">
                <View className="bg-brand/5 rounded-2xl p-3 border border-brand/20">
                  <View className="w-full h-20 bg-brand/5 rounded-xl mb-2 overflow-hidden">
                    {imageUri ? (
                      <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
                    ) : (
                      <View className="flex-1 items-center justify-center">
                        <Package size={24} color="rgba(45,106,79,0.3)" />
                      </View>
                    )}
                  </View>
                  <View className="self-start px-2 py-0.5 rounded-full bg-brand/10 mb-1">
                    <Text className={`text-[10px] font-bold text-${isDark ? "white" : "black"}`}>
                      {item.category}
                    </Text>
                  </View>
                  <Text className={`text-sm font-bold text-${isDark ? "white" : "black"} mb-1`} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View className="flex-row items-center justify-between">
                    <Text className={`text-base font-bold text-${isDark ? "white" : "black"}`}>
                      ₱{item.price.toLocaleString("en-PH", { minimumFractionDigits: 2 })}
                    </Text>
                    <View className="flex-row items-center gap-1">
                      <View className={`w-2 h-2 rounded-full ${stockColor}`} />
                      <Text className={`text-[10px] text-${isDark ? "white/60" : "black/60"}`}>
                        {item.stock}
                      </Text>
                    </View>
                  </View>
                  {qty > 0 ? (
                    <View className="flex-row items-center justify-between mt-2 pt-2 border-t border-brand/10">
                      <TouchableOpacity
                        className="w-7 h-7 rounded-lg bg-brand/10 items-center justify-center"
                        onPress={() => {
                          const current = cart.get(item.id) || 0;
                          if (current > 1) updateQty(item.id, current - 1);
                          else removeFromCart(item.id);
                        }}
                      >
                        <Minus size={14} color="#2d6a4f" />
                      </TouchableOpacity>
                      <Text className={`text-sm font-bold text-${isDark ? "white" : "black"}`}>{qty}</Text>
                      <TouchableOpacity
                        className="w-7 h-7 rounded-lg bg-brand/10 items-center justify-center"
                        onPress={() => addToCart(item.id)}
                      >
                        <Plus size={14} color="#2d6a4f" />
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      className="bg-brand px-3 py-1.5 rounded-lg items-center mt-2"
                      onPress={() => addToCart(item.id)}
                      activeOpacity={0.7}
                    >
                      <Text className="text-white text-xs font-bold">Add to Cart</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          }}
          contentContainerClassName="gap-3 pb-4"
          showsVerticalScrollIndicator={false}
        />
      )}

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

      {showCategoryModal && (
        <View className={`absolute inset-0 ${isDark ? "bg-black/70" : "bg-black/40"}`}>
          <TouchableOpacity
            className="flex-1"
            activeOpacity={1}
            onPress={() => setShowCategoryModal(false)}
          />
          <View className={`rounded-t-3xl p-6 bg-${isDark ? "[#1e293b]" : "[#f4f7f5]"}`}>
            <View className="flex-row items-center justify-between mb-4">
              <Text className={`text-lg font-bold text-${isDark ? "white" : "black"}`}>
                Select Category
              </Text>
              <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
                <X size={22} color={isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)"} />
              </TouchableOpacity>
            </View>
            <ScrollView className="max-h-80">
              <TouchableOpacity
                className={`flex-row items-center px-4 py-3.5 rounded-xl mb-1 ${
                  selectedCategory === null ? "bg-brand/10" : ""
                }`}
                onPress={() => {
                  setSelectedCategory(null);
                  setShowCategoryModal(false);
                }}
                activeOpacity={0.7}
              >
                <View className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${
                  selectedCategory === null ? "border-brand bg-brand" : "border-brand/30"
                }`}>
                  {selectedCategory === null && <View className="w-2.5 h-2.5 rounded-full bg-white" />}
                </View>
                <Text className={`text-base font-medium text-${isDark ? "white" : "black"}`}>
                  All Items
                </Text>
              </TouchableOpacity>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat}
                  className={`flex-row items-center px-4 py-3.5 rounded-xl mb-1 ${
                    selectedCategory === cat ? "bg-brand/10" : ""
                  }`}
                  onPress={() => {
                    setSelectedCategory(cat);
                    setShowCategoryModal(false);
                  }}
                  activeOpacity={0.7}
                >
                  <View className={`w-5 h-5 rounded-full border-2 items-center justify-center mr-3 ${
                    selectedCategory === cat ? "border-brand bg-brand" : "border-brand/30"
                  }`}>
                    {selectedCategory === cat && <View className="w-2.5 h-2.5 rounded-full bg-white" />}
                  </View>
                  <Text className={`text-base font-medium text-${isDark ? "white" : "black"}`}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              onPress={() => setShowCategoryModal(false)}
              className="w-full mt-4 py-3.5 rounded-xl bg-brand items-center active:bg-brand/90"
              activeOpacity={0.85}
            >
              <Text className="text-white text-base font-bold">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
          <ShoppingCart size={48} color="rgba(45,106,79,0.3)" />
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
                    <X size={16} color="#2d6a4f" />
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
    <SafeAreaView className={`flex-1 bg-${isDark ? "[#1e293b]" : "[#f4f7f5]"}`}>
      <View className="flex-row items-center px-4 py-3 border-b border-brand/20">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="w-10 h-10 items-center justify-center -ml-2"
        >
          <ArrowLeft size={22} color="#2d6a4f" />
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
          <View className={`w-full max-w-sm bg-${isDark ? "[#1e293b]" : "[#f4f7f5]"} rounded-2xl p-6 border border-brand/20 items-center`}>
            <View className="w-16 h-16 rounded-full bg-brand/10 items-center justify-center mb-4">
              <PackageCheck size={32} color="#2d6a4f" />
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
