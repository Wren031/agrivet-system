import React, { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { agriColors } from "../theme/colors";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: typeof agriColors;
}

const THEME_STORAGE_KEY = "@agrivet_theme";

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
  colors: agriColors,
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (saved !== null) {
        setIsDark(JSON.parse(saved));
      }
    } catch {}
  };

  const toggleTheme = useCallback(async () => {
    setIsDark(prev => {
      const next = !prev;
      AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo(() => ({ isDark, toggleTheme, colors: agriColors }), [isDark, toggleTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
