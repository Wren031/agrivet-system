import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Customer } from "../../../types";
import { Input } from "../../../components/Input";
import { Select } from "../../../components/Select";
import { Button } from "../../../components/Button";
import {
  regions,
  getProvincesByRegion,
  getCitiesByRegion,
  getBarangaysByCity,
  getRegionName,
  getProvinceName,
  getCityName,
  getBarangayName,
} from "../../../data/philippineAddress";
import { useTheme } from "../../../context/ThemeContext";

interface CustomerFormProps {
  customer?: Customer | null;
  onSubmit: (data: Omit<Customer, "id" | "createdAt">) => Promise<void>;
  onCancel: () => void;
}

type AddressStep = "region" | "province" | "city" | "barangay" | "street";

export function CustomerForm({ customer, onSubmit, onCancel }: CustomerFormProps) {
  const { isDark } = useTheme();
  const [name, setName] = useState(customer?.name || "");
  const [phone, setPhone] = useState(customer?.phone || "");
  const [email, setEmail] = useState(customer?.email || "");
  const [region, setRegion] = useState(customer?.region || "");
  const [province, setProvince] = useState(customer?.province || "");
  const [city, setCity] = useState(customer?.city || "");
  const [barangay, setBarangay] = useState(customer?.barangay || "");
  const [street, setStreet] = useState(customer?.address || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isEditing = !!customer;
  const allFieldsFilled = region && province && city && barangay;
  const initialStep: AddressStep = allFieldsFilled ? "street" : "region";
  const [addressStep, setAddressStep] = useState<AddressStep>(initialStep);

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setPhone(customer.phone);
      setEmail(customer.email);
      setRegion(customer.region);
      setProvince(customer.province);
      setCity(customer.city);
      setBarangay(customer.barangay);
      setStreet(customer.address);
    }
  }, [customer]);

  const provinceOptions = region ? getProvincesByRegion(region) : [];
  const cityOptions = region ? getCitiesByRegion(region) : [];
  const barangayOptions = city ? getBarangaysByCity(city) : [];

  const handleRegionChange = (code: string) => {
    setRegion(code);
    setProvince("");
    setCity("");
    setBarangay("");
    setAddressStep("province");
  };

  const handleProvinceChange = (code: string) => {
    setProvince(code);
    setCity("");
    setBarangay("");
    setAddressStep("city");
  };

  const handleCityChange = (code: string) => {
    setCity(code);
    setBarangay("");
    setAddressStep("barangay");
  };

  const handleBarangayChange = (code: string) => {
    setBarangay(code);
    setAddressStep("street");
  };

  const handleSubmit = async () => {
    if (!name || !phone || !email || !region || !province || !city || !barangay) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await onSubmit({
        name,
        phone,
        email,
        region,
        province,
        city,
        barangay,
        address: street,
        avatar: customer?.avatar,
      });
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const Chip = ({
    label,
    onPress,
    editable,
  }: {
    label: string;
    onPress: () => void;
    editable: boolean;
  }) => (
    <TouchableOpacity
      className="flex-row items-center gap-1.5 bg-brand/20 rounded-full px-3 py-1.5 mr-2 mb-2"
      onPress={onPress}
      disabled={!editable}
    >
      <Text className={`text-xs font-medium text-${isDark ? "white" : "black"}`}>{label}</Text>
      {editable && <Text className={`text-${isDark ? "white/60" : "black/60"} text-xs`}>✕</Text>}
    </TouchableOpacity>
  );

  return (
    <ScrollView className="gap-2" showsVerticalScrollIndicator={false}>
      {error ? (
        <View className="bg-brand/5 rounded-xl p-3 mb-2 border border-brand/20">
          <Text className={`text-${isDark ? "white/80" : "black/80"} text-sm`}>{error}</Text>
        </View>
      ) : null}

      <Input label="Full Name" placeholder="Enter full name" value={name} onChangeText={setName} />
      <Input label="Phone" placeholder="+63 9XX XXX XXXX" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Input label="Email" placeholder="email@example.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />

      <View className="mb-2">
        <Text className={`text-sm font-medium text-${isDark ? "white/80" : "black/80"} mb-2`}>
          Address
        </Text>
        <View className="flex-row flex-wrap">
          {region ? <Chip label={getRegionName(region)} onPress={() => { setRegion(""); setProvince(""); setCity(""); setBarangay(""); setAddressStep("region"); }} editable={!isEditing} /> : null}
          {province ? <Chip label={getProvinceName(province)} onPress={() => { setProvince(""); setCity(""); setBarangay(""); setAddressStep("province"); }} editable={!isEditing} /> : null}
          {city ? <Chip label={getCityName(city)} onPress={() => { setCity(""); setBarangay(""); setAddressStep("city"); }} editable={!isEditing} /> : null}
          {barangay ? <Chip label={getBarangayName(barangay)} onPress={() => { setBarangay(""); setAddressStep("barangay"); }} editable={!isEditing} /> : null}
        </View>
      </View>

      {addressStep === "region" && !region && (
        <Select
          label="Region"
          options={regions
            .filter((r) => ["12", "13", "14", "15", "16", "17"].includes(r.code))
            .map((r) => ({ code: r.code, name: r.name }))}
          value={region}
          onSelect={handleRegionChange}
          placeholder="Select region"
        />
      )}

      {addressStep === "province" && region && !province && (
        <Select
          label="Province"
          options={provinceOptions.map((p) => ({ code: p.code, name: p.name }))}
          value={province}
          onSelect={handleProvinceChange}
          placeholder="Select province"
        />
      )}

      {addressStep === "city" && province && !city && (
        <Select
          label="City / Municipality"
          options={cityOptions.map((c) => ({ code: c.code, name: c.name }))}
          value={city}
          onSelect={handleCityChange}
          placeholder="Select city"
        />
      )}

      {addressStep === "barangay" && city && !barangay && (
        <Select
          label="Barangay"
          options={barangayOptions.map((b) => ({ code: b.code, name: b.name }))}
          value={barangay}
          onSelect={handleBarangayChange}
          placeholder="Select barangay"
        />
      )}

      {addressStep === "street" && barangay && (
        <Input label="Street / Building" placeholder="House number, street, building" value={street} onChangeText={setStreet} />
      )}

      <View className="flex-row gap-3 mt-2 pb-4">
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
    </ScrollView>
  );
}
