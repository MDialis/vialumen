import { CommunityFeedClient } from "@/components/community/community-feed-client";
import { CommunitySidebar } from "@/components/community/community-sidebar";
import { ThemeWrapper } from "@/components/appearance/theme-wrapper";
import { getCommunityPosts } from "@/lib/api";
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
  const token = sessionData?.session?.token || "";

  const posts = await getCommunityPosts({
    feed: feedType,
    token: token,
  });

  return (
    <ThemeWrapper>
      <div className="min-h-screen p-4 md:p-8 bg-background text-foreground transition-colors duration-300">
        {/* Expanded to max-w-[1920px] and added lg:flex-row to match PathPage */}
        <div className="mx-auto flex flex-col lg:flex-row gap-4 max-w-[1920px]">
          {/* ================================== */}
          {/* LEFT COLUMN: NAVIGATION            */}
          {/* ================================== */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <CommunitySidebar feedType={feedType} />
          </div>

          {/* ================================== */}
          {/* CENTER COLUMN: MAIN FEED           */}
          {/* ================================== */}
          <main className="flex-1 max-w-4xl mx-auto w-full">
            <CommunityFeedClient posts={posts} feedType={feedType} token={token} />
          </main>

          {/* ================================== */}
          {/* RIGHT COLUMN: RECOMMENDATIONS      */}
          {/* ================================== */}
          <aside className="w-full lg:w-64 flex-shrink-0">
            {/* Placeholder Card for Future Community Recommendations */}
            <div className="sticky top-24">
              {/* Content Area */}
              <div className="flex flex-col">
                <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                  Trending Communities
                </h3>

                <p className="text-sm text-muted-foreground italic p-3">
                  Community recommendations will appear here soon.
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </ThemeWrapper>
  );
}
