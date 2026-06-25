import React, { useState, useMemo, useCallback } from "react";
import { View, FlatList, Text, TextInput, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Search } from "lucide-react-native";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import { useCustomers } from "../hooks/useCustomers";
import { CustomerCard } from "../components/CustomerCard";
import { CustomerForm } from "../components/CustomerForm";
import { PageHeader } from "../../../components/PageHeader";
import { EmptyState } from "../../../components/EmptyState";
import { Modal } from "../../../components/Modal";
import { Customer } from "../../../types";

export function CustomerListScreen() {
  const { isDark } = useTheme();
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";
  const { customers, loading, addCustomer, updateCustomer, deleteCustomer, fetchCustomers } = useCustomers();
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [search, setSearch] = useState("");

  const filteredCustomers = useMemo(() => {
    if (!search.trim()) return customers;
    const query = search.toLowerCase();
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(query) ||
        c.email.toLowerCase().includes(query) ||
        c.phone.toLowerCase().includes(query)
    );
  }, [customers, search]);

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = async (customer: Customer) => {
    try {
      await deleteCustomer(customer.id);
    } catch {}
  };

  const handleFormSubmit = async (data: Omit<Customer, "id" | "createdAt">) => {
    if (editingCustomer) {
      await updateCustomer(editingCustomer.id, data);
    } else {
      await addCustomer(data);
    }
    setShowForm(false);
    setEditingCustomer(null);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCustomer(null);
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCustomers();
    setRefreshing(false);
  }, [fetchCustomers]);

  return (
    <SafeAreaView className={`flex-1 bg-${isDark ? "[#1e293b]" : "[#f4f7f5]"}`}>
      <PageHeader
        title="Customers"
        subtitle={
          search
            ? `${filteredCustomers.length} of ${customers.length} customer${customers.length !== 1 ? "s" : ""}`
            : `${customers.length} customer${customers.length !== 1 ? "s" : ""}`
        }
        action={{ label: "+ Add", onPress: () => setShowForm(true) }}
      />
      <View className="px-6 mb-3">
        <View className="flex-row items-center bg-brand/5 rounded-xl px-4 border border-brand/20">
          <Search size={18} color="rgba(45,106,79,0.4)" />
          <TextInput
            className={`flex-1 ml-2 py-3 text-base text-${isDark ? "white" : "black"}`}
            placeholder="Search customers..."
            placeholderTextColor="rgba(45,106,79,0.4)"
            value={search}
            onChangeText={setSearch}
            clearButtonMode="while-editing"
          />
        </View>
      </View>
      {filteredCustomers.length === 0 ? (
        <EmptyState
          icon="👥"
          title={search ? "No Results" : "No Customers"}
          description={search ? "Try a different search term." : "Add your first customer to get started."}
        />
      ) : (
        <FlatList
          data={filteredCustomers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CustomerCard customer={item} onEdit={handleEdit} onDelete={handleDelete} />
          )}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2d6a4f" />}
        />
      )}
      <Modal
        visible={showForm}
        onClose={handleCloseForm}
        title={editingCustomer ? "Edit Customer" : "New Customer"}
      >
        <CustomerForm
          customer={editingCustomer}
          onSubmit={handleFormSubmit}
          onCancel={handleCloseForm}
        />
      </Modal>
    </SafeAreaView>
  );
}
