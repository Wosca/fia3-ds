"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface FeedbackDialogProps {
  sessionId: number;
  submitFeedback: (
    sessionId: number,
    rating: number,
    comment: string
  ) => Promise<{ success: boolean; error?: string }>;
}

export default function FeedbackDialog({
  sessionId,
  submitFeedback,
}: FeedbackDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await submitFeedback(sessionId, rating, comment);
    if (result.success) {
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback!",
      });
      setIsOpen(false);
    } else {
      toast({
        title: "Error",
        description:
          result.error || "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Provide Feedback</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Session Feedback</DialogTitle>
          <DialogDescription>
            Please rate your session and provide any comments.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="rating" className="text-right">
                Rating
              </Label>
              <Input
                id="rating"
                type="number"
                min="1"
                max="5"
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="comment" className="text-right">
                Comment
              </Label>
              <Textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Submit Feedback</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
