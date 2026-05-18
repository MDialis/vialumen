"use client";

import { useContentContext } from "@/contexts/content-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
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

  const hasNoVersions =
    !activeBlock.has_older_versions && versions.length === 0;
  const isDisabled = hasNoVersions || isLoadingList || isFetchingText;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="w-8 h-8 p-5 rounded-sm"
          disabled={isDisabled}
        >
          {isFetchingText ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <History className="w-4 h-4" />
          )}
          <span className="sr-only">Version History</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start">
        <DropdownMenuRadioGroup
          value={displayedBlock.version_id?.toString()}
          onValueChange={handleVersionSelect}
        >
          {versions.map((v) => (
            <DropdownMenuRadioItem
              key={v.version_id}
              value={v.version_id.toString()}
            >
              {v.is_active
                ? `${formatDate(v.accepted_at)} (Current)`
                : `${formatDate(v.accepted_at)}`}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}