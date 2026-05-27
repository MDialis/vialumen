"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Loader2, MessageSquare } from "lucide-react";
import { castVote } from "@/lib/api";

interface VoteActionsProps {
  postId: number;
  initialVotes: number;
  token: string;
  viewMode?: "full" | "compact";
}

export function VoteActions({ postId, initialVotes, token, viewMode = "full" }: VoteActionsProps) {
  const [netVotes, setNetVotes] = useState(initialVotes);
  const [isVoting, setIsVoting] = useState(false);
  const isCompact = viewMode === "compact";

  const handleVote = async (value: 1 | -1) => {
    setIsVoting(true);
    
    // Optimistic UI update
    const previousVotes = netVotes;
    setNetVotes((prev) => prev + value);

    const success = await castVote(postId, value, token);
    
    if (!success) {
      // Revert if API failed
      setNetVotes(previousVotes);
    }
    
    setIsVoting(false);
  };

  // ==========================================
  // COMPACT VIEW
  // ==========================================
  if (isCompact) {
    return (
      <div className="flex items-center gap-2">
        {/* Net Vote Counter */}
        <div className="flex items-center bg-muted/60 rounded-full p-0.5">
          <button
            onClick={() => handleVote(1)}
            disabled={isVoting}
            className="p-0.5 rounded-full transition-colors hover:text-primary hover:bg-primary/30 disabled:opacity-50"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <span className="font-bold text-foreground min-w-[1.25rem] text-center">
            {isVoting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : netVotes}
          </span>
          <button
            onClick={() => handleVote(-1)}
            disabled={isVoting}
            className="p-0.5 rounded-full transition-colors hover:text-primary hover:bg-primary/30 disabled:opacity-50"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>

        {/* Comments Button */}
        <button className="flex items-center bg-muted/60 gap-1.5 py-1.5 px-3 rounded-full transition-colors hover:text-primary hover:bg-primary/30">
          <MessageSquare className="w-5 h-5" />
          <span className="font-bold">0</span> {/* Comment count */}
        </button>
      </div>
    );
  }

  // ==========================================
  // FULL VIEW
  // ==========================================
  return (
    <div className="flex items-center gap-2">
      {/* Net Vote Counter */}
      <div className="flex items-center bg-muted/60 rounded-full p-1">
        <button
          onClick={() => handleVote(1)}
          disabled={isVoting}
          className="p-1 rounded-full transition-colors hover:text-primary hover:bg-primary/30 disabled:opacity-50"
        >
          <ChevronUp className="w-6 h-6" />
        </button>
        <span className="font-bold text-foreground min-w-[1.25rem] text-center">
          {isVoting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : netVotes}
        </span>
        <button
          onClick={() => handleVote(-1)}
          disabled={isVoting}
          className="p-1 rounded-full transition-colors hover:text-primary hover:bg-primary/30 disabled:opacity-50"
        >
          <ChevronDown className="w-6 h-6" />
        </button>
      </div>

      {/* Comments Button */}
      <button className="flex items-center bg-muted/60 gap-1.5 py-2.5 px-4 rounded-full transition-colors hover:text-primary hover:bg-primary/30">
        <MessageSquare className="w-5 h-5" />
        <span className="font-bold">0</span> {/* Comment count */}
      </button>
    </div>
  );
}