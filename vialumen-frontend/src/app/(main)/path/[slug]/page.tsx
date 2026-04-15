import { ThemeWrapper } from "@/components/theme-wrapper";
import { getOfficialSubthemeBySlug } from "@/lib/api";
import ContentGroup from "@/components/content-group";
import { OfficialPageResponse } from "@/types";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import { ContentProvider } from "@/components/content-context";
import ContentToolbar from "@/components/content-toolbar";

export default async function PathPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;

  const content: OfficialPageResponse | null = await getOfficialSubthemeBySlug(
    resolvedParams.slug,
  );

  if (!content) {
    notFound();
  }

  return (
    <ThemeWrapper>
      <div className="min-h-screen p-8 bg-background text-foreground transition-colors duration-300">
        <div className="max-w-4xl mx-auto">
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
        </div>
      </div>
    </ThemeWrapper>
  );
}