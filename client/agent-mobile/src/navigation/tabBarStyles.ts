import { Platform, ViewStyle } from "react-native";

export const TAB_BAR_HEIGHT = Platform.OS === "ios" ? 88 : 68;

export function getTabBarStyle(isDark: boolean): ViewStyle {
  return {
    backgroundColor: isDark ? "#0f172a" : "#ffffff",
    borderTopColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    borderTopWidth: 1,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: isDark ? 0.3 : 0.06,
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
