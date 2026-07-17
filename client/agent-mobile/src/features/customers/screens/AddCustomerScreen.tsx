import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, User, Phone, MapPin } from "lucide-react-native";
import { useTheme } from "../../../context/ThemeContext";
import { Input } from "../../../components/Input";
import { Select } from "../../../components/Select";
import { Button } from "../../../components/Button";
import { useAddCustomerForm } from "../hooks/useAddCustomerForm";

interface AddCustomerScreenProps {
  navigation: any;
}

export function AddCustomerScreen({ navigation }: AddCustomerScreenProps) {
  const { isDark } = useTheme();
  const {
    formData,
    updateField,
    errors,
    validate,
    formDataForConfirmation,

    regions,
    provinces,
    cities,
    barangays,

    loadingRegions,
    loadingProvinces,
    loadingCities,
    loadingBarangays,

    onRegionSelect,
    onProvinceSelect,
    onCitySelect,
    onBarangaySelect,
  } = useAddCustomerForm();

  const handleContinue = () => {
    if (validate()) {
      navigation.navigate("CustomerConfirmation", {
        customerData: formDataForConfirmation,
      });
    }
  };

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-[#0f172a]" : "bg-[#f8f9fa]"}`}
      edges={["top", "left", "right"]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        {/* Header */}
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
            Add Customer
          </Text>
        </View>

        <ScrollView
          className="flex-1 px-5"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 32 }}
          nestedScrollEnabled={true} // Helps with nested list scrolling inside ScrollView
        >
          {/* Personal Information */}
          <View className="mb-6">
            <View className="flex-row items-center gap-2.5 mb-4 mt-2">
              <View className="w-8 h-8 rounded-lg bg-brand/10 items-center justify-center">
                <User size={16} color="#2d6a4f" />
              </View>
              <Text
                className={`text-sm font-bold uppercase tracking-wider ${
                  isDark ? "text-white/40" : "text-slate-400"
                }`}
              >
                Personal Information
              </Text>
            </View>
            <Input
              label="Full Name"
              placeholder="Enter customer's full name"
              value={formData.name}
              onChangeText={(v) => updateField("name", v)}
              error={errors.name}
              autoCapitalize="words"
            />
            <Input
              label="Store Name"
              placeholder="Enter store name (optional)"
              value={formData.storeName}
              onChangeText={(v) => updateField("storeName", v)}
            />
          </View>

          {/* Contact Information */}
          <View className="mb-6">
            <View className="flex-row items-center gap-2.5 mb-4">
              <View className="w-8 h-8 rounded-lg bg-brand/10 items-center justify-center">
                <Phone size={16} color="#2d6a4f" />
              </View>
              <Text
                className={`text-sm font-bold uppercase tracking-wider ${
                  isDark ? "text-white/40" : "text-slate-400"
                }`}
              >
                Contact Information
              </Text>
            </View>
            <Input
              label="Phone Number"
              placeholder="+63 9XX XXX XXXX"
              value={formData.phone}
              onChangeText={(v) => updateField("phone", v)}
              keyboardType="phone-pad"
              error={errors.phone}
            />
          </View>

          {/* Address Information */}
          <View className="mb-6">
            <View className="flex-row items-center gap-2.5 mb-4">
              <View className="w-8 h-8 rounded-lg bg-brand/10 items-center justify-center">
                <MapPin size={16} color="#2d6a4f" />
              </View>
              <Text
                className={`text-sm font-bold uppercase tracking-wider ${
                  isDark ? "text-white/40" : "text-slate-400"
                }`}
              >
                Address Information
              </Text>
            </View>

            {/* Region Select Wrapper */}
            <View style={{ zIndex: 4000, position: "relative" }}>
              <Select
                label="Region"
                options={regions}
                value={formData.regionCode}
                onSelect={onRegionSelect}
                placeholder="Select region"
                loading={loadingRegions}
                error={errors.region}
              />
            </View>

            {/* Province Select Wrapper */}
            <View style={{ zIndex: 3000, position: "relative" }}>
              <Select
                label="Province"
                options={provinces}
                value={formData.provinceCode}
                onSelect={onProvinceSelect}
                placeholder="Select province"
                disabled={!formData.regionCode}
                loading={loadingProvinces}
                error={errors.province}
              />
            </View>

            {/* City Select Wrapper */}
            <View style={{ zIndex: 2000, position: "relative" }}>
              <Select
                label="City / Municipality"
                options={cities}
                value={formData.cityCode}
                onSelect={onCitySelect}
                placeholder="Select city/municipality"
                disabled={!formData.provinceCode}
                loading={loadingCities}
                error={errors.city}
              />
            </View>

            {/* Barangay Select Wrapper */}
            <View style={{ zIndex: 1000, position: "relative" }}>
              <Select
                label="Barangay"
                options={barangays}
                value={formData.barangayCode}
                onSelect={onBarangaySelect}
                placeholder="Select barangay"
                disabled={!formData.cityCode}
                loading={loadingBarangays}
                error={errors.barangay}
              />
            </View>

            <Input
              label="Street / Purok / House No."
              placeholder="e.g. Purok 4, Mabini Street"
              value={formData.street}
              onChangeText={(v) => updateField("street", v)}
            />
          </View>
        </ScrollView>

        {/* Footer Action */}
        <View
          className={`px-5 py-4 border-t ${
            isDark ? "border-white/[0.08]" : "border-slate-200"
          }`}
        >
          <Button
            title="Continue"
            onPress={handleContinue}
            size="lg"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}