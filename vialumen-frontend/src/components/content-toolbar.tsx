"use client";

import { useContentContext } from "@/components/content-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { History, Loader2 } from "lucide-react";

export default function ContentToolbar() {
  const {
    activeBlock,
    versions,
    isLoadingList,
    isFetchingText,
    displayedBlock,
    handleVersionSelect,
  } = useContentContext();

  if (!activeBlock.has_older_versions && versions.length === 0) {
    return null;
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Select
      value={displayedBlock.version_id?.toString()}
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
  );
}