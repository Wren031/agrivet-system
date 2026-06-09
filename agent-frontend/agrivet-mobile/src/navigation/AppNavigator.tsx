import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Text, View } from "react-native";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

import { LoginScreen } from "../features/auth/screens/LoginScreen";
import { RegisterScreen } from "../features/auth/screens/RegisterScreen";
import { CustomerListScreen } from "../features/customers/screens/CustomerListScreen";
import { ItemGridScreen } from "../features/items/screens/ItemGridScreen";
import { BookingListScreen } from "../features/bookings/screens/BookingListScreen";
import { BookingDetailScreen } from "../features/bookings/screens/BookingDetailScreen";
import { HistoryListScreen } from "../features/history/screens/HistoryListScreen";
import { SettingsScreen } from "../features/settings/screens/SettingsScreen";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Bookings: "📋",
    Customers: "👥",
    Items: "📦",
    History: "📜",
    Settings: "⚙️",
  };
  return (
    <View className="items-center">
      <Text className={`text-xl ${focused ? "opacity-100" : "opacity-50"}`}>
        {icons[label] || "📄"}
      </Text>
      <Text
        className={`text-[10px] mt-0.5 ${
          focused
            ? "text-primary-600 dark:text-primary-400 font-semibold"
            : "text-surface-400 dark:text-surface-500"
        }`}
      >
        {label}
      </Text>
    </View>
  );
}

function MainTabs() {
  const { isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: isDark ? "#1e293b" : "#ffffff",
          borderTopColor: isDark ? "#334155" : "#e2e8f0",
          paddingBottom: 8,
          paddingTop: 8,
          height: 72,
        },
      }}
    >
      <Tab.Screen
        name="Bookings"
        component={BookingListScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Bookings" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Customers"
        component={CustomerListScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Customers" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Items"
        component={ItemGridScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Items" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryListScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="History" focused={focused} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarIcon: ({ focused }) => <TabIcon label="Settings" focused={focused} />,
        }}
      />
    </Tab.Navigator>
  );
}

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}

function AppStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainTabs" component={MainTabs} />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  const { isAuthenticated, isPendingApproval } = useAuth();

  if (isPendingApproval) {
    return (
      <NavigationContainer>
        <AuthStack />
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
}
