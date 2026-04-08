"use client";

import { useSearchParams } from "next/navigation";
import { ReactNode } from "react";

export function ThemeWrapper({ children }: { children: ReactNode }) {
  const searchParams = useSearchParams();
  const themeParam = searchParams.get("theme") || "";
  
  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeParam}-theme`}>
      {children}
    </div>
  );
}