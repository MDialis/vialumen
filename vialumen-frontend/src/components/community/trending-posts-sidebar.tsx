import { CommunityPostFeedResponse } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronUp, MessageSquare, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface TrendingPostsSidebarProps {
  posts: CommunityPostFeedResponse[] | null;
  subthemeSlug: string;
  subthemeName: string;
}

export function TrendingPostsSidebar({ posts, subthemeSlug, subthemeName }: TrendingPostsSidebarProps) {
  // Only show the top 4 posts in the sidebar so it doesn't get overwhelming
  const displayPosts = posts?.slice(0, 4) || [];

  return (
    <div className="sticky top-24 space-y-6">
      <Card className="border-border bg-card shadow-sm">
        <CardHeader className="pb-3 border-b border-border/50">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center justify-between">
            Community Discussions
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0 flex flex-col">
          {displayPosts.length === 0 ? (
            <div className="p-6 text-center space-y-3">
              <MessageSquare className="w-8 h-8 text-muted-foreground mx-auto opacity-50" />
              <p className="text-sm text-muted-foreground">
                No discussions about <strong>{subthemeName}</strong> yet.
              </p>
              <Button asChild variant="outline" size="sm" className="w-full font-medium">
                <Link href="/community/create">Start a thread</Link>
              </Button>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border/50">
              {displayPosts.map((post) => (
                <Link 
                  key={post.id} 
                  href={`/community/post/${post.id}`} // Future-proofing the individual post route
                  className="p-4 hover:bg-muted/30 transition-colors group"
                >
                  <h4 className="text-sm font-bold leading-snug text-foreground group-hover:text-primary transition-colors line-clamp-2 mb-2">
                    {post.title}
                  </h4>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="font-medium truncate pr-4">
                      By {post.author_name}
                    </span>
                    <div className="flex items-center gap-1 font-bold text-foreground shrink-0">
                      <ChevronUp className="w-3.5 h-3.5 text-primary" />
                      {post.net_votes}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>

        {/* View All Button at the bottom */}
        {displayPosts.length > 0 && (
          <div className="p-3 border-t border-border/50 bg-muted/10">
            <Button asChild variant="ghost" size="sm" className="w-full text-xs font-bold text-muted-foreground hover:text-foreground">
              <Link href={`/community?slug=${subthemeSlug}`}>
                View all in m/{subthemeName}
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}