import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { ThemeWrapper } from "@/components/appearance/theme-wrapper";
import { getSubthemes } from "@/lib/api";
import CommunityPostForm from "@/components/form/form-community";

import { auth } from "@/lib/auth";

export default async function CreateCommunityPostPage() {
  const sessionData = await auth.api.getSession({ headers: await headers() });
  if (!sessionData?.session) {
    redirect("/login");
  }
  const token = sessionData.session.token;

  const subthemes = await getSubthemes();

  return (
    <ThemeWrapper>
      <div className="min-h-screen p-8 bg-background text-foreground transition-colors duration-300">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2 mb-8">
            <h1 className="text-4xl font-black tracking-tight">
              Create a Post
            </h1>
            <p className="text-muted-foreground text-lg">
              Share your insights, questions, or theories with the community.
            </p>
          </div>

          <CommunityPostForm initialSubthemes={subthemes || []} token={token} />
        </div>
      </div>
    </ThemeWrapper>
  );
}
