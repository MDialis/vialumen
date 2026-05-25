"use client";

import { useState } from "react";
import { CommunityToolbar } from "@/components/community/community-toolbar";
import { CommunityFeedList } from "@/components/community/community-feed-list";
import { CommunityPostFeedResponse } from "@/types";

interface CommunityFeedClientProps {
  posts: CommunityPostFeedResponse[] | null;
  feedType: string;
}

export function CommunityFeedClient({ posts, feedType }: CommunityFeedClientProps) {
  const [viewMode, setViewMode] = useState<"full" | "compact">("full");

  return (
    <>
      <CommunityToolbar viewMode={viewMode} setViewMode={setViewMode} />
      <CommunityFeedList posts={posts} feedType={feedType} viewMode={viewMode} />
    </>
  );
}