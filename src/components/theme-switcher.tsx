"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { twMerge } from "tailwind-merge";

type ThemeSwitcherProps = {
  className?: string;
};

export const ThemeSwitcher = ({ className }: ThemeSwitcherProps) => {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // useEffect only runs on the client, so now we can safely show the UI
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Return a placeholder with the same size to prevent layout shift
    return <div className={twMerge("h-6 w-6", className)} />;
  }

  const cycleTheme = () => {
    // If the current resolved theme is dark, switch to light, otherwise dark
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <button
      aria-label="Toggle Theme"
      onClick={cycleTheme}
      className={twMerge(
        "rounded-full p-2 transition-colors hover:bg-accent hover:text-accent-foreground",
        className
      )}
    >
      {resolvedTheme === "dark" ? (
        <Moon className="h-6 w-6" />
      ) : (
        <Sun className="h-6 w-6" />
      )}
    </button>
  );
};