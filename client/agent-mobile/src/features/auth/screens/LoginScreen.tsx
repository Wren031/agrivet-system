import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LogIn, Check } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    const loadSavedCredentials = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem("remembered_email");
        const savedPassword = await AsyncStorage.getItem("remembered_password");
        const savedRememberMe = await AsyncStorage.getItem("remember_me_status");

        if (savedRememberMe === "true") {
          setRememberMe(true);
          if (savedEmail) setEmail(savedEmail);
          if (savedPassword) setPassword(savedPassword);
        } else if (savedRememberMe === "false") {
          setRememberMe(false);
        }
      } catch (e) {
        console.error("Failed to load saved credentials", e);
      }
    };

    loadSavedCredentials();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");

    try {
      if (rememberMe) {
        await AsyncStorage.setItem("remembered_email", email);
        await AsyncStorage.setItem("remembered_password", password);
        await AsyncStorage.setItem("remember_me_status", "true");
      } else {
        await AsyncStorage.removeItem("remembered_email");
        await AsyncStorage.removeItem("remembered_password");
        await AsyncStorage.setItem("remember_me_status", "false");
      }
    } catch (e) {
      console.error("Failed to update credentials storage", e);
    }

    const result = await login(email, password, rememberMe);
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
      <SafeAreaView
        className={`flex-1 ${isDark ? "bg-[#0f172a]" : "bg-[#f8f9fa]"}`}
      >
        <View className="flex-1 items-center justify-center px-8">
          <View
            className={`w-full max-w-md rounded-3xl p-8 ${
              isDark
                ? "bg-[#1e293b] border border-white/[0.08]"
                : "bg-white shadow-xl shadow-black/5"
            }`}
          >
            <View className="items-center mb-6">
              <View className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/30 items-center justify-center mb-5">
                <Text className="text-3xl">⏳</Text>
              </View>
              <Text
                className={`text-xl font-bold text-center ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Awaiting Approval
              </Text>
              <Text
                className={`text-sm text-center mt-2 leading-5 ${
                  isDark ? "text-white/50" : "text-slate-500"
                }`}
              >
                Your account is pending approval from an administrator. You will
                be notified once your account has been reviewed.
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                logout();
                setShowPending(false);
                if (!rememberMe) {
                  setEmail("");
                  setPassword("");
                }
              }}
              className="bg-brand/5 border border-brand/20 rounded-xl px-6 py-3 items-center"
              activeOpacity={0.7}
            >
              <Text
                className={`font-semibold ${
                  isDark ? "text-white" : "text-brand"
                }`}
              >
                Back to Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className={`flex-1 ${isDark ? "bg-[#0f172a]" : "bg-[#f8f9fa]"}`}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerClassName="flex-grow"
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-8 py-10 max-w-md mx-auto w-full">
            <View className="items-center mb-10">
              <View className="w-16 h-16 rounded-2xl bg-brand items-center justify-center mb-5">
                <LogIn size={28} color="white" />
              </View>
              <Text
                className={`text-3xl font-bold text-center ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Welcome Back
              </Text>
              <Text
                className={`text-base mt-1.5 ${
                  isDark ? "text-white/50" : "text-slate-500"
                }`}
              >
                Sign in to your account
              </Text>
            </View>

            {error ? (
              <View
                className={`rounded-xl p-4 mb-6 border ${
                  isDark
                    ? "bg-red-500/10 border-red-500/20"
                    : "bg-red-50 border-red-200"
                }`}
              >
                <Text
                  className={`text-sm ${
                    isDark ? "text-red-400" : "text-red-600"
                  }`}
                >
                  {error}
                </Text>
              </View>
            ) : null}

            <Input
              label="Email Address"
              placeholder="you@example.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />

            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              className="flex-row items-center mt-1 mb-8"
              activeOpacity={0.7}
            >
              <View
                className={`w-5 h-5 rounded border-2 items-center justify-center mr-2.5 ${
                  rememberMe
                    ? "bg-brand border-brand"
                    : isDark
                      ? "border-white/25"
                      : "border-slate-300"
                }`}
              >
                {rememberMe && (
                  <Check size={13} color="white" strokeWidth={3} />
                )}
              </View>
              <Text
                className={`text-sm ${
                  isDark ? "text-white/60" : "text-slate-500"
                }`}
              >
                Remember me
              </Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleLogin}
              loading={loading}
              size="lg"
            />

            <View className="flex-row items-center justify-center mt-8">
              <Text
                className={`text-sm ${
                  isDark ? "text-white/50" : "text-slate-500"
                }`}
              >
                Don't have an account?{" "}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate("Register")}
              >
                <Text className="text-sm text-brand font-bold">
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
