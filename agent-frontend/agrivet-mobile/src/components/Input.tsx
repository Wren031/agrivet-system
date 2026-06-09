import React, { useState } from "react";
import {
  TextInput,
  View,
  Text,
  TextInputProps,
} from "react-native";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">
      <Text className="text-sm font-medium text-surface-700 dark:text-surface-300 mb-1.5">
        {label}
      </Text>
      <TextInput
        className={`w-full px-4 py-3 rounded-xl text-base text-surface-900 dark:text-surface-100 bg-surface-50 dark:bg-surface-800 border ${
          isFocused
            ? "border-primary-500 dark:border-primary-400"
            : error
            ? "border-red-400"
            : "border-surface-200 dark:border-surface-700"
        }`}
        placeholderTextColor="#94a3b8"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && (
        <Text className="text-red-500 text-xs mt-1">{error}</Text>
      )}
    </View>
  );
}
