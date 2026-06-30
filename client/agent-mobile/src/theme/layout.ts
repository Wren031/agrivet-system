import { Platform } from "react-native";
import { TAB_BAR_HEIGHT } from "../navigation/tabBarStyles";

export const SCREEN_HORIZONTAL_PADDING = 24;
export const SECTION_GAP = 28;
export const CARD_RADIUS = 14;

export function getScrollBottomPadding(withTabBar = true): number {
  const tabOffset = withTabBar ? TAB_BAR_HEIGHT : 0;
  return tabOffset + (Platform.OS === "ios" ? 24 : 20);
}

export function getScreenBg(isDark: boolean): string {
  return isDark ? "bg-surface-dark" : "bg-surface-light";
}
