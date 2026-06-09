import React, { useState } from "react";
import { View, FlatList, Alert, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCustomers } from "../hooks/useCustomers";
import { CustomerCard } from "../components/CustomerCard";
import { CustomerForm } from "../components/CustomerForm";
import { PageHeader } from "../../../components/PageHeader";
import { EmptyState } from "../../../components/EmptyState";
import { Modal } from "../../../components/Modal";
import { Customer } from "../../../types";

export function CustomerListScreen() {
  const { customers, loading, addCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const [showForm, setShowForm] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setShowForm(true);
  };

  const handleDelete = (customer: Customer) => {
    Alert.alert("Delete Customer", `Are you sure you want to delete ${customer.name}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteCustomer(customer.id);
          } catch {}
        },
      },
    ]);
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

  return (
    <SafeAreaView className="flex-1 bg-surface-50 dark:bg-surface-950">
      <PageHeader
        title="Customers"
        subtitle={`${customers.length} customer${customers.length !== 1 ? "s" : ""}`}
        action={{ label: "+ Add", onPress: () => setShowForm(true) }}
      />
      {customers.length === 0 ? (
        <EmptyState
          icon="👥"
          title="No Customers"
          description="Add your first customer to get started."
        />
      ) : (
        <FlatList
          data={customers}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CustomerCard customer={item} onEdit={handleEdit} onDelete={handleDelete} />
          )}
          contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
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
