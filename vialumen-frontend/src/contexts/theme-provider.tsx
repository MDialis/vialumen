"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

export const HIERARCHIES = ["physiology", "safety", "belonging", "esteem", "actualization"] as const;
export type HierarchyMode = typeof HIERARCHIES[number];
export type ThemeMode = "auto" | "common" | HierarchyMode;

const HIERARCHY_CLASSES = HIERARCHIES.map((h) => `${h}-theme`);

type ThemeContextType = {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  currentHierarchy: HierarchyMode | null;
  setCurrentHierarchy: (h: HierarchyMode | null) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

type ThemeProviderProps = React.ComponentProps<typeof NextThemesProvider>;

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  const [mode, setMode] = useState<ThemeMode>("auto");
  const [currentHierarchy, setCurrentHierarchy] = useState<HierarchyMode | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    Promise.resolve().then(() => {
      const saved = localStorage.getItem("app-theme-mode") as ThemeMode | null;
      if (saved) {
        setMode(saved);
      }
      setIsMounted(true);
    });
  }, []);

  useEffect(() => {
    if (!isMounted) return; 

    const body = document.body;
    body.classList.remove(...HIERARCHY_CLASSES);

    let themeToApply = "";

    if (mode === "auto") {
      if (currentHierarchy) themeToApply = `${currentHierarchy}-theme`;
    } else if (mode !== "common") {
      themeToApply = `${mode}-theme`;
    }

    if (themeToApply) {
      body.classList.add(themeToApply);
    }
    
    localStorage.setItem("app-theme-mode", mode);
  }, [mode, currentHierarchy, isMounted]);

  return (
    <NextThemesProvider {...props}>
      <ThemeContext.Provider value={{ mode, setMode, currentHierarchy, setCurrentHierarchy }}>
        {children}
      </ThemeContext.Provider>
    </NextThemesProvider>
  );
}

export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useAppTheme must be used within a ThemeProvider");
  return context;
};