import { ContentBlockResponse } from "@/types";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Users, ExternalLink } from "lucide-react";

interface ContentMetaProps {
  contributors?: ContentBlockResponse["contributors"];
  sources?: ContentBlockResponse["sources"];
}

export default function ContentMeta({
  contributors = [],
  sources = [],
}: ContentMetaProps) {
  if (!contributors.length && !sources.length) return null;

  return (
    <div className="mt-8 border-t border-border pt-2 w-full">
      <Accordion type="multiple" className="w-full">
        {/* Sources Section */}
        {sources.length > 0 && (
          <AccordionItem value="sources" className="border-b-0">
            <AccordionTrigger className="text-sm text-muted-foreground hover:text-foreground py-3">
              <div className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                <span className="font-medium tracking-wide">Sources</span>
                <Badge
                  variant="secondary"
                  className="ml-1 text-[10px] h-5 px-1.5 rounded-full"
                >
                  {sources.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <ul className="space-y-2 pt-1">
                {sources.map(({ url, title }, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                    {url ? (
                      <a
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="hover:text-primary transition-colors underline underline-offset-4 decoration-border hover:decoration-primary"
                      >
                        {title}
                      </a>
                    ) : (
                      <span>{title}</span>
                    )}
                  </li>
                ))}
              </ul>
            </AccordionContent>
          </AccordionItem>
        )}

        {/* Contributors Section */}
        {contributors.length > 0 && (
          <AccordionItem value="contributors" className="border-b-border/50">
            <AccordionTrigger className="text-sm text-muted-foreground hover:text-foreground py-3">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="font-medium tracking-wide">Contributors</span>
                <Badge
                  variant="secondary"
                  className="ml-1 text-[10px] h-5 px-1.5 rounded-full"
                >
                  {contributors.length}
                </Badge>
              </div>
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="flex flex-wrap gap-2 pt-1">
                {contributors.map(({ name, role }, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-secondary/40 border border-border/50 px-3 py-1.5 rounded-full text-sm transition-colors hover:bg-secondary/60"
                  >
                    <span className="font-medium text-secondary-foreground">
                      {name}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] h-4 px-1.5 py-0 border-primary/20 text-muted-foreground"
                    >
                      {role}
                    </Badge>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        )}
      </Accordion>
    </div>
  );
}
