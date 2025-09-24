import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { BriefcaseIcon } from "@heroicons/react/24/outline";

const Profile = () => {
  const { user, token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [location, setLocation] = useState({ city: "", country: "" });
  const [bio, setBio] = useState("");
  const [editingBio, setEditingBio] = useState(false);

  useEffect(() => {
    if (!user?.email || !token) return;

    const controller = new AbortController();

    const fetchJobs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/jobs`,
          {
            params: { email: user.email },
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );
        setJobs(Array.isArray(response.data?.jobs) ? response.data.jobs : []);
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
      }
    };

    const fetchBlogs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/users/blogs`,
          {
            params: { userId: user.id },
            headers: { Authorization: `Bearer ${token}` },
            signal: controller.signal,
          }
        );
        setBlogs(
          Array.isArray(response.data?.blogs) ? response.data.blogs : []
        );
      } catch (error) {
        console.log(error);
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

    fetchBlogs();
    fetchJobs();

    return () => controller.abort();
  }, [user?.email, token, user?.id, user?.bio]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_URL}/users/bio`,
        { userID: user.id, bio },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setEditingBio(false); // hide form after save
    } catch (err) {
      console.error("Error updating bio:", err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <header className="flex items-center gap-4 mb-6">
        <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center">
          <BriefcaseIcon className="w-8 h-8 text-gray-400" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold">
            {user?.firstName || "User"} {user?.lastName || "Profile"}
          </h1>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </header>

      <p>no of jobs: {jobs.length}</p>
      <p>no of blogs: {blogs.length}</p>
      <p>
        member since:{" "}
        {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : ""}
      </p>
      <p>
        location:{" "}
        {location.city && location.country
          ? `${location.city}, ${location.country}`
          : "Loading..."}
      </p>

      <div className="mt-6">
        {bio && !editingBio ? (
          <div className="flex items-center gap-2">
            <p>{bio}</p>
            <button
              className="text-blue-500 underline"
              onClick={() => setEditingBio(true)}
            >
              Edit
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              name="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Add your bio"
              className="border rounded px-2 py-1 flex-1"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-1 rounded"
            >
              Save
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
