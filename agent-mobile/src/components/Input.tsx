import React, { useState } from "react";
import {
  TextInput,
  View,
  Text,
  TextInputProps,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const { isDark } = useTheme();

  return (
    <View className="mb-4">
      <Text className={`text-sm font-medium text-${isDark ? "white/80" : "black/80"} mb-1.5`}>
        {label}
      </Text>
      <TextInput
        className={`w-full px-4 py-3 rounded-xl text-base text-${isDark ? "white" : "black"} bg-brand/5 border ${
          isFocused
            ? "border-brand"
            : error
            ? "border-brand/50"
            : "border-brand/20"
        }`}
        placeholderTextColor="rgba(45,106,79,0.4)"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && (
        <Text className={`text-${isDark ? "white/70" : "black/70"} text-xs mt-1`}>{error}</Text>
      )}
    </View>
  );
}
