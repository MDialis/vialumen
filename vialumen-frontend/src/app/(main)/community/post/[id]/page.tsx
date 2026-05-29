import { ThemeWrapper } from "@/components/appearance/theme-wrapper";
import { getCommunityPostDetail } from "@/lib/api";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import { CommunitySidebar } from "@/components/community/community-sidebar";
import { CommunityPostCard } from "@/components/community/community-post-card";
import { CommentSection } from "@/components/community/comment-section";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function CommunityPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = await params;
  const postId = resolvedParams.id;

  const sessionData = await auth.api.getSession({ headers: await headers() });
  const token = sessionData?.session?.token || "";

  // Fetch the specific post and its comments
  const data = await getCommunityPostDetail(postId, token);

  if (!data || !data.post) {
    notFound();
  }

  const { post, comments } = data;

  return (
    <ThemeWrapper>
      <div className="min-h-screen p-2 md:p-4 bg-background text-foreground transition-colors duration-300">
        <div className="mx-auto flex flex-col lg:flex-row gap-4 max-w-[1920px]">
          {/* ================================== */}
          {/* LEFT COLUMN: NAVIGATION            */}
          {/* ================================== */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <CommunitySidebar feedType="home" />
          </div>

          {/* ================================== */}
          {/* CENTER COLUMN: POST & COMMENTS     */}
          {/* ================================== */}
          <main className="flex-1 max-w-4xl mx-auto w-full">
            
            {/* Back Button */}
            <div className="mb-4">
              <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
                <Link href="/community">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Feed
                </Link>
              </Button>
            </div>

            {/* The Main Post (Using your existing Server Component) */}
            <CommunityPostCard post={post as any} viewMode="full" token={token} />

            {/* The Comments Area (Client Component) */}
            <CommentSection postId={post.id} comments={comments} token={token} />

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