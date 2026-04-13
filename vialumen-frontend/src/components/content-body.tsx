import { ContentBlockResponse } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ContentBody({
  block,
}: {
  block: ContentBlockResponse;
}) {
  return (
    <Card>
      <CardContent>
        <p className="whitespace-pre-wrap leading-relaxed text-lg">
          {block.content_text}
        </p>

        {block.has_older_versions && (
          <Badge
            variant="secondary"
            className="cursor-pointer hover:bg-secondary/80"
          >
            View History
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
