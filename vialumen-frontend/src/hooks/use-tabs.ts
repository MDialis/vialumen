import { useState } from "react";
import { ContentBlockResponse } from "@/types";

export function useTabs(blocks: ContentBlockResponse[]) {
  const [activeTabId, setActiveTabId] = useState<number | string>(blocks[0]?.version_id);
  
  const activeBlock = blocks.find((b) => String(b.version_id) === String(activeTabId)) || blocks[0];

  return {
    activeTabId,
    activeBlock,
    setActiveTabId,
  };
}