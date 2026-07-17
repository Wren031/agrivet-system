import React, { memo } from "react";
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  TouchableOpacityProps,
  Platform,
  ViewStyle,
} from "react-native";
import { useTheme } from "../context/ThemeContext";

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

const SIZE_CLASSES = {
  sm: "px-5 py-2.5",
  md: "px-6 py-[14px]",
  lg: "px-8 py-[16px]",
} as const;

const VARIANT_CLASSES = {
  primary: "bg-brand active:bg-brand/90",
  secondary: "bg-brand/5 border border-brand/20 active:bg-brand/10",
  ghost: "bg-transparent active:bg-black/5",
  danger: "bg-red-500 active:bg-red-600",
} as const;

const TEXT_CLASSES = {
  primary: "text-white font-bold",
  secondary: "text-brand font-semibold",
  ghost: "text-brand font-semibold",
  danger: "text-white font-bold",
} as const;

const SIZE_TEXT_CLASSES = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
} as const;

export const Button = memo(function Button({
  title,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  fullWidth = true,
  ...props
}: ButtonProps) {
  const { isDark } = useTheme();

  const shadowStyle: ViewStyle | undefined =
    variant === "primary"
      ? Platform.OS === "ios"
        ? {
            shadowColor: "#1b4332",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.25,
            shadowRadius: 6,
          }
        : { elevation: 4 }
      : undefined;

  return (
    <TouchableOpacity
      className={`rounded-xl flex-row items-center justify-center ${
        SIZE_CLASSES[size]
      } ${VARIANT_CLASSES[variant]} ${
        disabled || loading ? "opacity-45" : ""
      } ${fullWidth ? "" : "self-start"}`}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={shadowStyle}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          color={
            variant === "primary" || variant === "danger"
              ? "#FFFFFF"
              : "#2d6a4f"
          }
          size="small"
        />
      ) : (
        <Text
          className={`${TEXT_CLASSES[variant]} ${SIZE_TEXT_CLASSES[size]}`}
        >
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
});
