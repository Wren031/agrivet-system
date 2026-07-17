import React, { useState, useEffect } from "react";
import { View, Text, ScrollView } from "react-native";
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

  const [regionCode, setRegionCode] = useState("");
  const [provinceCode, setProvinceCode] = useState("");
  const [cityCode, setCityCode] = useState("");
  const [barangayCode, setBarangayCode] = useState("");
  const [purok, setPurok] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [regionOptions, setRegionOptions] = useState<Option[]>([]);
  const [provinceOptions, setProvinceOptions] = useState<Option[]>([]);
  const [cityOptions, setCityOptions] = useState<Option[]>([]);
  const [barangayOptions, setBarangayOptions] = useState<Option[]>([]);

  const [loadingRegions, setLoadingRegions] = useState(true);
  const [loadingProvinces, setLoadingProvinces] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [loadingBarangays, setLoadingBarangays] = useState(false);

  useEffect(() => {
    setLoadingRegions(true);
    addressApi
      .getRegions()
      .then((regions) => {
        setRegionOptions(regions.map((r: any) => ({ code: r.code, name: r.name })));
      })
      .catch((e) => console.error("Failed to load regions", e))
      .finally(() => setLoadingRegions(false));
  }, []);

  useEffect(() => {
    if (!regionCode) {
      setProvinceOptions([]);
      return;
    }
    setLoadingProvinces(true);
    addressApi
      .getProvinces(regionCode)
      .then((provinces) => setProvinceOptions(provinces.map((p: any) => ({ code: p.code, name: p.name }))))
      .catch((e) => console.error("Failed to load provinces", e))
      .finally(() => setLoadingProvinces(false));
  }, [regionCode]);

  useEffect(() => {
    if (!provinceCode) {
      setCityOptions([]);
      return;
    }
    setLoadingCities(true);
    Promise.all([addressApi.getMunicipalities(provinceCode), addressApi.getComponentCities(provinceCode)])
      .then(([municipalities, componentCities]) => {
        const all = [...municipalities, ...componentCities];
        setCityOptions(all.map((c: any) => ({ code: c.code, name: c.name })));
      })
      .catch((e) => console.error("Failed to load cities", e))
      .finally(() => setLoadingCities(false));
  }, [provinceCode]);

  useEffect(() => {
    if (!cityCode) {
      setBarangayOptions([]);
      return;
    }
    setLoadingBarangays(true);
    addressApi
      .getBarangays(cityCode)
      .then((barangays) => setBarangayOptions(barangays.map((b: any) => ({ code: b.code, name: b.name }))))
      .catch((e) => console.error("Failed to load barangays", e))
      .finally(() => setLoadingBarangays(false));
  }, [cityCode]);

  useEffect(() => {
    if (customer) {
      setName(customer.name);
      setPhone(customer.phone);
      setStoreName(customer.storeName);
      setPurok(customer.address);
      setRegionCode(findCode(regionOptions, customer.region));
      setProvinceCode(findCode(provinceOptions, customer.province));
      setCityCode(findCode(cityOptions, customer.city));
      setBarangayCode(findCode(barangayOptions, customer.barangay));
    }
  }, [customer, regionOptions, provinceOptions, cityOptions, barangayOptions]);

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
    if (!name || !phone || !regionCode || !provinceCode || !cityCode || !barangayCode) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError("");
    try {
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
    <ScrollView className="gap-4" showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
      {error ? (
        <View
          className={`rounded-xl p-3 mb-2 border ${
            isDark
              ? "bg-red-500/10 border-red-500/20"
              : "bg-red-50 border-red-200"
          }`}
        >
          <Text className={`text-sm ${isDark ? "text-red-400" : "text-red-600"}`}>
            {error}
          </Text>
        </View>
      ) : null}

      <Input label="Full Name" placeholder="Enter full name" value={name} onChangeText={setName} />
      <Input label="Phone" placeholder="+63 9XX XXX XXXX" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
      <Input label="Store Name" placeholder="Enter store name (optional)" value={storeName} onChangeText={setStoreName} />

      <Text className={`text-sm font-bold uppercase tracking-wider ${isDark ? "text-white/40" : "text-slate-400"} mt-2 mb-1`}>
        Address Information
      </Text>

      <Select label="Region" options={regionOptions} value={regionCode} onSelect={handleRegionChange} placeholder="Select region" loading={loadingRegions} />
      <Select label="Province" options={provinceOptions} value={provinceCode} onSelect={handleProvinceChange} placeholder="Select province" disabled={!regionCode} loading={loadingProvinces} />
      <Select label="City / Municipality" options={cityOptions} value={cityCode} onSelect={handleCityChange} placeholder="Select city/municipality" disabled={!provinceCode} loading={loadingCities} />
      <Select label="Barangay" options={barangayOptions} value={barangayCode} onSelect={handleBarangayChange} placeholder="Select barangay" disabled={!cityCode} loading={loadingBarangays} />
      <Input label="Street / Purok / House No." placeholder="e.g. Purok 4, Mabini St." value={purok} onChangeText={setPurok} />

      <View className="flex-row gap-3 mt-4 pb-4">
        <View className="flex-1">
          <Button title="Cancel" variant="secondary" onPress={onCancel} />
        </View>
        <View className="flex-1">
          <Button title="Save Changes" onPress={handleSubmit} loading={loading} />
        </View>
      </View>
    </ScrollView>
  );
}
