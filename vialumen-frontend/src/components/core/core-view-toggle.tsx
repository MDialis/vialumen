"use client";

import { Button } from "@/components/ui/button";
import { Network, ListTree } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function CoreViewToggle({ currentView }: { currentView: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const setView = (view: string) => {
    // Preserve other params (like ?tab=X) when switching views
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", view);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex items-center p-1 border border-border rounded-lg bg-muted/30 w-fit mb-4">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setView("map")}
        className={cn(
          "h-8 px-4 flex items-center gap-2 transition-all",
          currentView === "map"
            ? "bg-background shadow-sm text-foreground font-bold"
            : "text-muted-foreground hover:text-foreground font-medium"
        )}
      >
        <Network className="w-4 h-4" />
        <span className="text-xs">Node Map</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        onClick={() => setView("list")}
        className={cn(
          "h-8 px-4 flex items-center gap-2 transition-all",
          currentView === "list"
            ? "bg-background shadow-sm text-foreground font-bold"
            : "text-muted-foreground hover:text-foreground font-medium"
        )}
      >
        <ListTree className="w-4 h-4" />
        <span className="text-xs">Encyclopedia</span>
      </Button>
    </div>
  );
}