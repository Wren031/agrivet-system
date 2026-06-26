import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import { Customer } from "../../../types";
import { Input } from "../../../components/Input";
import { Select } from "../../../components/Select";
import { Button } from "../../../components/Button";
import { addressApi } from "../../../services/addressApi";
import { useTheme } from "../../../context/ThemeContext";

interface Option {
  code: string;
  name: string;
}

interface CustomerFormProps {
  customer?: Customer | null;
  onSubmit: (data: Omit<Customer, "id" | "createdAt">) => Promise<void>;
  onCancel: () => void;
}

function findName(options: Option[], code: string): string {
  return options.find((o) => o.code === code)?.name || code;
}

function findCode(options: Option[], name: string): string {
  return options.find((o) => o.name === name)?.code || name;
}

export function CustomerForm({ customer, onSubmit, onCancel }: CustomerFormProps) {
  const { isDark } = useTheme();
  const [name, setName] = useState(customer?.name || "");
  const [phone, setPhone] = useState(customer?.phone || "");
  const [storeName, setStoreName] = useState(customer?.storeName || "");
  
  // Address Codes (for cascading selects)
  const [regionCode, setRegionCode] = useState("");
  const [provinceCode, setProvinceCode] = useState("");
  const [cityCode, setCityCode] = useState("");
  const [barangayCode, setBarangayCode] = useState("");
  const [purok, setPurok] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Options States
  const [regionOptions, setRegionOptions] = useState<Option[]>([]);
  const [provinceOptions, setProvinceOptions] = useState<Option[]>([]);
  const [cityOptions, setCityOptions] = useState<Option[]>([]);
  const [barangayOptions, setBarangayOptions] = useState<Option[]>([]);

  // Loading States
  const [loadingRegions, setLoadingRegions] = useState(true);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingBarangays, setLoadingBarangays] = useState(false);

  // 1. Load All Regions on Mount
  useEffect(() => {
    setLoadingRegions(true);
    addressApi
      .getRegions()
      .then((regions) => {
        setRegionOptions(regions.map((r) => ({ code: r.code, name: r.name })));
      })
      .catch((e) => console.error("Failed to load regions", e))
      .finally(() => setLoadingRegions(false));
  }, []);

  // 2. Cascade Provinces
  useEffect(() => {
    if (!regionCode) {
      setProvinceOptions([]);
      return;
    }
    setLoadingProvinces(true);
    addressApi
      .getProvinces(regionCode)
      .then((provinces) => setProvinceOptions(provinces.map((p) => ({ code: p.code, name: p.name }))))
      .catch((e) => console.error("Failed to load provinces", e))
      .finally(() => setLoadingProvinces(false));
  }, [regionCode]);

  // 3. Cascade Cities/Municipalities
  useEffect(() => {
    if (!provinceCode) {
      setCityOptions([]);
      return;
    }
    setLoadingCities(true);
    Promise.all([addressApi.getMunicipalities(provinceCode), addressApi.getComponentCities(provinceCode)])
      .then(([municipalities, componentCities]) => {
        const all = [...municipalities, ...componentCities];
        setCityOptions(all.map((c) => ({ code: c.code, name: c.name })));
      })
      .catch((e) => console.error("Failed to load cities", e))
      .finally(() => setLoadingCities(false));
  }, [provinceCode]);

  // 4. Cascade Barangays
  useEffect(() => {
    if (!cityCode) {
      setBarangayOptions([]);
      return;
    }
    setLoadingBarangays(true);
    addressApi
      .getBarangays(cityCode)
      .then((barangays) => setBarangayOptions(barangays.map((b) => ({ code: b.code, name: b.name }))))
      .catch((e) => console.error("Failed to load barangays", e))
      .finally(() => setLoadingBarangays(false));
  }, [cityCode]);

  // Sync edits if customer prop changes (resolve stored names to codes for cascading)
  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setPhone(customer.phone);
      setStoreName(customer.storeName);
      setPurok(customer.address);
      // Try resolving stored names to codes; if options not yet loaded, just store names
      setRegionCode(findCode(regionOptions, customer.region));
      setProvinceCode(findCode(provinceOptions, customer.province));
      setCityCode(findCode(cityOptions, customer.city));
      setBarangayCode(findCode(barangayOptions, customer.barangay));
    }
  }, [customer, regionOptions, provinceOptions, cityOptions, barangayOptions]);

  // Input resets when parent level changes
  const handleRegionChange = (code: string) => {
    setRegionCode(code);
    setProvinceCode("");
    setCityCode("");
    setBarangayCode("");
  };

  const handleProvinceChange = (code: string) => {
    setProvinceCode(code);
    setCityCode("");
    setBarangayCode("");
  };

  const handleCityChange = (code: string) => {
    setCityCode(code);
    setBarangayCode("");
  };

  const handleBarangayChange = (code: string) => {
    setBarangayCode(code);
  };

  const handleSubmit = async () => {
    if (!name || !phone || !regionCode || !provinceCode || !cityCode || !barangayCode || !purok) {
      setError("Please fill in all required fields including house details/purok.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Resolve codes to readable names for storage
      const regionName = findName(regionOptions, regionCode);
      const provinceName = findName(provinceOptions, provinceCode);
      const cityName = findName(cityOptions, cityCode);
      const barangayName = findName(barangayOptions, barangayCode);
      await onSubmit({
        name,
        phone,
        storeName,
        region: regionName,
        province: provinceName,
        city: cityName,
        barangay: barangayName,
        address: purok,
        avatar: customer?.avatar,
      });
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="gap-4" showsVerticalScrollIndicator={false}>
      {error ? (
        <View className="bg-brand/5 rounded-xl p-3 mb-2 border border-brand/20">
          <Text className={`text-${isDark ? "white/80" : "black/80"} text-sm`}>{error}</Text>
        </View>
      ) : null}

      {/* Profile Details Section */}
      <Input label="Full Name" placeholder="Enter full name" value={name} onChangeText={setName} />
      <Input label="Phone" placeholder="+63 9XX XXX XXXX" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Input label="Store Name" placeholder="Enter store name" value={storeName} onChangeText={setStoreName} />

      {/* GCash Stacked Address Section */}
      <View className="mt-2 gap-3">
        <Text className={`text-sm font-semibold text-${isDark ? "white" : "black"}`}>
          Address Information
        </Text>

        {/* Region Select */}
        {loadingRegions ? (
          <ActivityIndicator size="small" className="py-2" color={isDark ? "#fff" : "#2d6a4f"} />
        ) : (
          <Select label="Region" options={regionOptions} value={regionCode} onSelect={handleRegionChange} placeholder="Select Region (e.g. Region 10)" />
        )}

        {/* Province Select (Disabled until region picked) */}
        {loadingProvinces ? (
          <ActivityIndicator size="small" className="py-2" color={isDark ? "#fff" : "#2d6a4f"} />
        ) : (
          <Select label="Province" options={provinceOptions} value={provinceCode} onSelect={handleProvinceChange} placeholder="Select Province (e.g. Bukidnon)" disabled={!regionCode} />
        )}

        {/* City/Municipality Select (Disabled until province picked) */}
        {loadingCities ? (
          <ActivityIndicator size="small" className="py-2" color={isDark ? "#fff" : "#2d6a4f"} />
        ) : (
          <Select label="City / Municipality" options={cityOptions} value={cityCode} onSelect={handleCityChange} placeholder="Select City / Municipality (e.g. Valencia City)" disabled={!provinceCode} />
        )}

        {/* Barangay Select (Disabled until city picked) */}
        {loadingBarangays ? (
          <ActivityIndicator size="small" className="py-2" color={isDark ? "#fff" : "#2d6a4f"} />
        ) : (
          <Select label="Barangay" options={barangayOptions} value={barangayCode} onSelect={handleBarangayChange} placeholder="Select Barangay (e.g. Poblacion)" disabled={!cityCode} />
        )}

        {/* Purok / Street Input */}
        <Input 
          label="Purok / Street / House No." 
          placeholder="e.g. p4" 
          value={purok} 
          onChangeText={setPurok} 
          editable={!!barangayCode}
        />
      </View>

      {/* Actions */}
      <View className="flex-row gap-3 mt-4 pb-6">
        <View className="flex-1">
          <Button title="Cancel" variant="secondary" onPress={onCancel} />
        </View>
        <View className="flex-1">
          <Button title={customer ? "Update" : "Create"} onPress={handleSubmit} loading={loading} />
        </View>
      </View>
    </ScrollView>
  );
}