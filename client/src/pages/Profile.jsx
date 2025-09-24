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

const Profile = () => {
  const { user, token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [location, setLocation] = useState({ city: "", country: "" });
  const [bio, setBio] = useState("");
  const [editingBio, setEditingBio] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user?.email || !token) return;

    const controller = new AbortController();
    setIsLoading(true);

    const fetchData = async () => {
      try {
        const jobsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/jobs`,
          {
            params: { email: user.email },
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );
        setJobs(
          Array.isArray(jobsResponse.data?.jobs) ? jobsResponse.data.jobs : []
        );

        const blogsResponse = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/blogs`,
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

  const handleBioSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/bio`,
        { userID: user.id, bio },
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
    return dateString ? new Date(dateString).toLocaleDateString() : "Unknown";
  };

  const stats = [
    {
      icon: BriefcaseIcon,
      label: "Job Applications",
      value: jobs.length,
      color: "text-blue-600 dark:text-blue-400",
      bg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      icon: DocumentTextIcon,
      label: "Blog Posts",
      value: blogs.length,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-purple-100 dark:bg-purple-900/30",
    },
    {
      icon: CalendarDaysIcon,
      label: "Member Since",
      value: formatDate(user?.createdAt),
      color: "text-green-600 dark:text-green-400",
      bg: "bg-green-100 dark:bg-green-900/30",
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center transition-theme">
        <div className="loading-spinner w-8 h-8"></div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-theme">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6"
        >
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="flex-shrink-0">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center ring-4 ring-white dark:ring-gray-800 shadow-lg">
                <UserCircleIcon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
            </div>

            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {user?.firstName || "User"} {user?.lastName || "Profile"}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-3">
                {user?.email}
              </p>

              {location.city && location.country && (
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <MapPinIcon className="w-4 h-4 mr-1" />
                  <span className="text-sm">
                    {location.city}, {location.country}
                  </span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
        >
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4"
              >
                <div className="flex items-center">
                  <div className={`p-3 rounded-lg ${stat.bg} mr-4`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {stat.label}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              About Me
            </h2>
            {!editingBio && (
              <motion.button
                onClick={() => setEditingBio(true)}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <PencilIcon className="w-4 h-4 mr-1" />
                Edit
              </motion.button>
            )}
          </div>

          {editingBio ? (
            <form onSubmit={handleBioSubmit} className="space-y-4">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-colors resize-none"
                placeholder="Tell us about yourself..."
              />
              <div className="flex space-x-3">
                <motion.button
                  type="submit"
                  disabled={isSaving}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <CheckIcon className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save"}
                </motion.button>
                <motion.button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 transition-colors"
                >
                  <XMarkIcon className="w-4 h-4 mr-2" />
                  Cancel
                </motion.button>
              </div>
            </form>
          ) : (
            <div className="min-h-[100px] flex items-center">
              {bio ? (
                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                  {bio}
                </p>
              ) : (
                <p className="text-gray-500 dark:text-gray-400 italic">
                  No bio added yet. Click "Edit" to add information about
                  yourself.
                </p>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
