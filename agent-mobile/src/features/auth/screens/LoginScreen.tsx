import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";

export function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
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

  if (showPending) {
    return (
      <SafeAreaView className={`flex-1 bg-${isDark ? "[#1A1A1A]" : "white"}`}>
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-20 h-20 rounded-full bg-brand/5 items-center justify-center mb-6 border border-brand/20">
            <Text className="text-4xl opacity-40">⏳</Text>
          </View>
          <Text className={`text-2xl font-bold text-${isDark ? "white" : "black"} text-center mb-3`}>
            Awaiting Admin Approval
          </Text>
          <Text className={`text-base text-${isDark ? "white/60" : "black/60"} text-center mb-8`}>
            Your account is pending approval from an administrator. You will be able to access the
            application once your account has been reviewed.
          </Text>
          <TouchableOpacity
            onPress={() => {
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
    <SafeAreaView className={`flex-1 bg-${isDark ? "[#1A1A1A]" : "white"}`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView contentContainerClassName="flex-grow px-8 pt-12 pb-8">
          <View className="mb-10">
            <Text className={`text-4xl font-bold text-${isDark ? "white" : "black"}`}>
              Welcome back
            </Text>
            <Text className={`text-base text-${isDark ? "white/60" : "black/60"} mt-2`}>
              Sign in to your Agrivet account
            </Text>
          </View>

          {error ? (
            <View className="bg-brand/5 rounded-xl p-4 mb-4 border border-brand/20">
              <Text className={`text-${isDark ? "white/80" : "black/80"} text-sm`}>{error}</Text>
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

          <View className="mt-4 mb-6">
            <Button title="Sign In" onPress={handleLogin} loading={loading} size="lg" />
          </View>

          <View className="flex-row items-center justify-center gap-1">
            <Text className={`text-sm text-${isDark ? "white/60" : "black/60"}`}>
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text className={`text-sm text-${isDark ? "white" : "black"} font-bold`}>
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-12 bg-brand/5 rounded-xl p-4 border border-brand/20">
            <Text className={`text-xs font-bold text-${isDark ? "white/60" : "black/60"} mb-2 uppercase tracking-wider`}>
              Demo Accounts
            </Text>
            <View className="gap-1">
              <Text className={`text-xs text-${isDark ? "white/70" : "black/70"}`}>
                Approved: admin@agrivet.com / admin123
              </Text>
              <Text className={`text-xs text-${isDark ? "white/70" : "black/70"}`}>
                Approved: maria@agrivet.com / maria123
              </Text>
              <Text className={`text-xs text-${isDark ? "white/70" : "black/70"}`}>
                Pending: juan@agrivet.com / juan123
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
