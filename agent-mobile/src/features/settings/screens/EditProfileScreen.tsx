import React, { useState, useEffect, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { ArrowLeft } from "lucide-react-native";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { Select } from "../../../components/Select";
import { addressApi } from "../../../services/addressApi";

interface AddressOption {
  code: string;
  name: string;
}

interface EditProfileScreenProps {
  navigation: NativeStackNavigationProp<any>;
}

export function EditProfileScreen({ navigation }: EditProfileScreenProps) {
  const { isDark } = useTheme();
  const { user, updateUser } = useAuth();

  const [form, setForm] = useState({
    fullName: user?.fullName || "",
    email: user?.email || "",
    contactNumber: user?.contactNumber || "",
  });

  const [regions, setRegions] = useState<AddressOption[]>([]);
  const [provinces, setProvinces] = useState<AddressOption[]>([]);
  const [cities, setCities] = useState<AddressOption[]>([]);
  const [barangays, setBarangays] = useState<AddressOption[]>([]);

  const [address, setAddress] = useState({
    regionCode: "",
    provinceCode: "",
    cityCode: "",
    barangayCode: "",
    regionName: "",
    provinceName: "",
    cityName: "",
    barangayName: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    addressApi
      .getRegions()
      .then((data) => isMounted && setRegions(data))
      .catch((err) => console.error("Failed to fetch regions:", err));
    return () => { isMounted = false; };
  }, []);

  useEffect(() => {
    if (!address.regionCode) return;

    let isMounted = true;
    addressApi.getProvinces(address.regionCode).then((p) => {
      if (!isMounted) return;
      if (p.length > 0) {
        setProvinces(p);
      } else {
        setProvinces([]);
        addressApi.getCities(address.regionCode).then((c) => {
          if (!isMounted) return;
          setCities(c);
          if (c.length === 1) {
            handleAddressChange("cityCode", c[0].code);
          }
        });
      }
    });
  }, [address.regionCode]);

  useEffect(() => {
    if (!address.provinceCode) return;

    let isMounted = true;
    Promise.all([
      addressApi.getMunicipalities(address.provinceCode),
      addressApi.getComponentCities(address.provinceCode),
    ]).then(([municipalities, componentCities]) => {
      if (isMounted) {
        setCities([...municipalities, ...componentCities]);
      }
    });
  }, [address.provinceCode]);

  useEffect(() => {
    if (!address.cityCode) return;

    let isMounted = true;
    addressApi.getBarangays(address.cityCode).then((b) => {
      if (isMounted) setBarangays(b);
    });
  }, [address.cityCode]);

  const handleInputChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (key: keyof typeof address, code: string) => {
    setAddress((prev) => {
      const updated = { ...prev, [key]: code };

      if (key === "regionCode") {
        Object.assign(updated, {
          provinceCode: "", cityCode: "", barangayCode: "",
          provinceName: "", cityName: "", barangayName: "",
          regionName: regions.find((r) => r.code === code)?.name || "",
        });
        setProvinces([]); setCities([]); setBarangays([]);
      }
      else if (key === "provinceCode") {
        Object.assign(updated, {
          cityCode: "", barangayCode: "",
          cityName: "", barangayName: "",
          provinceName: provinces.find((p) => p.code === code)?.name || "",
        });
        setCities([]); setBarangays([]);
      }
      else if (key === "cityCode") {
        Object.assign(updated, {
          barangayCode: "", barangayName: "",
          cityName: cities.find((c) => c.code === code)?.name || "",
        });
        setBarangays([]);
      }
      else if (key === "barangayCode") {
        updated.barangayName = barangays.find((b) => b.code === code)?.name || "";
      }

      return updated;
    });
  };

  const handleSave = useCallback(async () => {
    setError(null);
    if (!form.fullName.trim()) {
      setError("Full name is required");
      return;
    }

    const { barangayName, cityName, provinceName, regionName } = address;
    const addressParts = [barangayName, cityName, provinceName, regionName].filter(Boolean);
    const finalAddress = addressParts.length > 0 ? addressParts.join(", ") : user?.address || "";

    setLoading(true);
    try {
      await updateUser({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        contactNumber: form.contactNumber.trim(),
        address: finalAddress,
      });
      navigation.goBack();
    } catch (e: any) {
      setError(e?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  }, [form, address, user, updateUser, navigation]);

  const textTheme = isDark ? "white" : "black";
  const dimTextTheme = isDark ? "white/50" : "black/50";

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
          Edit Profile
        </Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerClassName="flex-grow px-6 pt-6 pb-8">
          {error && (
            <View className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-5 border border-red-200 dark:border-red-800">
              <Text className="text-red-600 dark:text-red-400 text-sm">{error}</Text>
            </View>
          )}

          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={form.fullName}
            onChangeText={(val) => handleInputChange("fullName", val)}
            autoCapitalize="words"
          />
          <Input
            label="Email"
            placeholder="you@example.com"
            value={form.email}
            onChangeText={(val) => handleInputChange("email", val)}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Contact Number"
            placeholder="Enter your contact number"
            value={form.contactNumber}
            onChangeText={(val) => handleInputChange("contactNumber", val)}
            keyboardType="phone-pad"
          />

          <Text className={`text-sm font-medium text-${isDark ? "white/80" : "black/80"} mb-3 mt-2`}>
            Address
          </Text>

          {user?.address && !address.barangayCode && (
            <View className="bg-brand/5 rounded-xl p-3 mb-4 border border-brand/20">
              <Text className={`text-xs font-semibold text-${isDark ? "white/60" : "black/60"} mb-1`}>
                Current Address
              </Text>
              <Text className={`text-sm text-${textTheme}`}>
                {user.address}
              </Text>
              <Text className={`text-xs text-${isDark ? "white/40" : "black/40"} mt-1`}>
                Select a new address below to update
              </Text>
            </View>
          )}

          <Select
            label="Region"
            options={regions}
            value={address.regionCode}
            onSelect={(code) => handleAddressChange("regionCode", code)}
            placeholder="Select region"
          />

          {provinces.length > 0 && (
            <Select
              label="Province"
              options={provinces}
              value={address.provinceCode}
              onSelect={(code) => handleAddressChange("provinceCode", code)}
              placeholder="Select province"
            />
          )}

          {cities.length > 0 && (
            <Select
              label="City / Municipality"
              options={cities}
              value={address.cityCode}
              onSelect={(code) => handleAddressChange("cityCode", code)}
              placeholder="Select city"
            />
          )}

          {barangays.length > 0 && (
            <Select
              label="Barangay"
              options={barangays}
              value={address.barangayCode}
              onSelect={(code) => handleAddressChange("barangayCode", code)}
              placeholder="Select barangay"
            />
          )}

          <View className="mt-6 mb-6">
            <Button title="Save Changes" onPress={handleSave} loading={loading} size="lg" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
