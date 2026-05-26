import { ThemeWrapper } from "@/components/appearance/theme-wrapper";
import { getOfficialSubthemeBySlug, getCommunityPosts } from "@/lib/api";
import ContentGroup from "@/components/path/path-group";
import { OfficialPageResponse } from "@/types";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { ContentProvider } from "@/contexts/content-context";
import ContentToolbar from "@/components/path/path-toolbar";
import { TrendingPostsSidebar } from "@/components/community/trending-posts-sidebar"; // New import

export default async function PathPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;

  // Fetch Official Content and Community Posts in parallel
  const [content, trendingPosts] = await Promise.all([
    getOfficialSubthemeBySlug(resolvedParams.slug),
    getCommunityPosts({ feed: "trending", slug: resolvedParams.slug }),
  ]);

  if (!content) {
    notFound();
  }

  return (
    <ThemeWrapper>
      <div className="min-h-screen p-4 md:p-8 bg-background text-foreground transition-colors duration-300">
        {/* Expanded layout to support two columns (Main + Right Sidebar) */}
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
          {/* ==================================
              LEFT: CONTENT 
              ================================== */}
          <main className="flex-1 max-w-4xl w-full">
            {content.blocks && content.blocks.length > 0 ? (
              <ContentProvider blocks={content.blocks} slug={content.slug}>
                <div className="flex items-center justify-between p-2">
                  <h1 className="text-4xl font-black text-foreground">
                    {content.title}
                  </h1>
                  <div>
                    <ContentToolbar />
                  </div>
                </div>

                <Separator className="bg-border" />

                <ContentGroup />
              </ContentProvider>
            ) : (
              <Card className="border-2 border-dashed border-border text-center shadow-none bg-card">
                <CardHeader>
                  <CardTitle className="text-xl">Uncharted Territory</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="italic text-muted-foreground text-lg">
                    This path is currently unmapped. No content has been written
                    yet.
                  </p>
                </CardContent>
              </Card>
            )}
          </main>

          {/* ================================== */}
          {/* RIGHT COLUMN: COMMUNITY DISCUSSIONS*/}
          {/* ================================== */}
          <aside className="w-full lg:w-80 flex-shrink-0">
            <TrendingPostsSidebar
              posts={trendingPosts}
              subthemeSlug={content.slug}
              subthemeName={content.title}
            />
          </aside>
        </div>
      </div>
    </ThemeWrapper>
  );
}
