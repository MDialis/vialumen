import { useState, useEffect } from "react";
import { ContentBlockResponse, VersionMetaResponse, VersionBlockResponse } from "@/types";
import { getOfficialSubthemeVersionList, getSpecificVersion } from "@/lib/api";

export function useVersionHistory(slug: string, activeBlock: ContentBlockResponse) {
  const [versions, setVersions] = useState<VersionMetaResponse[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  const [customBlock, setCustomBlock] = useState<VersionBlockResponse | null>(null);
  const [isFetchingText, setIsFetchingText] = useState(false);

  // Reset everything when the user changes tabs
  useEffect(() => {
    setCustomBlock(null);
    setVersions([]);
  }, [activeBlock.content_type]);

  // Fetch the list of historical versions
  useEffect(() => {
    if (!activeBlock.has_older_versions && versions.length === 0) return;

    const fetchVersions = async () => {
      setIsLoadingList(true);
      try {
        const data = await getOfficialSubthemeVersionList(slug, activeBlock.content_type);
        setVersions(data || []);
      } catch (error) {
        console.error("Failed to fetch version history:", error);
      } finally {
        setIsLoadingList(false);
      }
    };

    if (versions.length === 0) fetchVersions();
  }, [activeBlock.has_older_versions, slug, activeBlock.content_type, versions.length]);

  // Fetch the specific older content text when selected
  const handleVersionSelect = async (val: string) => {
    const versionId = Number(val);
    setIsFetchingText(true);

    try {
      const fetchedBlock = await getSpecificVersion(versionId) as VersionBlockResponse;
      if (fetchedBlock) {
        setCustomBlock(fetchedBlock);
      }
    } catch (error) {
      console.error("Failed to fetch specific version text:", error);
    } finally {
      setIsFetchingText(false);
    }
  };

  // Expose the currently "active" data (either the default or the fetched old version)
  const displayedBlock = customBlock || activeBlock;

  return {
    versions,
    isLoadingList,
    isFetchingText,
    displayedBlock,
    
    handleVersionSelect,
  };
}