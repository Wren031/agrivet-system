import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { useTheme } from "../../../context/ThemeContext";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { authApi } from "../../auth/services/authApi";

export function ChangePasswordScreen({ navigation }: any) {
  const { isDark } = useTheme();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChangePassword = async () => {
    setError("");
    if (!currentPassword.trim()) {
      setError("Current password is required");
      return;
    }
    if (!newPassword.trim() || newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await authApi.changePassword(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      navigation.goBack();
    } catch (e: any) {
      setError(e.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

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
          Change Password
        </Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerClassName="flex-grow px-6 pt-6 pb-8">
          {error ? (
            <View className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-5 border border-red-200 dark:border-red-800">
              <Text className="text-red-600 dark:text-red-400 text-sm">{error}</Text>
            </View>
          ) : null}

          <Input
            label="Current Password"
            placeholder="Enter current password"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
          />
          <Input
            label="New Password"
            placeholder="Minimum 6 characters"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <Input
            label="Confirm New Password"
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <View className="mt-6 mb-6">
            <Button title="Update Password" onPress={handleChangePassword} loading={loading} size="lg" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
