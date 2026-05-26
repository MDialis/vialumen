import { CommunityPostFeedResponse } from "@/types";
import { ChevronUp, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface TrendingPostsSidebarProps {
  posts: CommunityPostFeedResponse[] | null;
  subthemeSlug: string;
  subthemeName: string;
}

export function TrendingPostsSidebar({
  posts,
  subthemeSlug,
  subthemeName,
}: TrendingPostsSidebarProps) {
  // Only show the top 4 posts in the sidebar so it doesn't get overwhelming
  const displayPosts = posts?.slice(0, 4) || [];

  return (
    <div className="sticky top-24">
      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
        Related posts
      </h3>

      {/* Content Area */}
      <div className="flex flex-col">
        {displayPosts.length === 0 ? (
          <div className="py-6 text-center space-y-3">
            <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto opacity-40" />
            <p className="text-sm text-muted-foreground">
              No discussions about <strong>{subthemeName}</strong> yet.
            </p>
            <Button
              asChild
              variant="outline"
              size="sm"
              className="w-full font-medium"
            >
              <Link href="/community/create">Make a post</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col">
            {displayPosts.map((post) => (
              <Link
                key={post.id}
                href={`/community/post/${post.id}`}
                className="p-3 rounded-md hover:bg-muted/50 transition-colors group grid grid-cols-3 gap-3 items-start"
              >
                {/* Left Column */}
                <div className="col-span-2 flex flex-col min-w-0">
                  <h4 className="text-sm font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-1">
                    {post.title}
                  </h4>
                  <span className="text-xs font-medium text-muted-foreground truncate">
                    By {post.author_name}
                  </span>
                </div>

                {/* Right Column */}
                <div className="col-span-1 flex items-center justify-end gap-1 font-bold text-foreground self-center">
                  <ChevronUp className="w-5 h-5 text-primary shrink-0" />
                  <span className="truncate">{post.net_votes}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* View All Button at the bottom */}
      {displayPosts.length > 0 && (
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="w-full text-xs font-bold text-muted-foreground"
        >
          <Link href={`/community/${subthemeSlug}`}>
            View more in {subthemeName} community
            <ArrowRight className="w-4 h-4" />
          </Link>
        </Button>
      )}
    </div>
  );
}
