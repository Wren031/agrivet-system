import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../../context/AuthContext";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";

export function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!fullName || !email || !address || !password) {
      setError("Please fill in all fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");
    const result = await register(fullName, email, address, password);
    setLoading(false);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-surface-50 dark:bg-surface-950">
      <ScrollView contentContainerClassName="flex-grow px-8 pt-16 pb-8">
        <View className="mb-10">
          <View className="w-14 h-14 rounded-2xl bg-primary-600 items-center justify-center mb-4">
            <Text className="text-white text-2xl font-bold">A</Text>
          </View>
          <Text className="text-3xl font-bold text-surface-900 dark:text-surface-100">
            Create Account
          </Text>
          <Text className="text-base text-surface-500 dark:text-surface-400 mt-2">
            Join Agrivet management platform
          </Text>
        </View>

        {error ? (
          <View className="bg-red-50 dark:bg-red-900/20 rounded-xl p-4 mb-4">
            <Text className="text-red-600 dark:text-red-400 text-sm">{error}</Text>
          </View>
        ) : null}

        <Input
          label="Full Name"
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
        <Input
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Address"
          placeholder="Enter your address"
          value={address}
          onChangeText={setAddress}
        />
        <Input
          label="Password"
          placeholder="Minimum 6 characters"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <View className="mt-2 mb-6">
          <Button title="Create Account" onPress={handleRegister} loading={loading} size="lg" />
        </View>

        <View className="flex-row items-center justify-center gap-1">
          <Text className="text-sm text-surface-500 dark:text-surface-400">
            Already have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text className="text-sm text-primary-600 dark:text-primary-400 font-semibold">
              Sign In
            </Text>
          </TouchableOpacity>
        </View>

        <View className="mt-8 bg-amber-50 dark:bg-amber-900/10 rounded-xl p-4 border border-amber-200 dark:border-amber-800">
          <Text className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">
            ℹ️ Note
          </Text>
          <Text className="text-xs text-amber-600 dark:text-amber-500">
            New accounts require admin approval before you can access the application.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
