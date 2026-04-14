"use client";

import { useState, useEffect } from "react";
import { ContentBlockResponse, VersionMetaResponse, VersionBlockResponse } from "@/types";
import { History, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { 
  getOfficialSubthemeVersionList, 
  getSpecificVersion 
} from "@/lib/api";

export default function ContentBody({
  block,
  slug,
  onVersionChange,
}: {
  block: ContentBlockResponse;
  slug: string;
  onVersionChange?: (versionId: number) => void;
}) {
  const [versions, setVersions] = useState<VersionMetaResponse[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(false);

  const [displayedText, setDisplayedText] = useState(block.content_text);
  const [isFetchingText, setIsFetchingText] = useState(false);

  useEffect(() => {
    setDisplayedText(block.content_text);
  }, [block.content_text]);

  useEffect(() => {
    if (!block.has_older_versions && versions.length === 0) return;

    const fetchVersions = async () => {
      setIsLoadingList(true);
      try {
        const data = await getOfficialSubthemeVersionList(
          slug,
          block.content_type,
        );
        setVersions(data || []);
      } catch (error) {
        console.error("Failed to fetch version history:", error);
      } finally {
        setIsLoadingList(false);
      }
    };

    if (versions.length === 0) {
      fetchVersions();
    }
  }, [block.has_older_versions, slug, block.content_type, versions.length]);

  const handleVersionSelect = async (val: string) => {
    // Cast to Number to satisfy your onVersionChange signature
    const versionId = Number(val);
    setIsFetchingText(true);

    try {
      // Assuming getSpecificVersion is typed to return VersionBlockResponse
      const fetchedBlock = await getSpecificVersion(versionId) as VersionBlockResponse;
      
      if (fetchedBlock) {
        // Direct property access because it's not wrapped in a blocks array
        setDisplayedText(fetchedBlock.content_text);
        onVersionChange?.(versionId);
      }
    } catch (error) {
      console.error("Failed to fetch specific version text:", error);
    } finally {
      setIsFetchingText(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="relative space-y-4">
      <p 
        className={`whitespace-pre-wrap leading-relaxed text-lg text-foreground transition-opacity duration-300 ${
          isFetchingText ? "opacity-50" : "opacity-100"
        }`}
      >
        {displayedText}
      </p>

      {(block.has_older_versions || versions.length > 0) && (
        <div className="flex justify-end">
          <Select
            defaultValue={block.version_id?.toString()}
            onValueChange={handleVersionSelect}
          >
            <SelectTrigger
              className="w-45 h-8 text-xs bg-secondary text-secondary-foreground border-none rounded-full flex gap-2 disabled:opacity-50"
              disabled={isLoadingList || isFetchingText}
            >
              {isFetchingText ? (
                <Loader2 className="w-3.5 h-3.5 text-secondary-foreground animate-spin" />
              ) : (
                <History className="w-3.5 h-3.5 text-secondary-foreground" />
              )}
              
              <SelectValue
                placeholder={isLoadingList ? "Loading..." : "Select version"}
              />
            </SelectTrigger>
            <SelectContent>
              {versions.map((v) => (
                <SelectItem key={v.version_id} value={v.version_id.toString()}>
                  {v.is_active
                    ? `${formatDate(v.accepted_at)} (Current)`
                    : `${formatDate(v.accepted_at)}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}