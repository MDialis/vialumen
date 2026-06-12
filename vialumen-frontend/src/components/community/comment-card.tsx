"use client";

import { useState } from "react";
import { PostCommentResponse } from "@/types";
import { User, ChevronUp, ChevronDown, Loader2, MessageSquare, ChevronsUpDown } from "lucide-react";
import Link from "next/link";
import { castCommentVote, postComment } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

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

export function CommentCard({
  comment,
  token,
  onToggleReplies,
  areRepliesHidden,
  isLastInThread,
}: {
  comment: PostCommentResponse;
  token: string;
  onToggleReplies?: (commentId: number) => void;
  areRepliesHidden?: boolean;
  isLastInThread?: boolean;
}) {
  const [netVotes, setNetVotes] = useState(comment.net_votes);
  const [replyCount, setReplyCount] = useState(comment.reply_count);
  const [isVoting, setIsVoting] = useState(false);
  const [showReply, setShowReply] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleVote = async (value: 1 | -1) => {
    setIsVoting(true);
    const previousVotes = netVotes;
    setNetVotes((prev) => prev + value);

    const success = await castCommentVote(comment.id, value, token);
    if (!success) setNetVotes(previousVotes);
    setIsVoting(false);
  };

  const handleReplySubmit = async () => {
    if (!replyContent.trim() || !token) return;
    setIsSubmitting(true);
    const newComment = await postComment(comment.post_id, replyContent, token, comment.id);
    if (newComment) {
      setReplyContent("");
      setShowReply(false);
      setReplyCount((prev) => prev + 1);
      router.refresh();
    }
    setIsSubmitting(false);
  };

  return (
    <div
      className="relative flex flex-col gap-2 p-4 last:border-0 transition-colors"
      style={{ marginLeft: `${comment.depth * 2}rem` }}
    >
      {comment.depth > 0 && (
        <>
          {/* Vertical thread line for the whole thread. */}
          <div className={`absolute -left-4 w-px bg-border ${isLastInThread ? "top-0 h-[26px]" : "top-0 bottom-0"}`} />
          {/* Curve and horizontal line, with a background to hide the vertical line. */}
          <svg
            width="17"
            height="8"
            viewBox="0 0 17 8"
            className={`absolute -left-4 top-[18px] ${isLastInThread ? "text-background" : ""}`}
            fill="none"
          >
            <rect width="17" height="8" fill={`${isLastInThread ? "currentColor" : ""}`} />
            <path
              d="M0.5 0 C0.5 4.41828, 4.08172 8, 8.5 8 H 17"
              stroke="currentColor"
              className="text-border"
            />
          </svg>
        </>
      )}

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

      {/* Actions */}
      <div className="flex items-center gap-4 mt-1">
        {/* Vote Actions */}
        <div className="flex items-center bg-muted/60 rounded-full p-0.5">
          <button
            onClick={() => {
              if (!token) {
                router.push("/login");
              } else {
                handleVote(1);
              }
            }}
            disabled={isVoting}
            className="p-0.5 rounded-full transition-colors hover:text-primary hover:bg-primary/30 disabled:opacity-50"
          >
            <ChevronUp className="w-6 h-6" />
          </button>
          <span className="font-bold text-foreground min-w-[1.25rem] text-center">
            {isVoting ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : netVotes}
          </span>
          <button
            onClick={() => {
              if (!token) {
                router.push("/login");
              } else {
                handleVote(-1);
              }
            }}
            disabled={isVoting}
            className="p-0.5 rounded-full transition-colors hover:text-primary hover:bg-primary/30 disabled:opacity-50"
          >
            <ChevronDown className="w-6 h-6" />
          </button>
        </div>

        {/* Reply Button */}
        <button
          onClick={() => {
            if (!token) {
              router.push("/login");
            } else {
              setShowReply(!showReply);
            }
          }}
          className="flex items-center bg-muted/60 gap-1.5 py-1 px-3 rounded-full transition-colors hover:text-primary hover:bg-primary/30"
        >
          <MessageSquare className="w-5 h-5" />
          <span className="font-bold">{replyCount ?? 0}</span>
        </button>

        {comment.reply_count > 0 && onToggleReplies && (
          <button
            onClick={() => onToggleReplies(comment.id)}
            className="flex items-center bg-muted/60 gap-1.5 py-2 px-3 rounded-full transition-colors hover:text-primary hover:bg-primary/30"
          >
            <ChevronsUpDown className="w-4 h-4" />
            <span className="text-xs font-bold">
              {areRepliesHidden
                ? `Show ${comment.reply_count} ${comment.reply_count === 1 ? "reply" : "replies"
                }`
                : "Hide replies"}
            </span>
          </button>
        )}
      </div>

      {/* Reply Form */}
      {showReply && (
        <div className="space-y-3 pt-2">
          <Textarea
            placeholder={`Replying to ${comment.author_name}...`}
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            className="min-h-[80px] resize-y bg-background"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" size="sm" onClick={() => setShowReply(false)}>Cancel</Button>
            <Button onClick={handleReplySubmit} disabled={isSubmitting || !replyContent.trim()} size="sm">
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Post Reply
            </Button>
          </div>
        </div>
      )
      }
    </div >
  );
}