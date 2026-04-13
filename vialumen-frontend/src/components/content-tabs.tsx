"use client";

import { Button } from "@/components/ui/button";
import { ContentBlockResponse } from "@/types";

interface ContentTabsProps {
  blocks: ContentBlockResponse[];
  activeTabId: number | string;
  onTabChange: (id: number | string) => void;
}

export default function ContentTabs({ blocks, activeTabId, onTabChange }: ContentTabsProps) {
  return (
    <div className="flex flex-wrap gap-3 pb-4 border-b border-border/50">
      {blocks.map((block) => {
        const isActive = String(activeTabId) === String(block.version_id);
        
        return (
          <Button
            key={block.version_id}
            variant={isActive ? "default" : "outline"}
            className="uppercase tracking-wider font-bold"
            onClick={() => onTabChange(block.version_id)}
          >
            {block.content_type}
          </Button>
        );
      })}
    </div>
  );
}