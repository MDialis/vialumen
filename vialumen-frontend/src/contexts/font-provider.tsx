"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type FontContextType = {
  fontSize: number;
  setFontSize: (size: number) => void;
  fontFamily: string;
  setFontFamily: (family: string) => void;
};

const FontContext = createContext<FontContextType | undefined>(undefined);

const FONTS = [
  "font-sans",
  "font-serif",
  "font-mono",
  "font-poppins",
  "font-playfair",
  "font-nunito"
];

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState<number>(16);
  const [fontFamily, setFontFamilyState] = useState<string>("sans");

  useEffect(() => {
    const initializeFonts = async () => {
      const storedSize = localStorage.getItem("app-font-size");
      if (storedSize) {
        const size = Number(storedSize);
        setFontSizeState(size);

        // Calculate the scale (e.g., 20 / 16 = 1.25) and apply to our custom variable
        const scale = (size / 16).toString();
        document.documentElement.style.setProperty("--font-scale", scale);
      } else {
        document.documentElement.style.setProperty("--font-scale", "1");
      }

      // CRITICAL: Ensure the root font size stays at 16px so layout/padding doesn't break
      document.documentElement.style.fontSize = "16px";

      const storedFamily = localStorage.getItem("app-font-family");
      if (storedFamily) {
        setFontFamilyState(storedFamily);
        document.documentElement.classList.remove(...FONTS);
        document.documentElement.classList.add(`font-${storedFamily}`);
      } else {
        document.documentElement.classList.add("font-sans");
      }
    };

    initializeFonts();
  }, []);

  const handleSetFontSize = (size: number) => {
    setFontSizeState(size);
    const scale = (size / 16).toString();
    document.documentElement.style.setProperty("--font-scale", scale);
    localStorage.setItem("app-font-size", size.toString());
  };

  const handleSetFontFamily = (family: string) => {
    setFontFamilyState(family);

    document.documentElement.classList.remove(...FONTS);

    document.documentElement.classList.add(`font-${family}`);
    localStorage.setItem("app-font-family", family);
  };

  return (
    <FontContext.Provider
      value={{
        fontSize,
        setFontSize: handleSetFontSize,
        fontFamily,
        setFontFamily: handleSetFontFamily
      }}
    >
      {children}
    </FontContext.Provider>
  );
}

export function useFont() {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error("useFont must be used within a FontProvider");
  }
  return context;
}