"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PostCommentResponse } from "@/types";
import { postComment } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, MessageSquare } from "lucide-react";
import { CommentCard } from "./comment-card";

interface CommentSectionProps {
  postId: number;
  comments: PostCommentResponse[];
  token: string;
}

export function CommentSection({ postId, comments, token }: CommentSectionProps) {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const [hiddenReplies, setHiddenReplies] = useState<Set<number>>(() => {
    return new Set(comments.filter((c) => c.reply_count > 0).map((c) => c.id));
  });

  const toggleReplies = (commentId: number) => {
    setHiddenReplies((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    if (!content.trim() || !token) return;

    setIsSubmitting(true);
    const newComment = await postComment(postId, content, token, null);

    if (newComment) {
      setContent(""); // Clear input
      router.refresh(); // Tells Next.js to re-fetch the server component seamlessly
    }
    setIsSubmitting(false);
  };

  const visibleComments: PostCommentResponse[] = [];
  if (comments.length > 0) {
    const parentStack: PostCommentResponse[] = [];

    for (const comment of comments) {
      while (parentStack.length > 0 && comment.depth <= parentStack[parentStack.length - 1].depth) {
        parentStack.pop();
      }

      if (parentStack.some((p) => hiddenReplies.has(p.id))) {
        continue;
      }

      visibleComments.push(comment);
      parentStack.push(comment);
    }
  }

  return (
    <div id="comment" className="space-y-4 mt-2">
      {/* Input Area */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Join the Discussion
        </h3>
        {token ? (
          <div className="space-y-3">
            <Textarea
              placeholder="What are your thoughts?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[100px] resize-y bg-background"
            />
            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={isSubmitting || !content.trim()}>
                {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Post Comment
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground p-4 bg-muted/30 rounded-lg text-center">
            You must be logged in to comment.
          </div>
        )}
      </div>

      {/* Comments List */}
      <div>
        {visibleComments.length > 0 ? (
          <div className="flex flex-col">
            {visibleComments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                token={token}
                onToggleReplies={toggleReplies}
                areRepliesHidden={hiddenReplies.has(comment.id)}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-muted-foreground text-sm">
            No comments yet. Be the first to share your thoughts!
          </div>
        )}
      </div>
    </div>
  );
}