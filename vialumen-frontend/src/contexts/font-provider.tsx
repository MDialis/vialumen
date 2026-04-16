"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type FontContextType = {
  fontSize: number;
  setFontSize: (size: number) => void;
};

const FontContext = createContext<FontContextType | undefined>(undefined);

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState<number>(16);

  useEffect(() => {
    const initializeFont = async () => {
      const stored = localStorage.getItem("app-font-size");
      if (stored) {
        const size = Number(stored);
        setFontSizeState(size);
        
        // Calculate the scale (e.g., 20 / 16 = 1.25) and apply to our custom variable
        const scale = (size / 16).toString();
        document.documentElement.style.setProperty("--font-scale", scale);
      } else {
        document.documentElement.style.setProperty("--font-scale", "1");
      }
      
      // CRITICAL: Ensure the root font size stays at 16px so layout/padding doesn't break
      document.documentElement.style.fontSize = "16px";
    };

    initializeFont();
  }, []);

  const handleSetFontSize = (size: number) => {
    setFontSizeState(size);
    
    const scale = (size / 16).toString();
    document.documentElement.style.setProperty("--font-scale", scale);
    
    localStorage.setItem("app-font-size", size.toString());
  };

  return (
    <FontContext.Provider value={{ fontSize, setFontSize: handleSetFontSize }}>
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