import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";

function Profile() {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);

  useEffect(() => {
    setAvatarUrl(user?.profile_url ?? undefined);
  }, [user]);

  const handleAvatarClick = () => {
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
        {
          withCredentials: true,
        }
      );
      const data = await res.data;
      if (data.avatarUrl) {
        setAvatarUrl(data.avatarUrl);
      }
    } catch (err) {
      console.error("Upload failed", err);
    }
  };

  return (
    <div className="min-h-[80vh] p-4 flex overflow-hidden">
      <div className="w-1/2 h-full bg-background p-6 flex flex-col">
        <div className="flex items-center gap-4 mb-8">
          <div
            className="cursor-pointer hover:opacity-80 transition"
            onClick={handleAvatarClick}
          >
            <Avatar className="w-14 h-14">
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>

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
