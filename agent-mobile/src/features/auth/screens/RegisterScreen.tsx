import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeft } from "lucide-react-native";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";

export function RegisterScreen({ navigation }: any) {
  const { register } = useAuth();
  const { isDark } = useTheme();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [idVerificationUrl, setIdVerificationUrl] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    if (!fullName || !email || !contactNumber || !password) {
      setError("Please fill in all required fields");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");
    const result = await register(fullName, email, contactNumber, password, idVerificationUrl || undefined);
    setLoading(false);
    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <SafeAreaView className={`flex-1 bg-${isDark ? "[#1A1A1A]" : "white"}`}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <View className="flex-row items-center px-4 py-3 border-b border-brand/20">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="w-10 h-10 items-center justify-center -ml-2"
          >
            <ArrowLeft size={22} color="#1877F2" />
          </TouchableOpacity>
          <Text className={`flex-1 text-lg font-bold text-${isDark ? "white" : "black"} text-center mr-6`}>
            Create Account
          </Text>
        </View>
        <ScrollView contentContainerClassName="flex-grow px-8 pt-8 pb-8">
          <View className="mb-8">
            <Text className={`text-2xl font-bold text-${isDark ? "white" : "black"}`}>
              Join Agrivet
            </Text>
            <Text className={`text-base text-${isDark ? "white/60" : "black/60"} mt-1`}>
              Fill in your details to register
            </Text>
          </View>

          {error ? (
            <View className="bg-brand/5 rounded-xl p-4 mb-4 border border-brand/20">
              <Text className={`text-${isDark ? "white/80" : "black/80"} text-sm`}>{error}</Text>
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
            label="Contact Number"
            placeholder="Enter your contact number"
            value={contactNumber}
            onChangeText={setContactNumber}
            keyboardType="phone-pad"
          />
          <Input
            label="ID Verification URL (optional)"
            placeholder="Link to your ID image"
            value={idVerificationUrl}
            onChangeText={setIdVerificationUrl}
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
            <Text className={`text-sm text-${isDark ? "white/60" : "black/60"}`}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Text className={`text-sm text-${isDark ? "white" : "black"} font-bold`}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>

          <View className="mt-8 bg-brand/5 rounded-xl p-4 border border-brand/20">
            <Text className={`text-xs font-bold text-${isDark ? "white/60" : "black/60"} mb-1`}>
              Note
            </Text>
            <Text className={`text-xs text-${isDark ? "white/70" : "black/70"}`}>
              New accounts require admin approval before you can access the application.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
