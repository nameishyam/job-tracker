import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import axios from "axios";
import {
  UserCircleIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  MapPinIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Blog from "../components/Blog";
import ConfirmBlogDelete from "../components/ConfirmBlogDelete";

const Profile = () => {
  const { user, token, jobs } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [location, setLocation] = useState({ city: "", country: "" });
  const [bio, setBio] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!user?.email || !token) return;

    const controller = new AbortController();
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const blogsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/blogs`,
          {
            params: { userId: user.id },
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );
        setBlogs(
          Array.isArray(blogsResponse.data?.blogs)
            ? blogsResponse.data.blogs
            : []
        );
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            setLocation({
              city:
                data.address.city ||
                data.address.town ||
                data.address.village ||
                "",
              country: data.address.country || "",
            });
          } catch (error) {
            console.error("Error fetching location name:", error);
          }
        },
        (error) => {
          console.error("Error getting geolocation:", error);
        }
      );
    }

    setBio(user?.bio || "");
    fetchData();

    return () => controller.abort();
  }, [user?.email, token, user?.id, user?.bio]);

  const handleDeleteRequest = (blog) => {
    setSelectedBlog(blog);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedBlog) return;
    setIsDeleting(true);
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/blogs/${selectedBlog.id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (response.status === 200 || response.status === 204) {
        setBlogs((prev) => prev.filter((b) => b.id !== selectedBlog.id));
      } else {
        console.error("Delete returned unexpected status:", response.status);
      }
    } catch (error) {
      console.error("Error deleting blog:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
      setSelectedBlog(null);
    }
  };

  const handleBioSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/bio`,
        { userId: user.id, bio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setEditingBio(false);
    } catch (err) {
      console.error("Error updating bio:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setBio(user?.bio || "");
    setEditingBio(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    return `${month} - ${day}, ${year}`;
  };

  const stats = [
    {
      icon: BriefcaseIcon,
      label: "Job Applications",
      value: jobs?.length ?? 0,
      accent: "from-emerald-400/20 to-emerald-500/10",
    },
    {
      icon: DocumentTextIcon,
      label: "Blog Posts",
      value: blogs.length,
      accent: "from-violet-400/20 to-indigo-500/10",
    },
    {
      icon: CalendarDaysIcon,
      label: "Member Since",
      value: formatDate(user?.createdAt),
      accent: "from-sky-400/20 to-cyan-500/10",
    },
  ];

  if (isLoading) {
    return (
      <div className="page-shell flex items-center justify-center">
        <div className="loading-spinner w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="page-width space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="glass-panel glass-panel--surface glass-panel--tight p-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 rounded-full glass-panel glass-panel--tight glass-panel--hover flex items-center justify-center border border-white/20">
                <UserCircleIcon className="w-10 h-10 text-emerald-200" />
              </div>
            </div>

            <div className="flex-1 space-y-3">
              <h1 className="text-3xl font-semibold text-slate-100 tracking-tight">
                {user?.firstName || "User"} {user?.lastName || "Profile"}
              </h1>
              <p className="text-slate-200/75">{user?.email}</p>

              {location.city && location.country && (
                <div className="flex items-center text-slate-300/70 gap-2">
                  <MapPinIcon className="w-4 h-4" />
                  <span className="text-sm">
                    {location.city}, {location.country}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                whileHover={{ translateY: -4 }}
                className="glass-panel glass-panel--tight glass-panel--hover p-5"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={[
                      "w-12 h-12 rounded-2xl border border-white/15 bg-gradient-to-br flex items-center justify-center",
                      stat.accent,
                    ].join(" ")}
                  >
                    <Icon className="w-6 h-6 text-slate-100" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-slate-100">
                      {stat.value}
                    </p>
                    <p className="text-sm text-slate-200/80">{stat.label}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.18 }}
          className="glass-panel glass-panel--tight p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-slate-100">About Me</h2>
            {!editingBio && (
              <motion.button
                onClick={() => setEditingBio(true)}
                whileTap={{ scale: 0.95 }}
                className="glass-button glass-button--muted px-4 py-2"
              >
                <PencilIcon className="w-4 h-4" /> Edit
              </motion.button>
            )}
          </div>

          {editingBio ? (
            <form onSubmit={handleBioSubmit} className="space-y-4">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="glass-textarea"
                placeholder="Tell us about yourself..."
              />
              <div className="flex flex-col sm:flex-row gap-3">
                <motion.button
                  type="submit"
                  disabled={isSaving}
                  whileTap={{ scale: 0.97 }}
                  className="glass-button glass-button--primary justify-center"
                >
                  <CheckIcon className="w-4 h-4" />
                  {isSaving ? "Saving..." : "Save"}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  whileTap={{ scale: 0.97 }}
                  className="glass-button glass-button--muted justify-center"
                >
                  <XMarkIcon className="w-4 h-4" /> Cancel
                </motion.button>
              </div>
            </form>
          ) : (
            <div className="min-h-[120px] flex items-center">
              {bio ? (
                <p className="text-slate-200/80 whitespace-pre-wrap leading-relaxed">
                  {bio}
                </p>
              ) : (
                <p className="text-slate-300/60 italic">
                  No bio added yet. Click "Edit" to add information about
                  yourself.
                </p>
              )}
            </div>
          )}

          <div>
            <p className="mb-3 text-slate-300/80">your blogs:</p>
            {blogs.length === 0 ? (
              <p className="text-slate-400/70">no blogs yet</p>
            ) : (
              blogs.map((blog) => (
                <Blog
                  key={blog.id}
                  data={blog}
                  onDeleteRequest={handleDeleteRequest}
                />
              ))
            )}
          </div>
        </motion.div>
      </div>

      <ConfirmBlogDelete
        isOpen={isDeleteOpen}
        blogTitle={selectedBlog?.company || selectedBlog?.title || ""}
        onClose={() => {
          setIsDeleteOpen(false);
          setSelectedBlog(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Profile;
