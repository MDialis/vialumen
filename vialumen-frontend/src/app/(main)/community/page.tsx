import { getCommunityPosts } from "@/lib/api";
import { ThemeWrapper } from "@/components/appearance/theme-wrapper";
import { CommunityPostCard } from "@/components/community/community-post-card";
import { Button } from "@/components/ui/button";
import { SearchX, LayoutList, AlignJustify, Flame, Sparkles } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

export default async function CommunityFeedPage({
  searchParams,
}: {
  searchParams: Promise<{ feed?: string }>;
}) {
  const resolvedSearchParams = await searchParams;

  const feedType = (resolvedSearchParams.feed as "home" | "trending") || "home";

  const sessionData = await auth.api.getSession({ headers: await headers() });
  const token = sessionData?.session?.token;

  const posts = await getCommunityPosts({
    feed: feedType,
    token: token,
  });

  return (
    <ThemeWrapper>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">

        {/* Main Grid Layout: 1 column on mobile, 2 columns on desktop */}
        <div className="max-w-7xl mx-auto p-4 md:p-8 flex flex-col md:flex-row gap-8">

          {/* ======================= */}
          {/* LEFT SIDEBAR            */}
          {/* ======================= */}
          <aside className="w-full md:w-64 flex-shrink-0">
            {/* Sticky positioning keeps it visible as the user scrolls */}
            <div className="sticky top-24 space-y-2">
              <h2 className="px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">
                Feeds
              </h2>

              <Button
                asChild
                variant={feedType === "home" ? "outline" : "ghost"}
                className={`w-full justify-start ${feedType === "home" ? "font-bold border-primary" : "font-medium text-muted-foreground"
                  }`}
              >
                <Link href="/community?feed=home">
                  <Sparkles className={`w-5 h-5 mr-3 ${feedType === "home" ? "text-primary" : ""}`} />
                  Recommended
                </Link>
              </Button>

              <Button
                asChild
                variant={feedType === "trending" ? "outline" : "ghost"}
                className={`w-full justify-start ${feedType === "trending" ? "font-bold border-primary" : "font-medium text-muted-foreground"
                  }`}
              >
                <Link href="/community?feed=trending">
                  <Flame className={`w-5 h-5 mr-3 ${feedType === "trending" ? "text-primary" : ""}`} />
                  Trending
                </Link>
              </Button>
            </div>
          </aside>

          {/* ======================= */}
          {/* MAIN CONTENT AREA       */}
          {/* ======================= */}
          <main className="flex-1 max-w-3xl space-y-6">

            {/* Header & Toolbar Section */}
            <div className="space-y-6 border-b border-border pb-4">
              <h1 className="text-4xl font-black tracking-tight">Community Feed</h1>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">

                {/* Far Left: Filters (Visual Placeholders) */}
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
                      <SelectItem value="actualization">Self Actualization</SelectItem>
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

            {/* Feed Loop */}
            <div className="flex flex-col gap-6 pt-2">
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
                  <CommunityPostCard key={post.id} post={post} />
                ))
              )}
            </div>
          </main>

        </div>
      </div>
    </ThemeWrapper>
  );
}