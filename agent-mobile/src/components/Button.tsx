import React, { memo } from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
}

const SIZE_CLASSES = { sm: "px-4 py-2", md: "px-6 py-3.5", lg: "px-8 py-4" } as const;
const VARIANT_CLASSES = {
  primary: "bg-brand active:bg-brand/90",
  secondary: "bg-brand/5 border border-brand/20 active:bg-brand/10",
  ghost: "bg-transparent",
} as const;
const TEXT_CLASSES = {
  primary: "text-white font-bold",
  secondary: "text-brand font-semibold",
  ghost: "text-brand font-semibold",
} as const;
const SIZE_TEXT_CLASSES = { sm: "text-sm", md: "text-base", lg: "text-lg" } as const;

export const Button = memo(function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  ...props
}: ButtonProps) {
  return (
    <TouchableOpacity
      className={`rounded-xl flex-row items-center justify-center ${SIZE_CLASSES[size]} ${VARIANT_CLASSES[variant]} ${
        disabled ? "opacity-40" : ""
      }`}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#FFFFFF" : "#2d6a4f"} size="small" />
      ) : (
        <Text className={`${TEXT_CLASSES[variant]} ${SIZE_TEXT_CLASSES[size]}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
});
