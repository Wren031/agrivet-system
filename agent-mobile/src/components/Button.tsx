import React from "react";
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

export function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  ...props
}: ButtonProps) {
  const sizeClasses = {
    sm: "px-4 py-2",
    md: "px-6 py-3.5",
    lg: "px-8 py-4",
  };

  const variantClasses = {
    primary: "bg-brand active:bg-brand/90",
    secondary: "bg-brand/5 border border-brand/20 active:bg-brand/10",
    ghost: "bg-transparent",
  };

  const textClasses = {
    primary: "text-white font-bold",
    secondary: "text-brand font-semibold",
    ghost: "text-brand font-semibold",
  };

  const sizeTextClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <TouchableOpacity
      className={`rounded-xl flex-row items-center justify-center ${sizeClasses[size]} ${variantClasses[variant]} ${
        disabled ? "opacity-40" : ""
      }`}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#FFFFFF" : "#1877F2"} size="small" />
      ) : (
        <Text className={`${textClasses[variant]} ${sizeTextClasses[size]}`}>{title}</Text>
      )}
    </TouchableOpacity>
  );
}
