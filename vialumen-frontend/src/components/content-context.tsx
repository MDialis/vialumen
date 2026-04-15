"use client";

import { createContext, useContext, ReactNode } from "react";
import { ContentBlockResponse, VersionBlockResponse, VersionMetaResponse } from "@/types";
import { useTabs } from "@/hooks/use-tabs"; 
import { useVersionHistory } from "@/hooks/use-version-history";

interface ContentContextType {
  blocks: ContentBlockResponse[];
  slug: string;
  activeTabId: number | string;
  activeBlock: ContentBlockResponse;
  setActiveTabId: (id: number | string) => void;
  versions: VersionMetaResponse[];
  isLoadingList: boolean;
  isFetchingText: boolean;
  displayedBlock: ContentBlockResponse | VersionBlockResponse;
  handleVersionSelect: (val: string) => Promise<void>;
}

const ContentContext = createContext<ContentContextType | null>(null);

export function ContentProvider({
  children,
  blocks,
  slug,
}: {
  children: ReactNode;
  blocks: ContentBlockResponse[];
  slug: string;
}) {
  const tabsData = useTabs(blocks);
  const versionData = useVersionHistory(slug, tabsData.activeBlock);

  return (
    <ContentContext.Provider
      value={{
        blocks,
        slug,
        ...tabsData,
        ...versionData,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContentContext() {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error("useContentContext must be used within a ContentProvider");
  }
  return context;
}