import React from "react";
import { View, Text, TouchableOpacity, Switch, Alert, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../../../context/ThemeContext";
import { useAuth } from "../../../context/AuthContext";

export function SettingsScreen() {
  const { mode, toggleTheme, isDark } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-50 dark:bg-surface-950">
      <ScrollView>
        <View className="px-6 pt-4 pb-3">
          <Text className="text-2xl font-bold text-surface-900 dark:text-surface-100">
            Settings
          </Text>
          <Text className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
            Manage your preferences
          </Text>
        </View>

        <View className="px-6 mt-4">
          <View className="bg-white dark:bg-surface-800 rounded-2xl p-5 border border-surface-100 dark:border-surface-700 mb-4">
            <Text className="text-xs text-surface-400 dark:text-surface-500 uppercase tracking-wider mb-4">
              Appearance
            </Text>
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-base font-medium text-surface-900 dark:text-surface-100">
                  Dark Mode
                </Text>
                <Text className="text-sm text-surface-500 dark:text-surface-400 mt-0.5">
                  {isDark ? "Currently dark" : "Currently light"}
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: "#e2e8f0", true: "#0ea5e9" }}
                thumbColor={isDark ? "#ffffff" : "#f1f5f9"}
              />
            </View>
          </View>

          <View className="bg-white dark:bg-surface-800 rounded-2xl p-5 border border-surface-100 dark:border-surface-700 mb-4">
            <Text className="text-xs text-surface-400 dark:text-surface-500 uppercase tracking-wider mb-4">
              Account
            </Text>
            <View className="mb-3">
              <Text className="text-sm text-surface-500 dark:text-surface-400">Name</Text>
              <Text className="text-base font-medium text-surface-900 dark:text-surface-100">
                {user?.fullName}
              </Text>
            </View>
            <View className="mb-3">
              <Text className="text-sm text-surface-500 dark:text-surface-400">Email</Text>
              <Text className="text-base font-medium text-surface-900 dark:text-surface-100">
                {user?.email}
              </Text>
            </View>
            <View className="mb-4">
              <Text className="text-sm text-surface-500 dark:text-surface-400">Role</Text>
              <Text className="text-base font-medium text-surface-900 dark:text-surface-100 capitalize">
                {user?.role}
              </Text>
            </View>
          </View>

          <View className="bg-white dark:bg-surface-800 rounded-2xl p-5 border border-surface-100 dark:border-surface-700 mb-4">
            <Text className="text-xs text-surface-400 dark:text-surface-500 uppercase tracking-wider mb-4">
              App Info
            </Text>
            <View className="flex-row justify-between mb-2">
              <Text className="text-sm text-surface-600 dark:text-surface-400">Version</Text>
              <Text className="text-sm text-surface-900 dark:text-surface-100">1.0.0</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-sm text-surface-600 dark:text-surface-400">Build</Text>
              <Text className="text-sm text-surface-900 dark:text-surface-100">2025.06</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-4 border border-red-200 dark:border-red-800 mb-8"
          >
            <Text className="text-center text-red-600 dark:text-red-400 font-semibold">
              Logout
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
