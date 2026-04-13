import { ContentBlockResponse } from "@/types";
import { Badge } from "@/components/ui/badge";

export default function ContentBody({
  block,
}: {
  block: ContentBlockResponse;
}) {
  return (
    <div>
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
    </div>
  );
}
