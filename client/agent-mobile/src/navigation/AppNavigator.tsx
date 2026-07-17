import React, { useMemo } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Platform, View } from "react-native";
import {
  Home,
  Users,
  Package,
  History,
  Settings,
} from "lucide-react-native";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getTabBarStyle } from "./tabBarStyles";
import { LoginScreen } from "../features/auth/screens/LoginScreen";
import { RegisterScreen } from "../features/auth/screens/RegisterScreen";
import { CustomerListScreen } from "../features/customers/screens/CustomerListScreen";
import { AddCustomerScreen } from "../features/customers/screens/AddCustomerScreen";
import { CustomerConfirmationScreen } from "../features/customers/screens/CustomerConfirmationScreen";
import { ItemGridScreen } from "../features/items/screens/ItemGridScreen";
import { ItemDetailScreen } from "../features/items/screens/ItemDetailScreen";
import { HomeScreen } from "../features/home/screens/HomeScreen";
import { BookingDetailScreen } from "../features/bookings/screens/BookingDetailScreen";
import { CreateBookingScreen } from "../features/bookings/screens/CreateBookingScreen";
import { MyBookingsScreen } from "../features/bookings/screens/MyBookingsScreen";
import { HistoryListScreen } from "../features/history/screens/HistoryListScreen";
import { SettingsScreen } from "../features/settings/screens/SettingsScreen";
import { EditProfileScreen } from "../features/settings/screens/EditProfileScreen";
import { ChangePasswordScreen } from "../features/settings/screens/ChangePasswordScreen";

const NoLabel = () => null;

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const brand = "#2d6a4f";
const brand60 = "rgba(45,106,79,0.6)";

const itemsTabBarIcon = ({ focused }: { focused: boolean }) => {
  const { isDark } = useTheme();
  return (
    <View
      style={{
        top: Platform.OS === "ios" ? -14 : -18,
        width: 58,
        height: 58,
        borderRadius: 29,
        backgroundColor: focused ? brand : "rgba(45,106,79,0.08)",
        justifyContent: "center",
        alignItems: "center",
        shadowColor: focused ? brand : "#2d6a4f",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: focused ? 0.4 : 0.08,
        shadowRadius: 5,
        elevation: 6,
        borderWidth: 3,
        borderColor: isDark ? "#0f172a" : "#FFFFFF",
      }}
    >
      <Package
        color={focused ? "#FFFFFF" : brand}
        size={24}
        strokeWidth={2.2}
      />
    </View>
  );
};

const homeTabBarIcon = ({ color, size }: { color: string; size: number }) => (
  <Home color={color} size={size} strokeWidth={2} />
);
const customersTabBarIcon = ({ color, size }: { color: string; size: number }) => (
  <Users color={color} size={size} strokeWidth={2} />
);
const historyTabBarIcon = ({ color, size }: { color: string; size: number }) => (
  <History color={color} size={size} strokeWidth={2} />
);
const settingsTabBarIcon = ({ color, size }: { color: string; size: number }) => (
  <Settings color={color} size={size} strokeWidth={2} />
);

function MainTabs() {
  const { isDark } = useTheme();

  const screenOptions = useMemo(() => ({
    headerShown: false,
    lazy: false,
    tabBarActiveTintColor: brand,
    tabBarInactiveTintColor: brand60,
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: "500" as const,
      marginBottom: Platform.OS === "ios" ? 0 : 6,
    },
    tabBarStyle: getTabBarStyle(isDark),
  }), [isDark]);

  return (
    <Tab.Navigator screenOptions={screenOptions}>
      <Tab.Screen
        name="Bookings"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: homeTabBarIcon,
        }}
      />
      <Tab.Screen
        name="Customers"
        component={CustomerListScreen}
        options={{
          tabBarLabel: "Customers",
          tabBarIcon: customersTabBarIcon,
        }}
      />
      <Tab.Screen
        name="Items"
        component={ItemGridScreen}
        options={{
          tabBarLabel: NoLabel,
          tabBarIcon: itemsTabBarIcon,
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryListScreen}
        options={{
          tabBarLabel: "History",
          tabBarIcon: historyTabBarIcon,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: settingsTabBarIcon,
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
      <Stack.Screen name="AddCustomer" component={AddCustomerScreen} />
      <Stack.Screen name="CustomerConfirmation" component={CustomerConfirmationScreen} />
      <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
      <Stack.Screen name="CreateBooking" component={CreateBookingScreen} />
      <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
      <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  const { isAuthenticated, isPendingApproval } = useAuth();

  return (
    <NavigationContainer>
      {isPendingApproval ? (
        <AuthStack />
      ) : isAuthenticated ? (
        <AppStack />
      ) : (
        <AuthStack />
      )}
    </NavigationContainer>
  );
}
