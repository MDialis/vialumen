"use client";

import { useState } from "react";
import { PostCommentResponse } from "@/types";
import { User, ChevronUp, ChevronDown, Loader2 } from "lucide-react";
import Link from "next/link";
import { castCommentVote } from "@/lib/api";
import { cn } from "@/lib/utils";

function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export function CommentCard({ comment, token }: { comment: PostCommentResponse; token: string }) {
  const [netVotes, setNetVotes] = useState(comment.net_votes);
  const [isVoting, setIsVoting] = useState(false);

  const handleVote = async (value: 1 | -1) => {
    setIsVoting(true);
    const previousVotes = netVotes;
    setNetVotes((prev) => prev + value);

    const success = await castCommentVote(comment.id, value, token);
    if (!success) setNetVotes(previousVotes);
    setIsVoting(false);
  };

  return (
    <div className="relative flex flex-col gap-2 p-4 last:border-0  transition-colors">
      {/* Author & Meta */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <Link href={`/profile/${comment.username}`}>
          <span className="flex items-center gap-1 font-semibold text-foreground/80 hover:text-primary transition-colors">
            <User className="w-3.5 h-3.5" />
            {comment.author_name}
          </span>
        </Link>
        <span>•</span>
        <span suppressHydrationWarning>{timeAgo(comment.created_at)}</span>
      </div>

      {/* Content */}
      <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed pl-1">
        {comment.content_text}
      </p>

      {/* Vote Actions */}
      <div className="flex items-center gap-1 mt-1">
        <button
          onClick={() => handleVote(1)}
          disabled={isVoting}
          className="hover:text-primary hover:bg-muted p-1 rounded transition-colors disabled:opacity-50"
        >
          <ChevronUp className="w-4 h-4" />
        </button>
        <span className="font-bold text-xs text-foreground min-w-[1.25rem] text-center">
          {isVoting ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : netVotes}
        </span>
        <button
          onClick={() => handleVote(-1)}
          disabled={isVoting}
          className="hover:text-destructive hover:bg-muted p-1 rounded transition-colors disabled:opacity-50"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}