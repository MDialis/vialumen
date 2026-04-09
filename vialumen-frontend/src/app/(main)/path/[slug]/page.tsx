import { ThemeWrapper } from "@/components/theme-wrapper";
import { getOfficialSubthemeBySlug } from "@/lib/api";
import ContentTabs from "@/components/content-tabs";
import ContentBody from "@/components/content-body";
import ContentMeta from "@/components/content-meta";
import { OfficialPageResponse, ContentBlockResponse } from "@/types";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PathPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  
  // Strongly type the API response
  const content: OfficialPageResponse | null = await getOfficialSubthemeBySlug(resolvedParams.slug);

  if (!content) {
    return (
      <ThemeWrapper>
        <div className="flex items-center justify-center min-h-screen text-destructive text-xl font-bold">
          404 - The path &quot;{resolvedParams.slug}&quot; could not be found.
        </div>
      </ThemeWrapper>
    );
  }

  // Determine active tab from the URL (?tab=...) or fallback to the first block
  const tabQuery = resolvedSearchParams.tab as string;
  const activeTabId = tabQuery ? Number(tabQuery) : content.blocks?.[0]?.version_id;
  
  // Find the content for the active tab
  const activeBlock = content.blocks?.find((b: ContentBlockResponse) => b.version_id === activeTabId) || content.blocks?.[0];

  return (
    <ThemeWrapper>
      <div className="min-h-screen p-8 bg-background text-foreground transition-colors duration-300">
        <div className="max-w-4xl mx-auto space-y-10">
          
          <div className="flex items-center justify-between p-2 mb-2">
            <h1 className="text-4xl font-black text-foreground">
              {content.title}
            </h1>
            <div>
              {/* TODO: Menu with tools */}
            </div>
          </div>
          
          <Separator className="bg-border/50" />

          {content.blocks && content.blocks.length > 0 && activeBlock ? (
            <div className="space-y-8">
              {/* Pass the activeTabId down to highlight the active tab */}
              <ContentTabs blocks={content.blocks} activeTabId={activeTabId} />

              <section className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <ContentBody block={activeBlock} />
                <ContentMeta contributors={activeBlock.contributors} sources={activeBlock.sources} />
              </section>
            </div>
          ) : (
            <Card className="border-2 border-dashed border-border text-center shadow-none bg-card">
              <CardHeader>
                <CardTitle className="text-xl">Uncharted Territory</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="italic text-muted-foreground text-lg">
                  This path is currently unmapped. No content has been written yet.
                </p>
              </CardContent>
            </Card>
          )}
          
        </div>
      </div>
    </ThemeWrapper>
  );
}