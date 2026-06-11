import React from "react";
import { View, ViewProps } from "react-native";
import { useTheme } from "../context/ThemeContext";

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
  const { isDark } = useTheme();
  return (
    <View
      className={`bg-brand/5 rounded-2xl p-4 border border-brand/20 ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
