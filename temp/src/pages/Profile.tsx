import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

function Profile() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    setAvatarUrl(user?.profile_url ?? undefined);
  }, [user]);

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

  return (
    <div className="min-h-[80vh] p-4 flex overflow-hidden">
      <div className="w-1/2 h-full bg-background p-6 flex flex-col">
        <div className="flex items-center gap-4 mb-8">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer hover:opacity-80 transition">
                <Avatar className="w-14 h-14">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback>
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
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

        <div className="flex-1" />
      </div>

      <div className="w-1/2 h-full bg-background overflow-y-auto p-6">bye</div>
    </div>
  );
}

export default Profile;
