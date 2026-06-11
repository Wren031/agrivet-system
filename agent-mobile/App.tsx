import "./global.css";
import React from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";
import { AuthProvider } from "./src/context/AuthContext";
import { AppNavigator } from "./src/navigation/AppNavigator";

function AppContent() {
  const { isDark } = useTheme();

  return (
    <View className={`flex-1 ${isDark ? "bg-black" : "bg-white"}`}>
      <StatusBar style={isDark ? "light" : "dark"} />
      <AppNavigator />
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <AppContent />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
