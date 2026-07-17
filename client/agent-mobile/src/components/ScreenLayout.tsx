import React from "react";
import { ScrollView, ScrollViewProps, View } from "react-native";
import { SafeAreaView, Edge } from "react-native-safe-area-context";
import { useTheme } from "../context/ThemeContext";
import { getScrollBottomPadding } from "../theme/layout";

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
  const bottomPadding = getScrollBottomPadding(withTabBarPadding);

  const container = `flex-1 ${
    isDark ? "bg-[#0f172a]" : "bg-[#f8f9fa]"
  } ${className}`;

  if (scroll) {
    return (
      <SafeAreaView className={container} edges={edges}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{
            paddingBottom: bottomPadding,
            flexGrow: 1,
          }}
          {...scrollProps}
        >
          <View className={contentClassName}>{children}</View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={container} edges={edges}>
      <View
        className={`flex-1 ${contentClassName}`}
        style={{
          paddingBottom: withTabBarPadding ? bottomPadding - 16 : 0,
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  );
}
