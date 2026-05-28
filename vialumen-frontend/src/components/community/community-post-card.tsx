"use client";

import { CommunityPostFeedResponse } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { User } from "lucide-react";
import Link from "next/link";
import { VoteActions } from "./vote-actions";

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

interface CommunityPostCardProps {
  post: CommunityPostFeedResponse;
  viewMode?: "full" | "compact";
  token: string;
}

export function CommunityPostCard({ post, viewMode = "full", token }: CommunityPostCardProps) {
  const isCompact = viewMode === "compact";

  const profileLink = `/profile/${post.username}`;
  const communityLink = `/community/${post.subtheme_slug || post.subtheme_id}`;

  // ==========================================
  // COMPACT VIEW
  // ==========================================
  if (isCompact) {
    return (
      <Card className="hover:border-primary/40 transition-colors duration-200 w-full py-3 px-4">
        <div className="flex flex-col gap-1.5 w-full">

          {/* Subtheme • Username • Timestamp */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href={communityLink}>
              <span className="font-semibold text-foreground text-lg hover:underline hover:text-primary transition-colors">
                {post.subtheme_name}
              </span>
            </Link>
            <span>•</span>
            <Link href={profileLink}>
              <span className="flex items-center gap-1 font-medium text-foreground text-md hover:text-primary transition-colors">
                <User className="w-4 h-4" />
                {post.author_name}
              </span>
            </Link>
            <span>•</span>
            <span suppressHydrationWarning>{timeAgo(post.created_at)}</span>
          </div>

          {/* Title */}
          <CardTitle className="text-base font-bold leading-snug tracking-tight text-foreground">
              {post.title}
            </CardTitle>

          {/* Interactive Actions */}
          <VoteActions postId={post.id} initialVotes={post.net_votes} commentsCount={post.comment_count} token={token} viewMode="compact" />
        </div>
      </Card>
    );
  }

  // ==========================================
  // FULL VIEW
  // ==========================================
  return (
    <Card className="border-border bg-card hover:border-primary/40 transition-colors duration-200">
      <CardHeader className="flex flex-row items-start justify-between">
        <div className="w-full">
          {/* Subtheme • Username • Timestamp */}
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href={communityLink}>
              <span className="font-semibold text-foreground text-lg hover:underline hover:text-primary transition-colors">
                {post.subtheme_name}
              </span>
            </Link>
            <span>•</span>
            <Link href={profileLink}>
              <span className="flex items-center gap-1 font-medium text-foreground text-md hover:text-primary transition-colors">
                <User className="w-4 h-4" />
                {post.author_name}
              </span>
            </Link>
            <span>•</span>
            <span suppressHydrationWarning>{timeAgo(post.created_at)}</span>
          </div>
          
          <CardTitle className="text-xl font-bold leading-snug tracking-tight text-foreground">
              {post.title}
            </CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground whitespace-pre-wrap leading-relaxed">
          {post.content_text}
        </p>
      </CardContent>

      <CardFooter>
        <VoteActions postId={post.id} initialVotes={post.net_votes} commentsCount={post.comment_count} token={token} viewMode="full" />
      </CardFooter>
    </Card>
  );
}