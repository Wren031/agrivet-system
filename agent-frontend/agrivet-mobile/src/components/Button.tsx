import React from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
} from "react-native";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
}

export function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  ...props
}: ButtonProps) {
  const baseClasses = "rounded-xl flex-row items-center justify-center";

  const sizeClasses = {
    sm: "px-4 py-2",
    md: "px-6 py-3",
    lg: "px-8 py-4",
  };

  const variantClasses = {
    primary: "bg-primary-600 active:bg-primary-700",
    secondary: "bg-surface-200 dark:bg-surface-700 active:bg-surface-300 dark:active:bg-surface-600",
    danger: "bg-red-500 active:bg-red-600",
    ghost: "bg-transparent",
  };

  const textClasses = {
    primary: "text-white font-semibold",
    secondary: "text-surface-800 dark:text-surface-200 font-semibold",
    danger: "text-white font-semibold",
    ghost: "text-primary-600 dark:text-primary-400 font-semibold",
  };

  const sizeTextClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <TouchableOpacity
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${
        disabled ? "opacity-50" : ""
      }`}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "white" : "#0ea5e9"} size="small" />
      ) : (
        <Text className={`${textClasses[variant]} ${sizeTextClasses[size]}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
