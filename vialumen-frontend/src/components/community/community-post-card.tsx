import { CommunityPostResponse } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MessageSquare, User } from "lucide-react";
import Link from "next/link";

// A lightweight helper to format "2 hours ago", "just now", etc.
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

export function CommunityPostCard({ post }: { post: CommunityPostResponse }) {
  return (
    <Card className="border-border bg-card shadow-sm hover:border-primary/50 transition-colors duration-200">
      <CardHeader className="pb-3 flex flex-row items-start justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl font-bold leading-tight">
            {post.title}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 font-medium text-foreground/80">
              <User className="w-3.5 h-3.5" />
              {post.author_name}
            </span>
            <span>•</span>
            <span suppressHydrationWarning>
              {timeAgo(post.created_at)}
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground whitespace-pre-wrap line-clamp-4">
          {post.content_text}
        </p>
      </CardContent>

      <CardFooter className="pt-2 pb-4 border-t border-border/40 bg-muted/10 mt-2">
        <div className="flex items-center gap-4 text-sm text-muted-foreground w-full mt-2">
          {/* Placeholder for future features like comments or upvotes */}
          <button className="flex items-center gap-1.5 hover:text-foreground transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span>Discuss</span>
          </button>
        </div>
      </CardFooter>
    </Card>
  );
}