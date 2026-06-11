import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
}

const THEME_STORAGE_KEY = "@agrivet_theme";

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
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

  const toggleTheme = async () => {
    const next = !isDark;
    setIsDark(next);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(next));
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
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
