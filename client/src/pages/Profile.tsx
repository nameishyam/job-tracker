import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

import ReviewForm from "@/components/ReviewForm";
import ProfileCard from "@/components/profile/ProfileCard";
import ReviewsSection from "@/components/profile/ReviewsSection";

export default function Profile() {
  const { user, reviews, jobs, updateUser, setReviews } = useAuth();

  const [open, setOpen] = useState<boolean>(false);

  return (
    <div className="h-[90vh] p-4 flex overflow-hidden">
      <div className="w-1/2 h-full bg-background p-6 flex flex-col overflow-hidden">
        <ProfileCard
          user={user}
          jobs={jobs}
          reviews={reviews}
          updateUser={updateUser}
        />
        <h2 className="text-3xl font-bold">Recent Activity</h2>
      </div>

      <div className="w-1/2 h-full bg-background p-6 flex flex-col overflow-hidden">
        <ReviewsSection
          reviews={reviews}
          setReviews={setReviews}
          onAddReview={() => setOpen(true)}
        />

        <ReviewForm open={open} onOpenChange={setOpen} />
      </div>
    </div>
  );
}
