import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView, Switch, TextInput, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Moon, LogOut, ChevronRight, X, Check, Info } from "lucide-react-native";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { useAgentStatus } from "../../agents/hooks/useAgentStatus";

export function SettingsScreen() {
  const { user, logout, updateUser } = useAuth();
  const { setOffline } = useAgentStatus();
  
  const { isDark, toggleTheme } = useTheme();
  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState(user?.fullName || "");
  const [editEmail, setEditEmail] = useState(user?.email || "");
  const [editAddress, setEditAddress] = useState(user?.address || "");

  const bg = isDark ? "bg-[#1e293b]" : "bg-[#f4f7f5]";
  const cardBg = isDark ? "bg-[#1e293b]" : "bg-[#f4f7f5]";
  const textPrimary = isDark ? "text-white" : "text-black";
  const textSecondary = isDark ? "text-white/50" : "text-black/50";
  const textTertiary = isDark ? "text-white/30" : "text-black/30";
  const border = isDark ? "border-white/10" : "border-black/10";
  const inputBg = isDark ? "bg-[#1e293b]" : "bg-[#e8ece9]";
  const divider = isDark ? "bg-white/10" : "bg-black/5";

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await setOffline();
          logout();
        },
      },
    ]);
  };

  const openEditProfile = () => {
    setEditName(user?.fullName || "");
    setEditEmail(user?.email || "");
    setEditAddress(user?.address || "");
    setShowEditModal(true);
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      Alert.alert("Validation", "Name cannot be empty.");
      return;
    }
    await updateUser({
      fullName: editName.trim(),
      email: editEmail.trim(),
      address: editAddress.trim(),
    });
    setShowEditModal(false);
  };

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <SafeAreaView className={`flex-1 ${bg}`}>
      <ScrollView className="flex-1">
        <View className="px-6 pt-4 pb-3">
          <Text className={`text-2xl font-bold ${textPrimary}`}>Settings</Text>
          <Text className={`text-sm ${textSecondary} mt-0.5`}>Manage your profile & preferences</Text>
        </View>

        <View className="px-6 mt-2">
          {/* Profile Card */}
          <TouchableOpacity
            onPress={openEditProfile}
            className={`flex-row items-center p-4 rounded-2xl ${cardBg} border ${border} shadow-sm`}
            activeOpacity={0.7}
          >
            <View className="w-14 h-14 rounded-full bg-brand items-center justify-center">
              <Text className="text-white text-xl font-bold">{initials}</Text>
            </View>
            <View className="flex-1 ml-4">
              <Text className={`text-base font-bold ${textPrimary}`}>{user?.fullName}</Text>
              <Text className={`text-sm ${textSecondary} mt-0.5`}>{user?.email}</Text>
              {user?.address ? (
                <Text className={`text-xs ${textTertiary} mt-0.5`}>{user.address}</Text>
              ) : null}
            </View>
            <View className="ml-2">
              <ChevronRight size={18} color={isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.3)"} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Appearance Section */}
        <View className="px-6 mt-8">
          <Text className={`text-xs font-bold ${textTertiary} uppercase tracking-widest mb-3`}>Appearance</Text>
          <View className={`rounded-2xl ${cardBg} border ${border} shadow-sm overflow-hidden`}>
            <View className="flex-row items-center justify-between px-4 py-4">
              <View className="flex-row items-center gap-3">
                <Moon size={20} color={isDark ? "rgba(255,255,255,0.7)" : "#2d6a4f"} />
                <Text className={`text-base font-medium ${textPrimary}`}>Dark Mode</Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: "#D1D5DB", true: "rgba(45,106,79,0.4)" }}
                thumbColor={isDark ? "#2d6a4f" : "#F9FAFB"}
              />
            </View>
          </View>
        </View>

        {/* App Info Section */}
        <View className="px-6 mt-8">
          <Text className={`text-xs font-bold ${textTertiary} uppercase tracking-widest mb-3`}>About</Text>
          <View className={`rounded-2xl ${cardBg} border ${border} shadow-sm`}>
            <View className="flex-row items-center px-4 py-4">
              <Info size={20} color={isDark ? "rgba(255,255,255,0.7)" : "#2d6a4f"} />
              <View className="flex-1 ml-3">
                <Text className={`text-base font-medium ${textPrimary}`}>Agrivet</Text>
                <Text className={`text-xs ${textTertiary} mt-0.5`}>Agriculture Management</Text>
              </View>
              <Text className={`text-sm ${textSecondary}`}>1.0.0</Text>
            </View>
          </View>
        </View>

        {/* Logout */}
        <View className="px-6 mt-8 mb-12">
          <TouchableOpacity
            onPress={handleLogout}
            className={`flex-row items-center justify-center py-4 rounded-2xl border ${border} shadow-sm ${cardBg}`}
            activeOpacity={0.7}
          >
            <LogOut size={20} color="#EF4444" />
            <Text className="ml-2.5 text-base font-bold text-[#EF4444]">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Edit Profile Modal */}
      {showEditModal && (
        <View className={`absolute inset-0 ${isDark ? "bg-black/70" : "bg-black/40"}`}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 justify-end"
          >
            <TouchableOpacity
              className="flex-1"
              activeOpacity={1}
              onPress={() => setShowEditModal(false)}
            />
            <View
              className={`rounded-t-3xl p-6 ${cardBg}`}
              style={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
            >
              <View className="flex-row items-center justify-between mb-6">
                <Text className={`text-xl font-bold ${textPrimary}`}>Edit Profile</Text>
                <TouchableOpacity onPress={() => setShowEditModal(false)}>
                  <X size={22} color={isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.5)"} />
                </TouchableOpacity>
              </View>

              <View className={inputBg + " rounded-xl px-4 py-1 mb-4"}>
                <Text className={`text-xs ${textTertiary} mt-2 mb-0.5`}>Full Name</Text>
                <TextInput
                  className={`text-base ${textPrimary} py-2`}
                  value={editName}
                  onChangeText={setEditName}
                  placeholderTextColor={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
                  placeholder="Enter your name"
                />
              </View>

              <View className={inputBg + " rounded-xl px-4 py-1 mb-4"}>
                <Text className={`text-xs ${textTertiary} mt-2 mb-0.5`}>Email</Text>
                <TextInput
                  className={`text-base ${textPrimary} py-2`}
                  value={editEmail}
                  onChangeText={setEditEmail}
                  placeholderTextColor={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
                  placeholder="Enter your email"
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View className={inputBg + " rounded-xl px-4 py-1 mb-6"}>
                <Text className={`text-xs ${textTertiary} mt-2 mb-0.5`}>Address</Text>
                <TextInput
                  className={`text-base ${textPrimary} py-2`}
                  value={editAddress}
                  onChangeText={setEditAddress}
                  placeholderTextColor={isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"}
                  placeholder="Enter your address"
                />
              </View>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => setShowEditModal(false)}
                  className={`flex-1 py-3.5 rounded-xl border ${border} items-center`}
                  activeOpacity={0.7}
                >
                  <Text className={`text-base font-bold ${textSecondary}`}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSaveProfile}
                  className="flex-1 py-3.5 rounded-xl bg-brand items-center flex-row justify-center"
                  activeOpacity={0.85}
                >
                  <Check size={18} color="#FFFFFF" />
                  <Text className="text-white text-base font-bold ml-2">Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      )}
    </SafeAreaView>
  );
}
