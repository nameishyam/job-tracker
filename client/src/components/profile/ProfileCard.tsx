import { useEffect, useRef, useState, type ChangeEvent } from "react";

import {
  formatDate,
  saveBio,
  uploadAvatar,
  deleteAvatar,
  uploadResume,
  deleteResume,
  downloadResume,
} from "@/lib/profileCardFunctions";

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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import type { ProfileCardProps } from "@/lib/props";

export default function ProfileCard({
  user,
  jobs,
  reviews,
  updateUser,
}: ProfileCardProps) {
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [isEditingBio, setIsEditingBio] = useState<boolean>(false);
  const [bioDraft, setBioDraft] = useState<string>(user?.bio || "");

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

  useEffect(() => {
    setBioDraft(user?.bio || "");
  }, [user?.bio]);

  const openAvatarPicker = () => avatarInputRef.current?.click();
  const openResumePicker = () => resumeInputRef.current?.click();

  const handleSaveBio = () => {
    saveBio(bioDraft, updateUser, () => setIsEditingBio(false));
  };

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const localPreview = URL.createObjectURL(file);
    setAvatarUrl(localPreview);

    await uploadAvatar(file, updateUser, setAvatarUrl);
  };

  const handleResumeChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    await uploadResume(file, updateUser);
  };

  const handleDeleteAvatar = () => {
    deleteAvatar(updateUser, setAvatarUrl);
  };

  const handleDeleteResume = () => {
    deleteResume(updateUser);
  };

  const handleDownloadResume = () => {
    downloadResume(user);
  };

  return (
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
                onClick={handleDeleteAvatar}
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
            <span className="text-sm text-muted-foreground">{user?.email}</span>
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
            <Button
              variant="default"
              size="sm"
              className="flex gap-2 hover:cursor-pointer"
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

      <div className="mt-4">
        {!isEditingBio ? (
          <div className="group flex items-center gap-1">
            <p className="text-[16px] text-muted-foreground">
              {(user?.bio ?? bioDraft) || "No bio"}
            </p>

            <Button
              className="p-0 h-auto w-auto bg-transparent hover:bg-transparent shadow-none opacity-0 group-hover:opacity-100 hover:cursor-pointer"
              onClick={() => setIsEditingBio(true)}
            >
              <Pencil className="w-4.5 h-4.5" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Input
              value={bioDraft}
              onChange={(e) => setBioDraft(e.target.value)}
              placeholder="Write something about yourself..."
            />

            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSaveBio}
                className="hover:cursor-pointer"
              >
                Save
              </Button>

              <Button
                size="sm"
                variant="ghost"
                className="hover:cursor-pointer"
                onClick={() => {
                  setBioDraft(user?.bio || "");
                  setIsEditingBio(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

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
  );
}
