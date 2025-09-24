import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { motion } from "framer-motion";
import {
  BriefcaseIcon,
  CalendarDaysIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

const Profile = () => {
  const { user, token } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [blogs, setBlogs] = useState([]);

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

        const jobsFromApi = response.data?.jobs ?? [];
        setJobs(Array.isArray(jobsFromApi) ? jobsFromApi : []);
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
        const blogsFromApi = response.data?.blogs ?? [];
        setBlogs(Array.isArray(blogsFromApi) ? blogsFromApi : []);
      } catch (error) {
        console.log(error);
      }
    };

    fetchBlogs();
    fetchJobs();

    return () => controller.abort();
  }, [user?.email, token, user?.id]);

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
    </div>
  );
};

export default Profile;
