import React from "react";
import { View, ViewProps } from "react-native";

interface CardProps extends ViewProps {
  children: React.ReactNode;
}

export function Card({ children, className = "", ...props }: CardProps) {
  return (
    <View
      className={`bg-white dark:bg-surface-800 rounded-2xl p-4 shadow-sm border border-surface-100 dark:border-surface-700 ${className}`}
      {...props}
    >
      {children}
    </View>
  );
}
