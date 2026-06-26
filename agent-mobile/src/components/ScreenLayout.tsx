import React from "react";
import {
  ScrollView,
  ScrollViewProps,
  View,
} from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { getScreenBg, getScrollBottomPadding } from "../theme/layout";

interface ScreenLayoutProps {
  children: React.ReactNode;
  scroll?: boolean;
  scrollProps?: ScrollViewProps;
  withTabBarPadding?: boolean;
  edges?: Edge[];
  className?: string;
  contentClassName?: string;
}

export function ScreenLayout({
  children,
  scroll = false,
  scrollProps,
  withTabBarPadding = true,
  edges = ["top", "left", "right"],
  className = "",
  contentClassName = "",
}: ScreenLayoutProps) {
  const { isDark } = useTheme();
  const bg = getScreenBg(isDark);
  const bottomPadding = getScrollBottomPadding(withTabBarPadding);

  if (scroll) {
    return (
      <SafeAreaView className={`flex-1 ${bg} ${className}`} edges={edges}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: bottomPadding, flexGrow: 1 }}
          {...scrollProps}
        >
          <View className={contentClassName}>{children}</View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${bg} ${className}`} edges={edges}>
      <View className={`flex-1 ${contentClassName}`} style={{ paddingBottom: withTabBarPadding ? bottomPadding - 16 : 0 }}>
        {children}
      </View>
    </SafeAreaView>
  );
}
