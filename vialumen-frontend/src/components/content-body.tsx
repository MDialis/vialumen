"use client";

import { useContentContext } from "@/components/content-context";

export default function ContentBody() {
  const { displayedBlock, isFetchingText } = useContentContext();

  return (
    <div className="relative space-y-4">
      <p
        className={`whitespace-pre-wrap leading-relaxed text-lg text-foreground transition-opacity duration-300 ${
          isFetchingText ? "opacity-50" : "opacity-100"
        }`}
      >
        {displayedBlock.content_text}
      </p>
    </div>
  );
}