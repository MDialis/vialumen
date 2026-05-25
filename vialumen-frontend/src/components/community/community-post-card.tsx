import { CommunityPostFeedResponse } from "@/types";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { MessageSquare, User } from "lucide-react";

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

  // ==========================================
  // COMPACT VIEW
  // ==========================================
  if (isCompact) {
    return (
      <Card className="hover:border-primary/50 transition-colors duration-200 w-full py-4 px-3">
        <div className="flex flex-col gap-1 w-full">
          
          {/* Metadata String: Username and Timestamp side-by-side on top left */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1 font-semibold text-foreground/80">
              <User className="w-4 h-4" />
              {post.author_name}
            </span>
            <span>•</span>
            <span suppressHydrationWarning>{timeAgo(post.created_at)}</span>
          </div>

          {/* Title right below metadata */}
          <CardTitle className="text-base font-bold leading-snug tracking-tight text-foreground">
            {post.title}
          </CardTitle>

          {/* Interactive Actions block below it all */}
          <div className="flex items-center text-xs text-muted-foreground">
            <button className="flex items-center gap-1 hover:text-foreground transition-colors py-0.5 px-1.5 rounded hover:bg-muted/60">
              <MessageSquare className="w-3.5 h-3.5" />
              <span className="font-medium">Discuss</span>
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
    <Card className="border-border bg-card shadow-sm hover:border-primary/50 transition-colors duration-200">
      <CardHeader className="pb-3 flex flex-row items-start justify-between">
        <div className="space-y-1">
          <CardTitle className="text-xl font-black leading-tight">
            {post.title}
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1 font-medium text-foreground/80">
              <User className="w-3.5 h-3.5" />
              {post.author_name}
            </span>
            <span>•</span>
            <span suppressHydrationWarning>{timeAgo(post.created_at)}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground whitespace-pre-wrap line-clamp-4 text-sm leading-relaxed">
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