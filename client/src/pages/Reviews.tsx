import ReviewCard from "@/components/ReviewCard";
import { SpinnerCustom } from "@/components/ui/spinner";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import { type Review } from "@/lib/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Reviews() {
  const { loading } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get("/reviews");
        setReviews(response.data.blogs);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error("Failed to load reviews. Please try again later.");
      }
    };
    fetchReviews();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[80vh] items-center justify-center">
        <SpinnerCustom />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 px-4 py-8 sm:px-6 lg:px-8">
      {reviews.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10">
          No reviews available at the moment.
        </p>
      ) : (
        reviews.map((review: Review) => (
          <ReviewCard key={review.id} review={review} />
        ))
      )}
    </div>
  );
}
