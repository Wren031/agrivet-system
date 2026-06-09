import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../context/AuthContext";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";

export function LoginScreen({ navigation }: any) {
  const { login } = useAuth();
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
      <SafeAreaView className="flex-1 bg-surface-50 dark:bg-surface-950">
        <View className="flex-1 items-center justify-center px-8">
          <View className="w-20 h-20 rounded-full bg-amber-100 dark:bg-amber-900/20 items-center justify-center mb-6">
            <Text className="text-4xl">⏳</Text>
          </View>
          <Text className="text-2xl font-bold text-surface-900 dark:text-surface-100 text-center mb-3">
            Awaiting Admin Approval
          </Text>
          <Text className="text-base text-surface-500 dark:text-surface-400 text-center mb-8">
            Your account is pending approval from an administrator. You will be able to access the
            application once your account has been reviewed.
          </Text>
          <TouchableOpacity
            onPress={() => {
              setShowPending(false);
              setEmail("");
              setPassword("");
            }}
            className="bg-surface-200 dark:bg-surface-700 rounded-xl px-6 py-3"
          >
            <Text className="text-surface-800 dark:text-surface-200 font-semibold">
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-surface-50 dark:bg-surface-950">
      <ScrollView contentContainerClassName="flex-grow px-8 pt-16 pb-8">
        <View className="mb-12">
          <View className="w-14 h-14 rounded-2xl bg-primary-600 items-center justify-center mb-4">
            <Text className="text-white text-2xl font-bold">A</Text>
          </View>
          <Text className="text-3xl font-bold text-surface-900 dark:text-surface-100">
            Welcome back
          </Text>
          <Text className="text-base text-surface-500 dark:text-surface-400 mt-2">
            Sign in to your Agrivet account
          </Text>
        </View>

        {error ? (
          <View className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-4">
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

        <View className="mt-2 mb-6">
          <Button title="Sign In" onPress={handleLogin} loading={loading} size="lg" />
        </View>

        <View className="flex-row items-center justify-center gap-1">
          <Text className="text-sm text-surface-500 dark:text-surface-400">
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text className="text-sm text-primary-600 dark:text-primary-400 font-semibold">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-12 bg-surface-100 dark:bg-surface-800 rounded-xl p-4">
          <Text className="text-xs font-semibold text-surface-500 dark:text-surface-400 mb-2 uppercase tracking-wider">
            Demo Accounts
          </Text>
          <View className="gap-1">
            <Text className="text-xs text-surface-600 dark:text-surface-300">
              Approved: admin@agrivet.com / admin123
            </Text>
            <Text className="text-xs text-surface-600 dark:text-surface-300">
              Approved: maria@agrivet.com / maria123
            </Text>
            <Text className="text-xs text-surface-600 dark:text-surface-300">
              Pending: juan@agrivet.com / juan123
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
