import { useMemo } from 'react';
import { useThemeStore } from '../store/themeStore';
import { Colors } from '../constants/colors';

export function useColorTheme() {
  const isDark = useThemeStore((s) => s.isDark);
  const colors = useMemo(() => (isDark ? Colors.dark : Colors.light), [isDark]);
  return { isDark, colors };
}
