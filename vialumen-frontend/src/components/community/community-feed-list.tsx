import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";
import Link from "next/link";
import { CommunityPostCard } from "@/components/community/community-post-card";
import { CommunityPostFeedResponse } from "@/types";

interface CommunityFeedListProps {
  posts: CommunityPostFeedResponse[] | null;
  feedType: string;
  viewMode: "card" | "compact";
  token: string;
}

export function CommunityFeedList({
  posts,
  feedType,
  viewMode,
  token,
}: CommunityFeedListProps) {
  return (
    <div className="flex flex-col gap-2 pt-2 mt-2">
      {!posts || posts.length === 0 ? (
        // Empty State
        <div className="flex flex-col items-center justify-center py-24 px-4 border-2 border-dashed border-border rounded-xl bg-card text-center">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <SearchX className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-2xl font-bold mb-2">No posts found</h3>
          <p className="text-muted-foreground max-w-sm mb-6">
            {feedType === "trending"
              ? "There are no trending posts right now. Check back later!"
              : "It's quiet here. What about being the first to start a conversation?"}
          </p>
          {feedType !== "trending" && (
            <Button asChild variant="outline">
              <Link href="/community/create">Draft the first post</Link>
            </Button>
          )}
        </div>
      ) : (
        posts.map((post) => (
          <CommunityPostCard
            key={post.id}
            post={post as any}
            viewMode={viewMode}
            token={token}
          />
        ))
      )}
    </div>
  );
}
