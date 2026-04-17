"use client";

import { useEffect, Suspense } from "react";
import { useAppTheme, HIERARCHIES, HierarchyMode } from "@/contexts/theme-provider";
import { useSearchParams } from "next/navigation";

function ThemeQueryParamsLogic({ children }: { children: React.ReactNode }) {
  const { setCurrentHierarchy } = useAppTheme();
  const searchParams = useSearchParams();

  useEffect(() => {
    const themeQuery = searchParams.get("theme");

    const isValidHierarchy = (HIERARCHIES as readonly string[]).includes(themeQuery || "");

    if (isValidHierarchy) {
      setCurrentHierarchy(themeQuery as HierarchyMode);
    } else {
      setCurrentHierarchy(null);
    }

    return () => setCurrentHierarchy(null);
  }, [searchParams, setCurrentHierarchy]);

  return <>{children}</>;
}

export function ThemeWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<>{children}</>}>
      <ThemeQueryParamsLogic>
        {children}
      </ThemeQueryParamsLogic>
    </Suspense>
  );
}