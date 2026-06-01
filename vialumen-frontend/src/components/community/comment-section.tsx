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
        {comments.length > 0 ? (
          <div className="flex flex-col">
            {comments.map((comment) => (
              <CommentCard key={comment.id} comment={comment} token={token} />
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