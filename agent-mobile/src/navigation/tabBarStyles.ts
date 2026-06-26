import { Platform, ViewStyle } from "react-native";

export const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 88 : 68;

export function getTabBarStyle(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? "#1e293b" : "#f4f7f5",
    borderTopColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(45,106,79,0.15)",
    borderTopWidth: 1,
    elevation: 10,
    shadowColor: isDark ? "#000" : "#2d6a4f",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    height: TAB_BAR_HEIGHT,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 28 : 8,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  };
}

export const HIDDEN_TAB_BAR_STYLE: ViewStyle = {
  display: "none",
  height: 0,
  minHeight: 0,
  overflow: "hidden",
};
