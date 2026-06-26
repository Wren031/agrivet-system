import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { getTabBarStyle, HIDDEN_TAB_BAR_STYLE } from "../navigation/tabBarStyles";

export function useHideTabBar(hide: boolean) {
  const navigation = useNavigation();
  const { isDark } = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      tabBarStyle: hide ? HIDDEN_TAB_BAR_STYLE : getTabBarStyle(isDark),
    });

    return () => {
      navigation.setOptions({
        tabBarStyle: getTabBarStyle(isDark),
      });
    };
  }, [hide, isDark, navigation]);
}
