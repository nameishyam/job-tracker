import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Star, Calendar, Pencil } from "lucide-react";
import axios from "axios";

function Profile() {
  const { user, reviews, jobs } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

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

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/users/avatar`,
        formData,
        { withCredentials: true }
      );
      if (res.data.avatarUrl) {
        setAvatarUrl(res.data.avatarUrl);
      }
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  const deleteProfileImage = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/users/avatar`, {
        withCredentials: true,
      });
      setAvatarUrl(undefined);
    } catch (err) {
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
        <div className="flex items-center gap-4 mb-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer hover:opacity-80 transition">
                <div className="relative group">
                  <Avatar className="w-14 h-14">
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
              </div>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={openFilePicker}>
                Upload new photo
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={deleteProfileImage}
                className="text-red-400 focus:text-red-500"
              >
                Delete photo
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex flex-col">
            <span className="font-semibold text-lg">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="text-sm text-gray-500">{user?.email}</span>
          </div>
        </div>

        <div className="flex-1 border-t pt-4 mt-6">
          <h2 className="text-xl font-semibold mb-4">Bio</h2>
          <p className="text-gray-700">{user?.bio || "No bio available."}</p>
        </div>

        <div className="mt-6 border-t pt-4">
          <h2 className="text-xl font-semibold mb-4">Account Details</h2>

          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center gap-3 text-sm">
                <Star className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Reviews</span>
                <span className="ml-auto font-medium">{reviews.length}</span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Briefcase className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Jobs Applied</span>
                <span className="ml-auto font-medium">{jobs.length}</span>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">Member since</span>
                <span className="ml-auto font-medium">
                  {user?.createdAt ? formatDate(user.createdAt) : "N/A"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="w-1/2 h-full bg-background overflow-y-auto p-6">bye</div>
    </div>
  );
}

export default Profile;
