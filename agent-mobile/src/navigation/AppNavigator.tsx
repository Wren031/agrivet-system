import React, { lazy, Suspense } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { Platform, View, ActivityIndicator } from "react-native";
import {
  Home,
  Users,
  Package,
  History,
  Settings,
} from "lucide-react-native";

import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const LoginScreen = lazy(() =>
  import("../features/auth/screens/LoginScreen").then((m) => ({ default: m.LoginScreen }))
);
const RegisterScreen = lazy(() =>
  import("../features/auth/screens/RegisterScreen").then((m) => ({ default: m.RegisterScreen }))
);
const CustomerListScreen = lazy(() =>
  import("../features/customers/screens/CustomerListScreen").then((m) => ({ default: m.CustomerListScreen }))
);
const ItemGridScreen = lazy(() =>
  import("../features/items/screens/ItemGridScreen").then((m) => ({ default: m.ItemGridScreen }))
);
const ItemDetailScreen = lazy(() =>
  import("../features/items/screens/ItemDetailScreen").then((m) => ({ default: m.ItemDetailScreen }))
);
const HomeScreen = lazy(() =>
  import("../features/home/screens/HomeScreen").then((m) => ({ default: m.HomeScreen }))
);
const BookingDetailScreen = lazy(() =>
  import("../features/bookings/screens/BookingDetailScreen").then((m) => ({ default: m.BookingDetailScreen }))
);
const CreateBookingScreen = lazy(() =>
  import("../features/bookings/screens/CreateBookingScreen").then((m) => ({ default: m.CreateBookingScreen }))
);
const MyBookingsScreen = lazy(() =>
  import("../features/bookings/screens/MyBookingsScreen").then((m) => ({ default: m.MyBookingsScreen }))
);
const HistoryListScreen = lazy(() =>
  import("../features/history/screens/HistoryListScreen").then((m) => ({ default: m.HistoryListScreen }))
);
const SettingsScreen = lazy(() =>
  import("../features/settings/screens/SettingsScreen").then((m) => ({ default: m.SettingsScreen }))
);

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const brand = "#2d6a4f";
const brand60 = "rgba(45,106,79,0.6)";

function MainTabs() {
  const { isDark } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: brand,
        tabBarInactiveTintColor: brand60,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "500",
          marginBottom: Platform.OS === "ios" ? 0 : 6,
        },
        tabBarStyle: {
          backgroundColor: isDark ? "#1e293b" : "#f4f7f5",
          borderTopColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(45,106,79,0.15)",
          elevation: 10,
          shadowColor: isDark ? "#000" : "#2d6a4f",
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.08,
          shadowRadius: 6,
          height: Platform.OS === "ios" ? 88 : 68,
          paddingTop: 8,
          paddingBottom: Platform.OS === "ios" ? 28 : 8,
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
        },
      }}
    >
      <Tab.Screen
        name="Bookings"
        component={HomeScreen}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tab.Screen
        name="Customers"
        component={CustomerListScreen}
        options={{
          tabBarLabel: "Customers",
          tabBarIcon: ({ color, size }) => (
            <Users color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tab.Screen
        name="Items"
        component={ItemGridScreen}
        options={{
          tabBarLabel: () => null,
          tabBarIcon: ({ focused }) => {
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
                  borderColor: isDark ? "#1e293b" : "#FFFFFF",
                }}
              >
                <Package
                  color={focused ? "#FFFFFF" : brand}
                  size={24}
                  strokeWidth={2.2}
                />
              </View>
            );
          },
        }}
      />
      <Tab.Screen
        name="History"
        component={HistoryListScreen}
        options={{
          tabBarLabel: "History",
          tabBarIcon: ({ color, size }) => (
            <History color={color} size={size} strokeWidth={2} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Settings color={color} size={size} strokeWidth={2} />
          ),
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
      <Stack.Screen name="CreateBooking" component={CreateBookingScreen} />
      <Stack.Screen name="MyBookings" component={MyBookingsScreen} />
      <Stack.Screen name="ItemDetail" component={ItemDetailScreen} />
    </Stack.Navigator>
  );
}

export function AppNavigator() {
  const { isAuthenticated, isPendingApproval } = useAuth();

  return (
    <Suspense fallback={<ActivityIndicator style={{ flex: 1 }} />}>
      <NavigationContainer>
        {isPendingApproval ? (
          <AuthStack />
        ) : isAuthenticated ? (
          <AppStack />
        ) : (
          <AuthStack />
        )}
      </NavigationContainer>
    </Suspense>
  );
}
