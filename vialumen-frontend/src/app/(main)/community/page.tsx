import { getCommunityPosts } from "@/lib/api";
import { ThemeWrapper } from "@/components/appearance/theme-wrapper";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { CommunitySidebar } from "@/components/community/community-sidebar";
import { CommunityFeedClient } from "@/components/community/community-feed-client";

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
        <div className="mx-auto flex flex-col md:flex-row gap-4 max-w-7xl">
          <CommunitySidebar feedType={feedType} />

          <main className="flex-1 max-w-2xl p-4">
            <CommunityFeedClient posts={posts} feedType={feedType} />
          </main>
        </div>
      </div>
    </ThemeWrapper>
  );
}