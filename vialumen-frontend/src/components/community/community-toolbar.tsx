"use client";

import { Button } from "@/components/ui/button";
import { LayoutList, AlignJustify } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface CommunityToolbarProps {
  viewMode: "card" | "compact";
  setViewMode: (mode: "card" | "compact" ) => void;
}

const TOGGLE_OPTIONS = [
  { id: "card", label: "Card", icon: LayoutList },
  { id: "compact", label: "Compact", icon: AlignJustify },
] as const;

export function CommunityToolbar({ viewMode, setViewMode }: CommunityToolbarProps) {
  return (
    <div className="border-b border-border pb-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Filters Panel */}
        <div className="flex flex-wrap items-center gap-3">
          <Select defaultValue="all">
            <SelectTrigger className="w-[160px] bg-card">
              <SelectValue placeholder="Hierarchy" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Hierarchies</SelectItem>
              <SelectItem value="physiology">Physiology</SelectItem>
              <SelectItem value="safety">Safety</SelectItem>
              <SelectItem value="belonging">Belonging</SelectItem>
              <SelectItem value="esteem">Esteem</SelectItem>
              <SelectItem value="actualization">Self Actualization</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Modular View Toggle Wrapper */}
        <div className="flex items-center border border-border rounded-lg bg-muted/30 gap-1">
          {TOGGLE_OPTIONS.map(({ id, label, icon: Icon }) => {
            const isActive = viewMode === id;

            return (
              <Button
                key={id}
                variant="ghost"
                size="sm"
                onClick={() => setViewMode(id)}
                className={cn(
                  "h-8 flex items-center transition-all duration-300",
                  isActive
                    ? "bg-background shadow-sm hover:bg-background text-foreground font-bold"
                    : "text-muted-foreground hover:text-foreground font-medium"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs">{label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}