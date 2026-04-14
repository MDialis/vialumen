// components/TabbedContent.tsx
"use client";

import { useState } from "react";
import ContentTabs from "@/components/content-tabs";
import ContentBody from "@/components/content-body";
import ContentMeta from "@/components/content-meta";
import { ContentBlockResponse } from "@/types";

export default function ContentGroup({ blocks, slug }: { blocks: ContentBlockResponse[]; slug: string }) {
  const [activeTabId, setActiveTabId] = useState<number | string>(blocks[0]?.version_id);

  const activeBlock = blocks.find((b) => String(b.version_id) === String(activeTabId)) || blocks[0];

  if (!activeBlock) return null;

  return (
    <div className="space-y-8">
      <ContentTabs 
        blocks={blocks} 
        activeTabId={activeTabId} 
        onTabChange={setActiveTabId} 
      />

      <section className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <ContentBody block={activeBlock} slug={slug} />
        <ContentMeta contributors={activeBlock.contributors} sources={activeBlock.sources} />
      </section>
    </div>
  );
}