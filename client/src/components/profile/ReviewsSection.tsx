import { useState } from "react";
import { api } from "@/lib/api";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Trash2, PlusIcon } from "lucide-react";
import type { ReviewsSectionProps } from "@/lib/props";

export default function ReviewsSection({
  reviews,
  setReviews,
  onAddReview,
}: ReviewsSectionProps) {
  const [showTopFade, setShowTopFade] = useState(false);
  const [showBottomFade, setShowBottomFade] = useState(false);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    const atTop = scrollTop === 0;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1;

    setShowTopFade(!atTop);
    setShowBottomFade(!atBottom);
  };

  const formatDate = (value: Date | string | number) => {
    const date = value instanceof Date ? value : new Date(value);

    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();

    const suffix =
      day % 10 === 1 && day !== 11
        ? "st"
        : day % 10 === 2 && day !== 12
          ? "nd"
          : day % 10 === 3 && day !== 13
            ? "rd"
            : "th";

    return `${day}${suffix} ${month}, ${year}`;
  };

  const handleDelete = async (id: string | undefined) => {
    try {
      await api.delete(`/reviews/${id}`);
      toast.success("Review deleted successfully.");
      setReviews((prev) => prev.filter((r) => r.id !== id));
    } catch (error) {
      toast.error("Failed to delete review.");
      console.error("Error deleting review:", error);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Your Reviews</h2>

        <Button variant="outline" size="sm" onClick={onAddReview}>
          <PlusIcon />
          Add Review
        </Button>
      </div>

      <div className="mt-4 flex flex-col flex-1 min-h-0">
        {reviews && reviews.length > 0 ? (
          <div className="relative flex-1 min-h-0">
            {showTopFade && (
              <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 z-10 bg-linear-to-b from-background to-transparent" />
            )}

            {showBottomFade && (
              <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 z-10 bg-linear-to-t from-background to-transparent" />
            )}

            <div
              className="h-full overflow-y-auto scrollbar-hide"
              onScroll={handleScroll}
            >
              {reviews.map((review) => (
                <Card key={review.id} className="mb-2">
                  <div className="px-3 py-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {review.company}
                      </span>

                      <span className="text-xs text-muted-foreground">
                        {review?.updatedAt
                          ? formatDate(review.updatedAt)
                          : "N/A"}
                      </span>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => e.stopPropagation()}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="w-5 h-5" />
                          </Button>
                        </AlertDialogTrigger>

                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>

                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete your review on {review.company}
                              .
                            </AlertDialogDescription>
                          </AlertDialogHeader>

                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>

                            <AlertDialogAction
                              className="bg-destructive hover:bg-destructive/90"
                              onClick={() => handleDelete(review.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            You have not submitted any reviews yet.
          </p>
        )}
      </div>
    </>
  );
}
