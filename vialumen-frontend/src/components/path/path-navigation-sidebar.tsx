"use client";

import { Button } from "@/components/ui/button";
import { Network, Users, ChevronDown, Waypoints } from "lucide-react";
import Link from "next/link";
import { HierarchySimple, HierarchyGraphResponse } from "@/types";
import { useNodeLineage } from "@/hooks/use-node-lineage";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PathNavigationSidebarProps {
  currentSlug: string;
  currentTitle: string;
  activeTheme: HierarchySimple;
  availableThemes: HierarchySimple[];
  graphData: HierarchyGraphResponse | null;
}

export function PathNavigationSidebar({
  currentSlug,
  currentTitle,
  activeTheme,
  availableThemes,
  graphData,
}: PathNavigationSidebarProps) {
  const { parents, children } = useNodeLineage(graphData, currentSlug);

  return (
    <div className="sticky top-24 space-y-8 pr-4">
      {/* Global Navigation */}
      <div className="space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
          Explore
        </h2>
        <nav className="flex flex-col gap-1">
          <Button asChild variant="ghost" className="w-full justify-start h-10 font-medium text-muted-foreground hover:text-foreground">
            <Link href={`/core?tab=${activeTheme.id}`}>
              <Network className="w-4 h-4 mr-3" />
              Core Node Map
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start h-10 font-medium text-muted-foreground hover:text-foreground">
            <Link href="/community">
              <Users className="w-4 h-4 mr-3" />
              Community Feed
            </Link>
          </Button>
        </nav>
      </div>

      {/* The Local Lineage Map */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground py-2 border-b border-border/50">
          <Waypoints className="w-4 h-4 text-primary" />
          Local Map
        </div>

        {/* Context Switcher */}
        <div className="space-y-2">
          {availableThemes.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full justify-between bg-card text-foreground font-semibold">
                  {activeTheme?.title || "Unknown Context"}
                  <ChevronDown className="w-4 h-4 ml-2 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-full min-w-[220px]">
                {availableThemes.map((theme) => (
                  <DropdownMenuItem key={theme.id} asChild>
                    <Link href={`/path/${currentSlug}?theme=${theme.id}`} className="cursor-pointer w-full">
                      {theme.title}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* ================================== */}
        {/* GRAPH RENDERING                    */}
        {/* ================================== */}
        <div className="flex flex-col">
          
          <div className="relative flex flex-col gap-1">
            <div className="absolute left-[7px] top-4 bottom-4 w-[2px] bg-border/80" />

            {/* PARENTS */}
            {parents.map((p) => (
              <Link key={p.id} href={`/path/${p.slug}?theme=${activeTheme.id}`} className="relative flex items-center group py-1.5">
                <div className="w-3 h-3 rounded-full bg-muted border-2 border-border z-10 mr-3 ml-0.5 group-hover:border-primary transition-colors" />
                <span className="text-sm text-muted-foreground font-medium group-hover:text-foreground transition-colors line-clamp-1">
                  {p.title}
                </span>
              </Link>
            ))}

            {/* CURRENT NODE */}
            <div className="relative flex items-center pt-2">
              <div className="w-4 h-4 rounded-full bg-primary ring-4 ring-primary/20 z-10 mr-3 shrink-0" />
              <span className="text-sm font-bold text-foreground leading-snug">
                {currentTitle}
              </span>
            </div>
          </div>

          {/* CHILDREN */}
          {children.length > 0 && (
            <div className="flex flex-col gap-1 ml-[7px] pl-5 border-l-[2px] border-border/80 pt-2">
              {children.map((c) => (
                <Link key={c.id} href={`/path/${c.slug}?theme=${activeTheme.id}`} className="relative flex items-center group py-1">
                  <div className="w-3 h-3 rounded-full border-2 border-border z-10 mr-3 ml-0.5 group-hover:border-primary transition-colors" />
                  <span className="text-sm text-muted-foreground font-medium group-hover:text-foreground transition-colors line-clamp-1">
                    {c.title}
                  </span>
                </Link>
              ))}
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}