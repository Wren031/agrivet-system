import { Platform } from "react-native";
import { TAB_BAR_HEIGHT } from "../navigation/tabBarStyles";

export const SCREEN_HORIZONTAL_PADDING = 24;
export const SECTION_GAP = 32;
export const CARD_RADIUS = 14;
export const INPUT_HEIGHT = 52;
export const BUTTON_HEIGHT = 52;
export const CARD_RADIUS_LG = 20;
export const CARD_RADIUS_XL = 24;

export function getScrollBottomPadding(withTabBar = true): number {
  const tabOffset = withTabBar ? TAB_BAR_HEIGHT : 0;
  return tabOffset + (Platform.OS === "ios" ? 24 : 20);
}

export function getScreenBg(isDark: boolean): string {
  return isDark ? "bg-[#0f172a]" : "bg-[#f8f9fa]";
}

export function getSurfaceBg(isDark: boolean): string {
  return isDark ? "bg-[#1e293b]" : "bg-white";
}

export function getSurfaceBorder(isDark: boolean): string {
  return isDark ? "border-white/[0.08]" : "border-black/[0.06]";
}
