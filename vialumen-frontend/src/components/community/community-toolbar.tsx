import { Button } from "@/components/ui/button";
import { LayoutList, AlignJustify } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function CommunityToolbar() {
  return (
    <div className=" border-b border-border pb-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        {/* Filters */}
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

        {/* View Toggle */}
        <div className="flex items-center p-1 border border-border rounded-lg bg-muted/30">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 flex items-center gap-2 bg-background shadow-sm hover:bg-background"
          >
            <LayoutList className="w-4 h-4" />
            <span className="text-xs font-bold">Full</span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-3 flex items-center gap-2 text-muted-foreground hover:text-foreground"
          >
            <AlignJustify className="w-4 h-4" />
            <span className="text-xs font-medium">Compact</span>
          </Button>
        </div>
      </div>
    </div>
  );
}