import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft, LogIn } from "lucide-react-native";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";

export function LoginScreen({ navigation }: any) {
  const { login, logout, isPendingApproval } = useAuth();
  const { isDark } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPending, setShowPending] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");
    const result = await login(email, password);
    setLoading(false);
    if (!result.success) {
      if (result.message === "pending_approval") {
        setShowPending(true);
        return;
      }
      setError(result.message);
    }
  };

  if (showPending || isPendingApproval) {
    return (
      <SafeAreaView className={`flex-1 bg-${isDark ? "[#1e293b]" : "[#f4f7f5]"}`}>
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 items-center justify-center mb-6">
            <Text className="text-3xl">⏳</Text>
          </View>
          <Text className={`text-2xl font-bold text-${isDark ? "white" : "black"} text-center mb-3`}>
            Awaiting Approval
          </Text>
          <Text className={`text-base text-${isDark ? "white/60" : "black/60"} text-center leading-6 mb-8`}>
            Your account is pending approval from an administrator. You will be notified once your account has been reviewed.
          </Text>
          <TouchableOpacity
            onPress={() => {
              logout();
              setShowPending(false);
              setEmail("");
              setPassword("");
            }}
            className="bg-brand/5 border border-brand/20 rounded-xl px-6 py-3"
          >
            <Text className={`text-${isDark ? "white" : "black"} font-semibold`}>
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
              <LogIn size={28} color="white" />
            </View>
            <Text className={`text-3xl font-bold text-${isDark ? "white" : "black"}`}>
              Welcome Back
            </Text>
            <Text className={`text-base text-${isDark ? "white/50" : "black/50"} mt-1.5`}>
              Sign in to continue
            </Text>
          </View>

          {error ? (
            <View className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-5 border border-red-200 dark:border-red-800">
              <Text className="text-red-600 dark:text-red-400 text-sm">{error}</Text>
            </View>
          ) : null}

          <Input
            label="Email"
            placeholder="you@example.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View className="mt-6 mb-6">
            <Button title="Sign In" onPress={handleLogin} loading={loading} size="lg" />
          </View>

          <View className="flex-row items-center justify-center gap-1.5">
            <Text className={`text-sm text-${isDark ? "white/50" : "black/50"}`}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text className="text-sm text-brand font-bold">
                Create One
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
