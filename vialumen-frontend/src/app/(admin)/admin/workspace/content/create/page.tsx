import { getSubthemes } from "@/lib/api";
import OfficialContentForm from "@/components/content-form";
import { ThemeWrapper } from "@/components/theme-wrapper";
import { Separator } from "@/components/ui/separator";

export default async function CreateOfficialContentPage() {
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
          <OfficialContentForm initialSubthemes={subthemes || []} />
        </div>
      </div>
    </ThemeWrapper>
  );
}