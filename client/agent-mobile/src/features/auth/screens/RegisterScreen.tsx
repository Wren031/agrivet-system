import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, Camera, UserPlus, CheckCircle2, Info } from "lucide-react-native";
import { useTheme } from "../../../context/ThemeContext";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { Select } from "../../../components/Select";
import { useRegisterForm } from "../hooks/useRegisterForm";

export function RegisterScreen({ navigation }: any) {
  const { isDark } = useTheme();
  const [showApproval, setShowApproval] = useState(false);
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
    loadingRegions, loadingProvinces, loadingCities, loadingBarangays,
  } = useRegisterForm();

  const onRegister = async () => {
    const result = await handleRegister();
    if (result?.success && result.message === "pending_approval") {
      setShowApproval(true);
    }
  };

  if (showApproval) {
    return (
      <SafeAreaView
        className={`flex-1 ${isDark ? "bg-[#0f172a]" : "bg-[#f8f9fa]"}`}
      >
        <View className="flex-1 items-center justify-center px-8">
          <View
            className={`w-full max-w-md rounded-3xl p-8 ${
              isDark
                ? "bg-[#1e293b] border border-white/[0.08]"
                : "bg-white shadow-xl shadow-black/5"
            }`}
          >
            <View className="items-center mb-6">
              <View className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 items-center justify-center mb-5">
                <CheckCircle2 size={36} color="#16a34a" />
              </View>
              <Text
                className={`text-xl font-bold text-center ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Account Created!
              </Text>
              <Text
                className={`text-sm text-center mt-2 leading-5 ${
                  isDark ? "text-white/50" : "text-slate-500"
                }`}
              >
                Your account is pending approval from an administrator. You will
                be notified once your account has been reviewed.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                setShowApproval(false);
                navigation.goBack();
              }}
              className="bg-brand/5 border border-brand/20 rounded-xl px-6 py-3 items-center"
            >
              <Text
                className={`font-semibold ${
                  isDark ? "text-white" : "text-brand"
                }`}
              >
                Back to Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-[#0f172a]" : "bg-[#f8f9fa]"}`}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow"
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 items-center justify-center px-6 py-8">
            <View
              className={`w-full max-w-md rounded-3xl p-8 ${
                isDark
                  ? "bg-[#1e293b] border border-white/[0.08]"
                  : "bg-white shadow-xl shadow-black/5"
              }`}
            >
              <View className="flex-row items-center mb-6">
                <TouchableOpacity
                  onPress={() => navigation.goBack()}
                  className={`w-10 h-10 rounded-xl items-center justify-center ${
                    isDark ? "bg-white/5" : "bg-black/5"
                  }`}
                >
                  <ArrowLeft
                    size={20}
                    color={isDark ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.5)"}
                  />
                </TouchableOpacity>
                <View className="flex-1 items-center -ml-10">
                  <View className="w-12 h-12 rounded-2xl bg-brand items-center justify-center mb-1">
                    <UserPlus size={22} color="white" />
                  </View>
                </View>
              </View>

              <View className="items-center mb-6">
                <Text
                  className={`text-2xl font-bold text-center ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  Create Account
                </Text>
                <Text
                  className={`text-sm mt-1 ${
                    isDark ? "text-white/50" : "text-slate-500"
                  }`}
                >
                  Fill in your details to get started
                </Text>
              </View>

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

              <Text
                className={`text-xs font-bold uppercase tracking-wider mb-3 ${
                  isDark ? "text-white/40" : "text-slate-400"
                }`}
              >
                Personal Information
              </Text>

              <Input
                label="Full Name"
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
              <Input
                label="Email Address"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <Input
                label="Contact Number"
                placeholder="+63 9XX XXX XXXX"
                value={contactNumber}
                onChangeText={setContactNumber}
                keyboardType="phone-pad"
              />

              <Text
                className={`text-xs font-bold uppercase tracking-wider mb-3 mt-2 ${
                  isDark ? "text-white/40" : "text-slate-400"
                }`}
              >
                ID Verification
              </Text>

              <Text
                className={`text-sm font-semibold mb-1.5 ${
                  isDark ? "text-white/80" : "text-slate-700"
                }`}
              >
                Government ID <Text className="text-red-500">*</Text>
              </Text>
              <TouchableOpacity
                onPress={pickImage}
                className={`border-2 border-dashed rounded-xl items-center justify-center mb-4 overflow-hidden ${
                  idImageUri
                    ? "border-brand bg-brand/5"
                    : isDark
                      ? "border-white/10 bg-white/5"
                      : "border-slate-200 bg-white"
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
                    <View className="absolute bottom-0 left-0 right-0 bg-black/60 px-4 py-2.5">
                      <Text className="text-white text-xs text-center font-medium">
                        Tap to change image
                      </Text>
                    </View>
                  </View>
                ) : (
                  <View className="items-center py-8">
                    <View className="w-12 h-12 rounded-full bg-brand/10 items-center justify-center mb-3">
                      <Camera size={22} color="#2d6a4f" />
                    </View>
                    <Text
                      className={`text-sm font-medium ${
                        isDark ? "text-white/60" : "text-slate-600"
                      }`}
                    >
                      Upload Government ID
                    </Text>
                    <Text
                      className={`text-xs mt-1 ${
                        isDark ? "text-white/35" : "text-slate-400"
                      }`}
                    >
                      JPG, PNG or WEBP
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <Text
                className={`text-xs font-bold uppercase tracking-wider mb-3 mt-2 ${
                  isDark ? "text-white/40" : "text-slate-400"
                }`}
              >
                Address Information
              </Text>

              <Select
                label="Region"
                options={regions}
                value={regionCode}
                onSelect={onRegionSelect}
                placeholder="Select region"
                loading={loadingRegions}
              />

              <Select
                label="Province"
                options={provinces}
                value={provinceCode}
                onSelect={onProvinceSelect}
                placeholder="Select province"
                disabled={!regionCode}
                loading={loadingProvinces}
              />

              <Select
                label="City / Municipality"
                options={cities}
                value={cityCode}
                onSelect={onCitySelect}
                placeholder="Select city"
                disabled={!provinceCode}
                loading={loadingCities}
              />

              <Select
                label="Barangay"
                options={barangays}
                value={barangayCode}
                onSelect={onBarangaySelect}
                placeholder="Select barangay"
                disabled={!cityCode}
                loading={loadingBarangays}
              />

              <Text
                className={`text-xs font-bold uppercase tracking-wider mb-3 mt-2 ${
                  isDark ? "text-white/40" : "text-slate-400"
                }`}
              >
                Security
              </Text>

              <Input
                label="Password"
                placeholder="Minimum 6 characters"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              <View className="mt-4 mb-2">
                <Button
                  title="Create Account"
                  onPress={onRegister}
                  loading={loading}
                  size="lg"
                />
              </View>

              <View className="flex-row items-center justify-center mt-4">
                <Text
                  className={`text-sm ${
                    isDark ? "text-white/50" : "text-slate-500"
                  }`}
                >
                  Already have an account?{" "}
                </Text>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Text className="text-sm text-brand font-bold">Sign In</Text>
                </TouchableOpacity>
              </View>

              <View
                className={`mt-6 rounded-xl p-4 border ${
                  isDark
                    ? "bg-amber-500/5 border-amber-500/15"
                    : "bg-amber-50 border-amber-200"
                }`}
              >
                <View className="flex-row items-start gap-2.5">
                  <Info
                    size={16}
                    color={isDark ? "#fbbf24" : "#d97706"}
                    style={{ marginTop: 1 }}
                  />
                  <Text
                    className={`text-xs flex-1 leading-4 ${
                      isDark ? "text-amber-400/80" : "text-amber-700"
                    }`}
                  >
                    New accounts require admin approval before you can access the
                    application.
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
