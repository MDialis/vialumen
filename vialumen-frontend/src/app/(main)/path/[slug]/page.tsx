import { ThemeWrapper } from "@/components/theme-wrapper";
import { getOfficialSubthemeBySlug } from "@/lib/api";

export default async function PathPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;

  const content = await getOfficialSubthemeBySlug(resolvedParams.slug);

  if (!content) {
    return (
      <ThemeWrapper>
        <div className="flex items-center justify-center min-h-screen text-destructive text-xl font-bold">
          404 - The path "{resolvedParams.slug}" could not be found.
        </div>
      </ThemeWrapper>
    );
  }

  return (
    <ThemeWrapper>
      <div className="min-h-screen p-8 bg-background text-foreground transition-colors duration-300">

        <div className="max-w-4xl mx-auto space-y-10">

          {/* HEADER */}
          <header className="p-6 rounded-xl border-2 border-primary bg-primary/10">
            <p className="text-sm font-bold text-primary uppercase tracking-widest mb-2">
              Official Content
            </p>
            <h1 className="text-4xl font-black text-foreground mb-2">
              {content.title}
            </h1>
            <p className="text-lg text-muted-foreground">
              {content.description || "No description provided."}
            </p>
          </header>

          {/* BLOCKS SECTION */}
          {content.blocks && content.blocks.length > 0 ? (
            <div className="space-y-12">
              {content.blocks.map((block: any) => (
                <section key={block.version_id} className="space-y-4">

                  {/* MAIN TEXT FOR THIS BLOCK */}
                  <div className="p-6 rounded-xl bg-card border border-border shadow-sm text-card-foreground">
                    <div className="flex justify-between items-center mb-4 border-b border-border pb-2">
                      {/* Capitalize the content_type (e.g., "overview" -> "Overview") */}
                      <h2 className="text-2xl font-bold capitalize text-primary">
                        {block.content_type}
                      </h2>

                      {/* Check boolean flag */}
                      {block.has_older_versions && (
                        <span className="text-xs font-semibold px-3 py-1 bg-muted text-muted-foreground rounded-full border border-border hover:bg-secondary hover:text-secondary-foreground transition-colors cursor-pointer">
                          View History
                        </span>
                      )}
                    </div>

                    <p className="whitespace-pre-wrap leading-relaxed text-lg">
                      {block.content_text}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 md:pl-8 border-l-0 md:border-l-4 border-primary/20">

                    {/* Contributors Box */}
                    <div className="p-5 rounded-xl bg-accent text-accent-foreground border border-border shadow-sm">
                      <h3 className="font-bold mb-3 text-sm uppercase tracking-wider opacity-80">Contributors</h3>
                      {block.contributors && block.contributors.length > 0 ? (
                        <ul className="space-y-2">
                          {block.contributors.map((c: any, index: number) => (
                            <li key={index} className="flex justify-between items-center text-sm bg-background/50 p-2 rounded">
                              <span className="font-semibold">{c.name}</span>
                              <span className="text-xs px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                                {c.role}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm opacity-70">No contributors.</p>
                      )}
                    </div>

                    {/* Sources Box */}
                    <div className="p-5 rounded-xl bg-secondary text-secondary-foreground border border-border shadow-sm">
                      <h3 className="font-bold mb-3 text-sm uppercase tracking-wider opacity-80">Sources</h3>
                      {block.sources && block.sources.length > 0 ? (
                        <ul className="space-y-2 list-disc list-inside">
                          {block.sources.map((s: any, index: number) => (
                            <li key={index} className="text-sm">
                              {s.url ? (
                                <a href={s.url} target="_blank" rel="noreferrer" className="underline hover:text-primary transition-colors">
                                  {s.title}
                                </a>
                              ) : (
                                <span>{s.title}</span>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm opacity-70">No sources listed.</p>
                      )}
                    </div>

                  </div>
                </section>
              ))}
            </div>
          ) : (
            /* EMPTY STATE */
            <div className="p-10 rounded-xl bg-card border-2 border-dashed border-border text-center">
              <h2 className="text-xl font-bold mb-2">Uncharted Territory</h2>
              <p className="italic text-muted-foreground text-lg">
                This path is currently unmapped. No content has been written yet.
              </p>
            </div>
          )}

        </div>
      </div>
    </ThemeWrapper>
  );
}