import { CommunityPostFeedResponse } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MessageSquare, User, ChevronUp, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link"; // Ensure Link is imported

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
}

export function CommunityPostCard({ post, viewMode = "full" }: CommunityPostCardProps) {
  const isCompact = viewMode === "compact";

  // Fallbacks just in case the backend hasn't updated yet
  const profileLink = `/profile/${post.username}`;
  const communityLink = `/community/${post.subtheme_slug || post.subtheme_id}`;

  // ==========================================
  // COMPACT VIEW
  // ==========================================
  if (isCompact) {
    return (
      <Card className="hover:border-primary/40 transition-colors duration-200 w-full py-3 px-4 shadow-sm">
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
          <div className="flex items-center gap-2">
            {/* Net Vote Counter */}
            <div className="flex items-center bg-muted/60 rounded-full p-0.5">
              <button className="p-0.5 rounded-full transition-colors hover:text-primary hover:bg-primary/30">
                <ChevronUp className="w-6 h-6" />
              </button>
              <span className="font-bold text-foreground min-w-[1.25rem] text-center">
                {post.net_votes}
              </span>
              <button className="p-0.5 rounded-full transition-colors hover:text-primary hover:bg-primary/30">
                <ChevronDown className="w-6 h-6" />
              </button>
            </div>

            {/* Comments Button */}
            <button className="flex items-center bg-muted/60 gap-1.5 py-1.5 px-3 rounded-full transition-colors hover:text-primary hover:bg-primary/30">
              <MessageSquare className="w-5 h-5" />
              <span className="font-bold">0</span> {/* Comment count */}
            </button>
          </div>
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
        {/* Interactive Actions */}
        <div className="flex items-center gap-2">
          {/* Net Vote Counter */}
          <div className="flex items-center bg-muted/60 rounded-full p-1">
            <button className="p-1 rounded-full transition-colors hover:text-primary hover:bg-primary/30">
              <ChevronUp className="w-6 h-6" />
            </button>
            <span className="font-bold text-foreground min-w-[1.25rem] text-center">
              {post.net_votes}
            </span>
            <button className="p-1 rounded-full transition-colors hover:text-primary hover:bg-primary/30">
              <ChevronDown className="w-6 h-6" />
            </button>
          </div>

          {/* Comments Button */}
          <button className="flex items-center bg-muted/60 gap-1.5 py-2.5 px-4 rounded-full transition-colors hover:text-primary hover:bg-primary/30">
            <MessageSquare className="w-5 h-5" />
            <span className="font-bold">0</span> {/* Comment count */}
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}