import React from "react";
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Camera, UserPlus } from "lucide-react-native";
import { useTheme } from "../../../context/ThemeContext";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { Select } from "../../../components/Select";
import { useRegisterForm } from "../hooks/useRegisterForm";

export function RegisterScreen({ navigation }: any) {
  const { isDark } = useTheme();
  const {
    fullName, setFullName,
    email, setEmail,
    contactNumber, setContactNumber,
    idImageUri, pickImage,
    password, setPassword,
    loading, error, handleRegister,
    regions, regionCode, onRegionSelect,
    provinces, provinceCode, onProvinceSelect,
    cities, cityCode, onCitySelect,
    barangays, barangayCode, onBarangaySelect,
  } = useRegisterForm();

  return (
    <SafeAreaView className={`flex-1 bg-${isDark ? "[#1e293b]" : "[#f4f7f5]"}`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerClassName="flex-grow px-6 pt-6 pb-8">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center rounded-full bg-brand/5 mb-6"
          >
            <ArrowLeft size={20} color="#2d6a4f" />
          </TouchableOpacity>

          <View className="mb-8">
            <View className="w-14 h-14 rounded-2xl bg-brand items-center justify-center mb-6">
              <UserPlus size={28} color="white" />
            </View>
            <Text className={`text-3xl font-bold text-${isDark ? "white" : "black"}`}>
              Create Account
            </Text>
            <Text className={`text-base text-${isDark ? "white/50" : "black/50"} mt-1.5`}>
              Fill in your details to get started
            </Text>
          </View>

          {error ? (
            <View className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-5 border border-red-200 dark:border-red-800">
              <Text className="text-red-600 dark:text-red-400 text-sm">{error}</Text>
            </View>
          ) : null}

          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Contact Number"
            placeholder="Enter your contact number"
            value={contactNumber}
            onChangeText={setContactNumber}
            keyboardType="phone-pad"
          />

          <Text className={`text-sm font-medium text-${isDark ? "white/80" : "black/80"} mb-1.5 mt-2`}>
            ID Verification Image <Text className="text-red-500">*</Text>
          </Text>
          <TouchableOpacity
            onPress={pickImage}
            className={`border-2 border-dashed rounded-xl items-center justify-center mb-4 overflow-hidden ${
              idImageUri
                ? "border-brand bg-brand/5"
                : isDark
                  ? "border-white/20 bg-[#1e293b]"
                  : "border-black/10 bg-gray-50"
            }`}
            activeOpacity={0.7}
          >
            {idImageUri ? (
              <View className="w-full">
                <Image
                  source={{ uri: idImageUri }}
                  className="w-full h-44"
                  resizeMode="cover"
                />
                <View className="absolute bottom-0 left-0 right-0 bg-black/50 px-4 py-2">
                  <Text className="text-white text-xs text-center">Tap to change image</Text>
                </View>
              </View>
            ) : (
              <View className="items-center py-8">
                <View className="w-12 h-12 rounded-full bg-brand/10 items-center justify-center mb-3">
                  <Camera size={22} color="#2d6a4f" />
                </View>
                <Text className={`text-sm text-${isDark ? "white/60" : "black/60"} font-medium`}>
                  Upload Government ID
                </Text>
                <Text className={`text-xs text-${isDark ? "white/40" : "black/40"} mt-1`}>
                  JPG, PNG or WEBP
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <Text className={`text-sm font-medium text-${isDark ? "white/80" : "black/80"} mb-3 mt-2`}>
            Address <Text className="text-red-500">*</Text>
          </Text>

          <Select
            label="Region"
            options={regions}
            value={regionCode}
            onSelect={onRegionSelect}
            placeholder="Select region"
          />

          {provinces.length > 0 && (
            <Select
              label="Province"
              options={provinces}
              value={provinceCode}
              onSelect={onProvinceSelect}
              placeholder="Select province"
            />
          )}

          {cities.length > 0 && (
            <Select
              label="City / Municipality"
              options={cities}
              value={cityCode}
              onSelect={onCitySelect}
              placeholder="Select city"
            />
          )}

          {barangays.length > 0 && (
            <Select
              label="Barangay"
              options={barangays}
              value={barangayCode}
              onSelect={onBarangaySelect}
              placeholder="Select barangay"
            />
          )}

          <Input
            label="Password"
            placeholder="Minimum 6 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View className="mt-6 mb-6">
            <Button title="Create Account" onPress={handleRegister} loading={loading} size="lg" />
          </View>

          <View className="flex-row items-center justify-center gap-1.5">
            <Text className={`text-sm text-${isDark ? "white/50" : "black/50"}`}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text className="text-sm text-brand font-bold">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-8 bg-amber-50 dark:bg-amber-900/10 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
            <Text className={`text-xs font-bold text-amber-700 dark:text-amber-400 mb-1`}>
              Note
            </Text>
            <Text className={`text-xs text-amber-600 dark:text-amber-500`}>
              New accounts require admin approval before you can access the application.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}