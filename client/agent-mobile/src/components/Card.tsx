import React, { memo } from "react";
import { View, ViewProps, Platform } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface CardProps extends ViewProps {
  children: React.ReactNode;
  elevated?: boolean;
}

export const Card = memo(function Card({
  children,
  className = "",
  elevated = false,
  ...props
}: CardProps) {
  const { isDark } = useTheme();

  return (
    <View
      className={`rounded-2xl p-5 border ${
        isDark
          ? "bg-[#1e293b] border-white/[0.08]"
          : "bg-white border-slate-200"
      } ${className}`}
      style={
        elevated
          ? {
              shadowColor: "#1b4332",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0.2 : 0.06,
              shadowRadius: 8,
              elevation: Platform.OS === "android" ? (isDark ? 4 : 2) : 0,
            }
          : undefined
      }
      {...props}
    >
      {children}
    </View>
  );
});
