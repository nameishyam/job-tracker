import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import {
  UserCircleIcon,
  EnvelopeIcon,
  CalendarDaysIcon,
  BriefcaseIcon,
  PencilIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";

const Profile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.firstName ? `${user.firstName} ${user.lastName}` : "John Doe",
    email: user?.email || "john.doe@example.com",
    location: user?.location || "New York, NY",
    joinDate: user?.createdAt
      ? new Date(user.createdAt).toLocaleDateString()
      : "January 2024",
    totalApplications: 0,
    pendingApplications: 0,
    interviewsScheduled: 0,
    bio: "Passionate developer looking for new opportunities in tech.",
  });

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-gray-50 dark:bg-gray-900 transition-theme">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-400 p-4 mb-6 rounded-lg"
        >
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg
                className="w-5 h-5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h1 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Development Notice
              </h1>
              <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                This profile page is currently under testing and development.
                Features may be incomplete or subject to change.
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6 sticky top-6"
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserCircleIcon className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {profileData.name}
                </h1>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors mx-auto text-sm"
                >
                  <PencilIcon className="w-3 h-3" />
                  Edit Profile
                </motion.button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 text-sm">
                  <EnvelopeIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span>{profileData.email}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 text-sm">
                  <MapPinIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span>{profileData.location}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300 text-sm">
                  <CalendarDaysIcon className="w-4 h-4 text-green-600 dark:text-green-400" />
                  <span>Member since {profileData.joinDate}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                  About Me
                </h3>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border-l-4 border-green-600">
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                    {profileData.bio}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-3">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  Job Search Statistics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center gap-3 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <BriefcaseIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {profileData.totalApplications}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wide">
                        Total Applications
                      </p>
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center gap-3 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CalendarDaysIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {profileData.pendingApplications}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wide">
                        Pending Applications
                      </p>
                    </div>
                  </motion.div>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 flex items-center gap-3 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-300"
                  >
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <UserCircleIcon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {profileData.interviewsScheduled}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300 text-xs uppercase tracking-wide">
                        Interviews Scheduled
                      </p>
                    </div>
                  </motion.div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-6"
              >
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 pb-2 border-b border-gray-200 dark:border-gray-700">
                  Recent Activity
                </h2>
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-600">
                    <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <BriefcaseIcon className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 dark:text-gray-300 font-medium text-sm">
                        You haven't submitted any applications yet.
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs">
                        Start your job search today!
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
