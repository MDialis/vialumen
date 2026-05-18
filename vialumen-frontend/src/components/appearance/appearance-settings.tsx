"use client";

import { useFont } from "@/contexts/font-provider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Type, MonitorSmartphone, Palette, X, Lock } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "@/components/appearance/theme-switcher";
import { useAppTheme, ThemeMode } from "@/contexts/theme-provider";
import { authClient } from "@/lib/auth-client";

const FONTS = [
  { id: "sans", label: "Sans-serif", cssClass: "font-sans" },
  { id: "serif", label: "Serif", cssClass: "font-serif" },
  { id: "mono", label: "Monospace", cssClass: "font-mono" },
  { id: "poppins", label: "Poppins", cssClass: "font-poppins" },
  { id: "nunito", label: "Nunito", cssClass: "font-nunito" },
  { id: "playfair", label: "Playfair", cssClass: "font-playfair" },
];

const THEMES = [
  {
    id: "auto",
    label: "Auto",
    customColor: "bg-linear-to-br from-sky-600 via-purple-500 to-pink-500",
  },
  { id: "common", label: "Common", customColor: "bg-zinc-500" },
  { id: "physiology", label: "Physiology" },
  { id: "safety", label: "Safety" },
  { id: "belonging", label: "Belonging" },
  { id: "esteem", label: "Esteem" },
  { id: "actualization", label: "Actualization" },
  { id: "premiumtest", label: "Premium Test", customColor: "bg-zinc-950 border border-yellow-600/50" },
];

export default function AppearanceSettings() {
  const router = useRouter();
  const { fontSize, setFontSize, fontFamily, setFontFamily } = useFont();
  const { mode, setMode } = useAppTheme();
  
  const { data: session } = authClient.useSession();
  const isLoggedIn = !!session?.user;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Appearance settings">
          <Palette className="w-5 h-5 text-muted-foreground" />
        </Button>
      </SheetTrigger>

      <SheetContent className="w-100 sm:w-135 flex flex-col p-0">
        {/* PINNED HEADER */}
        <div className="flex items-center justify-between border-b border-border/50 bg-background shrink-0 relative z-10">
          <SheetHeader className="text-left space-y-0">
            <SheetTitle className="flex items-center gap-2 text-2xl font-bold">
              <Palette className="w-6 h-6 text-primary" />
              Appearance
            </SheetTitle>
          </SheetHeader>

          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="mr-4 rounded-full hover:bg-muted"
            >
              <X className="w-4 h-4 text-muted-foreground" />
              <span className="sr-only">Close</span>
            </Button>
          </SheetClose>
        </div>

        {/* SCROLLABLE MIDDLE SECTION */}
        <div className="flex-1 overflow-y-auto px-6 py-8 space-y-6">
          {/* --- SETTING: FONT SIZE --- */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="flex items-center text-base font-semibold">
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
            />
          </div>

          <Accordion
            type="multiple"
            className="w-full space-y-6"
          >
            {/* --- SETTING: FONT FAMILY --- */}
            <AccordionItem value="font" className="border-none">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2 text-base font-semibold">
                  <MonitorSmartphone className="w-4 h-4 text-muted-foreground" />
                  Text Font
                </div>
              </AccordionTrigger>
              
              <AccordionContent>
                <div className="grid grid-cols-3 gap-2">
                  {FONTS.map((font) => {
                    const isActive = fontFamily === font.id;

                    return (
                      <button
                        key={font.id}
                        onClick={() => setFontFamily(font.id)}
                        className={`flex flex-col items-center justify-center aspect-square gap-2 p-2 rounded-xl border-2 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring ${font.cssClass} ${
                          isActive
                            ? "border-primary bg-primary/5 text-primary"
                            : "border-border/50 bg-transparent text-muted-foreground hover:bg-muted hover:border-border"
                        }`}
                      >
                        <span className="text-4xl font-medium leading-none">
                          Aa
                        </span>
                        <span
                          className={`text-xs ${
                            isActive ? "font-bold" : "font-medium"
                          }`}
                        >
                          {font.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* --- SETTING: THEMES AND COLORS --- */}
            <AccordionItem value="theme" className="border-none">
              <AccordionTrigger className="hover:no-underline py-0 mb-4">
                <div className="flex items-center gap-2 text-base font-semibold">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  Themes and Colors
                </div>
              </AccordionTrigger>
              <AccordionContent className="space-y-6 pb-0">
                {/* --- THEME TOGGLE --- */}
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="theme-toggle"
                    className="text-base font-semibold cursor-pointer flex items-center gap-1"
                  >
                    Theme Mode
                    <span className="text-muted-foreground text-xs ml-1">
                      (Light/Dark)
                    </span>
                  </Label>
                  <ThemeSwitcher />
                </div>

                {/* --- THEME PRESETS --- */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {THEMES.map((theme) => {
                    const isExclusive = theme.id !== "auto" && theme.id !== "common";
                    const isLocked = isExclusive && !isLoggedIn;
                    const isActive = mode === theme.id;

                    const containerStyles = isLocked
                      ? "border-border/50 bg-card/30 text-muted-foreground hover:bg-muted/30 hover:border-border cursor-pointer"
                      : isActive
                      ? "border-primary bg-card text-primary"
                      : "border-border bg-card/50 text-muted-foreground hover:bg-muted hover:border-border cursor-pointer";

                    return (
                      <button
                        key={theme.id}
                        onClick={() => {
                          if (isLocked) {
                            router.push("/login");
                          } else {
                            setMode(theme.id as ThemeMode);
                          }
                        }}
                        className={`flex flex-col items-center justify-center aspect-square gap-2 p-2 rounded-xl border-2 transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring relative ${containerStyles}`}
                      >
                        {/* Lock Badge floating on top right */}
                        {isLocked && (
                          <span className="absolute top-[-7] right-[-2] z-20 flex items-center gap-0.5 bg-primary text-primary-foreground text-xs font-semibold px-1 rounded shadow-sm">
                            <Lock className="w-2 h-2" />
                            Log in
                          </span>
                        )}

                        <div
                          className={`w-8 h-8 rounded-full shadow-sm ${
                            theme.customColor
                              ? theme.customColor
                              : `${theme.id}-theme bg-primary`
                          }`}
                        />
                        <span
                          className={`text-xs font-medium ${
                            isActive || isLocked ? "font-bold" : ""
                          }`}
                        >
                          {theme.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* PINNED FOOTER */}
        <div className="p-6 border-t border-border/50 bg-background shrink-0 relative z-10">
          <Button
            variant="outline"
            className="w-full border-dashed border-2 hover:border-primary hover:text-primary transition-colors h-12 rounded-xl bg-transparent relative overflow-hidden"
            asChild
          >
            {/* Direct to themes if logged in, otherwise route to login screen */}
            <Link href={isLoggedIn ? "/themes" : "/login"}>
              <Palette className="w-4 h-4 mr-2" />
              Browse Themes
              
              {/* Informative login badge inside the footer button */}
              {!isLoggedIn && (
                <span className="absolute right-3 flex items-center gap-0.5 bg-primary text-primary-foreground text-[10px] font-bold py-0.5 px-1 rounded shadow-sm">
                   <Lock className="w-2 h-2" />
                  Log in
                </span>
              )}
            </Link>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}