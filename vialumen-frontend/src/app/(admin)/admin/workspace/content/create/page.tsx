import { getSubthemes } from "@/lib/api";
import OfficialContentForm from "@/components/form/form-official";
import { ThemeWrapper } from "@/components/appearance/theme-wrapper";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function PostOfficialContentPage() {
  const sessionData = await auth.api.getSession({ headers: await headers() });
  const token = sessionData?.session?.token || "";

  const subthemes = await getSubthemes();

  return (
    <ThemeWrapper>
      <div className="min-h-screen p-8 bg-background text-foreground">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-4xl font-black tracking-tight">Post Official Content</h1>
            <p className="text-muted-foreground mt-1 text-lg">
              Any post here WILL actually become a published article, no jokes here ok?.
            </p>
          </div>

          <Separator className="bg-border" />

          {/* Render the interactive client form */}
          <OfficialContentForm
            initialSubthemes={subthemes || []}
            token={token}
          />
        </div>
      </div>
    </ThemeWrapper>
  );
}