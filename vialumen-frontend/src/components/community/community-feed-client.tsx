"use client";

import { useState } from "react";
import { CommunityToolbar } from "@/components/community/community-toolbar";
import { CommunityFeedList } from "@/components/community/community-feed-list";
import { CommunityPostFeedResponse } from "@/types";

interface CommunityFeedClientProps {
  posts: CommunityPostFeedResponse[] | null;
  feedType: string;
  token: string;
}

export function CommunityFeedClient({
  posts,
  feedType,
  token,
}: CommunityFeedClientProps) {
  const [viewMode, setViewMode] = useState<"full" | "compact">("full");

  return (
    <>
      <CommunityToolbar viewMode={viewMode} setViewMode={setViewMode} />
      <CommunityFeedList
        posts={posts}
        feedType={feedType}
        viewMode={viewMode}
        token={token}
      />
    </>
  );
}
