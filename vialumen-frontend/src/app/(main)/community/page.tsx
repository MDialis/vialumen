import { getCommunityPosts } from "@/lib/api";
import { ThemeWrapper } from "@/components/appearance/theme-wrapper";
import { CommunityPostCard } from "@/components/community/community-post-card";
import { Button } from "@/components/ui/button";
import { SearchX, LayoutList, AlignJustify } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

export default async function CommunityFeedPage() {
  // Fetch the data on the server
  const posts = await getCommunityPosts();

  return (
    <ThemeWrapper>
      <div className="min-h-screen p-4 md:p-8 bg-background text-foreground transition-colors duration-300">
        <div className="max-w-3xl mx-auto space-y-6">

          {/* Header & Toolbar Section */}
          <div className="space-y-6 border-b border-border pb-4">
            <h1 className="text-4xl font-black tracking-tight">Community Feed</h1>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

              {/* Far Left: Filters and Sorting */}
              <div className="flex flex-wrap items-center gap-3">
                <Select defaultValue="all">
                  <SelectTrigger className="w-[160px] bg-card">
                    <SelectValue placeholder="Hierarchy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Hierarchies</SelectItem>
                    <SelectItem value="physiology">Physiology</SelectItem>
                    <SelectItem value="safety">Safety</SelectItem>
                    <SelectItem value="belonging">Belonging</SelectItem>
                    <SelectItem value="esteem">Esteem</SelectItem>
                    <SelectItem value="esteem">Self Actualization</SelectItem>
                  </SelectContent>
                </Select>

                <Select defaultValue="recommended">
                  <SelectTrigger className="w-[150px] bg-card">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Far Right: View Toggle */}
              <div className="flex items-center p-1 border border-border rounded-lg bg-muted/30">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 flex items-center gap-2 bg-background shadow-sm hover:bg-background"
                >
                  <LayoutList className="w-4 h-4" />
                  <span className="text-xs font-bold">Full</span>
                </Button>

                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 px-3 flex items-center gap-2 text-muted-foreground hover:text-foreground"
                >
                  <AlignJustify className="w-4 h-4" />
                  <span className="text-xs font-medium">Compact</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Feed Content */}
          <div className="flex flex-col gap-6 pt-2">
            {!posts || posts.length === 0 ? (
              // Empty State
              <div className="flex flex-col items-center justify-center py-24 px-4 border-2 border-dashed border-border rounded-xl bg-card text-center">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <SearchX className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold mb-2">No posts yet</h3>
                <p className="text-muted-foreground max-w-sm mb-6">
                  The matrix is quiet. Be the first to start a conversation or share a theory with the community.
                </p>
                <Button asChild variant="outline">
                  <Link href="/community/create">Draft the first post</Link>
                </Button>
              </div>
            ) : (
              // Active Feed
              posts.map((post) => (
                <CommunityPostCard key={post.id} post={post} />
              ))
            )}
          </div>

        </div>
      </div>
    </ThemeWrapper>
  );
}