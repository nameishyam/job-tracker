import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { api, fileApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ReviewForm from "@/components/ReviewForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  FileText,
  Upload,
  Download,
  Trash2,
  ChevronDown,
  PlusIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
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

export default function Profile() {
  const { user, reviews, jobs, updateUser, setReviews } = useAuth();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false);
  const [showTopFade, setShowTopFade] = useState<boolean>(false);
  const [showBottomFade, setShowBottomFade] = useState<boolean>(false);

  useEffect(() => {
    setAvatarUrl(user?.profile_url ?? undefined);
  }, [user]);

  useEffect(() => {
    return () => {
      if (avatarUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(avatarUrl);
      }
    };
  }, [avatarUrl]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const atTop = scrollTop === 0;
    const atBottom = scrollTop + clientHeight >= scrollHeight - 1;
    setShowTopFade(!atTop);
    setShowBottomFade(!atBottom);
  };

  const openAvatarPicker = () => avatarInputRef.current?.click();

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localPreview = URL.createObjectURL(file);
    setAvatarUrl(localPreview);
    await uploadProfileImage(file);
  };

  const uploadProfileImage = async (file: File) => {
    const formData = new FormData();
    formData.append("avatar", file);
    try {
      const res = await fileApi.post(`/users/avatar`, formData);
      if (res.data.avatarUrl) {
        setAvatarUrl(res.data.avatarUrl);
        toast.success("Profile image uploaded successfully.");
      }
      updateUser({ profile_url: res.data.avatarUrl });
    } catch (err) {
      toast.error("Failed to upload profile image.");
      console.error("Avatar upload failed", err);
    }
  };

  const openResumePicker = () => resumeInputRef.current?.click();

  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("resume", file);
    try {
      const res = await fileApi.post("/users/resume", formData);
      if (res.data.resumeUrl) {
        updateUser({ resume_url: res.data.resumeUrl });
        toast.success("Resume uploaded successfully.");
      }
    } catch (err) {
      toast.error("Failed to upload resume.");
      console.error("Resume upload failed,", err);
    }
  };

  const handleDownloadResume = () => {
    if (!user?.resume_url) {
      toast.warning("No resume available for download.");
      console.warn("No resume available for download");
      return;
    }
    const a = document.createElement("a");
    a.href = user.resume_url;
    a.download = `resume-${user.firstName || "user"}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDeleteResume = async () => {
    try {
      await fileApi.delete(`/users/resume`);
      updateUser({ resume_url: undefined });
      toast.success("Resume deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete resume.");
      console.error("Resume delete failed", err);
    }
  };

  const deleteProfileImage = async () => {
    try {
      await fileApi.delete(`/users/avatar`);
      setAvatarUrl(undefined);
      updateUser({ profile_url: undefined });
      toast.success("Profile image deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete profile image.");
      console.error("Delete failed", err);
    }
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
      setReviews((prev) => prev.filter((j) => j.id !== id));
    } catch (error) {
      toast.error("Failed to delete review.");
      console.error("Error deleting review:", error);
    }
  };

  return (
    <div className="h-[90vh] p-4 flex overflow-hidden">
      <div className="w-1/2 h-full bg-background p-6 flex flex-col overflow-hidden">
        <div className="rounded-xl border bg-background p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="relative group cursor-pointer">
                    <Avatar className="w-14 h-14 ring-1 ring-border">
                      <AvatarImage src={avatarUrl} />
                      <AvatarFallback>
                        {user?.firstName?.[0]}
                        {user?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition">
                      <Pencil className="w-4 h-4 text-white" />
                    </div>
                  </div>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem onClick={openAvatarPicker}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload new photo
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={deleteProfileImage}
                    className="text-red-400 focus:text-red-500"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete photo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <div className="flex flex-col">
                <span className="text-lg font-semibold leading-tight">
                  {user?.firstName} {user?.lastName}
                </span>
                <span className="text-sm text-muted-foreground">
                  {user?.email}
                </span>
              </div>
            </div>
            <input
              ref={resumeInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={handleResumeChange}
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex gap-2">
                  <FileText className="w-4 h-4" />
                  Resume
                  <ChevronDown className="w-3 h-3 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={openResumePicker}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload New
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDownloadResume}>
                  <Download className="w-4 h-4 mr-2" />
                  Download Old
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDeleteResume}
                  className="text-red-400 focus:text-red-500"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Forever
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {user?.bio || "No bio available."}
          </p>
          <div className="my-4 border-t" />
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Reviews</span>
              <div className="font-medium">{reviews?.length || 0}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Jobs Tracked</span>
              <div className="font-medium">{jobs?.length || 0}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Member Since</span>
              <div className="font-medium">
                {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-1/2 h-full bg-background p-6 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Your Reviews</h2>
          <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
            <PlusIcon />
            Add Review
          </Button>
        </div>
        <ReviewForm open={open} onOpenChange={setOpen} />
        <div className="mt-4 flex flex-col flex-1 min-h-0">
          {reviews && reviews.length > 0 ? (
            <div className="relative flex-1 min-h-0">
              {showTopFade && (
                <div
                  className="pointer-events-none absolute top-0 left-0 right-0 h-6 z-10
                        bg-linear-to-b from-background to-transparent"
                />
              )}
              {showBottomFade && (
                <div
                  className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 z-10
                        bg-linear-to-t from-background to-transparent"
                />
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
                                permanently delete your review on{" "}
                                {review.company}.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel className="hover:cursor-pointer">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive hover:bg-destructive/90 hover:cursor-pointer"
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
      </div>
    </div>
  );
}
