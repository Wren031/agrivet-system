import React, { useState } from "react";
import { TextInput, View, Text, TextInputProps, Platform } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const { isDark } = useTheme();

  return (
    <View className="mb-4">
      <Text
        className={`text-sm font-semibold mb-1.5 ${
          isDark ? "text-white/80" : "text-slate-700"
        }`}
      >
        {label}
      </Text>
      <View
        className={`w-full rounded-xl border flex-row items-center ${
          isDark
            ? "bg-white/5"
            : "bg-white"
        } ${
          isFocused
            ? "border-brand"
            : error
              ? "border-red-400"
              : isDark
                ? "border-white/10"
                : "border-slate-200"
        } ${className}`}
        style={{
          height: 52,
          shadowColor: "#1b4332",
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: isDark ? 0 : 0.04,
          shadowRadius: 3,
          elevation: isDark ? 0 : 1,
        }}
      >
        <TextInput
          className={`flex-1 px-4 text-base ${
            isDark ? "text-white" : "text-slate-900"
          }`}
          style={{
            height: 52,
            paddingTop: 0,
            paddingBottom: 0,
            textAlignVertical: "center",
          }}
          placeholderTextColor={
            isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)"
          }
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
      </View>
      {error ? (
        <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>
      ) : null}
    </View>
  );
}
