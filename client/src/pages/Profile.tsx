import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";

import { fileApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import ReviewForm from "@/components/ReviewForm";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  Briefcase,
  Star,
  Calendar,
  Pencil,
  FileText,
  Upload,
  Download,
  Trash2,
  ChevronDown,
  PlusIcon,
} from "lucide-react";

export default function Profile() {
  const { user, reviews, jobs, updateUser } = useAuth();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [open, setOpen] = useState<boolean>(false);

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

  const formatDate = (value: Date | string) => {
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

  return (
    <div className="min-h-[80vh] p-4 flex overflow-hidden">
      <div className="w-1/2 h-full bg-background p-6 flex flex-col">
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
                  <DropdownMenuItem
                    onClick={openAvatarPicker}
                    className="hover:cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload new photo
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={deleteProfileImage}
                    className="text-red-400 focus:text-red-500 hover:cursor-pointer"
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
            <div>
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={handleResumeChange}
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2 hover:cursor-pointer"
                  >
                    <FileText className="w-4 h-4" />
                    Resume
                    <ChevronDown className="w-3 h-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem
                    onClick={openResumePicker}
                    className="hover:cursor-pointer"
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload New
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDownloadResume}
                    className="hover:cursor-pointer"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Old
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDeleteResume}
                    className="text-red-400 focus:text-red-500 hover:cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Forever
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {user?.bio || "No bio available."}
          </p>
          <div className="my-4 border-t" />
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col">
              <span className="text-muted-foreground">Reviews</span>
              <span className="font-medium">{reviews?.length || 0}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Jobs Tracked</span>
              <span className="font-medium">{jobs?.length || 0}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-muted-foreground">Member Since</span>
              <span className="font-medium">
                {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
              </span>
            </div>
          </div>
        </div>
        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold mb-4">Your Reviews:</h2>
        </div>
      </div>
      <div className="w-1/2 h-full bg-background p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold">Activity</h2>
          <Button
            variant="outline"
            size="sm"
            className="hover:cursor-pointer"
            onClick={() => setOpen(true)}
          >
            <PlusIcon />
            Add Review
          </Button>
        </div>
        <ReviewForm open={open} onOpenChange={setOpen} />
        <p className="text-muted-foreground italic text-sm mt-3">
          Yet to implement this feature...
        </p>
      </div>
    </div>
  );
}
