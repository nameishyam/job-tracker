import type { ReviewCardProps } from "@/lib/props";
import { useEffect, useState } from "react";
import type { User } from "@/lib/types";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Briefcase, IndianRupee } from "lucide-react";

export default function ReviewCard({ review }: ReviewCardProps) {
  const [user, setUser] = useState<Partial<User> | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get(`/users/${review.userId}`);
        if (res.status === 200) {
          setUser(res.data.user);
          setAvatarUrl(res.data.user.avatar_url);
        }
      } catch {
        toast.error("Failed to load user data");
      }
    };
    fetchUser();
  }, []);

  return (
    <Card className="w-1/2 min-w-75">
      <CardHeader className="flex flex-row items-start gap-4">
        <Avatar className="h-14 w-14">
          {avatarUrl && <AvatarImage src={avatarUrl} />}
          <AvatarFallback>
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-1">
          <p className="text-sm font-semibold leading-none">
            {user?.firstName} {user?.lastName}
          </p>
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Briefcase className="h-3 w-3" />
              {review.role}
            </span>
            <span className="flex items-center gap-1">
              <IndianRupee className="h-3 w-3" />
              {review.salary}
            </span>
          </div>
          <Badge variant="secondary">{review.company}</Badge>
        </div>
        <div className="flex items-center gap-1 text-sm font-medium">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          {review.rating} / 5
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="mb-3 leading-relaxed">{review.review}</p>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            {review.rounds && review.rounds.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {review.rounds.map((round, index) => (
                  <Badge key={index} variant="outline">
                    {round}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          <div>
            <span className="text-xs text-muted-foreground">
              Reviewed on {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
