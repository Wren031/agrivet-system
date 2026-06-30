import React from "react";
import { View, Text, TouchableOpacity, Alert, Switch } from "react-native";
import { Moon, LogOut, Info, User, Lock } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { useAgentStatus } from "../../agents/hooks/useAgentStatus";
import { ScreenLayout } from "../../../components/ScreenLayout";
import { PageHeader } from "../../../components/PageHeader";
import { SettingsGroup, SettingsRow, SettingsDivider } from "../../../components/SettingsGroup";

export function SettingsScreen() {
  const navigation = useNavigation<any>();
  const { user, logout } = useAuth();
  const { setOffline } = useAgentStatus();
  const { isDark, toggleTheme } = useTheme();

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

  const initials = user?.fullName
    ? user.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "U";

  return (
    <ScreenLayout scroll withTabBarPadding>
      <PageHeader title="Settings" subtitle="Manage your profile and preferences" />

      <View className="px-5 mt-1">
        <View
          className={`rounded-2xl p-5 border overflow-hidden ${
            isDark ? "bg-white/5 border-white/10" : "bg-white border-black/5"
          }`}
          style={{
            shadowColor: "#1b4332",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: isDark ? 0 : 0.08,
            shadowRadius: 12,
            elevation: isDark ? 0 : 3,
          }}
        >
          <View className="flex-row items-center">
            <View
              className="w-16 h-16 rounded-2xl bg-brand items-center justify-center"
              style={{ shadowColor: "#1b4332", shadowOpacity: 0.25, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }}
            >
              <Text className="text-white text-2xl font-bold">{initials}</Text>
            </View>
            <View className="flex-1 ml-4">
              <Text className={`text-lg font-bold ${isDark ? "text-white" : "text-black"}`}>
                {user?.fullName}
              </Text>
              <Text className={`text-sm mt-0.5 ${isDark ? "text-white/55" : "text-black/55"}`}>
                {user?.email}
              </Text>
              {user?.address ? (
                <Text
                  className={`text-xs mt-1 ${isDark ? "text-white/35" : "text-black/35"}`}
                  numberOfLines={2}
                >
                  {user.address}
                </Text>
              ) : null}
            </View>
          </View>
        </View>
      </View>

      <SettingsGroup title="Account">
        <SettingsRow icon={User} label="Edit Profile" onPress={() => navigation.navigate("EditProfile")} />
        <SettingsDivider />
        <SettingsRow icon={Lock} label="Change Password" onPress={() => navigation.navigate("ChangePassword")} />
      </SettingsGroup>

      <SettingsGroup title="Appearance">
        <SettingsRow
          icon={Moon}
          label="Dark Mode"
          subtitle="Switch between light and dark theme"
          showChevron={false}
          rightElement={
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: "#D1D5DB", true: "rgba(27,67,50,0.35)" }}
              thumbColor={isDark ? "#1b4332" : "#FFFFFF"}
              ios_backgroundColor="#D1D5DB"
            />
          }
        />
      </SettingsGroup>

      <SettingsGroup title="About">
        <SettingsRow
          icon={Info}
          label="Agrivet"
          subtitle="Agriculture Management"
          value="v1.0.0"
          showChevron={false}
        />
      </SettingsGroup>

      <View className="px-5 mt-8 mb-4">
        <TouchableOpacity
          onPress={handleLogout}
          className={`flex-row items-center justify-center py-4 rounded-2xl border ${
            isDark ? "border-red-500/30 bg-red-500/10" : "border-red-200 bg-red-50"
          }`}
          activeOpacity={0.7}
        >
          <LogOut size={20} color="#EF4444" />
          <Text className="ml-2.5 text-base font-bold text-red-500">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScreenLayout>
  );
}
