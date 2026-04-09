import { api, fileApi } from "@/lib/api";
import { toast } from "sonner";

export const formatDate = (value: Date | string | number) => {
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

export const saveBio = async (
  bio: string,
  updateUser: (data: any) => void,
  onSuccess?: () => void,
) => {
  try {
    const res = await api.put("/users/bio", { bio });
    updateUser({ bio: res.data.bio });
    toast.success("Bio updated successfully.");
    onSuccess?.();
  } catch (err) {
    toast.error("Failed to update bio.");
    console.error(err);
  }
};

export const uploadAvatar = async (
  file: File,
  updateUser: (data: any) => void,
  setAvatarUrl: (url: string) => void,
) => {
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
    console.error(err);
  }
};

export const deleteAvatar = async (
  updateUser: (data: any) => void,
  setAvatarUrl: (url: string | undefined) => void,
) => {
  try {
    await fileApi.delete(`/users/avatar`);
    setAvatarUrl(undefined);
    updateUser({ profile_url: undefined });
    toast.success("Profile image deleted successfully.");
  } catch (err) {
    toast.error("Failed to delete profile image.");
    console.error(err);
  }
};

export const uploadResume = async (
  file: File,
  updateUser: (data: any) => void,
) => {
  const formData = new FormData();
  formData.append("resume", file);

  try {
    const res = await fileApi.post("/users/resume");

    if (res.data.resumeUrl) {
      updateUser({ resume_url: res.data.resumeUrl });
      toast.success("Resume uploaded successfully.");
    }
  } catch (err) {
    toast.error("Failed to upload resume.");
    console.error(err);
  }
};

export const deleteResume = async (updateUser: (data: any) => void) => {
  try {
    await fileApi.delete(`/users/resume`);
    updateUser({ resume_url: undefined });
    toast.success("Resume deleted successfully.");
  } catch (err) {
    toast.error("Failed to delete resume.");
    console.error(err);
  }
};

export const downloadResume = (user: any) => {
  if (!user?.resume_url) {
    toast.warning("No resume available for download.");
    return;
  }

  const a = document.createElement("a");
  a.href = user.resume_url;
  a.download = `resume-${user.firstName || "user"}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
};
