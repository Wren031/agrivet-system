import React, { useState } from "react";
import {
  TextInput,
  View,
  Text,
  TextInputProps,
  Platform,
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
      <Text
        className={`text-sm font-semibold mb-1.5 ${
          isDark ? "text-white/80" : "text-black/75"
        }`}
      >
        {label}
      </Text>
      <TextInput
        className={`w-full px-4 rounded-xl text-base border ${
          Platform.OS === "ios" ? "py-3.5" : "py-3"
        } ${isDark ? "text-white bg-white/5" : "text-black bg-black/3"} ${
          isFocused
            ? "border-brand"
            : error
              ? "border-red-400"
              : isDark
                ? "border-white/10"
                : "border-black/8"
        }`}
        placeholderTextColor={isDark ? "rgba(255,255,255,0.35)" : "rgba(0,0,0,0.35)"}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error ? (
        <Text className="text-red-500 text-xs mt-1">{error}</Text>
      ) : null}
    </View>
  );
}
