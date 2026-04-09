import { ContentBlockResponse } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ContentMetaProps {
  contributors: ContentBlockResponse["contributors"];
  sources: ContentBlockResponse["sources"];
}

export default function ContentMeta({ contributors, sources }: ContentMetaProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 md:pl-8 border-l-0 md:border-l-4 border-primary/20 mt-6">
      
      {/* Contributors Card */}
      <Card className="bg-accent text-accent-foreground border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm uppercase tracking-wider opacity-80">
            Contributors
          </CardTitle>
        </CardHeader>
        <CardContent>
          {contributors && contributors.length > 0 ? (
            <ul className="space-y-2">
              {contributors.map((c, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center text-sm bg-background/50 p-2 rounded"
                >
                  <span className="font-semibold">{c.name}</span>
                  <Badge variant="secondary" className="text-xs">
                    {c.role}
                  </Badge>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm opacity-70">No contributors.</p>
          )}
        </CardContent>
      </Card>

      {/* Sources Card */}
      <Card className="bg-secondary text-secondary-foreground border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm uppercase tracking-wider opacity-80">
            Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sources && sources.length > 0 ? (
            <ul className="space-y-2 list-disc list-inside">
              {sources.map((s, index) => (
                <li key={index} className="text-sm">
                  {s.url ? (
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline hover:text-primary transition-colors"
                    >
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
        </CardContent>
      </Card>
      
    </div>
  );
}