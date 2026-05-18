"use client";

import ContentTabs from "@/components/path/path-tabs";
import ContentBody from "@/components/path/path-body";
import ContentMeta from "@/components/path/path-meta";
import { useContentContext } from "@/contexts/content-context";

export default function ContentGroup() {
  const { blocks, activeTabId, setActiveTabId, displayedBlock } = useContentContext();

  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="space-y-8">
      <ContentTabs
        blocks={blocks}
        activeTabId={activeTabId}
        onTabChange={setActiveTabId}
      />

      <section className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <ContentBody />
        <ContentMeta 
          contributors={displayedBlock.contributors} 
          sources={displayedBlock.sources} 
        />
      </section>
    </div>
  );
}