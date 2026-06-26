import React, { memo } from "react";
import { View, ViewProps } from "react-native";
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
      className={`rounded-2xl p-4 border ${
        isDark
          ? "bg-white/5 border-white/10"
          : "bg-white border-black/5"
      } ${className}`}
      style={
        elevated
          ? {
              shadowColor: "#1b4332",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0 : 0.06,
              shadowRadius: 8,
              elevation: isDark ? 0 : 2,
            }
          : undefined
      }
      {...props}
    >
      {children}
    </View>
  );
});
