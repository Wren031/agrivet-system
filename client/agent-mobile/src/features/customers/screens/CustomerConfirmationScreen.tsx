import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ArrowLeft,
  User,
  Phone,
  MapPin,
  CheckCircle2,
} from "lucide-react-native";
import { useTheme } from "../../../context/ThemeContext";
import { Button } from "../../../components/Button";
import { useCustomers } from "../hooks/useCustomers";

interface ConfirmationFieldProps {
  label: string;
  value: string;
}

function ConfirmationField({ label, value }: ConfirmationFieldProps) {
  const { isDark } = useTheme();

  return (
    <View className="mb-3">
      <Text
        className={`text-xs font-medium uppercase tracking-wider mb-1 ${
          isDark ? "text-white/40" : "text-slate-400"
        }`}
      >
        {label}
      </Text>
      <Text
        className={`text-base ${
          value
            ? isDark
              ? "text-white"
              : "text-slate-900"
            : isDark
              ? "text-white/30"
              : "text-slate-300"
        }`}
      >
        {value || "Not provided"}
      </Text>
    </View>
  );
}

interface CustomerConfirmationScreenProps {
  navigation: any;
  route: any;
}

export function CustomerConfirmationScreen({
  navigation,
  route,
}: CustomerConfirmationScreenProps) {
  const { isDark } = useTheme();
  const { addCustomer } = useCustomers();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const customerData = route.params?.customerData;

  const handleConfirm = async () => {
    if (!customerData) {
      setError("No customer data found. Please go back and try again.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      await addCustomer({
        name: customerData.name || "",
        phone: customerData.phone || "",
        storeName: customerData.storeName || "",
        region: customerData.region || "",
        province: customerData.province || "",
        city: customerData.city || "",
        barangay: customerData.barangay || "",
        address: customerData.address || "",
      });
      setSuccess(true);
      setTimeout(() => {
        navigation.navigate("Customers");
      }, 1500);
    } catch (e: any) {
      const message =
        e?.message ||
        (typeof e === "string" ? e : "Failed to create customer. Please try again.");
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <SafeAreaView
        className={`flex-1 ${isDark ? "bg-[#0f172a]" : "bg-[#f8f9fa]"}`}
        edges={["top", "left", "right"]}
      >
        <View className="flex-1 items-center justify-center px-8">
          <View
            className={`w-full max-w-sm rounded-3xl p-8 items-center ${
              isDark
                ? "bg-[#1e293b] border border-white/[0.08]"
                : "bg-white shadow-xl shadow-black/5"
            }`}
          >
            <View className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 items-center justify-center mb-5">
              <CheckCircle2 size={40} color="#16a34a" />
            </View>
            <Text
              className={`text-xl font-bold text-center ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Customer Created!
            </Text>
            <Text
              className={`text-sm text-center mt-2 ${
                isDark ? "text-white/50" : "text-slate-500"
              }`}
            >
              Redirecting to customer list...
            </Text>
            <ActivityIndicator
              size="small"
              color="#2d6a4f"
              style={{ marginTop: 20 }}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-[#0f172a]" : "bg-[#f8f9fa]"}`}
      edges={["top", "left", "right"]}
    >
      <View className="flex-row items-center px-5 py-3">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className={`w-10 h-10 rounded-xl items-center justify-center ${
            isDark ? "bg-white/5" : "bg-black/5"
          }`}
        >
          <ArrowLeft
            size={20}
            color={
              isDark
                ? "rgba(255,255,255,0.7)"
                : "rgba(0,0,0,0.5)"
            }
          />
        </TouchableOpacity>
        <Text
          className={`flex-1 text-lg font-bold text-center mr-10 ${
            isDark ? "text-white" : "text-slate-900"
          }`}
        >
          Review Details
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        {error ? (
          <View
            className={`rounded-xl p-4 mb-5 border ${
              isDark
                ? "bg-red-500/10 border-red-500/20"
                : "bg-red-50 border-red-200"
            }`}
          >
            <Text
              className={`text-sm ${
                isDark ? "text-red-400" : "text-red-600"
              }`}
            >
              {error}
            </Text>
          </View>
        ) : null}

        <View className="items-center my-6">
          <View className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 items-center justify-center mb-4">
            <CheckCircle2
              size={32}
              color={isDark ? "#86efac" : "#16a34a"}
            />
          </View>
          <Text
            className={`text-xl font-bold text-center ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Review Customer Details
          </Text>
          <Text
            className={`text-sm text-center mt-1 ${
              isDark ? "text-white/50" : "text-slate-500"
            }`}
          >
            Please verify all information before saving
          </Text>
        </View>

        <View
          className={`rounded-2xl p-5 mb-4 border ${
            isDark
              ? "bg-[#1e293b] border-white/[0.08]"
              : "bg-white border-slate-200"
          }`}
        >
          <View className="flex-row items-center gap-2.5 mb-4">
            <View className="w-8 h-8 rounded-lg bg-brand/10 items-center justify-center">
              <User size={16} color="#2d6a4f" />
            </View>
            <Text
              className={`text-sm font-bold uppercase tracking-wider ${
                isDark ? "text-white/50" : "text-slate-400"
              }`}
            >
              Personal Information
            </Text>
          </View>
          <ConfirmationField label="Full Name" value={customerData?.name} />
          <ConfirmationField label="Store Name" value={customerData?.storeName} />
        </View>

        <View
          className={`rounded-2xl p-5 mb-4 border ${
            isDark
              ? "bg-[#1e293b] border-white/[0.08]"
              : "bg-white border-slate-200"
          }`}
        >
          <View className="flex-row items-center gap-2.5 mb-4">
            <View className="w-8 h-8 rounded-lg bg-brand/10 items-center justify-center">
              <Phone size={16} color="#2d6a4f" />
            </View>
            <Text
              className={`text-sm font-bold uppercase tracking-wider ${
                isDark ? "text-white/50" : "text-slate-400"
              }`}
            >
              Contact Information
            </Text>
          </View>
          <ConfirmationField label="Phone Number" value={customerData?.phone} />
        </View>

        <View
          className={`rounded-2xl p-5 mb-6 border ${
            isDark
              ? "bg-[#1e293b] border-white/[0.08]"
              : "bg-white border-slate-200"
          }`}
        >
          <View className="flex-row items-center gap-2.5 mb-4">
            <View className="w-8 h-8 rounded-lg bg-brand/10 items-center justify-center">
              <MapPin size={16} color="#2d6a4f" />
            </View>
            <Text
              className={`text-sm font-bold uppercase tracking-wider ${
                isDark ? "text-white/50" : "text-slate-400"
              }`}
            >
              Address Information
            </Text>
          </View>
          <ConfirmationField label="Region" value={customerData?.region} />
          <ConfirmationField label="Province" value={customerData?.province} />
          <ConfirmationField label="City / Municipality" value={customerData?.city} />
          <ConfirmationField label="Barangay" value={customerData?.barangay} />
          <ConfirmationField label="Street / Purok" value={customerData?.address} />
        </View>
      </ScrollView>

      <View
        className={`px-5 py-4 border-t ${
          isDark ? "border-white/[0.08]" : "border-slate-200"
        }`}
      >
        <View className="flex-row gap-3">
          <View className="flex-1">
            <Button
              title="Edit"
              variant="secondary"
              onPress={() => navigation.goBack()}
              disabled={submitting}
            />
          </View>
          <View className="flex-1">
            <Button
              title="Confirm Add Customer"
              onPress={handleConfirm}
              loading={submitting}
            />
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
