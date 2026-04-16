"use client";

import { useFont } from "@/contexts/font-provider";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Type, MonitorSmartphone, Palette, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";

const FONTS = [
  { id: "sans", label: "Sans-serif", cssClass: "font-sans" },
  { id: "serif", label: "Serif", cssClass: "font-serif" },
  { id: "mono", label: "Monospace", cssClass: "font-mono" },
];

const THEMES = [
  { id: "default", label: "Default", color: "bg-zinc-500" },
  { id: "physiology", label: "Physiology", color: "bg-red-500" },
  { id: "safety", label: "Safety", color: "bg-blue-700" },
  { id: "belonging", label: "Belonging", color: "bg-amber-400" },
  { id: "esteem", label: "Esteem", color: "bg-purple-600" },
  { id: "actualization", label: "Actualization", color: "bg-cyan-400" },
];

export default function AppearanceSettings() {
  const { fontSize, setFontSize } = useFont();
  const [fontFamily, setFontFamily] = useState<string>("sans");
  const [activeTheme, setActiveTheme] = useState<string>("default");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Appearance settings">
          <Palette className="w-5 h-5 text-muted-foreground" />
        </Button>
      </SheetTrigger>

      <SheetContent className="w-100 sm:w-135 flex flex-col p-0">
        {/* PINNED HEADER */}
        <div className="border-b border-border/50 bg-background shrink-0 relative z-10">
          <SheetHeader className="text-left">
            <SheetTitle className="flex items-center gap-2 text-2xl font-bold">
              <Palette className="w-6 h-6 text-primary" />
              Appearance
            </SheetTitle>
          </SheetHeader>
        </div>

        {/* SCROLLABLE MIDDLE SECTION */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-10">
          {/* --- SETTING: FONT SIZE --- */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2 text-base font-semibold">
                <Type className="w-4 h-4 text-muted-foreground" />
                Base Font Size
              </Label>
              <span className="text-sm text-muted-foreground font-mono">
                {fontSize}px
              </span>
            </div>

            <Slider
              value={[fontSize]}
              onValueChange={(val) => setFontSize(val[0])}
              max={24}
              min={12}
              step={1}
              className="py-4"
            />
          </div>

          {/* --- SETTING: FONT FAMILY --- */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2 text-base font-semibold mb-4">
              <MonitorSmartphone className="w-4 h-4 text-muted-foreground" />
              Font Family
            </Label>

            <div className="grid grid-cols-3 gap-3">
              {FONTS.map((font) => {
                const isActive = fontFamily === font.id;

                return (
                  <button
                    key={font.id}
                    onClick={() => setFontFamily(font.id)}
                    className={`flex flex-col items-center justify-center aspect-square gap-2 p-4 rounded-xl border-2 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring ${font.cssClass} ${
                      isActive
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border/50 bg-transparent text-muted-foreground hover:bg-muted hover:border-border"
                    }`}
                  >
                    <span className="text-4xl font-medium leading-none">
                      Aa
                    </span>
                    <span
                      className={`text-xs ${isActive ? "font-bold" : "font-medium"}`}
                    >
                      {font.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* --- SETTING: THEME TOGGLE --- */}
          <div className="space-y-4 border-t border-border/50 pt-8">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="theme-toggle"
                className="text-base font-semibold cursor-pointer"
              >
                Theme Mode
                <span className="text-muted-foreground text-xs">
                  (Light/Dark)
                </span>
              </Label>
              <ThemeSwitcher />
            </div>
          </div>

          {/* --- SETTING: THEMES AND COLORS --- */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2 text-base font-semibold mb-4">
              <Palette className="w-4 h-4 text-muted-foreground" />
              Themes and Colors
            </Label>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {THEMES.map((theme) => {
                const isActive = activeTheme === theme.id;

                return (
                  <button
                    key={theme.id}
                    onClick={() => setActiveTheme(theme.id)}
                    className={`flex flex-col items-center justify-center aspect-square gap-3 p-4 rounded-xl border-2 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      isActive
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border/50 bg-transparent text-muted-foreground hover:bg-muted hover:border-border"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full shadow-sm ${theme.color}`}
                    />
                    <span
                      className={`text-xs font-medium ${isActive ? "font-bold" : ""}`}
                    >
                      {theme.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* PINNED FOOTER */}
        <div className="p-6 border-t border-border/50 bg-background shrink-0 relative z-10">
          <Button
            variant="outline"
            className="w-full border-dashed border-2 hover:border-primary hover:text-primary transition-colors h-12 rounded-xl bg-transparent"
            asChild
          >
            <Link href="/settings/theme-builder">
              <Plus className="w-4 h-4 mr-2" />
              Create Custom Theme
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}