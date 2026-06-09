import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import { Customer } from "../../../types";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";

interface CustomerFormProps {
  customer?: Customer | null;
  onSubmit: (data: Omit<Customer, "id" | "createdAt">) => Promise<void>;
  onCancel: () => void;
}

export function CustomerForm({ customer, onSubmit, onCancel }: CustomerFormProps) {
  const [name, setName] = useState(customer?.name || "");
  const [phone, setPhone] = useState(customer?.phone || "");
  const [email, setEmail] = useState(customer?.email || "");
  const [address, setAddress] = useState(customer?.address || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setPhone(customer.phone);
      setEmail(customer.email);
      setAddress(customer.address);
    }
  }, [customer]);

  const handleSubmit = async () => {
    if (!name || !phone || !email || !address) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onSubmit({ name, phone, email, address, avatar: customer?.avatar });
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="gap-2">
      {error ? (
        <View className="bg-red-50 dark:bg-red-900/20 rounded-xl p-3 mb-2">
          <Text className="text-red-600 dark:text-red-400 text-sm">{error}</Text>
        </View>
      ) : null}
      <Input label="Full Name" placeholder="Enter full name" value={name} onChangeText={setName} />
      <Input label="Phone" placeholder="+63 9XX XXX XXXX" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Input label="Email" placeholder="email@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
      <Input label="Address" placeholder="Enter address" value={address} onChangeText={setAddress} />
      <View className="flex-row gap-3 mt-2">
        <View className="flex-1">
          <Button title="Cancel" variant="secondary" onPress={onCancel} />
        </View>
        <View className="flex-1">
          <Button
            title={customer ? "Update" : "Create"}
            onPress={handleSubmit}
            loading={loading}
          />
        </View>
      </View>
    </View>
  );
}
